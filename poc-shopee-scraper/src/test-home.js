import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

chromium.use(stealth());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeShopeeHome() {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Testing Home Page access...`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    const products = [];
    let status = 'success';

    try {
        await page.goto('https://shopee.com.br/', { waitUntil: 'networkidle', timeout: 60000 });
        await delay(5000);

        // Take screenshot of home
        const logsDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
        await page.screenshot({ path: path.join(logsDir, `home-check-${Date.now()}.png`) });

        // Try to find products in "Ofertas Relâmpago" or similar
        // Shopee home has many sections. Let's look for link/product cards.
        const productLinks = await page.$$('a[href*="-i."]');
        console.log(`Found ${productLinks.length} product links on Home`);

        if (productLinks.length === 0) {
            if (page.url().includes('login')) {
                throw new Error("Redirected to login even on Home");
            }
            throw new Error("No products found on Home. Might be blocked or layout changed.");
        }

    } catch (err) {
        status = 'error';
        console.error(`Home test failed: ${err.message}`);
    } finally {
        await browser.close();
    }

    return { status };
}

scrapeShopeeHome();
