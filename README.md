# Spatial Diseases Modeling Dashboard

A responsive React + Vite + Tailwind CSS dashboard for exploring the supplied 74-study spatial disease research dataset.

## Features

- 74-study dataset preserved from the supplied dashboard source
- Search across author, country, province, condition and insight
- Filters for health type, continent and year
- Overview, detailed analysis and research insights views
- Recharts visualizations
- Responsive mobile / tablet / desktop layout
- Empty-state handling when filters return zero studies
- Safe percentage calculations when the result set is empty
- GitHub Pages deployment via GitHub Actions
- Professional SDN Analytics Lab footer

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## GitHub Pages deployment

1. Create a GitHub repository.
2. Put this project at the repository root.
3. Push the `main` branch.
4. In GitHub, open **Settings → Pages**.
5. Set **Source** to **GitHub Actions**.
6. The included workflow will build and publish the site.

The Vite config uses a relative base path (`./`) so the built assets work correctly when GitHub Pages serves the project from a repository subpath.

## Exact Git commands

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub account and repository name:

```bash
cd spatial-diseases-modeling-dashboard
git init
git branch -M main
git add .
git commit -m "Initial Spatial Diseases Modeling Dashboard"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

If the GitHub repository already exists and already has a remote:

```bash
git remote -v
git add .
git commit -m "Deploy dashboard"
git push
```

## Project structure

```text
spatial-diseases-modeling-dashboard/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── data/
│   │   └── studies.json
│   ├── Dashboard.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── .nojekyll
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Notes on the source dataset

The study records are carried over from the supplied dashboard source rather than silently normalized or replaced. Values such as country/continent labels and `NA` categories remain as supplied.

## Deployment troubleshooting

- If the Actions workflow fails, open **GitHub → Actions → Deploy to GitHub Pages** and inspect the failed step.
- If the page is blank, confirm that the repository's Pages source is **GitHub Actions**, not the legacy branch/folder publisher.
- If a repository already has an old Pages workflow, remove or disable the old workflow to avoid competing deployments.
