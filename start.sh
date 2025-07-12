#!/bin/bash

# Script to configure, install dependencies, and run the Jekyll server locally.

# Function to kill processes by name
kill_process_by_name() {
  local process_name=$1
  echo "INFO: Checking for running '$process_name' processes..."
  pids=$(pgrep -f $process_name)
  
  if [ -n "$pids" ]; then
    echo "INFO: Found running '$process_name' processes with PIDs: $pids. Killing them now."
    kill -9 $pids
    sleep 2 # Give it a moment to die
  else
    echo "INFO: No running '$process_name' processes found."
  fi
}

# Kill existing Jekyll and Ruby processes to ensure a clean start
kill_process_by_name "jekyll"
kill_process_by_name "ruby"

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

# 3. Generate tag pages for all tags found in posts
echo "INFO: Generating tag pages..."
ruby scripts/generate_tag_pages.rb

# 4. Serve the site with livereload.
echo "INFO: Starting Jekyll server with live reload..."
bundle exec jekyll serve --livereload
