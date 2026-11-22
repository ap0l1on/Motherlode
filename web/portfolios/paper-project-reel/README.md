# Paper project reel

An airy developer portfolio arranges project thumbnails on a movable filmstrip. The strip swings through a vertical layout and opens an editorial project detail.

![Paper project reel](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Portfolios](../) |
| **Size** | 1152 × 660 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 16.8-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7701972642051443988) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=6#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Use the horizontal and vertical view controls, arrow keys and project thumbnails to explore. The project detail and full-page menu remain available outside the automated tour.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py web/portfolios/paper-project-reel` from the repository root.
