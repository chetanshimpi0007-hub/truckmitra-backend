const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

let count = 0;
walkDir('./src', (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace quotes followed directly by /api/ with quote followed by /
    content = content.replace(/(['"`])\/api\//g, '$1/');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      count++;
      console.log('Updated: ' + filePath);
    }
  }
});
console.log('Total files updated: ' + count);
