import test from 'node:test';
import assert from 'node:assert/strict';
import {makerAssets} from '../src/maker-assets.mjs';
import {searchMakerParts,makerWords} from '../src/maker-search.mjs';
test('maker gallery deduplicates linked originals and prefers physical references',()=>{
 const photo={file:'a.jpg',type:'identification photo'},pinout={file:'b.png',type:'pinout image'};
 assert.deepEqual(makerAssets({assets:[photo],boardIds:['board']},{boards:[{id:'board',assets:[photo,pinout]}]}),[pinout,photo]);
});
test('power search recognizes step-up and step-down without conflating exact charger numbers',()=>{
 assert.deepEqual(makerWords('step up'),makerWords('boost'));assert.deepEqual(makerWords('stepdown'),makerWords('buck'));
 const parts=['TP4056','TP4057'].map((name,i)=>({id:name,name,brand:'Test',category:'Power & charging',aliases:[],tags:['charger'],imageCount:i}));
 assert.deepEqual(searchMakerParts(parts,{query:'TP 4057'}).map(p=>p.id),['TP4057']);
 assert.deepEqual(searchMakerParts(parts,{imagesOnly:true}).map(p=>p.id),['TP4057']);
});
