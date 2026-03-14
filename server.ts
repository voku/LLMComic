import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { panels, characterConfig } from "./src/data";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/generation-plan", (req, res) => {
    const plan = [];
    plan.push({
      id: 'main-intro-bg',
      prompt: `Scene: A dark, rainy cyberpunk city skyline at night. Noir comic style, high contrast ink. Style: ${characterConfig.style}`
    });
    for (const panel of panels) {
      if (panel.imagePrompt) {
        plan.push({ id: panel.id, prompt: panel.imagePrompt });
      }
      if (panel.type === 'interactive') {
        plan.push({
          id: `${panel.id}-bg`,
          prompt: panel.imagePrompt ? `${panel.imagePrompt} (Blurred background texture version)` : ''
        });
      }
    }
    res.json(plan);
  });

  app.post("/api/generate-single", async (req, res) => {
    const { id, prompt } = req.body;
    const publicDir = path.join(process.cwd(), 'public', 'generated');
    const filePath = path.join(publicDir, `${id}.jpg`);

    if (fs.existsSync(filePath)) {
      return res.json({ success: true, cached: true });
    }

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "undefined") {
        console.warn("No API key found, falling back to picsum.photos");
        const fallbackUrl = `https://picsum.photos/seed/${id}/1920/1080?grayscale`;
        const imgRes = await fetch(fallbackUrl);
        const buffer = await imgRes.arrayBuffer();
        const base64Image = `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
        
        fs.writeFileSync(filePath, Buffer.from(buffer));
        console.log(`Saved fallback image for ${id} to ${filePath}`);
        
        return res.json({ success: true, path: `/generated/${id}.jpg` });
      }
      
      console.log("Using API key:", apiKey.substring(0, 5) + "...");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      let base64Image = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }

      if (base64Image) {
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
        fs.writeFileSync(filePath, base64Image, 'base64');
        res.json({ success: true, cached: false });
      } else {
        res.status(500).json({ error: "No image generated" });
      }
    } catch (e: any) {
      console.error(`Error generating ${id} with the image model, falling back to picsum:`, e.message);
      try {
        const fallbackUrl = `https://picsum.photos/seed/${id}/1920/1080?grayscale`;
        const imgRes = await fetch(fallbackUrl);
        const buffer = await imgRes.arrayBuffer();
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
        fs.writeFileSync(filePath, Buffer.from(buffer));
        console.log(`Saved fallback image for ${id} to ${filePath}`);
        res.json({ success: true, path: `/generated/${id}.jpg`, cached: false });
      } catch (fallbackErr: any) {
        res.status(500).json({ error: e.message, fallbackError: fallbackErr.message });
      }
    }
  });

  app.post("/api/save-image", (req, res) => {
    const { panelId, base64Image } = req.body;
    if (!panelId || !base64Image) {
      return res.status(400).json({ error: "Missing panelId or base64Image" });
    }

    try {
      const publicDir = path.join(process.cwd(), 'public', 'generated');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      const filePath = path.join(publicDir, `${panelId}.jpg`);
      
      fs.writeFileSync(filePath, base64Data, 'base64');
      res.json({ success: true, path: `/generated/${panelId}.jpg` });
    } catch (error) {
      console.error("Error saving image:", error);
      res.status(500).json({ error: "Failed to save image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
