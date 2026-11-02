# Local Tools

Browser-only tools at `/local-tools/`.

## Principles

- Process input entirely in the browser. No backend, remote APIs, uploads or analytics.
- Serve all runtime dependencies from this site. Tools must work offline after
  loading, including exports.
- Keep input in memory, out of URLs, browser storage, logs and telemetry.
  User-initiated local file downloads are allowed.
- Use plain HTML, CSS and JavaScript, with Jekyll for build-time composition.

## Adding a tool

Create `<tool-slug>/index.html` with `layout: local-tool`, `title`, `description`
and `permalink: /local-tools/<tool-slug>/` in its front matter. `subtitle` is optional.
Use `relative_url` for local URLs, `tools.css` for shared styles, and separate
script files with `defer`. No inline scripts, event handlers or styles.

Add a card to the collection. Only the collection belongs in the site's
`header_pages` navigation, not individual tools.

## External dependencies

- Download during the build; do not commit dependency source or generated files.
- Pin Git sources to full commit hashes; prefer these wherever supported.
  Otherwise use exact release versions.
- Keep upstream URLs, pinned references, expected content hashes and download
  steps in Git. Failed downloads or hash mismatches must fail the build.
- Publish required license notices with the files. Review license changes on updates.
- Use the same dependency preparation for local development and deployment.

## Browser policy and checks

Use the CSP in [`local-tool.html`](../_layouts/local-tool.html). Do not allow
external resource origins or network-based violation reporting.

- Only same-origin static assets load initially, without CSP violations.
- Input, controls and exports trigger no network requests and work offline
  after loading. Disable LiveReload when checking: it injects a network connection.

## GitHub Pages

Hosted at <https://arphox.github.io/local-tools/>. Initial page loads contact
GitHub Pages, which [logs visitor IP addresses](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection).
