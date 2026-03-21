#!/usr/bin/env python3
"""Validate Story as Code examples against SHACL shapes.

Loads all .ttl ontology/shape files, then for each example directory
loads all .jsonld files into a single RDF graph and runs SHACL validation.
"""

import json
import sys
from pathlib import Path
from rdflib import Graph, Namespace
from pyshacl import validate


ROOT = Path(__file__).resolve().parent.parent
ONTOLOGY_DIR = ROOT / "ontology"
SHAPES_DIR = ROOT / "shapes"
EXAMPLES_DIR = ROOT / "examples"

SAC = Namespace("https://story-as-code.dev/ontology#")
ENTITY_BASE = "https://story-as-code.dev/entity/"


def load_shapes_graph() -> Graph:
    """Load all ontology and shape files into a single shapes graph."""
    g = Graph()
    for ttl_file in ONTOLOGY_DIR.glob("*.ttl"):
        g.parse(ttl_file, format="turtle")
    for ttl_file in SHAPES_DIR.rglob("*.ttl"):
        g.parse(ttl_file, format="turtle")
    return g


def load_example_graph(example_dir: Path) -> Graph:
    """Load all .jsonld files in an example directory into one graph."""
    g = Graph()
    jsonld_files = list(example_dir.rglob("*.jsonld"))
    if not jsonld_files:
        print(f"  No .jsonld files found in {example_dir}")
        return g
    for jsonld_file in sorted(jsonld_files):
        try:
            with open(jsonld_file) as f:
                data = json.load(f)
            # Inject @base so all relative IDs resolve to a consistent IRI
            # regardless of which subdirectory the file lives in.
            ctx = data.get("@context")
            if isinstance(ctx, str):
                data["@context"] = [ctx, {"@base": ENTITY_BASE}]
            elif isinstance(ctx, list):
                data["@context"] = list(ctx) + [{"@base": ENTITY_BASE}]
            elif isinstance(ctx, dict):
                data["@context"] = [ctx, {"@base": ENTITY_BASE}]
            # Use the file's own URI as base so the external @context path resolves correctly.
            g.parse(data=json.dumps(data), format="json-ld", base=jsonld_file.as_uri())
        except Exception as e:
            print(f"  ERROR parsing {jsonld_file.relative_to(ROOT)}: {e}")
            raise
    return g


def validate_example(shapes_graph: Graph, example_dir: Path) -> bool:
    """Validate a single example against the shapes graph."""
    print(f"\nValidating {example_dir.name}...")
    data_graph = load_example_graph(example_dir)
    triple_count = len(data_graph)
    print(f"  Loaded {triple_count} triples from {len(list(example_dir.rglob('*.jsonld')))} files")

    if triple_count == 0:
        print("  SKIP: no triples loaded")
        return True

    conforms, results_graph, results_text = validate(
        data_graph,
        shacl_graph=shapes_graph,
        ont_graph=shapes_graph,
        inference="none",
        abort_on_first=False,
    )

    if conforms:
        print("  PASS")
    else:
        print("  FAIL")
        print(results_text)

    return conforms


def main():
    examples_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else EXAMPLES_DIR

    print("Loading ontology and shapes...")
    shapes_graph = load_shapes_graph()
    print(f"  {len(shapes_graph)} triples in shapes graph")

    all_pass = True
    example_dirs = sorted(
        d for d in examples_dir.iterdir() if d.is_dir() and not d.name.startswith(".")
    )

    if not example_dirs:
        print(f"No example directories found in {examples_dir}")
        sys.exit(1)

    for example_dir in example_dirs:
        if not validate_example(shapes_graph, example_dir):
            all_pass = False

    print()
    if all_pass:
        print("All examples passed validation.")
    else:
        print("Some examples failed validation.")
        sys.exit(1)


if __name__ == "__main__":
    main()
