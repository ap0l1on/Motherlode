# Liquid focus controls

Three deep glass controls sit diagonally on a beveled plate. Blue, red and amber liquid illuminate the active mode as the plate switches between pale and dark material.

![Liquid focus controls](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Segmented controls](../) |
| **Size** | 864 × 606 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 7-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7696038120097074453) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=1.5#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Hover or select Sleep, Do Not Disturb or Personal. Each mode has its own material, icon and active lighting.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py ui/segmented-controls/liquid-focus-controls` from the repository root.
