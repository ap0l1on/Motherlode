# Ruby wing coupe

A ruby-red concept coupe appears above concentric rings on a black showroom stage. The camera circles and changes distance, revealing the polished bodywork, glass roof and raised doors.

![Ruby wing coupe](preview.gif)

| | |
| --- | --- |
| **Category** | [3D › Product renders](../) |
| **Size** | 576 × 327 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Outfit, bundled under the SIL Open Font License |
| **Artwork** | Six original generated studio views of an unbranded concept vehicle and a reconstructed vector turntable. |
| **Animated** | Yes, 7.25-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7697684391560023317) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Use the side arrows to inspect camera angles. Doors switches between closed and raised poses, and Auto tour resumes the sequence.
- Add `#ocean` to switch palettes or `?t=2.3#ocean` to freeze the animation.
- [Exports](exports/) holds the colorway PNGs and H.264 loops.

The same comparison post also shows [Block axle turntable](../../../3d/low-poly/block-axle-turntable/).

## Changing it

Edit the palette variables at the top of [the source](source/design.html), then run `python3 .github/scripts/export_design.py 3d/product-renders/ruby-wing-coupe` from the repository root.
