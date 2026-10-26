const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function renderEditorialGuides({write,base,guides}) {
 for(const g of guides){
  const core=g.blocks.map(b=>`<${b.type}>${escape(b.text)}</${b.type}>`).join('');
  const sourceLinks=g.sources.map(([url,label])=>`<li><a href="${escape(url)}">${escape(label)}</a></li>`).join('');
  const related=g.links.map(([url,label])=>`<li><a href="${escape(url)}">${escape(label)}</a></li>`).join('');
  const body=`<div class="wrap"><section class="page-head article-head"><span class="eyebrow">Directory research</span><h1>${escape(g.title)}</h1><p class="lede">${escape(g.description)}</p><p>Published October 26, 2026 · Business Owner Index website editorial</p></section><article class="prose"><div id="editorial-body">${core}</div><section><h2>Fictional research worksheet</h2><p><a href="/assets/founder-record-example.csv" download>Download the fictional founder-record example (CSV)</a>. No actual person, company or financial result is represented.</p></section><section><h2>Primary sources and scope</h2><ul>${sourceLinks}</ul><p>AI-assisted website editorial content with checked fictional examples. Sources checked October 26, 2026. No named professional review, actual ownership verification or client outcome is asserted.</p></section><section><h2>Related directory research</h2><ul>${related}</ul></section></article></div>`;
  write(g.route,g.title,g.description,body,{article:true,lastmod:'2026-10-26',schema:[{'@type':'Article',headline:g.title,description:g.description,datePublished:g.published,dateModified:'2026-10-26',wordCount:g.words,mainEntityOfPage:base+g.route,author:{'@type':'Organization',name:'Business Owner Index website editorial'},publisher:{'@id':base+'/#publisher'}},{'@type':'FAQPage',mainEntity:g.faqs}]});
 }
}
