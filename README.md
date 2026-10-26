# Akhil Krishna R — Spacecraft Journey

A responsive, static academic website presented through an animated spacecraft viewport.

**Live:** https://akhilkrishnar0.github.io/

## Journey

Scroll continuously from **Earth (departure)** through **Moon, Mars, Saturn**, and **Solar System escape**. Navigation links jump to each chapter. The background Canvas animation interpolates across scrolling, while the ship frame and flight instruments stay in place.

All planetary artwork, orbital lines, starfields, and warp effects are procedural HTML Canvas visuals, with no animation/video dependencies.

## Editing

- `index.html`: Academic biography, research, links, text and navigation.
- `assets/css/style.css`: Responsive visual design and cockpit.
- `assets/js/main.js`: Five connected scenes, stars, planet textures and scroll interpolation.
- `assets/img/`: Metadata graphics.

## Deploy

This repository automatically deploys from `main` via `.github/workflows/pages.yml`. GitHub Pages must be configured to use **GitHub Actions**. No compilation, Node.js, or dependencies required.

The site respects `prefers-reduced-motion` and retains semantic, keyboard-accessible navigation.

© Akhil Krishna R. Source code licensed under MIT.
