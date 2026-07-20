const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'src')).filter(f => f.match(/\.(tsx|ts|json|md)$/));

let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;

  content = content.replace(/walaho/g, 'sukamakmur');
  content = content.replace(/Walaho/g, 'Suka Makmur');
  content = content.replace(/WALAHO/g, 'SUKA MAKMUR');

  if (content !== originalContent) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated ' + path.basename(f));
    count++;
  }
});
console.log('Total files updated:', count);
