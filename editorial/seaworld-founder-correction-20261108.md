# SeaWorld founder-record correction

The imported Wikidata snapshot connected SeaWorld (Q540102) to a person whose own description concerned an unrelated political organization. Search Console exposed the mismatch: an unexpected combined query led to the false founder profile, with six clicks from eleven impressions during October 10–November 6, 2026.

Primary source checked November 8, 2026:
https://unitedparks.com/about-us/history/

United Parks & Resorts names SeaWorld’s four founders as George Millay, Milt Shedd, Ken Norris and David DeMott, and dates the original San Diego park to 1964. The independent founder identities are not inferred from similarly named people or invented Wikidata IDs.

Changes:
- Replace the company’s imported founder relationship with the four names from its official history.
- Retain the company reference URL and identify the primary source in visible text and structured data.
- Remove the unsupported person association from active person records and the internal search index.
- Keep the previous person URL as a noindex correction notice linked to the corrected company record. It is intentionally removed from the indexable sitemap; the URL remains available.
- Add a publication check that fails if the rejected relationship is reintroduced during a dataset refresh.

Validation: full build and npm check passed: 6,944 HTML pages and 6,916 indexable URLs. The one-URL reduction is the withdrawn false record. All legitimate company and person references remain available. The correction notice contains no Person schema and makes no replacement biographical claim.
