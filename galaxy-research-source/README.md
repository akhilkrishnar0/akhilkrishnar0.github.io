# Akhil Krishna R. — Galaxy Research

Astro-based academic website, prepared as a **separate GitHub Pages project site** at:

`https://akhilkrishnar0.github.io/galaxy-research/`

**Publication status:** static export committed to `akhilkrishnar0/akhilkrishnar0.github.io` under `/galaxy-research/`; the original homepage contains a **More about me** link. GitHub Actions is configured to deploy the root Pages repository on changes to `main`. The live deployment and external image retrieval require independent browser verification.

There are **two copies** in the existing GitHub repository:

- `galaxy-research/` — the published static HTML/CSS and public CV.
- `galaxy-research-source/` — this editable Astro source and build scripts.

No separate `galaxy-research` repository has been created. The static export is maintained to avoid requiring npm install on the GitHub Pages runner.

## Requirements

Node.js 20.11 or later (22 preferred). Internet access is required for the first `npm install`, external source images, and deployment.

```bash
npm install
npm run dev
```

Open the local URL printed by Astro. Build static pages with:

```bash
npm run build
npm run preview
npm run check:links
node scripts/export-publications.mjs
```

The `astro.config.mjs` settings `site: 'https://akhilkrishnar0.github.io'` and `base: '/galaxy-research'` are already configured. **Do not change the base without updating `src/utils/path.js`.** All in-site paths are generated with `url()` to preserve the project subdirectory.

## Redeploy the existing GitHub Pages site

This site's production static files live in `akhilkrishnar0/akhilkrishnar0.github.io/galaxy-research/`. The existing root repository workflow at `.github/workflows/pages.yml` deploys GitHub Pages on a push to `main`. It is **not** necessary to create a new repository.

1. Update content in `galaxy-research-source/src/data/` and the Astro layouts.
2. Run `npm install && npm run build && npm run check:links` when npm is available; the included `node scripts/build-static.mjs` is an additional dependency-free static exporter for this site and can be used without Astro install.
3. Copy the resulting HTML/CSS/assets from `dist/` to the repository's `galaxy-research/` directory. Keep the public CV at `galaxy-research/documents/`.
4. Commit only the source and the updated export; push to `main`. The existing Pages workflow should trigger.
5. Verify `https://akhilkrishnar0.github.io/galaxy-research/` in a browser and the GitHub Actions workflow result. If GitHub Pages is not enabled, in root repository **Settings → Pages**, choose **GitHub Actions**.

The full source is also provided as a ZIP for local editing. Do not make unrelated changes to the original homepage.
## Where to edit

| Content | File |
|---|---|
| Global styles | `src/styles/global.css` |
| Homepage content and opening | `src/pages/index.astro` |
| Research theme descriptions | `src/data/themes.js` |
| Galaxy/project summaries and verified findings | `src/data/projects.js` |
| Bibliography, DOI/arXiv and categories | `src/data/publications.js` |
| News and conference activities | `src/data/media.js` |
| Authentic figure URLs and attribution | `src/data/images.js` |
| Header, footer, responsive layouts | `src/components/` and `src/layouts/Base.astro` |
| Public CV | `public/documents/Akhil_Krishna_R_public_CV.pdf` |

`src/pages/research/[theme]/index.astro` and `src/pages/research/[theme]/[slug]/index.astro` automatically create pages for every record in `themes.js` and `projects.js`.

## Adding publications

Add one record to `src/data/publications.js`, with a unique `id`, full title, actual author sequence, year, publication category (`first`, `co` or `preprint`), verified journal details, DOI and optionally arXiv ID. The ADS action uses the DOI as an ADS search query. Do not invent a bibcode. Keep preprints separate from refereed journal papers.

## Adding research images

`src/data/images.js` is the attribution/source-of-truth registry. Currently source images are remotely linked from authoritative NASA and Cambridge pages and selected published figures reproduced by Phys.org / Deccan Herald. **They are not binary image files packaged inside this ZIP.** See `docs/IMAGE_RIGHTS.csv` for each source, credit, reuse status and local asset destination. Be aware that third-party sites can change their URLs or prohibit hotlinking. Self-host authorized originals whenever obtained.

For each image, obtain an original high-resolution file from the identified publisher/archive source, confirm source-specific permissions, and copy it under `public/images/research/{theme}/` or `public/images/homepage/`. Set the `src` property in `src/data/images.js` to a project-local URL such as `/galaxy-research/images/research/polar-rings/fig1.png`. Do not remove any original axis labels or crop away legends. Keep figure captions and exact credit statements.

The caption component includes a full-resolution modal viewer and a direct image-opening link. Missing science figures are not replaced with generated approximations.

## Adding personal and conference photography

Copy original images into `public/images/photography/` and `public/images/conferences/`, then add photographs in `src/data/photography.js` and optional conference photograph fields in `src/data/media.js`. The Photography page renders an image grid automatically when records are supplied. Record ownership and, optionally, date/location. **No generic photos have been substituted.**

## Scientific content policy

- DJ0240 is a **polar-ring candidate**; kinematic confirmation is not claimed.
- The NGC 3718 → NGC 2685 → NGC 4262 sequence is the **interpretation proposed in Akhil et al. (2025)**, not a proven universal temporal track.
- Unpublished GLSB results and numerical experiments are not represented as established results.
- The co-authored bibliography is deduplicated. Two entries have corrected duplicates in the source CV; the RAA PAH paper number is **095004** according to the publisher, not 095005.
- Final metadata, author order and preprint statuses should be cross-checked through NASA ADS before launch.
- Public CV excludes phone numbers and referee contacts; compare against the original CV before publishing.

## Project documentation

- `docs/PAGE_STRUCTURE.md` — complete list of routes.
- `docs/CONTENT_INVENTORY.md` — research and publication inventory.
- `docs/PUBLICATION_REGISTER.csv` — editable bibliography register exported from JS records.
- `docs/IMAGE_RIGHTS.csv` — image source, licence and packaging status.
- `docs/MISSING_ASSETS_AND_REVIEW.md` — unresolved assets and final QA checklist.

## Known gaps

See `docs/MISSING_ASSETS_AND_REVIEW.md` for a detailed checklist. In particular: publisher-quality figures for DJ0240 and the UV upturn paper, additional NGC 4262 panels, GLSB project imagery, simulation figures approved for sharing, conference and personal photographs, and final reconciliation of a few coauthor records.

The source package has not been Astro-built in this environment because Astro was not locally installed and the runtime lacked external package network access. The GitHub Actions build is configured for ordinary GitHub-hosted runners, but deployment must be tested when the project is uploaded.

## News images — 2026-11-06 update

The News & Media page displays the original scientific figures shown in the Phys.org DJ0240 and NGC 4262 stories and the UVIT/JWST figure shown by Deccan Herald. Each figure is labelled with the scientific creators, source article and image credit. The research articles themselves have open-access licensing where noted; **news-site renditions are remotely linked, not copied or relicensed here**. Their availability depends on third-party CDNs. The DJ0240 project page now includes its original DECaLS composite.
