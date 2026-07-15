const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { url: 'https://loremflickr.com/1920/1080/indonesia,ricefield?random=1', name: 'hero-bg.jpg' },
  { url: 'https://loremflickr.com/800/600/indonesia,village?random=2', name: 'village-profile.jpg' },
  { url: 'https://loremflickr.com/800/600/coffee,beans?random=3', name: 'katalog-kopi.jpg' },
  { url: 'https://loremflickr.com/800/600/bamboo,craft?random=4', name: 'katalog-bambu.jpg' },
  { url: 'https://loremflickr.com/800/600/waterfall,jungle?random=5', name: 'katalog-wisata.jpg' },
  { url: 'https://loremflickr.com/800/600/people,meeting,indonesia?random=6', name: 'news-musrenbang.jpg' },
  { url: 'https://loremflickr.com/800/600/small,business,market?random=7', name: 'news-umkm.jpg' },
  { url: 'https://loremflickr.com/800/600/farming,farmer,indonesia?random=8', name: 'news-gotong-royong.jpg' }
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
