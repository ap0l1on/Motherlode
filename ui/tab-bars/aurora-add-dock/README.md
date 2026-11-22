# Aurora add dock

Blue home and discovery icons flank a raised aqua add button. A small light marks the selected destination.

![Aurora add dock](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Tab bars](../) |
| **Size** | 402 × 120 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 4.2-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7696783019134258452) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Choose a destination, use the arrow keys to move between tabs, or press the circular center control.
- Add `#ocean` to switch palettes or `?t=1.64#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py ui/tab-bars/aurora-add-dock` from the repository root.
