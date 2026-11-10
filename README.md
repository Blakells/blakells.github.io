# blakells.dev

The source of [blakells.dev](https://blakells.dev), Blake Bailey's portfolio site. A static
[Astro](https://astro.build) site deployed to GitHub Pages by GitHub Actions.

## Run it

Needs Node.js 22.23.4 or later.

```bash
npm ci
npx playwright install chromium   # for the resume PDF and the browser tests
npm run dev                       # http://localhost:4321
npm run build && npm run preview  # the production build, with the resume PDF
npm run check                     # everything CI runs
```

## Edit it

| To change | Edit |
|---|---|
| A fact used on several pages (contact details, test count, degree) | `src/data/site.yaml` |
| A project page | `src/content/projects/*.mdx` |
| The earlier-work list | `src/content/earlier-work.yaml` |
| A post | `src/content/posts/*.md` |
| The resume (page and PDF) | `src/content/resume.yaml` |
| Home, About, Contact or 404 copy | the page in `src/pages/` |

Every push to `main` runs the checks and deploys only if they all pass. The checks include a content
check that fails on a personal Gmail address, figures about finances, placeholders, or the upstream
project's name outside its credit.

`npm run make:og` regenerates the social preview card after a change to the name, role or look.

## Design

The design and the decisions behind it are in
[docs/superpowers/specs/2026-11-10-portfolio-site-design.md](docs/superpowers/specs/2026-11-10-portfolio-site-design.md).
