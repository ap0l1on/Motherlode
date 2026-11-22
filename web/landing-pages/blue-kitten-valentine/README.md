# Blue kitten Valentine

A little blue kitten bobs beneath a Valentine invitation. Every decline enlarges the green Yes button until acceptance reveals an illustrated hug.

![Blue kitten Valentine](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Landing pages](../) |
| **Size** | 864 × 555 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 10-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7694550532949626132) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=1.2#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Press No to cycle through the replies and grow the green button. Yes reveals the original illustrated kitten and rabbit together.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py web/landing-pages/blue-kitten-valentine` from the repository root.
