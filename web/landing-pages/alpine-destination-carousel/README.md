# Alpine destination carousel

A full-bleed Alpine valley opens a travel carousel. Six destinations take turns filling the screen as image cards, compact destination copy and the active slide number move together.

![Alpine destination carousel](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Landing pages](../) |
| **Size** | 1152 × 602 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter and Barlow Condensed (bundled Latin subsets from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 12.4-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7701607014056594708) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=0.65#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Use the arrow controls, destination cards or keyboard arrows to move between six locations. The source includes one original AI-generated photographic atlas showing an alpine valley, a timber street, dunes, a granite park, a rocky coast and a volcanic valley.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py web/landing-pages/alpine-destination-carousel` from the repository root.
