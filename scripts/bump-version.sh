#!/usr/bin/env bash
# Updates all schema files to match the version in VERSION.
# Usage: ./scripts/bump-version.sh [new-version]
#   If new-version is provided, VERSION is updated first.
#   If omitted, schemas are synced to the current VERSION.

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

echo "Syncing schemas to version $VERSION..."

for schema in schemas/*.schema.json; do
  # Update the $schema URL: .../schemas/vX.Y.Z/name.schema.json
  sed -i '' "s|\(story-as-code\.dev/schemas/v\)[^/]*/|\1${VERSION}/|" "$schema"

  echo "  ✓ $(basename "$schema")"
done

echo "Done. All schemas now reference v${VERSION}."
