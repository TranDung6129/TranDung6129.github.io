source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file, and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!

# Use the GitHub Pages gem to manage Jekyll and its dependencies.
# This ensures that your local environment matches the GitHub Pages build environment.
gem "github-pages", "~> 231", group: :jekyll_plugins

# If you have any other plugins not included in the `github-pages` gem,
# you can add them here.
# group :jekyll_plugins do
# end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Required for Jekyll 3.9+ and Ruby 3.0+
gem "webrick", "~> 1.7"
