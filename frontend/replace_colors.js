import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = 'c:/Users/samri/Desktop/Task Management/frontend/src';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      replaceInDir(filePath);
    } else if (file.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const newContent = content
        .replace(/emerald/g, 'indigo')
        .replace(/teal/g, 'violet')
        .replace(/Emerald/g, 'Indigo')
        .replace(/Teal/g, 'Violet');
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    }
  });
}

replaceInDir(directory);
