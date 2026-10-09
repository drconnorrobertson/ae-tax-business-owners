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
