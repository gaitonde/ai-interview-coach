import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function getBrowserInstance() {
  const options = process.env.NODE_ENV === 'production'
    ? {
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
      }
    : {
        args: [],
        executablePath: process.platform === 'win32'
          ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
          : process.platform === 'linux'
          ? '/usr/bin/google-chrome'
          : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: true,
      };

  return await puppeteer.launch(options);
}

export async function getPageContent(url: string): Promise<string> {
  const browser = await getBrowserInstance();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' });
    const html = await page.content();
    return html;
  } finally {
    await browser.close();
  }
} 