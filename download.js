const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop', name: 'village-profile.jpg' },
  { url: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop', name: 'katalog-kopi.jpg' },
  { url: 'https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?q=80&w=800&auto=format&fit=crop', name: 'katalog-bambu.jpg' },
  { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=800&auto=format&fit=crop', name: 'katalog-wisata.jpg' },
  { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop', name: 'news-musrenbang.jpg' },
  { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=800&auto=format&fit=crop', name: 'news-umkm.jpg' },
  { url: 'https://images.unsplash.com/photo-1593113589914-075990141ce5?q=80&w=800&auto=format&fit=crop', name: 'news-gotong-royong.jpg' },
  { url: 'https://images.unsplash.com/photo-1582570086938-163e9f45d7a6?q=80&w=1920&auto=format&fit=crop', name: 'hero-bg.jpg' }
];

const destDir = path.join(__dirname, 'public', 'mock-data');

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const img of images) {
    console.log(`Downloading ${img.name}...`);
    try {
      await download(img.url, path.join(destDir, img.name));
      console.log(`Successfully downloaded ${img.name}`);
    } catch (e) {
      console.error(`Error downloading ${img.name}:`, e.message);
    }
  }
}

main();
