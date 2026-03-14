import fs from 'fs';
import path from 'path';
import https from 'https';

const plan = [
  { id: 'main-intro-bg' },
  { id: 'intro' },
  { id: 'symptoms' },
  { id: 'new-engineer' },
  { id: 'the-tools' },
  { id: 'cheap-part' },
  { id: 'the-catch' },
  { id: 'first-clue' },
  { id: 'first-clue-bg' },
  { id: 'workflow' },
  { id: 'pattern-mirrors' },
  { id: 'happy-path' },
  { id: 'eighty-eighty' },
  { id: 'slow-decay' },
  { id: 'missing-knowledge' },
  { id: 'missing-knowledge-bg' },
  { id: 'quiet-witness' },
  { id: 'quiet-witness-bg' },
  { id: 'danny-kruger-effect' },
  { id: 'danny-kruger-effect-bg' },
  { id: 'reality-arrives' },
  { id: 'real-shift' },
  { id: 'closing-case' }
];

async function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 && response.headers.location) {
        // Handle redirect
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', (err) => {
          fs.unlink(dest, () => reject(err));
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  console.log("Downloading placeholder images...");
  const dir = path.join(process.cwd(), 'public', 'generated');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (let i = 0; i < plan.length; i++) {
    const item = plan[i];
    const dest = path.join(dir, `${item.id}.jpg`);
    
    if (fs.existsSync(dest)) {
      console.log(`[${i+1}/${plan.length}] ${item.id}.jpg already exists, skipping.`);
      continue;
    }

    console.log(`[${i+1}/${plan.length}] Downloading ${item.id}.jpg...`);
    const url = `https://picsum.photos/seed/${item.id}/1920/1080?grayscale`;
    
    try {
      await downloadImage(url, dest);
      console.log(`  -> Success`);
    } catch (err) {
      console.error(`  -> Failed:`, err);
    }
  }
  console.log("All done!");
}

run();