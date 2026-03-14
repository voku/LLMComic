import fs from 'fs';
import path from 'path';
import { generatedImages } from '../src/generatedImages.js';

const publicDir = path.join(process.cwd(), 'public');

function main() {
  const missingImages = Object.entries(generatedImages).filter(([, relativePath]) => {
    return !fs.existsSync(path.join(publicDir, relativePath));
  });

  if (missingImages.length === 0) {
    console.log(`All ${Object.keys(generatedImages).length} pre-generated comic images are available.`);
    return;
  }

  console.error('Missing pre-generated comic images:');
  for (const [imageId, relativePath] of missingImages) {
    console.error(`- ${imageId}: public/${relativePath}`);
  }

  process.exitCode = 1;
}

main();
