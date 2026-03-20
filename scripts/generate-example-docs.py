#!/usr/bin/env python3
"""Generate documentation pages for all examples.

Scans examples/ for directories containing a story.yaml.
For each example, generates a markdown page in docs/examples/generated/
with the README.md as intro and all YAML files as collapsible sections.

Supports nested directory structures (e.g. world/characters/, narrative/beats/).

Adding a new example = creating a new directory with story.yaml + README.md.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXAMPLES_DIR = ROOT / "examples"
OUTPUT_DIR = ROOT / "docs" / "examples" / "generated"

# Display names for directories at any level
DIR_LABELS = {
    "definitions": "Definitions",
    "world": "World",
    "narrative": "Narrative",
    "tags": "Tags",
    "types": "Types",
    "characters": "Characters",
    "locations": "Locations",
    "objects": "Objects",
    "events": "Events",
    "edges": "Edges",
    "lenses": "Lenses",
    "beats": "Beats",
    "devices": "Devices",
    "threads": "Threads",
    "formats": "Formats",
}

# Ordering for top-level sections
SECTION_ORDER = ["definitions", "world", "narrative"]

# Ordering for subsections within a section
SUBSECTION_ORDER = [
    "tags", "types",
    "characters", "locations", "objects", "events", "edges",
    "lenses", "beats", "devices", "threads", "formats",
]


def slug(name: str) -> str:
    return name.lower().replace(" ", "-").replace("'", "").replace("\u2019", "")


def indent(text: str, spaces: int = 4) -> str:
    """Indent every line of text by the given number of spaces."""
    prefix = " " * spaces
    return "\n".join(prefix + line if line else "" for line in text.splitlines())


def yaml_section(filepath: Path) -> str:
    """Create a collapsible details section for a YAML file."""
    content = filepath.read_text().rstrip()
    indented = indent(content)
    return f'??? example "`{filepath.name}`"\n\n    ```yaml\n{indented}\n    ```\n'


def sort_key(name: str, order: list[str]) -> int:
    """Return sort index for a name based on an ordering list."""
    try:
        return order.index(name)
    except ValueError:
        return 999


def generate_example_page(example_dir: Path) -> str:
    """Generate a markdown page for a single example."""
    parts: list[str] = []

    # Include README.md as intro
    readme = example_dir / "README.md"
    if readme.exists():
        parts.append(readme.read_text().rstrip())
    else:
        name = example_dir.name.replace("-", " ").title()
        parts.append(f"# {name}")

    # Root-level YAML files (story.yaml first, then others)
    root_yamls = sorted(example_dir.glob("*.yaml"))
    story_file = example_dir / "story.yaml"
    if story_file.exists():
        root_yamls = [story_file] + [f for f in root_yamls if f != story_file]

    if root_yamls:
        parts.append("## Root Files\n")
        for f in root_yamls:
            parts.append(yaml_section(f))

    # Top-level sections
    top_dirs = sorted(
        [d for d in example_dir.iterdir() if d.is_dir()],
        key=lambda d: sort_key(d.name, SECTION_ORDER),
    )

    for top_dir in top_dirs:
        sub_dirs = sorted(
            [d for d in top_dir.iterdir() if d.is_dir()],
            key=lambda d: sort_key(d.name, SUBSECTION_ORDER),
        )
        has_subsections = bool(sub_dirs)

        index_yamls = sorted(top_dir.glob("*.yaml"))

        if not has_subsections:
            # Flat directory — treat as a single section
            if not index_yamls:
                continue
            label = DIR_LABELS.get(top_dir.name, top_dir.name.title())
            parts.append(f"## {label}\n")
            for f in index_yamls:
                parts.append(yaml_section(f))
        else:
            # Nested directory — create section with subsections
            label = DIR_LABELS.get(top_dir.name, top_dir.name.title())
            parts.append(f"## {label}\n")

            for f in index_yamls:
                parts.append(yaml_section(f))

            for sub_dir in sub_dirs:
                sub_yamls = sorted(sub_dir.glob("*.yaml"))
                if not sub_yamls:
                    continue
                sub_label = DIR_LABELS.get(sub_dir.name, sub_dir.name.title())
                parts.append(f"### {sub_label}\n")
                for f in sub_yamls:
                    parts.append(yaml_section(f))

    return "\n".join(parts) + "\n"


def generate_index(examples: list[tuple[str, Path]]) -> str:
    """Generate the examples index page."""
    lines = [
        "# Examples",
        "",
        "Complete, working projects that show how all schema pieces fit together.",
        "",
    ]
    for name, example_dir in examples:
        readme = example_dir / "README.md"
        desc = ""
        if readme.exists():
            for line in readme.read_text().splitlines():
                stripped = line.strip()
                if stripped and not stripped.startswith("#"):
                    desc = stripped
                    break
        doc_name = slug(name)
        lines.append(f"- [{name}](generated/{doc_name}.md) — {desc}")
    lines.append("")
    return "\n".join(lines)


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    examples = []

    for example_dir in sorted(EXAMPLES_DIR.iterdir()):
        if not example_dir.is_dir():
            continue
        if not (example_dir / "story.yaml").exists():
            continue

        # Derive display name from README title or directory name
        readme = example_dir / "README.md"
        name = example_dir.name.replace("-", " ").title()
        if readme.exists():
            first_line = readme.read_text().splitlines()[0]
            if first_line.startswith("# "):
                name = first_line[2:].strip()

        examples.append((name, example_dir))

        doc_name = slug(name)
        output_file = OUTPUT_DIR / f"{doc_name}.md"
        content = generate_example_page(example_dir)
        output_file.write_text(content)
        print(f"\u2713 {doc_name}.md")

    # Generate index
    index_content = generate_index(examples)
    index_file = ROOT / "docs" / "examples" / "index.md"
    index_file.write_text(index_content)
    print(f"\u2713 index.md")

    print(f"\nExample docs generated in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
