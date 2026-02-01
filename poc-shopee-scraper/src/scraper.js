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

async function scrapeShopee(keyword) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Starting Human-like scrape for: ${keyword}`);

    const browser = await chromium.launch({
        headless: true, // I must keep it headless
        args: ['--disable-blink-features=AutomationControlled']
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();

    const products = [];
    let status = 'success';
    let errorMsg = null;

    try {
        // 1. Go to Home
        console.log(`Navigating to Shopee home...`);
        await page.goto('https://shopee.com.br/', { waitUntil: 'networkidle', timeout: 60000 });
        await delay(3000 + Math.random() * 2000);

        // 2. Handle potential "Accept Cookies" or popups
        const cookieButton = await page.$('button:has-text("Aceitar"), button:has-text("todos os cookies")');
        if (cookieButton) {
            await cookieButton.click();
            console.log("Accepted cookies");
            await delay(1000);
        }

        // 3. Find search bar and type
        console.log(`Typing keyword: ${keyword}`);
        const searchSelectors = ['input.shopee-searchbar-input__input', 'input[placeholder*="Buscar"]', 'input'];
        let searchInput = null;
        for (const sel of searchSelectors) {
            searchInput = await page.$(sel);
            if (searchInput) break;
        }

        if (!searchInput) throw new Error("Search input not found");

        await searchInput.click();
        await delay(500);
        await page.keyboard.type(keyword, { delay: 100 });
        await delay(1000);
        await page.keyboard.press('Enter');

        console.log("Waiting for search results...");
        await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => { });
        await delay(5000);

        // Check if we are at login page
        if (page.url().includes('login')) {
            throw new Error(`Detected as bot: Redirected to ${page.url()}`);
        }

        // 4. Extract
        const itemsSelector = '.shopee-search-item-result__item';
        try {
            await page.waitForSelector(itemsSelector, { timeout: 20000 });
        } catch (e) {
            // Maybe different selector?
            const screenshotPath = path.join(__dirname, '..', 'logs', `debug-${Date.now()}.png`);
            await page.screenshot({ path: screenshotPath });
            throw new Error(`Results not found (Selector ${itemsSelector} timed out). Screenshot saved to ${screenshotPath}`);
        }

        const items = await page.$$(itemsSelector);
        console.log(`Found ${items.length} items`);

        for (let i = 0; i < Math.min(items.length, config.maxProducts); i++) {
            const item = items[i];
            const title = await item.$eval('div[data-sqp="name"]', el => el.innerText).catch(() => 'N/A');
            const url = await item.$eval('a', el => el.href).catch(() => 'N/A');
            products.push({ title, url });
        }

    } catch (err) {
        status = 'error';
        errorMsg = err.message;
        console.error(`Scrape failed: ${err.message}`);
        const logsDir = path.join(__dirname, '..', 'logs');
        if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
        await page.screenshot({ path: path.join(logsDir, `error-${Date.now()}.png`) }).catch(() => { });
    } finally {
        await browser.close();
    }

    return { timestamp, status, keyword, productsFound: products.length, products, error: errorMsg };
}

async function run() {
    const logsDir = path.join(__dirname, '..', 'logs');
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const allResults = [];
    // Run only one keyword for testing
    const result = await scrapeShopee(config.keywords[0]);
    allResults.push(result);

    const dateStr = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `${dateStr}.json`);
    fs.writeFileSync(logFile, JSON.stringify(allResults, null, 2));

    console.log(`Done! Results saved to ${logFile}`);
}

run();
