# Apricot workspace sidebar

A narrow rail expands into a warm glass workspace with glazed app tiles, a project flyout, a record player and a night switch. An original drawing builds the surrounding shelves, ceramics and stone coffee table.

![Apricot workspace sidebar](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Sidebars](../) |
| **Size** | 576 × 728 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 5.8-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7706065126838816020) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Expand the rail, select a destination, filter with the search box, browse tracks or switch on night shift.
- Add `#ocean` to switch palettes or `?t=3.22#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py ui/sidebars/apricot-workspace-sidebar` from the repository root.
