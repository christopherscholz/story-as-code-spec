#!/usr/bin/env bash
# Updates all example files to match the version in VERSION.
# Usage: ./scripts/bump-version.sh [new-version]
#   If new-version is provided, VERSION is updated first.
#   If omitted, examples are synced to the current VERSION.

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

if [ -n "${1:-}" ]; then
  echo "$1" > VERSION
  echo "Updated VERSION to $1"
fi

VERSION=$(tr -d '[:space:]' < VERSION)

if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: VERSION '$VERSION' is not valid semver" >&2
  exit 1
fi

echo "Syncing examples to version $VERSION..."

for example in examples/*/story.yaml; do
  name=$(echo "$example" | cut -d/ -f2)
  sed -i '' "s|spec_version:.*|spec_version: \"${VERSION}\"|" "$example"
  echo "  ✓ $name"
done

echo "Done. All examples now reference v${VERSION}."
