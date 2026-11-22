# Pearl glass tabs

A pearl-white selection tile turns edge-on as it moves between five labels on a smoky, translucent rail.

![Pearl glass tabs](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Tab bars](../) |
| **Size** | 576 × 100 CSS pixels, exported at 1152 × 200 |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Font** | DM Sans, an embedded variable-weight subset under the SIL Open Font License. The license is included in the HTML. |
| **Icons and backdrop** | Original inline SVG drawings |
| **Animated** | Yes, 2.75 seconds at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7705318976523357460) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the standalone design](source/design.html) to try the navigation. The demo visits Home, Discover and Library. Select any of the five destinations to control the flip.
- Use the left and right arrow keys to move between destinations. Home and End select the first and last destination. The demo respects reduced motion.
- Add `#ocean` to the address to switch palettes, or `?t=1.65#ocean` to freeze the animation at 1.65 seconds.
- [Exports](exports/) contains one PNG and one H.264 MP4 per colorway.

## Changing it

The palette blocks at the top of `source/design.html` set the colors of the interior, glass and lettering. To add a palette, copy a block, rename it and run `python3 .github/scripts/export_design.py ui/tab-bars/pearl-glass-tabs` from the repository root.
