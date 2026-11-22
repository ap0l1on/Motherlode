# Midnight energy can

A glowing energy-drink seal expands into a navy product card. A metallic can rises above its right edge and turns away as the seal closes.

![Midnight energy can](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Cards](../) |
| **Size** | 872 × 654 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 7.6-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7693619244268784917) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=3.45#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Hover, focus or press the seal to expand the card. Its shop button records a local selection. The fictional can and mark are original generated product artwork and vector art.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py ui/cards/midnight-energy-can` from the repository root.
