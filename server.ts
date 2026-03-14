import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { generatedImages, getGeneratedImagePath, hasGeneratedImage } from "./src/generatedImages";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/generation-plan", (req, res) => {
    const plan = Object.entries(generatedImages).map(([id, relativePath]) => ({
      id,
      path: `/${relativePath}`,
      cached: true,
    }));

    res.json(plan);
  });

  app.post("/api/generate-single", (req, res) => {
    const id = typeof req.body?.id === "string" ? req.body.id : "";
    if (!hasGeneratedImage(id)) {
      return res.status(404).json({ error: `Unknown generated image: ${id}` });
    }

    return res.json({
      success: true,
      cached: true,
      path: getGeneratedImagePath(id),
    });
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
