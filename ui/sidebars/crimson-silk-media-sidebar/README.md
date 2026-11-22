# Crimson silk media sidebar

An icon rail and a separate expanded media sidebar float over folded crimson silk. Both sets of links track the selection together.

![Crimson silk media sidebar](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Sidebars](../) |
| **Size** | 576 × 1024 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 5.3-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7691663481405213958) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Use the screen icon to show or hide the larger panel. Select any destination on either rail.
- Add `#ocean` to switch palettes or `?t=2.85#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py ui/sidebars/crimson-silk-media-sidebar` from the repository root.
