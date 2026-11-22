# Aurora speedometer

An outlined gauge sweeps from zero to full speed. Turquoise light spreads through its graduation marks, turning ember near the redline.

![Aurora speedometer](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Progress bars](../) |
| **Size** | 864 × 592 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 10-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7692327967891950868) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=4.9#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Hold the gauge or Space to accelerate and release to slow down. Movement inside the dial gives it a small tilt.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py ui/progress-bars/aurora-speedometer` from the repository root.
