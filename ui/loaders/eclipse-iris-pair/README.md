# Eclipse iris loader

A pair of angular eyes opens on black. Copper-red orbit marks give way to lilac concentric rings before the eyelids close and a welcome message appears.

![Eclipse iris loader](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Loaders](../) |
| **Size** | 864 × 576 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 7.4-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7701240226613693716) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=2.45#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Click or press Enter to replay. The orbital marks and iris symbols are original, with their own ring spacing and rotation.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py ui/loaders/eclipse-iris-pair` from the repository root.
