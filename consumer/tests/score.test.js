import test from 'node:test'; import assert from 'node:assert/strict'; import { calculateUtilizationScore } from '../engine/score.js';
test('ציון 0',()=>assert.equal(calculateUtilizationScore({deposited:0,ceiling:20566}),0));
test('ציון חלקי',()=>assert.equal(calculateUtilizationScore({deposited:10283,ceiling:20566,hasMonthlyPlan:true,fundStatus:'liquid',completionPreference:'monthly'}),70));
test('ציון 100',()=>assert.equal(calculateUtilizationScore({deposited:20566,ceiling:20566,hasMonthlyPlan:true,fundStatus:'liquid',completionPreference:'monthly'}),100));
test('אין ציון מעל 100',()=>assert.equal(calculateUtilizationScore({deposited:50000,ceiling:20566,hasMonthlyPlan:true,fundStatus:'liquid',completionPreference:'monthly'}),100));
