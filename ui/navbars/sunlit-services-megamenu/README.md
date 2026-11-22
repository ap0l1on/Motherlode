# Sunlit services megamenu

A translucent studio navigation bar opens into a three-column services menu above a sunlit cabinet, ceramic vase and mushroom lamp.

![Sunlit services megamenu](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Navbars](../) |
| **Size** | 576 × 330 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 5.5-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7709769536873975060) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Hover or open Services to explore twelve options. The arrow keys move between links, and Escape closes the menu.
- Add `#ocean` to switch palettes or `?t=3.0#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py ui/navbars/sunlit-services-megamenu` from the repository root.
