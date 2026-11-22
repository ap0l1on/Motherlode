# Curved crystal sidebar

A concave frosted sidebar expands over black and silver waves. Its compact crystal poster widens alongside the profile, nested bookings and navigation labels.

![Curved crystal sidebar](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Sidebars](../) |
| **Size** | 576 × 642 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 5.6-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7708661722428476692) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Use the fold button to expand the rail, open Bookings for its three subitems, and choose a destination.
- Add `#ocean` to switch palettes or `?t=3.5#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py ui/sidebars/curved-crystal-sidebar` from the repository root.
