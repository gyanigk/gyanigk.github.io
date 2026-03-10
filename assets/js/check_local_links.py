#!/usr/bin/env python3
"""Validate local href/src links in HTML files for GitHub Pages compatibility."""

from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse


HTML_TAG_ATTRS = {
    "a": ("href",),
    "img": ("src",),
    "script": ("src",),
    "link": ("href",),
    "source": ("src",),
    "video": ("src", "poster"),
}


def is_external(value: str) -> bool:
    value = value.strip()
    if not value:
        return True
    if value.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return True
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} or value.startswith("//")


def normalize_local_path(value: str, html_file: Path, repo_root: Path) -> Path:
    parsed = urlparse(value.strip())
    path_part = unquote(parsed.path)
    if path_part.startswith("/"):
        return (repo_root / path_part.lstrip("/")).resolve()
    return (html_file.parent / path_part).resolve()


class LinkCollector(HTMLParser):
    def __init__(self, html_file: Path):
        super().__init__(convert_charrefs=True)
        self.html_file = html_file
        self.references: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_names = HTML_TAG_ATTRS.get(tag.lower())
        if not attr_names:
            return
        attr_map = {key: value for key, value in attrs}
        for attr_name in attr_names:
            value = attr_map.get(attr_name)
            if value:
                self.references.append((tag, value))


def collect_html_files(repo_root: Path) -> list[Path]:
    return sorted(path for path in repo_root.glob("*.html") if path.is_file())


def main() -> int:
    repo_root = Path(__file__).resolve().parents[1]
    html_files = collect_html_files(repo_root)
    if not html_files:
        print("No HTML files found at repository root.")
        return 1

    errors: list[str] = []
    for html_file in html_files:
        parser = LinkCollector(html_file)
        parser.feed(html_file.read_text(encoding="utf-8", errors="replace"))

        for tag, reference in parser.references:
            if is_external(reference):
                continue

            target = normalize_local_path(reference, html_file, repo_root)
            if not target.exists():
                display = reference.strip()
                errors.append(f"{html_file.name}: <{tag}> -> '{display}' does not exist")

    if errors:
        print("Local link validation failed:")
        for line in errors:
            print(f"  - {line}")
        return 2

    print(f"Local link validation passed for {len(html_files)} HTML file(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
