import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist');
const read=(file)=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const html=url=>fs.readFileSync(path.join(dist,url,'index.html'),'utf8');
const index=read('dist/assets/people-index.json'),overlays=read('data/profile-enrichment.json');
const expected=[...read('data/owners.json').filter(p=>p.status==='published').map(p=>'/owners/'+p.slug+'/'),...read('data/public-founders.json').map(p=>'/owners/'+p.slug+'/'),...read('data/featured-businesses.json').map(p=>'/owners/'+p.slug+'/'),...read('data/founder-reference.json').people.map(p=>'/founder-reference/people/'+p.slug+'/'),...read('data/researched-founders.json').map(p=>'/founder-profiles/'+p.slug+'/')];
assert.deepEqual(new Set(index.map(p=>p.url)),new Set(expected),'Unified search includes every active collection');
assert.equal(index.length,new Set(expected).size,'No duplicate search destinations');
const listed=[];
for(let n=1;n<=Math.ceil(index.length/60);n++){
 const body=html(n===1?'/people/':`/people/page/${n}/`);
 const cards=[...body.matchAll(/<article class="people-card">(.*?)<\/article>/gs)];
 assert(cards.length>0&&cards.length<=60,'Bounded crawlable index');
 assert(body.includes('aria-current="page"')&&body.includes('aria-label="People index pages"'));
 for(const card of cards)listed.push(card[1].match(/<h2><a href="([^"]+)"/)?.[1]);
}
assert.deepEqual(listed,index.map(p=>p.url),'Every active person is crawlable once in name order');
for(const p of index){
 assert(p.name&&p.company&&p.collection);
 const body=html(p.url),schema=JSON.parse(body.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 const page=schema.find(x=>x['@type']==='ProfilePage');
 assert(page,'ProfilePage structured data: '+p.url);
 assert.equal(page.mainEntity['@id'],'https://businessownerindex.com'+p.url+'#person');
 assert(schema.some(x=>x['@type']==='Person'&&x['@id']===page.mainEntity['@id']&&x.name===p.name),'Main entity resolves to this person');
 for(const id of ['business-connections','owner-planning'])assert(body.includes(`id="${id}"`),'Accessible profile section');
 assert(body.includes('/profile-methodology/')&&body.includes('/ae-tax-advisors/'));
 assert(!body.includes('undefined'),'No incomplete listing values');
 if(!overlays.some(o=>o.url===p.url))assert(!body.includes('id="professional-links"'),'No invented link verification');
}
for(const p of overlays){
 const body=html(p.url);assert(index.some(x=>x.url===p.url&&x.name===p.name),'Overlay identity matches');
 const schema=JSON.parse(body.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 const person=schema.find(x=>x['@type']==='Person'&&x.name===p.name);
 for(const link of p.links){assert(link.evidence.startsWith('https://'));assert(body.includes(link.url.replaceAll('&','&amp;')));assert(body.includes(link.evidence.replaceAll('&','&amp;')));assert(person.sameAs.includes(link.url));}
 assert(body.includes('reviewed 2026-11-21'));
}
for(const p of read('data/founder-reference.json').withdrawnRecords){assert(!index.some(x=>x.url===p.path));assert(html(p.path).includes('noindex,follow'));}
const ae=html('/owners/christina-nortman/');
assert(ae.includes('Managing Partner, Northeast Region')&&!ae.includes('AE’s founder and principal'));
assert(!html('/').includes('Founded and led by Christina'));
console.log(`PASS: ${index.length} real profile entities, bounded complete A–Z, source-backed links for ${overlays.length} profiles, AE planning routes and preserved withdrawals.`);
