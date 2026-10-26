# Akhil Krishna R — Cosmic academic homepage

A dark, space-themed, interactive personal homepage inspired by [Prajwel Joseph’s website](https://prajwel.github.io/). All animations are implemented in original vanilla JavaScript / HTML Canvas (no external source code, assets, or libraries copied from the reference site).

**Live site**: https://akhilkrishnar0.github.io/

## Features

- Nearly black starfield with twinkling stars, delicate glowing constellations and pointer-responsive parallax
- Animated Earth atmosphere with colored spectral bands and orbital paths
- Five navigable perspectives: Earth, Moon, Sun, Galaxy, Universe
- Fully responsive glassy profile card, profile photo, academic links, copy-email button
- Accessible navigation (keyboard arrow keys), semantic markup, reduced-motion support
- Pop-up research and publications information
- No build, package manager or web framework needed

## Modify

- `index.html`: personal biography, institutional affiliation, academic links, social profiles and research text.
- `assets/css/style.css`: visuals and responsive layout.
- `assets/js/main.js`: animated space background and interactive behaviors.
- `assets/img/`: project graphics. Avatar is loaded from the linked GitHub profile; to use a custom picture replace the image URL in `index.html` with a local path.

## Deployment

The included `.github/workflows/pages.yml` automatically deploys the root directory with GitHub Pages on changes to `main`. If needed, set **Settings → Pages → Source → GitHub Actions** in the repo.

## Credits

Inspired by the visual layout and concept of https://prajwel.github.io/. This project is an independent implementation with entirely original animation code and the site owner's own content.
