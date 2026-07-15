# arphox.github.io

My blog, built with [Jekyll](https://jekyllrb.com/) and the [minima](https://github.com/jekyll/minima) theme,
hosted on GitHub Pages at <https://arphox.github.io>.

## Running locally

Requires Ruby (see [`.ruby-version`](.ruby-version)) and Bundler.

```sh
bundle install
bundle exec jekyll serve --livereload
```

Then open <http://localhost:4000>. On Windows you can also just run
[`_start_local_hosting.bat`](_start_local_hosting.bat).

## Writing a post

Add a Markdown file to [`_posts/`](_posts) named `YYYY-MM-DD-title.md` with front matter:

```markdown
---
layout: post
title: "Your title"
date: 2026-01-01 09:00:00 +0100
---
```

## The CV page (`/cv/`)

The CV lives at <https://arphox.github.io/cv/> and is rendered **at build time**
from its Markdown source — no runtime fetching, no client-side rendering.

- **[`assets/cv.md`](assets/cv.md) is not the source of truth** — it's a
  published copy. The canonical version is maintained separately and copied in
  here; this repo is just the publish surface that renders it and serves the
  "Download Markdown".
- **PDF download:** [`.github/workflows/pages.yml`](.github/workflows/pages.yml)
  prints the built `/cv/` page to `_site/assets/cv.pdf` with headless Chrome
  during the deploy, then validates its text. The PDF ships with the deploy
  artifact and is **never committed**, so it can't drift from `cv.md`.
- **Locally**, the PDF is *not* generated — the "Download PDF" button only works
  on the deployed site. Use `bundle exec jekyll serve` to check the page render
  and Markdown download; verify the PDF on the live site after a deploy.

> **Note:** `cv.md` is passed through Liquid when rendered, so avoid literal
> `{{ }}` / `{% %}` in the CV text (or escape them). The raw Markdown download
> is a verbatim copy and is unaffected.

## Deployment

Every push to `master` is built and deployed automatically by the
[GitHub Actions workflow](.github/workflows/pages.yml) with the latest Jekyll 4.x.
