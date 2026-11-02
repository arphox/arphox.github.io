# QR Code Generator

Uses Project Nayuki's QR Code generator **v1.8.0 ES6** (MIT).

[`local_tools_dependencies.rb`](../../_plugins/local_tools_dependencies.rb)
downloads the library during Jekyll builds and verifies its SHA-256, including
cached copies in `.jekyll-cache/local-tools-dependencies/`. Download or hash
failures stop the build. The published library retains its MIT notice.

To update, review the upstream release and license, then change the URL and
SHA-256 in the plugin. Run `bundle exec jekyll build` and repeat the
[shared browser checks](../README.md#browser-policy-and-checks).
