#!/bin/bash
# Fetches the latest Substack posts and pushes an update to the site.
# Run this after Jasmine publishes a new newsletter post.
#
# Requirements: Node.js, git, and push access to the GitHub repo.
# Usage: bash scripts/update-and-push.sh
#        (or double-click in Finder after making it executable)

set -e

# Navigate to the repo root regardless of where the script is run from
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

echo "Fetching latest Substack posts..."
node scripts/update-substack.js

# Check if the data file actually changed
if git diff --quiet content/substackPostsData.json; then
  echo "No new posts — nothing to update."
  exit 0
fi

echo "New posts found. Committing and pushing..."
git add content/substackPostsData.json
git commit -m "Update Substack posts data"
git push

echo "Done! Site will rebuild on GitHub in about a minute."
