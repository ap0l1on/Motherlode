# Quantum radar access

Fine teal radar traces orbit a small terminal on a star field. Submitting the form triggers a luminous circular scan and access confirmation.

![Quantum radar access](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Auth pages](../) |
| **Size** | 576 × 392 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 6.4-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7698637170864688405) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Enter a local identifier and token, then initialize the connection. The confirmation control returns to the form.
- Add `#ocean` to switch palettes or `?t=1.05#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py web/auth-pages/quantum-radar-access` from the repository root.
