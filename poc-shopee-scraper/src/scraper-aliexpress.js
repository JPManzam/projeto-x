import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

chromium.use(stealth());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const randomDelay = (min, max) => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min)));

async function superStealthScrape(keyword) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🕵️ Final Super-Stealth AliExpress attempt for: ${keyword}`);

    const browser = await chromium.launch({
        headless: config.headless,
        args: ['--disable-blink-features=AutomationControlled']
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        viewport: { width: 1366, height: 768 }
    });

    const page = await context.newPage();
    const products = [];
    let status = 'success';
    let errorMsg = null;

    try {
        console.log("Navigating to AliExpress Home...");
        // Use domcontentloaded to avoid long timeouts on heavy ads
        await page.goto('https://www.aliexpress.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await randomDelay(5000, 8000); // Wait manually

        // Close popups
        console.log("Clearing popups...");
        await page.keyboard.press('Escape');
        await randomDelay(2000, 3000);
        await page.keyboard.press('Escape'); // Double tap to be sure

        // Find Search Bar
        console.log("Finding search bar...");
        const searchInput = await page.$('input#search-key, input[name="SearchText"], .search--input--1V_mYxP');
        if (!searchInput) {
            throw new Error("Search input not found");
        }

        await searchInput.click();
        await randomDelay(800, 1500);

        console.log("Typing keyword...");
        for (const char of keyword) {
            await page.keyboard.type(char, { delay: Math.random() * 200 + 50 });
        }
        await randomDelay(1000, 2000);
        await page.keyboard.press('Enter');

        console.log("Waiting for results...");
        await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => { });
        await randomDelay(6000, 10000);

        // Extraction
        const cardSelector = 'div[class*="multi--item--"], div[class*="search-card-item"], .list--item';
        await page.waitForSelector(cardSelector, { timeout: 20000 });

        const cards = await page.$$(cardSelector);
        console.log(`Found ${cards.length} product cards!`);

        for (let i = 0; i < Math.min(cards.length, config.maxProducts); i++) {
            const card = cards[i];
            const title = await card.$eval('h3, h1, div[class*="title"], div[class*="multi--title"]', el => el.innerText).catch(() => 'N/A');
            const price = await card.$eval('div[class*="price--current"], div[class*="main--price"], div[class*="multi--price"]', el => el.innerText).catch(() => 'N/A');
            const href = await card.$eval('a', el => el.href).catch(() => 'N/A');

            if (title !== 'N/A') {
                products.push({ title: title.trim(), price: price.trim(), url: href });
            }
        }

    } catch (err) {
        status = 'error';
        errorMsg = err.message;
        console.error(`Attempt failed: ${err.message}`);
        const logsDir = path.join(__dirname, '..', 'logs');
        await page.screenshot({ path: path.join(logsDir, `final-attempt-error-${Date.now()}.png`) }).catch(() => { });
    } finally {
        await browser.close();
    }

    return { timestamp, status, keyword, productsFound: products.length, products, error: errorMsg };
}

async function run() {
    const result = await superStealthScrape(config.keywords[0]);
    const dateStr = new Date().toISOString().split('T')[0];
    const logsDir = path.join(__dirname, '..', 'logs');
    fs.writeFileSync(path.join(logsDir, `final-ae-${dateStr}.json`), JSON.stringify([result], null, 2));
    console.log(`Final Test Done. Status: ${result.status}`);
}

run();
