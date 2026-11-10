# Portfolio site: design

Date: 2026-11-10. Status: written for Blake's review; nothing is built yet.

This is the design for blakells.dev, Blake Bailey's personal site. It was agreed section by section
during brainstorming (pages, look, build and deploy, quality and launch); this document records
those decisions in one place, so the build plan can be written from it.

## 1. Purpose

A site for potential employers. It shows Preflight, Blake's open-source job-application agent, in
depth, and gives a general picture of Blake: what he builds, how he works, and how to reach him.

**Who reads it.** Recruiters skim the homepage and the resume; engineers read the Preflight case
study and the code. The site pitches Blake for remote US roles in automation and tooling and in
AI and agent engineering, with some range beyond those (security, general software).

**It works when:**

- a recruiter learns from the homepage, without scrolling far, who Blake is, what he builds,
  that he wants remote work, and how to contact him;
- an engineer can go from the homepage to the Preflight case study to the repo in two clicks;
- every claim on the site is true and matches the Preflight repository, Blake's resume and Blake's
  own answers;
- every page passes the checks in section 7.

**Out of scope:** a contact form or any backend, analytics, cookies, a light theme, comments, a
CMS, a race-telemetry case study page, and any repository not named in this spec.

## 2. Pages and content

| Path | Content |
|---|---|
| `/` | The C1 hero (section 4); two featured project cards, Preflight and Lantern Hollow; a strip of earlier work; a short About blurb with the in-progress inference server line; the latest posts; a contact line. |
| `/work` | Preflight and Lantern Hollow as full cards, then the earlier work as compact rows. |
| `/work/preflight` | The flagship case study (below). |
| `/work/lantern-hollow-game` | A short project page (below). The game itself stays at `/lantern-hollow/`. |
| `/about` | Blake's story, racing and telemetry, coaching, investing, the inference server, education, and the kind of work he wants (below). |
| `/resume` | The resume as a page, with a link to the PDF built from it (section 6). |
| `/writing` | The post index, with an RSS feed at `/rss.xml`. |
| `/writing/<slug>` | One page per post. |
| `/contact` | Email, GitHub, phone and city, as plain links. No form. |
| 404 | A short "off track" page in the site's style, linking home and to the Work page. |

Page paths must never match the name of a GitHub repository that publishes its own Pages site.
Those repositories are served under the same domain (`/lantern-hollow/` today).

**Header and footer.** The header shows the name mark and the navigation: Work, About, Resume,
Writing and Contact. The footer shows the email, GitHub and RSS links and a one-line copyright.

### Home

- **Hero.**
  - Name: Blake Bailey.
  - Title line: "Automation & AI agent engineer".
  - Tagline: "I build AI agents that do real work safely, and the tests that prove it."
  - Buttons: "View Preflight" (primary) and "Get in touch" (secondary).
  - The speed trace runs in its own band above the name.
- **Featured work (CH·01-02).**
  - Preflight: "An AI agent that fills job applications, with dry runs enforced inside the browser." Tags: Python, Claude Code, Playwright. Stat line: the test count and "CI on Linux + macOS".
  - Lantern Hollow: a small cozy dungeon crawler in plain JavaScript and Canvas 2D, with a link to play it.
- **Earlier work.** A compact strip linking to `/work`.
- **About blurb.** Two or three sentences, plus the facts list: location, remote (US), and "Building a local inference server (4× RTX 6000 Pro)".
- **Writing.** The latest two posts.
- **Contact line.** Email and GitHub.

The draft mockups in `.superpowers/reference/` show three featured cards, one of them race
telemetry. That card is outdated: the homepage and the Work index have two featured cards, and race
telemetry lives on the About page only. The mockups are local references with draft content, and
are never committed (section 6).

### Preflight case study

Written from the Preflight README and `docs/architecture.md`, and checked against them:

- **The problem.** Applying to jobs is repetitive form-filling, and a browser agent doing it for
  real has to be safe to run.
- **What it does.** The pipeline diagram (discover, enrich, score, resolve, tailor, cover, pdf,
  apply), with one line per stage.
- **The safety layers.** A table of the dry-run guard, the step parser, the dry-run hook, the phone
  guard, the auditor, the confirmation backstop, dedupe, the tool allow-list and credentials. It
  states the known gap plainly: the guard does not intercept a page's own `fetch`, and the
  backstop catches that case afterwards.
- **Anti-detection, plainly.** The pinned Patchright driver, natural input, CAPTCHA handling (paid
  solvers only with the operator's own key; a person solves Cloudflare's checkbox by default), and
  the optional proxy. Also the operator's responsibility for each site's terms.
- **Testing.** The suite size and runtime, no network and no API key, the fake LLM server, the
  guard tests in headless Chromium against local pages, and CI on Linux (Python 3.11 to 3.13) and
  macOS. Nothing in CI submits an application.
- **Honest note callout.**
  - Preflight began from ApplyPilot 0.3.0 by Pickle-Pixel (AGPL-3.0-only), and most of its current code was written for Preflight.
  - The 50+ live applications were sent by Blake's private predecessor system, not by the public repository.
- **Links.** The repository, the architecture doc and the safety reference.
- **Images.** Screenshots made locally from the test fixtures, for example the guard's banner on a blocked submit and a dry-run log. Never a real application, real employer or real personal data.

Numbers that change, such as the test count, are stated in one place in the content files, so
they are updated in one edit.

### Lantern Hollow page

- Its two screenshots from the game's repository: desktop and iPhone.
- **How it's built:**
  - plain JavaScript on Canvas 2D, with no build step and no dependencies; the art is procedural geometry, with no art assets;
  - procedurally generated, seedable floors (`?seed=`);
  - the oil-light mechanic, where the light radius shrinks as the oil burns;
  - the minimap;
  - touch controls, and it installs to an iPhone Home Screen;
  - the world-generator test.
- A large "Play it" button pointing to `/lantern-hollow/`.
- A line on how Blake made it, if he supplies one.

### About

- **Story.** In Blake's words, shaped lightly: he has always been a gamer and good with computers,
  he likes understanding how systems work from the top down, and building with AI is the most fun
  he has had. Today the limit is mostly your ideas.
- **What he wants.** Remote roles in the US, in automation and AI agent engineering.
- **Off the keyboard: racing.**
  - WERA/ASRA motorcycle road racing in the 2026 season, at VIR, Barber, Road Atlanta, Roebling Road and Carolina Motorsports Park.
  - How the AiM data logger made him a better rider: math channels that showed missed downshifts, clutch slip and a lean-angle asymmetry.
  - A short account of tracing a season-long brake fade to its root cause by ruling out parts one at a time, presented as the same method he uses on software.
  - Volunteer riding coach.
  - One photo, if Blake supplies one.
- **Investing.** Nearly ten years of self-directed investing, since 2017. No amounts and no figures, anywhere on the site.
- **Local models.** "Building a local inference server (4× RTX 6000 Pro)." It changes to past tense once the server runs. The site claims only the self-hosting experience Blake confirms.
- **Education.** Bachelor's degree, Thomas Edison State University, expected March 2027. "Expected" is removed once the degree is conferred. The About copy may say he is two courses from finishing.

### Earlier work

These 2020 JavaScript projects are listed with a one-line description taken from each repository:

- Weather-Website
- Task-Manager-API
- chat-app
- eCommerce-Site
- Markdown-Previewer
- Random-Quote-Machine
- Drum-Machine

Each row links its source. Live demos are linked only for Markdown Previewer
(`youthful-goldstine-b03121.netlify.app`) and Random Quote Machine (`sleepy-wing-a733f0.netlify.app`).
Demos that no longer run are not linked. Other 2020 repositories are not linked until Blake
reviews them.

### Writing

Two posts at launch, drafted from Preflight's own docs. Blake reviews and edits them before they
go up:

1. "Enforcing an AI agent's dry run inside the browser": the guard, the hook and the audit.
2. "Testing an agent that must never submit": the fake LLM, the guard tests against real Chromium,
   and CI.

A post about the inference server comes after the server is built.

### Contact

The page lists:

- `blake@blakells.dev` (the proposed address; Blake confirms it)
- github.com/Blakells
- (843) 616-1069
- Florence, SC, open to remote roles in the US

Blake's personal Gmail address appears nowhere: not on the site, not in its source and not in the
PDF. Mail to the domain reaches him through Cloudflare Email Routing (section 5).

## 3. Content rules

- Every factual claim traces to one of these sources:
  - the Preflight repository;
  - the Lantern Hollow repository;
  - Blake's resume;
  - Blake's own answers.
  No metric is invented or rounded up.
- Anything not finished is worded as in progress ("building", "expected") until Blake says it is done.
- Text drafted by subagents is checked against the sources above before Blake sees it.
- No dollar figures or other figures about Blake's finances, and no personal email address.
- The name "ApplyPilot" appears only in the credit to the upstream project.

## 4. Look and components

The C1 "Telemetry, refined" direction. The local reference is `.superpowers/reference/c1-refined.html`,
and the full-page mockups next to it show the layout, apart from the featured-card count noted above.
This section and section 2 are the authority; the mockups only illustrate them.

- **Colors**, as CSS variables:
  - background `#111316`;
  - panels `#16191d` and `#1e2228`;
  - borders `#24292f` and `#2b3138`;
  - text `#f5f3ee` (headings), `#b0b5bc` (body) and `#868c94` (muted);
  - one accent, racing orange `#ff5b1f`, used for the primary button, the channel labels and the trace.

  The site is dark only.
- **Type.** System sans for text, and system monospace for the small uppercase channel labels
  ("CH·02 / WORK"), with letter-spacing around 0.18em. Numbers use tabular figures. There are no
  web fonts.
- **Components**, each a plain `.astro` file:
  - the speed-trace band;
  - the channel label;
  - primary and secondary buttons;
  - the project card and the archive row;
  - the label-and-value fact list;
  - the post row;
  - the contact strip;
  - for case studies: the meta row, the pipeline diagram, the layer table and the honest-note callout.
- **The trace** is an inline SVG in its own band, never crossing text or buttons. It draws itself
  once on load with a CSS animation, and does not animate when the visitor has asked for reduced
  motion. It is hidden from screen readers.
- **Accessibility.**
  - Text contrast meets WCAG AA; the dimmest text is about 5:1.
  - Every control has a visible orange focus ring.
  - There is a skip-to-content link and one `h1` per page with headings in order.
  - Images have alt text.
- **Layout.** It works from 320px wide upward, with no horizontal scrolling. The phone mockup
  shows the narrow layout.

## 5. Hosting, domain and email

- **Repository.** `Blakells/blakells.github.io`, Blake's existing user-site repository. Its 2020
  placeholder is on the `master` branch, which stays untouched. The new site goes on a new `main`
  branch, which becomes the default, and Pages is switched to deploy from GitHub Actions. The site
  is developed in `~/portfolio-site`, and nothing on GitHub changes until Blake approves the push.
- **Domain.** `blakells.dev`. Cloudflare is its registrar and DNS host.
  - The custom domain is set in the repository's Pages settings. A site deployed from GitHub Actions
    needs no `CNAME` file, and GitHub ignores one, so the site has none.
  - The bare domain is the canonical address, and `www` redirects to it.
  - `.dev` requires HTTPS, so the site is unreachable until GitHub has issued its certificate.
- **DNS records**, all set to "DNS only" in Cloudflare (not proxied), so that GitHub can issue
  the certificate:
  - `A` records for `blakells.dev`: 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153;
  - `AAAA` records: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153 and 2606:50c0:8003::153;
  - a `CNAME` record pointing `www` to `blakells.github.io`;
  - the TXT record GitHub gives when the domain is added as a verified domain in Blake's account
    settings. Verifying the domain stops anyone else from claiming it on GitHub Pages.
- **Other Pages sites.** Once the custom domain is set, every repository of Blake's that publishes
  a Pages site is served under `blakells.dev/<repo>/`. Lantern Hollow should be. Any other
  repository with Pages turned on is reviewed at launch, and Pages is turned off where it should
  not appear.
- **Email.** Cloudflare Email Routing forwards `blake@blakells.dev` and, through a catch-all, every
  other address at the domain to his personal Gmail. Replies go out from Gmail unless he later sets up "Send mail as".
  Blake configures this himself in his Cloudflare account.

## 6. Build

- **Stack.**
  - Astro, with the version pinned exactly when the project is scaffolded.
  - TypeScript in strict mode.
  - Astro's official sitemap and RSS integrations.
  - No UI framework. No client-side JavaScript beyond what Astro emits for a static page.
- **Layout:**

  ```
  src/pages/          one file per page, plus writing/[slug].astro and rss.xml.ts
  src/content/        projects (Markdown + front matter), posts (Markdown), resume (YAML)
  src/components/     the components in section 4
  src/layouts/        the base layout (head, header, footer, skip link)
  src/styles/         tokens.css (colors, spacing, type) and global.css
  public/             favicon, social preview image, project images
  src/data/site.yaml  facts used on several pages: contact details, the inference-server line,
                      the degree line, the Preflight test count
  scripts/            resume-pdf.mjs and the content checks
  ```

  Copy edits touch `src/content/`, `src/data/site.yaml`, or the page file that holds that page's own
  prose (Home, About, Contact, 404); never components or styles. A fact that appears on more than one
  page lives only in `site.yaml`. Each content collection has a schema, so a missing field fails the
  build.
- **Never committed:** `.superpowers/` (the brainstorm sessions and draft mockups) and Blake's source
  resume. Both stay local; `.gitignore` covers the first, and the second lives outside the repository.
- **Resume PDF.**
  - The `/resume` page has a print stylesheet.
  - After `astro build`, `scripts/resume-pdf.mjs` serves `dist/` on a local port, opens `/resume/` in headless Chromium (Playwright) and prints it to `dist/blake-bailey-resume.pdf`, so the PDF always matches the page. Serving over HTTP, not opening the file directly, is what lets the page's root-relative stylesheets load.
  - The build fails if the PDF is missing, if its extracted text lacks Blake's name and the section headings, or if it runs past three pages.
  - It aims for two pages.
- **Resume content.** Re-authored into `src/content/` from Blake's current resume (a local file he has
  already provided, never copied into the repository), with these changes:
  - the header carries `blake@blakells.dev`, `blakells.dev` and `github.com/Blakells`;
  - the job-application project is named Preflight and links the repository, and the 50+ live applications are attributed to the private predecessor;
  - Lantern Hollow is added as a project;
  - the inference server appears as in progress;
  - no figures about Blake's finances;
  - Education is the TESU degree, expected March 2027, then one line of earlier coursework: computer science at Francis Marion University (2020-2021) and software engineering at Western Governors University (2026). There are no completion percentages, and the licenses line stays.
- **Deploy.**
  - On every push to `main`, a GitHub Actions workflow builds the site once, including the PDF, and runs the checks in section 7 against that build.
  - Only if all of them pass does it publish that same build with GitHub's Pages actions (`upload-pages-artifact`, then `deploy-pages`). Astro's official action uses these same actions; building once means the files deployed are exactly the files checked.
  - A failed check means the live site stays as it was.

## 7. Quality checks

On every push and pull request:

- the type check and the build, including the PDF;
- HTML validation of every built page;
- the internal link check over the built site;
- an accessibility scan of every page in headless Chromium, with axe, with no violations allowed;
- Lighthouse on the home, Work, Preflight and resume pages: performance 95 or higher, accessibility 100;
- the content check. The build fails if any file under `src/` or `public/`, any built page, or the
  PDF's extracted text contains:
  - any `@gmail.com` address;
  - a dollar sign followed by a digit, or a word ending in "-figure" (as in "six-figure");
  - the name "ApplyPilot" outside the credit line;
  - a placeholder ("TODO", "TBD", "lorem").

  The check is written as patterns, so it never contains the private strings it protects.

Once a week, a scheduled job checks the external links, so a dead demo or repo link gets noticed.

**Search and sharing.**

- Each page has its own title and description.
- Canonical URLs on `blakells.dev`.
- One C1-style social preview image, so links shared on LinkedIn or Slack show a card.
- A favicon.
- The sitemap.
- The RSS feed.

**Privacy.** No analytics, no cookies, no third-party requests. The contact details are exactly
those in section 2.

## 8. What Blake provides

| When | Item |
|---|---|
| Now | Confirm the public address (proposed: `blake@blakells.dev`) and set up Cloudflare Email Routing for it, with the catch-all. |
| Now | Add `blakells.dev` as a verified domain in his GitHub account settings and put the TXT record it gives into Cloudflare. |
| Before launch | Approval or edits on the About copy; optionally a headshot and a racing photo. |
| Before launch | A sentence or two on how the data logger changed his riding. |
| Before launch | What he has actually done with local models so far. |
| Before launch | Review of the two posts and the resume page. |
| Optional | A line on how he made Lantern Hollow. |
| Later | Word when the inference server runs, and when the degree is conferred. |

## 9. Launch

Before these steps, the domain is verified in Blake's GitHub account (section 8). Each outward step
happens only after Blake says yes to that step at the time:

1. Build and check locally; Blake reviews the site on a local preview.
2. Push the site to a new `main` branch of `Blakells/blakells.github.io`, and make `main` the
   default branch.
3. Switch the repository's Pages source to GitHub Actions, and let the first deploy run.
4. Set `blakells.dev` as the repository's custom domain.
5. Blake adds the `A`, `AAAA` and `www` records in Cloudflare.
6. Once GitHub has issued the certificate, turn on "Enforce HTTPS".
7. Turn Pages off on any other repository that should not appear under the domain.
8. Read through the live site on a desktop and a phone, and test the email address.

Optionally, after launch, the Preflight and Lantern Hollow repositories can link to the site from
their "About" boxes.

## 10. After launch

Content changes are Markdown or YAML edits that redeploy on push. Planned updates:

- the inference server line moves to past tense when it runs;
- "expected" comes off the degree when it is conferred;
- new posts as Blake writes them.

The `docs/superpowers/` folder is committed with the site and holds only this design and the build
plan. Nothing in it is private.
