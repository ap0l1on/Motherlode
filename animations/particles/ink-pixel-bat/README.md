# Ink pixel bat

A small bat flaps on a white field, briefly dissolving into black ink pixels at its wing tips.

![Ink pixel bat](preview.gif)

| | |
| --- | --- |
| **Category** | [Animations › Particles](../) |
| **Size** | 576 × 306 |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, iris |
| **Fonts** | No visible text |
| **Icons** | Original procedural SVG geometry |
| **Animated** | 3 seconds, 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7698641336274128149) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the editable drawing](source/design.html) to watch the loop. Append a colorway such as `#ocean` or use `?t=1.15#original` to pause it.
- The [exports](exports/) include a full-size still and H.264 loop in every colorway.

## Changing it

Four original pixel silhouettes cycle through six beats to reproduce the asymmetrical wingbeat. Each color token lives in the palette blocks at the top of the HTML. Run `python3 .github/scripts/export_design.py animations/particles/ink-pixel-bat` to refresh the media.
