# Lunar gravity

A shaded cratered moon turns beside tightly set gradient lettering. Small rocks cross the orbital dust halo as the pointer adjusts the light and spin.

![Lunar gravity](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Landing pages](../) |
| **Size** | 1140 × 624 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 12-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7697686181961567508) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=3.6#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Drag to rotate the moon, use the arrow keys, or select the globe to change its orbit. The surface is an original AI-generated lunar study. The craters, satellites and dust field use additional procedural artwork.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py web/landing-pages/lunar-gravity` from the repository root.
