import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { panels, characterConfig } from '../src/data.js';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const publicDir = path.join(process.cwd(), 'public', 'generated');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generateImage(panelId: string, prompt: string) {
  const filePath = path.join(publicDir, `${panelId}.jpg`);
  if (fs.existsSync(filePath)) {
    console.log(`Image for ${panelId} already exists. Skipping.`);
    return;
  }

  console.log(`Generating image for ${panelId}...`);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    let base64Image = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        base64Image = part.inlineData.data;
        break;
      }
    }

    if (base64Image) {
      fs.writeFileSync(filePath, base64Image, 'base64');
      console.log(`Saved image for ${panelId}.`);
    } else {
      console.error(`No image data returned for ${panelId}.`);
    }
  } catch (error) {
    console.error(`Failed to generate image for ${panelId}:`, error);
  }
}

async function main() {
  // Generate intro bg
  await generateImage('main-intro-bg', `Scene: A dark, rainy cyberpunk city skyline at night. Noir comic style, high contrast ink. Style: ${characterConfig.style}`);

  // Generate first few panels
  for (const panel of panels.slice(0, 3)) {
    if (panel.imagePrompt) {
      await generateImage(panel.id, panel.imagePrompt);
    }
  }
  console.log("Done generating initial images.");
}

main();
