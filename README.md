# Business Owner Index

Publicly sourced founder and company directory presented by AE Tax Advisors.
Canonical production domain: https://businessownerindex.com.

## Build

Node 22 or later, no dependencies.

```
npm run build
npm run check
```

Vercel: Framework Other; build command `npm run build`; output `dist`.
Deploy only into Connor's verified Vercel team. Connect apex and www using the actual DNS records Vercel returns, preserving email records in GoDaddy.

## Content and publishing

`data/owners.json` contains published records with source links and historical eligibility.
`data/queue.json` is an unpublished research queue. Review identity, public role, business activity and edition-specific revenue evidence before setting `approved: true`.
`npm run publish:batch` promotes at most 100 approved records per Toronto calendar day.
Each owner produces a founder page and a linked company page. Collections and XML sitemaps rebuild from the approved records. Expand toward 1,000 pages through reviewed research rather than filler profiles.

This command is a publishing helper, not a scheduled automation. No daily job is active yet.

## Launch verification

Confirm production commit, HTTP 200 on representative owner/company/resource pages, custom-domain HTTPS, apex/www redirect, sitemap fetch and robots. Verify the property in Google Search Console using its returned DNS token, then submit `/sitemap.xml`. IndexNow requires a configured key and the corresponding reachable text file. Google does not use IndexNow; neither sitemap submission nor IndexNow guarantees indexing or ranking.

## Editorial rules

Do not invent current revenues, ownership percentages, quotes, interviews, AE client relationships, testimonials or endorsements. Historical revenue qualification is labeled with its year. Profile requests prepare an email draft, which visitors choose whether to send. No backend intake or advertising tracker is installed.

The directory targets founder and company discovery. AE's main site remains the destination for tax advisory service enquiries. Build output is generated and untracked.

## Founder reference library

The separate `/founder-reference/` and `/company-reference/` collections record U.S. founding associations from the CC0 Wikidata public dataset. These records do not use the Inc. growth-profile revenue qualification and do not verify current equity, employment, or AE client status. The source record, related person/company pages, available company website, and founder-statement reference URLs are exposed on each profile. The collection snapshot excludes explicit dissolved-company and deceased-founder statements, out-of-scope organizations, missing business descriptions, and duplicate company names/websites. Missing status statements do not prove that a company remains active.

`data/founder-reference.json` is the sourced publication dataset; `scripts/founder-reference.mjs` builds the records, alphabetical pagination, and searchable reference index. Public entity IDs preserve source identity. The existing growth directory and its revenue evidence remain separate.

## October 9 reference expansion and advisory copy

The reference library now includes historical founding associations as well as current-business references. A founding record is not proof of present ownership, operating status, income, or an AE client relationship. Country fields are sourced per company; a small number of international company records sit alongside the U.S. collection.

New U.S. associations were selected from the public CC0 Wikidata query: SELECT DISTINCT ?company ?companyLabel ?companyDescription ?founder ?founderLabel ?founderDescription WHERE { ?company wdt:P17 wd:Q30; wdt:P112 ?founder . ?founder wdt:P31 wd:Q5 . SERVICE wikibase:label {bd:serviceParam wikibase:language "en".} } LIMIT 8500. Complete labels, business descriptions and reciprocal company/person links are required. Nonbusiness records and conflicting names are excluded. Records carry stable source IDs and direct source links; existing reference URLs remain intact. The output distinguishes these references from revenue-qualified growth profiles.

The AE advisory landing page and shared CTA components explain the business decisions to discuss, discovery-call preparation and the written scope. Campaign parameters identify source and placement. Build and check scripts validate at least 5,000 indexable URLs, reciprocal reference links, metadata, local targets and sitemap parity.
