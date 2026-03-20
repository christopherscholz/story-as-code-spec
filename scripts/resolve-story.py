#!/usr/bin/env python3
"""Resolve a Story as Code example into a single JSON file.

Walks the YAML tree starting from story.yaml, resolves all $ref pointers
by loading the referenced YAML files (relative to the referencing file),
and outputs a single JSON document conforming to story.schema.json.

Usage:
    python scripts/resolve-story.py examples/the-metamorphosis/
    python scripts/resolve-story.py examples/the-metamorphosis/ -o docs/assets/data/the-metamorphosis.story.json
"""
import argparse
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("PyYAML is required. Install it with: pip install pyyaml")

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT_DIR = ROOT / "docs" / "assets" / "data"


def resolve_refs(data, base_dir: Path):
    """Recursively resolve $ref pointers in a YAML/JSON structure."""
    if isinstance(data, dict):
        if "$ref" in data and len(data) == 1:
            ref_path = base_dir / data["$ref"]
            ref_path = ref_path.resolve()
            if not ref_path.exists():
                print(f"  Warning: referenced file not found: {ref_path}", file=sys.stderr)
                return data
            with open(ref_path) as f:
                resolved = yaml.safe_load(f)
            return resolve_refs(resolved, ref_path.parent)
        return {k: resolve_refs(v, base_dir) for k, v in data.items()}
    if isinstance(data, list):
        return [resolve_refs(item, base_dir) for item in data]
    return data


def main():
    parser = argparse.ArgumentParser(description="Resolve Story as Code $refs into a single JSON file.")
    parser.add_argument("example_dir", type=Path, help="Path to example directory (must contain story.yaml)")
    parser.add_argument("-o", "--output", type=Path, default=None, help="Output JSON path (default: docs/assets/data/<name>.story.json)")
    args = parser.parse_args()

    example_dir = args.example_dir.resolve()
    story_file = example_dir / "story.yaml"

    if not story_file.exists():
        sys.exit(f"Error: {story_file} not found")

    with open(story_file) as f:
        story = yaml.safe_load(f)

    resolved = resolve_refs(story, example_dir)

    output_path = args.output
    if output_path is None:
        DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        output_path = DEFAULT_OUTPUT_DIR / f"{example_dir.name}.story.json"

    output_path = output_path.resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(resolved, f, indent=2, ensure_ascii=False)

    print(f"\u2713 {output_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
