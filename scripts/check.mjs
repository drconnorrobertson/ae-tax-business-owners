import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'), dist=path.join(root,'dist');
const owners=JSON.parse(fs.readFileSync(path.join(root,'data/owners.json'),'utf8'));
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(f=>f.isDirectory()?walk(path.join(p,f.name)):[path.join(p,f.name)]);
const files=walk(dist), html=files.filter(p=>p.endsWith('.html'));
const titles=new Set(),canonical=new Set(),indexable=new Set();
for(const p of html){
 const text=fs.readFileSync(p,'utf8');
 assert.equal((text.match(/<h1[ >]/g)||[]).length,1,`One h1: ${p}`);
 if(p.endsWith('/404.html'))continue;
 const title=text.match(/<title>(.*?)<\/title>/)?.[1],url=text.match(/rel="canonical" href="([^"]+)"/)?.[1];
 assert(title && !titles.has(title),`Unique title: ${p}`);titles.add(title);
 assert(url?.startsWith('https://businessownerindex.com/')&&!canonical.has(url),`Unique canonical: ${p}`);canonical.add(url);
 assert(text.includes('name="description" content="'),`Description: ${p}`);
 if(!text.includes('content="noindex'))indexable.add(url);
 for(const m of text.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))JSON.parse(m[1]);
 for(const m of text.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[^\"]*)"/g)){
  const local=path.join(dist,decodeURI(m[1]));assert(fs.existsSync(local),`Missing internal target ${m[1]} from ${p}`);
 }
}
const sitemapURLs=new Set(files.filter(p=>/sitemap-\d+\.xml$/.test(p)).flatMap(p=>[...fs.readFileSync(p,'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1])));
assert.deepEqual(sitemapURLs,indexable,'Sitemap includes all and only indexable pages');
for(const key of ['slug','companySlug'])assert.equal(new Set(owners.map(p=>p[key])).size,owners.length,`Duplicate ${key}`);
for(const p of owners){assert(p.name&&p.company&&p.milestone&&p.summary);assert(p.sources.length&&p.sources.every(s=>s.url.startsWith('https://')));assert(p.eligibility.minimumRevenue>1000000);}
assert(fs.existsSync(path.join(dist,'assets/share.png')),'Social preview image');
assert(JSON.parse(fs.readFileSync(path.join(dist,'assets/search-index.json'),'utf8')).length===owners.length);
console.log(`PASS: ${html.length} HTML pages; ${indexable.size} indexable URLs; metadata, schema, internal targets, sitemap and ${owners.length} sourced profiles.`);
