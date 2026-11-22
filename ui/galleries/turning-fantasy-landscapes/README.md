# Turning fantasy landscapes

Eight luminous landscape paintings form the connected faces of a turning gallery on a deep midnight field.

![Turning fantasy landscapes](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Galleries](../) |
| **Size** | 576 × 386 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 12.8-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7696039740323253524) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Drag to turn the cylinder. Focus it and use the arrow keys to step between landscapes.
- Add `#ocean` to switch palettes or `?t=0.3#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

The eight original landscape illustrations are packed into `source/original-landscape-atlas.webp`. The palette treatment applies to every panel, including the grayscale edition.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py ui/galleries/turning-fantasy-landscapes` from the repository root.
