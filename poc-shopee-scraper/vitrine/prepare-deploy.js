import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '..', 'logs');
const outputDir = path.join(__dirname, 'src');

// Find latest log
const files = fs.readdirSync(logsDir).filter(f => f.startsWith('amazon-') && f.endsWith('.json')).sort((a, b) => {
    return fs.statSync(path.join(logsDir, b)).mtime.getTime() - fs.statSync(path.join(logsDir, a)).mtime.getTime();
});

if (files.length === 0) {
    console.error("No logs found!");
    process.exit(1);
}

const rawData = fs.readFileSync(path.join(logsDir, files[0]), 'utf8');
const parsedData = JSON.parse(rawData);

let flatProducts = [];
if (Array.isArray(parsedData)) {
    parsedData.forEach(entry => {
        if (entry.products) flatProducts = flatProducts.concat(entry.products);
    });
}

const outputPath = path.join(outputDir, 'products.json');
fs.writeFileSync(outputPath, JSON.stringify(flatProducts, null, 2));

console.log(`✅ Success! Flattened ${flatProducts.length} products to ${outputPath}`);
console.log('Now you can deploy to Vercel/Netlify as a static site.');
