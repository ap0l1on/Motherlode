# Folding bike configurator

A white folding bicycle sits across a slate-and-white product page. Its wheels roll out and return with four interchangeable spoke patterns.

![Folding bike configurator](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Product pages](../) |
| **Size** | 1152 × 780 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 13-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7694177899913448724) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=3.2#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Select any wheel style, check out the current build, or return from the added-to-cart screen. The frame, tires, chain and four wheel patterns are original SVG artwork.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py web/product-pages/folding-bike-configurator` from the repository root.
