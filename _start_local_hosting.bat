@echo off
REM Auto-refresh (--livereload) is intentionally omitted: it pulls in the
REM eventmachine native gem, whose Windows extension fails to load under this
REM Ruby/UCRT toolchain. Plain `serve` still watches files and rebuilds on
REM change; just refresh the browser (F5) to see updates.
bundle exec jekyll serve
