#!/usr/bin/env python3
"""Validate Story as Code examples against SHACL shapes.

Loads all .ttl ontology/shape files, then for each example directory
loads all .jsonld files into a single RDF graph and runs SHACL validation.

Additionally validates that TextAnnotation offsets (start/end) match the
exact text within the passage content, and suggests fixes for mismatches.
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


def validate_annotations(example_dir: Path, *, fix: bool = False) -> bool:
    """Check that annotation start/end offsets match the exact text in content.

    Returns True when all annotations are correct.  When *fix* is True the
    .jsonld files are rewritten with corrected offsets.
    """
    ok = True
    for jsonld_file in sorted(example_dir.rglob("*.jsonld")):
        with open(jsonld_file) as f:
            raw = f.read()
        data = json.loads(raw)

        passages = data.get("passages", [])
        if not passages:
            continue

        file_changed = False
        for passage in passages:
            content = passage.get("content", "")
            pid = passage.get("id", "?")
            for ann in passage.get("annotations", []):
                start = ann["start"]
                end = ann["end"]
                exact = ann.get("exact")
                if exact is None:
                    continue

                actual = content[start:end]
                if actual == exact:
                    continue

                # Mismatch – find all occurrences and pick the closest one
                # to the original offset to handle duplicate substrings.
                ok = False
                rel = jsonld_file.relative_to(ROOT)

                occurrences = []
                search_from = 0
                while True:
                    idx = content.find(exact, search_from)
                    if idx == -1:
                        break
                    occurrences.append(idx)
                    search_from = idx + 1

                if not occurrences:
                    print(
                        f"  ANNOTATION ERROR  {rel}  passage={pid}  ref={ann['ref']}\n"
                        f"    exact text {exact!r} NOT FOUND in content"
                    )
                    continue

                # Pick the occurrence whose start is closest to the original
                correct_start = min(occurrences, key=lambda s: abs(s - start))
                correct_end = correct_start + len(exact)
                print(
                    f"  ANNOTATION ERROR  {rel}  passage={pid}  ref={ann['ref']}\n"
                    f"    content[{start}:{end}] = {actual!r}\n"
                    f"    exact            = {exact!r}\n"
                    f"    suggested fix: start={correct_start}, end={correct_end}"
                )

                if fix:
                    ann["start"] = correct_start
                    ann["end"] = correct_end
                    file_changed = True

        if file_changed:
            with open(jsonld_file, "w") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                f.write("\n")
            print(f"  FIXED  {jsonld_file.relative_to(ROOT)}")

    return ok


def validate_example(
    shapes_graph: Graph, example_dir: Path, *, fix: bool = False
) -> bool:
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
        max_validation_depth=30,
    )

    if conforms:
        print("  SHACL: PASS")
    else:
        print("  SHACL: FAIL")
        print(results_text)

    annotations_ok = validate_annotations(example_dir, fix=fix)
    if annotations_ok:
        print("  Annotations: PASS")
    else:
        print("  Annotations: FAIL")

    return conforms and annotations_ok


def main():
    import argparse

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "examples", nargs="?", default=str(EXAMPLES_DIR),
        help="Path to examples directory (default: %(default)s)",
    )
    parser.add_argument(
        "--fix", action="store_true",
        help="Automatically fix annotation offsets in .jsonld files",
    )
    args = parser.parse_args()

    examples_dir = Path(args.examples)

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
        if not validate_example(shapes_graph, example_dir, fix=args.fix):
            all_pass = False

    print()
    if all_pass:
        print("All examples passed validation.")
    else:
        print("Some examples failed validation.")
        sys.exit(1)


if __name__ == "__main__":
    main()
