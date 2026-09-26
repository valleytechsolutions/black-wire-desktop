import {chromium,expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const live=process.env.BLACKWIRE_TEST_URL,url=live||'http://127.0.0.1:5187/';
let browser,server;
try{
 if(!live){server=spawn(process.execPath,['scripts/preview-web.mjs'],{stdio:'pipe',windowsHide:true});await new Promise((r,j)=>{server.stdout.once('data',r);server.once('error',j);});}
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1050}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);const c=await page.evaluate(()=>fetch('catalog.json').then(r=>r.json()));
 const part=c.makerParts.find(p=>p.brand==='Adafruit'&&p.name.includes('BME280')&&p.pinReferences?.length);
 const search=page.getByRole('combobox',{name:'Search boards and references'});await search.fill(part.name);
 await expect(page.getByRole('listbox').getByRole('option').first()).toContainText(part.name);await search.press('Enter');
 let dialog=page.getByRole('dialog');await expect(dialog).toContainText('Pin names & purpose');
 await expect(dialog.locator('.maker-gallery-heading')).toContainText('pinout image');
 await expect.poll(()=>dialog.locator('.maker-image-stage img').evaluate(im=>im.complete&&im.naturalWidth>100)).toBe(true);
 await dialog.getByRole('textbox',{name:'Find a pin or function'}).fill('SDA');await expect(dialog.locator('.pin-table-scroll tbody tr').first()).toContainText('SDA');
 await dialog.getByRole('textbox',{name:'Find a pin or function'}).fill('');
 const download=page.waitForEvent('download');await dialog.getByRole('button',{name:'Save original',exact:true}).click();const path=await(await download).path();
 const expected=part.assets.find(a=>a.type==='pinout image');expect(crypto.createHash('sha256').update(await fs.readFile(path)).digest('hex')).toBe(expected.hash);
 await fs.mkdir('data/qa/pins',{recursive:true});await dialog.locator('.maker-gallery').scrollIntoViewIfNeeded();await page.screenshot({path:'data/qa/pins/'+(live?'live-':'')+'connector-desktop.png'});
 await page.setViewportSize({width:390,height:844});await dialog.locator('.pin-reference').scrollIntoViewIfNeeded();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'data/qa/pins/'+(live?'live-':'')+'purpose-mobile.png'});
 await page.keyboard.press('Escape');await page.setViewportSize({width:1440,height:1050});
 const missing=c.boards.find(b=>b.pinoutCoverage.status==='missing'&&b.name.length>8);await search.fill(missing.name);await page.getByLabel('Global search scope').selectOption('boards');
 const option=page.getByRole('listbox').getByRole('option').filter({has:page.locator('b',{hasText:missing.name})}).first();await expect(option).toBeVisible();await option.click();await expect(page.getByRole('dialog')).toContainText('Documentation needed');await page.keyboard.press('Escape');
 await search.fill('OLED');await page.getByLabel('Global search scope').selectOption('all');await search.focus();for(let n=0;n<12;n++)await search.press('ArrowDown');
 const selected=page.getByRole('listbox').getByRole('option',{selected:true});await expect(selected).toBeInViewport();await page.screenshot({path:'data/qa/pins/'+(live?'live-':'')+'unified-search.png'});
 expect(errors).toEqual([]);console.log(JSON.stringify({passed:true,target:live?'production':'local',checks:['keyboard global search','exact maker selection','pinout before photos','pin purpose filter','byte-exact connector-sheet download','missing-record visibility','keyboard result scrolling','mobile pin table']}));
}finally{await browser?.close();server?.kill();}
