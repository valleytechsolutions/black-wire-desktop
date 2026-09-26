import test from 'node:test';import assert from 'node:assert/strict';
import {validateMeasurement,validateSavedWorkbench} from '../src/domain.mjs';
const m={id:'one',boardId:'old-board',revision:'1',condition:'LED off',instrument:'meter',date:'2026-02-28',input:'USB',voltage:5,currentMa:20};
test('Stored data rejects malformed measurements before rendering and preserves retired board IDs',()=>{
 for(const data of [null,[],{favorites:[],measurements:[null]},{favorites:[{}],measurements:[]},{favorites:[],measurements:[{...m,notes:{}}]}])assert.throws(()=>validateSavedWorkbench(data));
 assert.deepEqual(validateSavedWorkbench({favorites:['old-board'],measurements:[m]}),{favorites:['old-board'],measurements:[m]});
 assert.deepEqual(validateSavedWorkbench({}),{favorites:[],measurements:[]});
});
test('Measurement dates reject calendar overflow while accepting leap day',()=>{
 assert.match(validateMeasurement({...m,date:'2026-02-31'},new Set([m.boardId])),/valid measurement date/);
 assert.equal(validateMeasurement({...m,date:'2024-02-29'},new Set([m.boardId])), '');
});
