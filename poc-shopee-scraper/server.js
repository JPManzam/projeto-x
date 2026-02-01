import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const configPath = path.join(__dirname, 'src', 'config.js');
const logsDir = path.join(__dirname, 'logs');

// Helper to read config
const readConfig = () => {
    const content = fs.readFileSync(configPath, 'utf8');
    const keywordsMatch = content.match(/keywords:\s*\[(.*?)\]/s);
    const associateTagMatch = content.match(/associateTag:\s*"(.*?)"/);
    const maxProductsMatch = content.match(/maxProducts:\s*(\d+)/);

    return {
        keywords: keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim().replace(/"/g, '')) : [],
        associateTag: associateTagMatch ? associateTagMatch[1] : '',
        maxProducts: maxProductsMatch ? parseInt(maxProductsMatch[1]) : 10
    };
};

const writeConfig = (newData) => {
    const currentContent = fs.readFileSync(configPath, 'utf8');
    let updatedContent = currentContent;
    updatedContent = updatedContent.replace(/keywords:\s*\[.*?\]/s, `keywords: [${newData.keywords.map(k => `"${k}"`).join(', ')}]`);
    updatedContent = updatedContent.replace(/associateTag:\s*".*?"/, `associateTag: "${newData.associateTag}"`);
    updatedContent = updatedContent.replace(/maxProducts:\s*\d+/, `maxProducts: ${newData.maxProducts}`);
    fs.writeFileSync(configPath, updatedContent);
};

app.get('/api/config', (req, res) => {
    try { res.json(readConfig()); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/config', (req, res) => {
    try { writeConfig(req.body); res.json({ message: 'Config updated' }); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/run', (req, res) => {
    exec('node src/scraper-amazon.js', { cwd: __dirname }, (error) => {
        if (error) console.error(`Scraper error: ${error}`);
    });
    res.json({ message: 'Scraper started' });
});

app.get('/api/logs', (req, res) => {
    try {
        const files = fs.readdirSync(logsDir).filter(f => f.startsWith('amazon-') && f.endsWith('.json')).sort((a, b) => {
            return fs.statSync(path.join(logsDir, b)).mtime.getTime() - fs.statSync(path.join(logsDir, a)).mtime.getTime();
        });

        if (files.length === 0) return res.json([]);

        const logData = JSON.parse(fs.readFileSync(path.join(logsDir, files[0]), 'utf8'));

        // Flatten products from all keyword results
        let flattenedProducts = [];
        if (Array.isArray(logData)) {
            logData.forEach(entry => {
                if (entry.products) flattenedProducts = flattenedProducts.concat(entry.products);
            });
        }

        res.json(flattenedProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Backend on http://localhost:${PORT}`));
