const puppeteer = require('puppeteer');

async function checkPage(url, name) {
  console.log(`\nChecking ${name} at ${url}...`);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[${name} CONSOLE ERROR]:`, msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log(`[${name} PAGE ERROR]:`, err.toString());
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 10000 });
    const content = await page.content();
    if (content.includes('viteErrorOverlay')) {
      console.log(`[${name} VITE ERROR OVERLAY DETECTED]`);
    } else {
      console.log(`[${name} Load complete. No Vite error overlay found.]`);
    }
  } catch (err) {
    console.log(`[${name} NAVIGATION ERROR]:`, err.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  await checkPage('http://localhost:5173', 'Client');
  await checkPage('http://localhost:5174', 'Agent');
}

main();
