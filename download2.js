const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { url: 'https://picsum.photos/800/600?random=11', name: 'news-umkm.jpg' },
  { url: 'https://picsum.photos/800/600?random=12', name: 'news-gotong-royong.jpg' },
  { url: 'https://picsum.photos/1920/1080?random=13', name: 'hero-bg.jpg' }
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
