# Prismatic liquid tab bar

A luminous soft-edged droplet glides across five dark tabs, changing from mint through blue and violet.

![Prismatic liquid tab bar](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Navbars](../) |
| **Size** | 576 × 322 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 5-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7692335089463692564) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Select any destination or use the arrow keys to move the indicator.
- Add `#ocean` to switch palettes or `?t=1.94#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py ui/navbars/prismatic-liquid-tab-bar` from the repository root.
