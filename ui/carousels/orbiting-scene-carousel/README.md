# Orbiting scene carousel

Seven Spanish-language scene cards fill the stage with immersive landscape artwork. Circular destination previews sweep across the right edge as the scene changes.

![Orbiting scene carousel](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Carousels](../) |
| **Size** | 576 × 313 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 11.9-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7693147995730185492) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Select a circular preview or use the arrow buttons and keyboard to visit each destination.
- Add `#ocean` to switch palettes or `?t=0.34#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

The seven displayed scenes are original imagegen illustrations, packed into `source/original-scene-atlas.webp`. The eighth tile is an unused alternate landscape from the same generated sheet.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py ui/carousels/orbiting-scene-carousel` from the repository root.
