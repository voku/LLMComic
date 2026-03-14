import fs from 'fs';
import path from 'path';
import { generatedImages } from '../src/generatedImages.js';
import { panels } from '../src/data.js';

const publicDir = path.join(process.cwd(), 'public');

function hasValidImageSignature(absolutePath: string): boolean {
  const content = fs.readFileSync(absolutePath);
  const ext = path.extname(absolutePath).toLowerCase();

  if (ext === '.svg') {
    return content.toString('utf8').includes('<svg');
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    return content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff;
  }

  if (ext === '.png') {
    return content.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (ext === '.webp') {
    return content.subarray(0, 4).toString('ascii') === 'RIFF' && content.subarray(8, 12).toString('ascii') === 'WEBP';
  }

  return false;
}

function main() {
  const expectedImageIds = new Set<string>(['main-intro-bg']);
  for (const panel of panels) {
    expectedImageIds.add(panel.id);
    if (panel.type === 'interactive') {
      expectedImageIds.add(`${panel.id}-bg`);
    }
  }

  const unregisteredImages = [...expectedImageIds].filter((imageId) => !(imageId in generatedImages));
  const missingImages = Object.entries(generatedImages).filter(([, relativePath]) => {
    return !fs.existsSync(path.join(publicDir, relativePath));
  });
  const invalidImages = Object.entries(generatedImages).filter(([, relativePath]) => {
    const absolutePath = path.join(publicDir, relativePath);
    return fs.existsSync(absolutePath) && !hasValidImageSignature(absolutePath);
  });

  if (unregisteredImages.length === 0 && missingImages.length === 0 && invalidImages.length === 0) {
    console.log(`All ${Object.keys(generatedImages).length} pre-generated comic images are available and valid.`);
    return;
  }

  if (unregisteredImages.length > 0) {
    console.error('Story images referenced by the comic but missing from the image manifest:');
    for (const imageId of unregisteredImages) {
      console.error(`- ${imageId}`);
    }
  }

  console.error('Missing pre-generated comic images:');
  for (const [imageId, relativePath] of missingImages) {
    console.error(`- ${imageId}: public/${relativePath}`);
  }

  if (invalidImages.length > 0) {
    console.error('Invalid pre-generated comic images:');
    for (const [imageId, relativePath] of invalidImages) {
      console.error(`- ${imageId}: public/${relativePath}`);
    }
  }

  process.exitCode = 1;
}

main();
