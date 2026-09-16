# Mohammed Sabbah — AI Engineer Portfolio

Source for [molioace.github.io](https://molioace.github.io) — a static portfolio site (no build step) for an AI Engineer / AI Backend Engineer.

## Structure

```
index.html            Home page (hero, featured project, projects, about, skills, education, contact)
styles.css             Design system + all component styles
script.js               Navigation, mobile menu, scroll-reveal
Resume.pdf              Downloadable resume
assets/                 Screenshots and images
projects/
  meterflow.html         Case study: MeterFlow
  studymate.html          Case study: StudyMate AI
```

## Editing

This is plain HTML/CSS/JS — no framework, no build step, no dependencies to install. Open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Design tokens (colors, spacing, type) live at the top of `styles.css` under `:root`.

## Deploying

This repo is set up for GitHub Pages: push to `main` and enable Pages on the repo (Settings → Pages → Deploy from branch → `main` / root). No build step required.

## Notes

- The MeterFlow "Code" link currently points to the GitHub profile as a placeholder — update it to the real MeterFlow repository URL (search `TODO` in `index.html` and `projects/meterflow.html`).
- `Resume.pdf` currently reflects an earlier "Machine Learning Engineer" framing — consider updating it to match the site's "AI Engineer" positioning.
