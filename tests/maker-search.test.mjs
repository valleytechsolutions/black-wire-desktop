import test from 'node:test';
import assert from 'node:assert/strict';
import {searchMakerParts,makerSuggestions} from '../src/maker-search.mjs';
const rows=[
 {id:'oled',name:'0.96 inch OLED breakout',brand:'Example',category:'Displays',technology:'OLED',controllers:['SSD1306'],interfaces:['I2C'],diagonalInches:0.96,resolution:'128x64',documentationStatus:'Manufacturer documentation recorded'},
 {id:'sh',name:'1.3 inch OLED breakout',brand:'Example',category:'Displays',technology:'OLED',controllers:['SH1106'],interfaces:['SPI'],diagonalInches:1.3,resolution:'128x64'},
 {id:'epd',name:'13.3 inch e-Paper HAT',brand:'Other',category:'Displays',technology:'e-Paper',interfaces:['SPI'],diagonalInches:13.3},
 {id:'bme',name:'BME280 environmental sensor',brand:'Other',category:'Sensors',controllers:['BME280'],interfaces:['I2C','SPI'],tags:['temperature','humidity','pressure']},
 {id:'bmp',name:'BMP280 pressure sensor',brand:'Other',category:'Sensors',controllers:['BMP280'],interfaces:['I2C','SPI'],tags:['temperature','pressure']},
 {id:'ky',name:'KY-004 Button',brand:'Joy-IT',category:'Controls & input',aliases:['KY004'],interfaces:['GPIO']}
];
const ids=(q,options={})=>searchMakerParts(rows,{query:q,...options}).map(p=>p.id);
test('Display dimensions, buses and controller separators are normalized without widening numeric identities',()=>{
 for(const q of ['oled 0.96 i²c','OLED 0.96" IIC','ssd-1306','ssd 1306','128 × 64 oled i2c'])assert.deepEqual(ids(q),['oled'],q);
 assert.deepEqual(ids('1.3 oled'),['sh']);assert.deepEqual(ids('13 oled'),[]);
 assert.deepEqual(ids('e ink SPI'),['epd']);assert.deepEqual(ids('epaper'),['epd']);
 assert.deepEqual(ids('SSD130'),[]);assert.deepEqual(ids('128x32'),[]);
});
test('Exact sensor identity and combined filters do not imply voltage or software compatibility',()=>{
 assert.deepEqual(ids('bme280'),['bme']);assert.deepEqual(ids('bmp280'),['bmp']);
 assert.deepEqual(ids('temp humidity'),['bme']);assert.deepEqual(ids('ky 004'),['ky']);
 assert.deepEqual(ids('',{category:'Displays',interface:'SPI',size:'1.3'}),['sh']);
 assert.deepEqual(ids('',{documentedOnly:true}),['oled']);
 assert.deepEqual(ids('',{savedOnly:true,favorites:['bme']}),['bme']);
 assert.deepEqual(ids('5V compatible'),[]);
});
test('Near model suggestions are explicit, never automatic substitutions',()=>{
 assert.deepEqual(ids('SSD1307'),[]);assert.ok(makerSuggestions(rows,'SSD1307').includes('SSD1306'));
 assert.deepEqual(ids('---'),[]);assert.equal(ids('modules').length,rows.length);
});
