import test from 'node:test';import assert from 'node:assert/strict';
import {pdfGeometry} from '../src/pdf-geometry.mjs';
test('PDF maximum zoom stays inside memory and dimension limits, including tall sheets',()=>{
 for(const [w,h] of [[595,842],[842,595],[300,12000]])for(const width of [280,1100,3800]){
  const g=pdfGeometry(w,h,width,6,3);assert.ok(g.pixelWidth*g.pixelHeight<=16000000);assert.ok(g.pixelWidth<=8192&&g.pixelHeight<=8192);
  assert.equal(g.cssWidth,width*6);assert.equal(g.cssHeight,g.cssWidth*h/w);
 }
});
test('PDF normal zoom preserves high-density text rendering',()=>{
 const g=pdfGeometry(600,800,600,1,2);assert.equal(g.pixelWidth,1200);assert.equal(g.pixelHeight,1600);assert.equal(g.scale,2);
});
