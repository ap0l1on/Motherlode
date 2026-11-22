# Citron sales ledger

A lime-accented CRM uses serif italics in its headings and a fixed navigation bar above a scrolling performance overview. The sequence continues through a deal pipeline and contact directory.

![Citron sales ledger in motion](preview.gif)

| | |
| --- | --- |
| **Category** | [Dashboards › Sales and CRM](../) |
| **Size** | 1440 × 782 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, lagoon, apricot, cobalt, orchid |
| **Fonts** | Inter and Cormorant Garamond Italic, bundled under the SIL Open Font License |
| **Icons** | Original inline SVG drawings |
| **Animated** | Yes, 5.4166666667 seconds at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7703988730998082836) |

## Every colorway

![All eight colorways](colorways.png)

## Files

- `source/design.html` contains the interface, diagrams and animation. Use the highlighted navigation entries to hold a view, and select the workspace mark to replay.
- Append `#lagoon` to select that palette, or `?t=1.43#lagoon` to freeze the overview.
- `exports/` contains a PNG and an H.264 MP4 for each palette.
- `source/fonts/OFL.txt` contains the font license.

## Changing it

Edit the named CSS variables at the top of `source/design.html`. To export a new colorway, duplicate a palette block, give it a new name and run `python3 .github/scripts/export_design.py dashboards/sales-crm/citron-sales-ledger`.
