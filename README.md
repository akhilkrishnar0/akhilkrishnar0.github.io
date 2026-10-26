# Akhil Krishna R — Academic Personal Website

A ready-to-publish, fully responsive, single-page academic website inspired by [Prajwel Joseph's academic homepage](https://prajwel.github.io/). Built with **plain HTML, CSS, and JavaScript** — no Node.js, Jekyll, package installation, API keys, or build commands are needed.

**Intended URL:** https://akhilkrishnar0.github.io/

## Fastest publication (use the **git-ready ZIP**)

The `akhilkrishnar0.github.io_git-ready.zip` distribution already has a `main` branch and an initial commit. Unzip it, create an empty public GitHub repository named `akhilkrishnar0.github.io`, and run the following commands **inside the unzipped directory**:

```bash
git remote add origin https://github.com/akhilkrishnar0/akhilkrishnar0.github.io.git
git push -u origin main
```

If GitHub Pages is not already enabled for this new repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions** once. The bundled workflow deploys your changes automatically on future pushes.

## Publish from the source-only ZIP (alternative)

1. Log into GitHub as `akhilkrishnar0`.
2. Create an **empty public repository** named exactly **`akhilkrishnar0.github.io`**. Do **not** tick "Add a README" or choose a license, because this package already contains both.
3. Download and unzip this package, then open your terminal **inside the extracted `akhilkrishnar0.github.io` folder**.
4. Run:

   ```bash
   git init -b main
   git add .
   git commit -m "Launch personal academic website"
   git remote add origin https://github.com/akhilkrishnar0/akhilkrishnar0.github.io.git
   git push -u origin main
   ```

5. Your automatic deployment is defined in `.github/workflows/pages.yml`. Under **Repository Settings → Pages**, choose **GitHub Actions** as the build/deployment source if GitHub has not enabled it yet. Check **Actions → Deploy website to GitHub Pages** for the first deployment status.
6. Open **https://akhilkrishnar0.github.io/** after deployment completes. The site can take a few minutes to become visible.

**Already have a repository?** Clone it (`git clone https://github.com/akhilkrishnar0/akhilkrishnar0.github.io.git`), copy *all contents* of this package (including hidden `.github`, `.nojekyll`, `.gitignore`) to the cloned folder, then run `git add . && git commit -m "Update personal site" && git push`.

## Preview locally

Double-click `index.html` in a browser. Everything is static and works directly from the filesystem. Or run `python3 -m http.server 8000` inside this directory and open `http://localhost:8000`.

## Edit your information

All text, publications, email and profile links are in **`index.html`**. Search for the content you want to change; no templating knowledge is required.

- **Email:** search for `akhil.krishna@iiap.res.in`.
- **Research:** edit the three articles under `<section id="research">`.
- **Publications:** edit the items under `<section id="publications">` and update the DOI/arXiv links.
- **Photo:** place a photo at `assets/img/profile.jpg`, then change `src="https://github.com/akhilkrishnar0.png?size=400"` to `src="assets/img/profile.jpg"` in `index.html`. The default displays your public GitHub avatar, with an `AK` fallback if it cannot load.
- **CV:** add your PDF under `assets/Akhil_Krishna_R_CV.pdf` and create a link with `<a href="assets/Akhil_Krishna_R_CV.pdf">Download CV</a>`. No fake or empty CV has been included.
- **Appearance:** edit `assets/css/style.css`. Change CSS variables at the beginning for sitewide colours. The dark-mode toggle is in `assets/js/main.js`.
- **Domain/username:** if you change the GitHub username or use a custom domain, update URLs in the HTML metadata, `robots.txt`, `sitemap.xml`, and the README.

## Repository contents

```text
akhilkrishnar0.github.io/
├── .github/workflows/pages.yml   # auto deployment on main pushes
├── .gitignore
├── .nojekyll
├── assets/
│   ├── css/style.css             # responsive styling & dark mode
│   ├── img/favicon.svg
│   ├── img/galaxy-orbits.svg
│   ├── img/social-preview.svg
│   └── js/main.js                # nav, theme toggle, year
├── index.html                    # all website content
├── LICENSE
├── README.md
├── robots.txt
└── sitemap.xml
```

## Design & data notes

This is an **original implementation** inspired by the layout and academic-page approach of the linked example, not a copy of its source code or branding. Publication metadata, academic affiliation, and external links were assembled from public academic records and your publicly available online profiles. Please review the wording and selection of publications before publishing. Dates, scientific positions and emails can change; the code does not update them automatically.

The default profile avatar and web fonts use external URLs; all other site assets are bundled. The layout and content work with external assets blocked (your initials appear in place of the photo, and system fonts are used).

## License

Code is available under the MIT License. Publication titles, author attribution, and any photographs added by the site owner remain subject to their respective rights.
