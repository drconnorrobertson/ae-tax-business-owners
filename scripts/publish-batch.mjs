import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name),'utf8'));
const owners=read('owners.json'),queue=read('queue.json');
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const remaining=Math.max(0,100-owners.filter(p=>p.publishedAt===today).length);
const selected=queue.filter(p=>p.approved===true).slice(0,remaining);
for(const p of selected){
 assert(p.name&&p.company&&p.role&&p.summary&&p.milestone&&p.service&&p.industry&&p.location&&p.reviewedAt,'Complete profile required');
 assert(p.sources?.length&&p.sources.every(s=>s.title&&/^https:\/\//.test(s.url)),'Public source evidence required');
 assert(p.eligibility?.minimumRevenue>1000000&&p.eligibility.revenueYear&&p.eligibility.type==='inc5000','Dated qualifying revenue evidence required');
 assert(p.slug&&p.companySlug&&!owners.some(x=>x.slug===p.slug||x.companySlug===p.companySlug),'Duplicate person or company');
 owners.push({...p,status:'published',profileType:'publicly-researched',publishedAt:today});
}
if(selected.length){
 const save=(name,data)=>fs.writeFileSync(path.join(root,'data',name),JSON.stringify(data,null,2)+'\n');
 save('owners.json',owners);save('queue.json',queue.filter(p=>!selected.includes(p)));
}
console.log(`${selected.length} reviewed profiles promoted. ${remaining-selected.length} remaining today. Run npm run build and npm run check before committing. No unapproved research is published.`);
