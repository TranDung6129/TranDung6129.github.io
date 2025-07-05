#!/bin/bash

# Script to configure, install dependencies, and run the Jekyll server locally.

# 1. Configure bundle path to be local to the project if not already set.
if [ ! -f ".bundle/config" ]; then
  echo "INFO: .bundle/config not found. Configuring Bundler to use a local path..."
  bundle config set --local path 'vendor/bundle'
else
  echo "INFO: .bundle/config found. Skipping Bundler configuration."
fi

# 2. Install gem dependencies using Bundler.
echo "INFO: Installing gem dependencies..."
bundle install

# 3. Serve the site.
echo "INFO: Starting Jekyll server in the background. Logging to site.log"
nohup bundle exec jekyll serve > site.log 2>&1 & 