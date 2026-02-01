import fs from 'fs';
import path from 'path';

function checkHealth() {
    const dateStr = new Date().toISOString().split('T')[0];
    const logFile = path.join('logs', `${dateStr}.json`);

    console.log(`Checking health for ${dateStr}...`);

    if (!fs.existsSync(logFile)) {
        console.error(`🔴 FAIL: No log file found for today (${logFile})`);
        process.exit(1);
    }

    try {
        const data = JSON.parse(fs.readFileSync(logFile, 'utf8'));
        const lastExecution = data[data.length - 1];

        if (lastExecution.status !== 'success') {
            console.error(`🔴 FAIL: Last execution status was ${lastExecution.status}`);
            console.error(`Error: ${lastExecution.error}`);
            process.exit(1);
        }

        if (lastExecution.productsFound === 0) {
            console.warn(`🟡 WARNING: No products found in last execution`);
        }

        console.log(`✅ SUCCESS: Scraper is healthy. Last execution found ${lastExecution.productsFound} products.`);
    } catch (err) {
        console.error(`🔴 FAIL: Could not parse log file: ${err.message}`);
        process.exit(1);
    }
}

checkHealth();
