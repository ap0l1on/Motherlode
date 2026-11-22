# Cobalt peeking eyes

A cobalt capsule tips up at one end, uncovering two white eyes inside the black base. The pupils turn toward the pointer.

![Cobalt peeking eyes](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Buttons](../) |
| **Size** | 864 × 462 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Barlow Condensed (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 5.8-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7695072703211949313) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=1.35#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Hover or focus to lift the blue lid. Move the pointer to steer the eyes, or click to blink.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py ui/buttons/cobalt-peeking-eyes` from the repository root.
