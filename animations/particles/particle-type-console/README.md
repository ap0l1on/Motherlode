# Particle type console

A violet particle globe breaks apart into letters. An input below the field turns a short phrase into a new constellation of dots.

![Particle type console](preview.gif)

| | |
| --- | --- |
| **Category** | [Animations › Particles](../) |
| **Size** | 576 × 341 |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, iris |
| **Fonts** | System sans-serif and monospace |
| **Icons** | Original procedural SVG geometry |
| **Animated** | 13 seconds, 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7699385726407871765) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the editable drawing](source/design.html) to watch the loop. Append a colorway such as `#ocean` or use `?t=10.2#original` to pause it.
- The [exports](exports/) include a full-size still and H.264 loop in every colorway.

## Changing it

The sphere and two text clouds exchange places at fixed times. Enter a phrase and press Create to draw it yourself. Each color token lives in the palette blocks at the top of the HTML. Run `python3 .github/scripts/export_design.py animations/particles/particle-type-console` to refresh the media.
