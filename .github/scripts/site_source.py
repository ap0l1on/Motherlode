"""Build a portable copy of a Motherlode source page using its bundled media."""

import base64
import html
import mimetypes
from pathlib import Path
import re


LICENSE = re.compile(r'(?:ofl|licen[cs]e|copying|copyright)', re.IGNORECASE)


def portable_html(source: Path) -> str:
    """Return one HTML file with embedded source assets, licenses and creator credits.

    `source` is a design's source/design.html. Match complete local URL tokens,
    including ones in JavaScript-generated markup, without changing #svg IDs.
    """
    document = source.read_text(encoding='utf-8')
    assets = {}
    notices = []
    for path in sorted(source.parent.rglob('*')):
        rel = path.relative_to(source.parent)
        if not path.is_file() or path == source or any(part.startswith('.') for part in rel.parts):
            continue
        if path.suffix.lower() in {'.txt', '.md'} and LICENSE.search(path.name):
            license_text = path.read_text(encoding='utf-8').strip()
            if license_text not in document:
                notices.append((rel.as_posix(), license_text))
            continue
        assets[rel.as_posix()] = path

    if assets:
        media_urls = {}
        names = '|'.join(re.escape(name) for name in sorted(assets, key=len, reverse=True))
        # Delimiters cover HTML, CSS and JS literals, including unquoted url().
        pattern = re.compile(r'''(?<=["'`=(\s])(?:\./)?(''' + names + r''')(?=["'`)\s>])''')

        def embed(match):
            name = match[1]
            if name not in media_urls:
                payload = base64.b64encode(assets[name].read_bytes()).decode('ascii')
                mime = mimetypes.guess_type(name)[0] or 'application/octet-stream'
                media_urls[name] = f'data:{mime};base64,{payload}'
            return media_urls[name]

        document = pattern.sub(embed, document)

    readme = source.parents[1] / 'README.md'
    credit_lines = [line for line in readme.read_text(encoding='utf-8').splitlines()
                    if 'tiktok.com/' in line] if readme.is_file() else []
    if credit_lines:
        notices.append(('Motherlode source credits', '\n'.join(credit_lines)))
    if notices:
        blocks = []
        for name, contents in notices:
            # These plain-text blocks preserve their text without entering the DOM layout.
            contents = re.sub(r'</script', r'<\\/script', contents, flags=re.IGNORECASE)
            blocks.append(f'<script type="text/plain" data-notice="{html.escape(name, quote=True)}">\n{contents}\n</script>')
        end = re.search(r'</body\s*>', document, re.IGNORECASE)
        at = end.start() if end else len(document)
        document = document[:at] + '\n'.join(blocks) + '\n' + document[at:]
    return document
