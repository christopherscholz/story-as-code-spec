#!/usr/bin/env bash
# Generate schema reference documentation from YAML schemas
# using json-schema-for-humans.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SCHEMA_DIR="$ROOT_DIR/schemas"
OUTPUT_DIR="$ROOT_DIR/docs/schemas/generated"

mkdir -p "$OUTPUT_DIR"

for schema_file in "$SCHEMA_DIR"/*.schema.yaml; do
  name="$(basename "$schema_file" .schema.yaml)"
  output_file="$OUTPUT_DIR/${name}.md"

  python -m json_schema_for_humans.cli \
    "$schema_file" "$output_file" \
    --config template_name=md \
    --config show_toc=false \
    --config show_breadcrumbs=false \
    2>/dev/null

  echo "✓ ${name}.md"
done

echo ""
echo "Schema docs generated in $OUTPUT_DIR"
