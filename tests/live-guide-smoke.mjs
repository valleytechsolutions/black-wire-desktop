import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const guide='https://valleytech-black-wire-guide.pages.dev/';
const store='https://valleytechsolutions.tech/pages/bwm-technical-reference-guide';
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto(guide);await expect(page.getByRole('heading',{name:/Know your board/})).toBeVisible();
 const c=await page.evaluate(()=>fetch('catalog.json').then(r=>r.json()));expect(c.editionInfo.snapshot).toBe('2026.09.3');expect(c.stats.makerRecords).toBe(457);
 await page.getByRole('textbox',{name:'Search boards and references'}).fill('teensy-4.1');await page.getByRole('button',{name:'View Teensy 4.1 references',exact:true}).click();
 await expect.poll(()=>page.locator('.scaled-image img').evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
 await page.keyboard.press('Escape');
 const p=c.boards.find(b=>b.assets.some(a=>a.extension==='pdf')&&b.assets.some(a=>a.type==='pinout image'));
 await page.goto(guide+'?board='+p.id);await page.locator('.asset-item').filter({has:page.locator('small',{hasText:'PDF'})}).first().click();await expect(page.locator('canvas[data-rendered="true"]')).toBeVisible();await page.getByRole('button',{name:'Next page'}).click();await expect(page.getByRole('status')).toHaveText('Page 2 of 7');
 await page.goto(guide+'?tab=devices');await expect(page.getByRole('heading',{name:/Small devices/})).toBeVisible();await page.getByLabel('Device manufacturer').selectOption('LILYGO');await expect(page.locator('.board-card').first()).toBeVisible();
 await page.goto(store);const frame=page.frameLocator('iframe[src*="valleytech-black-wire-guide.pages.dev"]');await expect(frame.getByRole('heading',{name:/Know your board/})).toBeVisible({timeout:30000});
 await frame.getByRole('button',{name:/Displays & modules/}).click();await frame.getByRole('textbox',{name:'Search boards and references'}).fill('BME280');await expect(frame.locator('.maker-card').first()).toContainText('BME280');
 await fs.mkdir('data/qa/makers',{recursive:true});await page.screenshot({path:'data/qa/makers/shopify-desktop.png',animations:'disabled'});
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(frame.getByRole('textbox',{name:'Search boards and references'})).toBeVisible();await page.screenshot({path:'data/qa/makers/shopify-mobile.png',animations:'disabled'});
 const report={passed:true,guide,store,snapshot:c.editionInfo.snapshot,makerRecords:c.stats.makerRecords,checks:['live original image','live PDF pagination','device filter','Shopify iframe maker search','phone layout']};await fs.writeFile('data/qa/makers/live-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
