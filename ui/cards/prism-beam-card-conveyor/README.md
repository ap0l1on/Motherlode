# Prism beam card conveyor

Four fictional payment cards glide through a narrow violet beam. On its dark side each card resolves into lines of fine technical lettering.

![Prism beam card conveyor](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Cards](../) |
| **Size** | 464 × 263 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 12-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7695086807041576193) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Use the arrow keys to step between the cards. Space pauses or resumes automatic motion.
- Add `#ocean` to switch palettes or `?t=9.25#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py ui/cards/prism-beam-card-conveyor` from the repository root.
