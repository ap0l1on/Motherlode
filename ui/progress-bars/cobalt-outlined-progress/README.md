# Cobalt outlined progress

A cobalt fill advances in short steps inside a thin, square-cornered progress bar with a black loading label.

![Cobalt outlined progress](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Progress bars](../) |
| **Size** | 576 × 144 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, bundled under the SIL Open Font License |
| **Artwork** | Original vector progress track and label. |
| **Animated** | Yes, 10-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7696152427006872853) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Select the scene to replay the loop.
- Add `#ocean` to switch palettes or `?t=3.5#ocean` to freeze the animation.
- [Exports](exports/) holds the colorway PNGs and H.264 loops.

The reference also shows [Folded cobalt progress ribbon](../folded-cobalt-progress-ribbon/), synchronized to the same progress.

## Changing it

Edit the palette variables at the top of [the source](source/design.html), then run `python3 .github/scripts/export_design.py ui/progress-bars/cobalt-outlined-progress` from the repository root.
