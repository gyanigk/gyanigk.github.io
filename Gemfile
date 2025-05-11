source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
gem "jekyll", "~> 4.3.2"

# This is the default theme for new Jekyll sites
gem "minima", "~> 2.5"

# Required for Ruby 3.0+
gem "webrick", "~> 1.7"

# Essential for watching files
gem "listen", "~> 3.8"

# Jekyll plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17.0"
  gem "jekyll-seo-tag", "~> 2.8"
end

# Windows and JRuby does not include zoneinfo files
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end