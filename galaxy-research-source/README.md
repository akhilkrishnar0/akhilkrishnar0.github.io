# Akhil Krishna R. — Galaxy Research

Astro-based academic website, prepared as a **separate GitHub Pages project site** at:

`https://akhilkrishnar0.github.io/galaxy-research/`

**Status:** source package prepared for review. **Not uploaded, not deployed, and not connected back from the existing homepage.** The site uses remote, attributable original astronomical image URLs where local, high-quality downloads could not be acquired. Personal and conference photographs have not been supplied.

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

## Deploy (only after approval)

1. Create a **new, empty public repository** named `galaxy-research` under `akhilkrishnar0`. Do **not** push to `akhilkrishnar0.github.io`.
2. From this folder, initialize Git, commit and push to the new repo's `main` branch.
3. In the new repository's **Settings → Pages**, select **GitHub Actions** as the build/deployment source.
4. The included `.github/workflows/deploy.yml` will install Astro, build, and deploy the site on pushes to `main`. Trigger workflow manually if necessary.
5. Verify the base-path URL above. Inspect all images, relative links, DOI links, layout and credit statements before making the site public.
6. To connect to the existing website, **after separate approval**, add this small HTML link to the main homepage:

```html
<a href="https://akhilkrishnar0.github.io/galaxy-research/">Galaxy research</a>
```

No existing repository was changed while preparing this package.

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

`src/data/images.js` is the attribution/source-of-truth registry. Currently source images are linked from authoritative NASA and Cambridge pages, plus a published figure reproduced on Phys.org. **They are not binary files packaged inside this ZIP.** See `docs/IMAGE_RIGHTS.csv` for each source, credit, reuse status and local asset destination. Be aware that third-party sites can change their URLs or prohibit hotlinking. Self-host authorized originals whenever obtained.

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
