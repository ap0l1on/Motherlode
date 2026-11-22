# Crimson runner detail

A scarlet running shoe hovers in a black product card. The round arrow opens a closeable details panel with a size row and a full-width cart control.

![Crimson runner detail](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Cards](../) |
| **Size** | 864 × 768 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 8.4-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7697152910022561045) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=1.25#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Open the arrow to inspect the shoe, choose a size and add it to the local cart. Use the cross to close the panel or the heart to mark the item. The shoe is an original AI-generated product photograph.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py ui/cards/crimson-runner-detail` from the repository root.
