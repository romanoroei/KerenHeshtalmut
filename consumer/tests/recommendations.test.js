import test from 'node:test'; import assert from 'node:assert/strict'; import { buildCta, buildRecommendation } from '../engine/recommendations.js';
const base={deposited:10000,remaining:10566,overCeiling:0,suggestedMonthlyToYearEnd:1761};
test('המלצה ללא הפקדות',()=>assert.match(buildRecommendation({...base,deposited:0},{fundStatus:'liquid'}),/להתחיל/));
test('המלצה חד־פעמית',()=>assert.match(buildRecommendation(base,{fundStatus:'liquid',completionPreference:'lump'}),/10,566/));
test('המלצה חודשית',()=>assert.match(buildRecommendation(base,{fundStatus:'liquid',completionPreference:'monthly'}),/1,761/));
test('המלצה לניצול מלא',()=>assert.match(buildRecommendation({...base,remaining:0},{fundStatus:'liquid'}),/מלוא התקרה/));
test('המלצה מעל התקרה',()=>assert.match(buildRecommendation({...base,overCeiling:1000},{fundStatus:'liquid'}),/מעל התקרה/));
test('CTA ללא קרן',()=>assert.match(buildCta(base,{fundStatus:'none'}),/לפתוח קרן/));
