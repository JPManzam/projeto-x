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

function createAffiliateLink(rawUrl, tag) {
    if (!rawUrl || rawUrl === 'N/A') return 'N/A';
    try {
        const asinMatch = rawUrl.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
        if (asinMatch && asinMatch[1]) {
            return `https://www.amazon.com.br/dp/${asinMatch[1]}/?tag=${tag}`;
        }
        const url = new URL(rawUrl);
        url.searchParams.set('tag', tag);
        return url.toString();
    } catch (e) {
        return rawUrl;
    }
}

async function scrapeAmazon(keyword) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] � Scraper Amazon: Searching for ${keyword}`);

    const browser = await chromium.launch({
        headless: config.headless,
        args: ['--disable-blink-features=AutomationControlled']
    });

    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 },
        locale: 'pt-BR',
    });

    const page = await context.newPage();
    const products = [];

    try {
        const searchUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
        await page.goto(searchUrl, { waitUntil: 'load', timeout: 6000 });
        await randomDelay(2000, 4000);

        const cardSelector = 'div[data-component-type="s-search-result"]';
        await page.waitForSelector(cardSelector, { timeout: 15000 });

        const cards = await page.$$(cardSelector);

        for (const card of cards.slice(0, config.maxProducts)) {
            try {
                const title = await card.$eval('h2 span, .a-size-base-plus.a-color-base.a-text-normal', el => el.innerText).catch(() => 'N/A');
                const price = await card.$eval('.a-price .a-offscreen', el => el.innerText)
                    .catch(async () => await card.$eval('.a-color-base .a-text-bold', el => el.innerText).catch(() => 'N/A'));

                // Image Extraction
                const image = await card.$eval('img.s-image', el => el.src).catch(() => 'N/A');

                const rawUrl = await card.$$eval('a', links => {
                    const productLink = links.find(a => a.href.includes('/dp/') || a.href.includes('/gp/product/'));
                    if (productLink) return productLink.href;
                    const h2Link = links.find(a => a.querySelector('h2') || a.closest('h2'));
                    return h2Link ? h2Link.href : 'N/A';
                }).catch(() => 'N/A');

                const affiliateUrl = createAffiliateLink(rawUrl, config.associateTag);

                if (title !== 'N/A') {
                    products.push({
                        title: title.trim(),
                        price: price.trim(),
                        image: image,
                        affiliate_url: affiliateUrl
                    });
                }
            } catch (e) { }
        }
    } catch (err) {
        console.error(`Scrape failed for ${keyword}: ${err.message}`);
    } finally {
        await browser.close();
    }
    return { keyword, products };
}

async function run() {
    const allResults = [];
    for (const kw of config.keywords) {
        const result = await scrapeAmazon(kw);
        allResults.push(result);
    }
    const dateStr = new Date().toISOString().split('T')[0];
    const logsDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    fs.writeFileSync(path.join(logsDir, `amazon-affiliate-${dateStr}.json`), JSON.stringify(allResults, null, 2));
    console.log('✅ Done');
}

run();
