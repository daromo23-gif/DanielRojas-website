import { chromium } from 'file:///C:/Users/darom/AppData/Local/ms-playwright-go/1.50.1/package/index.mjs';
import fs from 'fs';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || 'section';

const dir = './temporary screenshots';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const existing = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
let maxN = 0;
for (const f of existing) {
  const m = f.match(/^screenshot-(\d+)/);
  if (m) maxN = Math.max(maxN, parseInt(m[1]));
}
const n = maxN + 1;
const outPath = `${dir}/screenshot-${n}-${label}.png`;

const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle' });
// screenshot just the top 900px (hero area)
await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1440, height: 900 } });
await browser.close();
console.log(`Screenshot saved: ${outPath}`);
