import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const read=file=>JSON.parse(fs.readFileSync(path.join(root,'data',file),'utf8'));
const people=read('researched-founders.json');
const norm=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const existing=[...read('owners.json'),...read('public-founders.json'),...read('featured-businesses.json'),...read('founder-reference.json').people];
const names=new Set(existing.map(x=>norm(x.name)));
assert.equal(people.length,48);
assert.equal(new Set(people.map(p=>norm(p.name))).size,48);
assert.equal(new Set(people.map(p=>p.slug)).size,48);
for(const p of people){
 assert(!names.has(norm(p.name)),'Duplicate existing person: '+p.name);
 assert.equal(p.revenueEvaluated,false);
 assert(p.website.startsWith('https://')&&p.sources.length>=1);
 assert(p.sources.every(s=>s.url.startsWith('https://')&&s.title));
 assert(p.sections.every(s=>s.sourceIndexes.every(i=>p.sources[i])));
 assert([p.intro,...p.sections.map(s=>s.text),...p.checks].join(' ').split(/\s+/).length>=270);
 const page=fs.readFileSync(path.join(root,'dist/founder-profiles',p.slug,'index.html'),'utf8');
 assert(page.includes('Revenue has not been evaluated.')&&page.includes(p.reviewedAt));
 assert(!page.includes('"worksFor"'),'Do not infer current employment');
 assert(page.includes('https://businessownerindex.com/founder-profiles/'+p.slug+'/'));
 for(const s of p.sources)assert(page.includes(s.url.replace(/&/g,'&amp;')));
}
const found=[];
for(let page=1;page<=3;page++){
 const hub=fs.readFileSync(path.join(root,page===1?'dist/founder-profiles/index.html':`dist/founder-profiles/page/${page}/index.html`),'utf8');
 assert.equal((hub.match(/<article class="guide-card">/g)||[]).length,16);
 const links=[...hub.matchAll(/<h2><a href="(\/founder-profiles\/[^"]+)"/g)].map(m=>m[1]);
 found.push(...links);
 assert(hub.includes('/founder-profiles/page/2/')&&hub.includes('aria-current="page"'));
}
assert.equal(found.length,48);assert.equal(new Set(found).size,48);
assert.deepEqual(new Set(found),new Set(people.map(p=>'/founder-profiles/'+p.slug+'/')));
assert(fs.readFileSync(path.join(root,'dist/directory/index.html'),'utf8').includes('Primary-source founder profiles — revenue not evaluated'));
const search=JSON.parse(fs.readFileSync(path.join(root,'dist/assets/search-index.json'),'utf8'));
assert(!people.some(p=>search.some(s=>norm(s.name)===norm(p.name))),'Keep separate from growth search/filter');
console.log('PASS: 48 distinct primary-source founder profiles with 16-card crawlable pagination, dated sources, revenue exclusions, separate hub and no mixing into growth filters.');
