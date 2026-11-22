# Amber cable break

Two rounded golden fours frame a small cave explorer who tugs a cable. A brief electrical flash lights the broken connection above a compact 404 message.

![Amber cable break](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Error pages](../) |
| **Size** | 864 × 447 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 4.6-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7702721713838034196) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=1#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

The explorer, clothing and cable are original SVG artwork. The button uses browser history when a previous page exists and replays the illustration in a standalone preview.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py web/error-pages/amber-cable-break` from the repository root.
