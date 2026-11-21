(() => {
 const input=document.querySelector('#people-query');
 if(!input)return;
 const form=input.closest('form'),list=document.querySelector('#people-results'),status=document.querySelector('#people-status');
 let index,request,sequence=0;
 const normalize=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 form.addEventListener('submit',e=>e.preventDefault());
 async function search(){
  const ticket=++sequence,query=normalize(input.value.trim());list.replaceChildren();
  if(query.length<2){status.textContent='Enter at least two characters. All profiles are also available in the pages below.';return;}
  status.textContent='Searching people and companies…';
  try{
   if(!index){request??=fetch('/assets/people-index.json').then(r=>{if(!r.ok)throw Error('Search unavailable');return r.json();}).catch(e=>{request=undefined;throw e;});index=await request;}
   if(ticket!==sequence)return;
   const hits=index.filter(p=>normalize(p.name+' '+p.company).includes(query));
   status.textContent=hits.length?`${hits.length} matching records. Showing ${Math.min(12,hits.length)}.`:'No matching records. Try a surname or company name.';
   for(const p of hits.slice(0,12)){
    const item=document.createElement('li'),a=document.createElement('a'),detail=document.createElement('span');
    a.href=p.url;a.textContent=p.name;detail.textContent=` — ${p.company} · ${p.collection}`;
    item.append(a,detail);list.append(item);
   }
  }catch{if(ticket===sequence)status.textContent='Search is temporarily unavailable. Browse the alphabetical pages below.';}
 }
 input.addEventListener('input',search);
 const initial=new URLSearchParams(location.search).get('q');
 if(initial){input.value=initial;search();}
})();
