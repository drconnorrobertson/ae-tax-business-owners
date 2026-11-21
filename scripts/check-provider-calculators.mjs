import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { calculate } from '../assets/provider-cost-models.js';
const root=path.resolve(import.meta.dirname,'..');
const specs=JSON.parse(fs.readFileSync(path.join(root,'data/provider-calculators.json'),'utf8'));
const expected={payroll:[170,160,2040,1920,120],processing:[560,560,0],retainer:[1800,1700,-100],bookkeeping:[400,375,25],seats:[205,196,108],recruiting:[14400,15000,-600],staffing:[74000,57000,17000],setup:[6000,6000,0,500,500]};
for(const spec of specs){
 const values=Object.fromEntries(spec.fields.map(f=>[f.name,f.value]));
 assert.deepEqual(calculate(spec.id,values).map(r=>r[1]),expected[spec.id],spec.id+' worked example');
 for(const f of spec.fields){
  assert.throws(()=>calculate(spec.id,{...values,[f.name]:-1}),undefined,`${spec.id}.${f.name} negative`);
  assert.throws(()=>calculate(spec.id,{...values,[f.name]:Infinity}),undefined,`${spec.id}.${f.name} infinite`);
  assert.throws(()=>calculate(spec.id,{...values,[f.name]:NaN}),undefined,`${spec.id}.${f.name} missing`);
  if(f.step===1)assert.throws(()=>calculate(spec.id,{...values,[f.name]:1.5}),undefined,`${spec.id}.${f.name} fraction`);
  if(f.max!==null)assert.throws(()=>calculate(spec.id,{...values,[f.name]:f.max+1}),undefined,`${spec.id}.${f.name} maximum`);
 }
 const text=fs.readFileSync(path.join(root,'dist/calculators',spec.slug,'index.html'),'utf8');
 assert(text.includes('type="module" src="/assets/provider-calculators.js?'),'External module for '+spec.id);
 assert(!text.includes('onsubmit='),'No inline event code');
 assert(text.includes('aria-live="polite"')&&text.includes('<noscript>'),'Accessible results and fallback');
 assert(spec.fields.every(f=>text.includes('for="'+spec.id+'-'+f.name+'"')),'Every field labeled');
}
assert.equal(calculate('payroll',{employees:0,baseA:50,personA:6,baseB:80,personB:4})[0][1],50);
assert.equal(calculate('processing',{volume:0,transactions:0,rateA:2.5,fixedA:.1,monthlyA:20,rateB:2.7,fixedB:.05,monthlyB:0})[0][1],20);
assert.equal(calculate('retainer',{hours:8,hourly:150,retainer:1200,included:8,extra:125})[1][1],1200);
assert.equal(calculate('retainer',{hours:0,hourly:150,retainer:1200,included:8,extra:125})[1][1],1200);
assert.equal(calculate('bookkeeping',{transactions:200,baseA:250,includedA:200,extraA:1.5,baseB:375,includedB:400,extraB:1})[0][1],250);
assert.equal(calculate('seats',{seats:0,baseA:25,seatA:15,baseB:100,seatB:8})[0][1],25);
assert.equal(calculate('recruiting',{salary:0,rate:18,flat:15000})[0][1],0);
assert.equal(calculate('staffing',{salary:0,employer:0,tools:0,provider:0,setup:0,retained:0})[2][1],0);
assert.equal(calculate('setup',{months:1,setupA:2400,monthlyA:300,setupB:600,monthlyB:450})[0][1],2700);
assert.throws(()=>calculate('setup',{months:0,setupA:0,monthlyA:0,setupB:0,monthlyB:0}));
assert.throws(()=>calculate('missing',{}));
assert.throws(()=>calculate('payroll',{employees:Number.MAX_VALUE,baseA:1,personA:Number.MAX_VALUE,baseB:1,personB:1}));
console.log('PASS: eight cost calculators; examples, zeros, allowance boundaries, invalid inputs, finite outputs and accessible external scripts.');
