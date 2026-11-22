# Eight-trace loading chip

Eight fine circuit traces converge on a black chip labeled Loading. Short colored signals travel in from both sides and disappear at the silver pins.

![Eight-trace loading chip](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Loaders](../) |
| **Size** | 576 × 298 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, bundled under the SIL Open Font License |
| **Artwork** | Original SVG circuit paths, chip housing and brushed pins. |
| **Animated** | Yes, 3-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7691225756193574164) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Select the scene to replay the loop.
- Add `#ocean` to switch palettes or `?t=0.7#ocean` to freeze the animation.
- [Exports](exports/) holds the colorway PNGs and H.264 loops.

## Changing it

Edit the palette variables at the top of [the source](source/design.html), then run `python3 .github/scripts/export_design.py ui/loaders/eight-trace-loading-chip` from the repository root.
