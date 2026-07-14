source "https://rubygems.org"

gem "jekyll", "~> 4.4"
gem "minima", "~> 2.5"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
end

# Windows and JRuby do not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows.
gem "wdm", "~> 0.2", :platforms => [:mingw, :x64_mingw, :mswin]

# webrick is no longer bundled with Ruby 3+.
gem "webrick", "~> 1.9"
