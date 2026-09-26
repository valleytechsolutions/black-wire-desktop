import {chromium,expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
const live=process.env.BLACKWIRE_TEST_URL;
const url=live||'http://127.0.0.1:5187/';
let server,browser;
try{
 if(!live){server=spawn(process.execPath,['scripts/preview-web.mjs'],{stdio:'pipe',windowsHide:true});await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});}
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1050}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?tab=makers');await expect(page.getByRole('heading',{name:'Displays & modules',exact:true})).toBeVisible();
 const search=page.getByRole('textbox',{name:'Search boards and references'});
 await search.fill('BME280');await expect(page.locator('.maker-card').first()).toContainText('BME280');
 await expect(page.locator('.maker-card').filter({hasText:'BMP280'})).toHaveCount(0);
 await page.locator('.maker-card').filter({hasText:'Adafruit'}).getByRole('button',{name:/Open maker record/}).first().click();
 const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog).toContainText('Documented pin labels');await expect(dialog).toContainText('not the physical order');
 const permalink=await dialog.getByRole('link',{name:'Link to this record'}).getAttribute('href');
 await page.goto(permalink);await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
 await search.fill('1.54 LCD');await page.getByLabel('Maker interface',{exact:true}).selectOption('SPI');await expect(page.locator('.maker-card').first()).toContainText('1.54inch LCD Module');
 await page.getByRole('button',{name:'Reset search & filters'}).click();await search.fill('KY 004');await expect(page.locator('.maker-card')).toHaveCount(1);await expect(page.locator('.maker-card')).toContainText('Button');
 await search.fill('SSD1307');await expect(page.getByRole('heading',{name:'No matching maker records yet.'})).toBeVisible();await expect(page.getByRole('button',{name:'SSD1306',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'SSD1306',exact:true}).click();await expect(page.locator('.maker-card').first()).toBeVisible();
 await page.getByRole('button',{name:'Reset search & filters'}).click();await page.getByRole('button',{name:/^Displays\d/}).click();
 await page.evaluate(()=>window.scrollTo(0,0));
 await fs.mkdir('data/qa/makers',{recursive:true});await page.screenshot({path:'data/qa/makers/'+(live?'live-':'')+'desktop.png',animations:'disabled'});
 await page.setViewportSize({width:390,height:844});await expect.poll(()=>page.locator('.sidebar').evaluate(el=>el.getBoundingClientRect().right)).toBeLessThanOrEqual(1);
 await page.screenshot({path:'data/qa/makers/'+(live?'live-':'')+'mobile.png',animations:'disabled'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await search.fill('KY004');await page.getByRole('button',{name:'Reset search & filters'}).click();
 await page.setViewportSize({width:1440,height:1050});await page.getByRole('button',{name:/^Board library/}).click();await search.fill('BME280');await expect(page.getByRole('button',{name:'Explore parts'})).toBeVisible();await page.getByRole('button',{name:'Explore parts'}).click();await expect(page.locator('.maker-card').first()).toContainText('BME280');
 expect(errors).toEqual([]);
 console.log(JSON.stringify({passed:true,target:live?'production':'local',checks:['exact controller identity','source and label disclosure','shareable records','interface filtering','punctuation normalization','explicit spelling suggestions','mobile overflow','cross-library discovery']}));
}finally{await browser?.close();server?.kill();}
