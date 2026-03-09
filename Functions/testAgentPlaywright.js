const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`[CONSOLE ERROR]: ${msg.text()}`);
        }
    });

    page.on('pageerror', exception => {
        console.log(`[PAGE EXCEPTION]: ${exception}`);
    });

    try {
        await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 5000 });
        console.log("Successfully connected, awaiting console output...");
        await page.waitForTimeout(2000);
        
        const content = await page.content();
        if (content.includes('viteErrorOverlay')) {
            console.log("[VITE OVERLAY ERROR FOUND]");
        }
        
    } catch (e) {
        console.error("Navigation failed", e);
    } finally {
        await browser.close();
    }
})();
