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

## Deployment

Every push to `master` is built and deployed automatically by the
[GitHub Actions workflow](.github/workflows/pages.yml) with the latest Jekyll 4.x.
