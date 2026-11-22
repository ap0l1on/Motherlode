# Porcelain relief account

A pale relief panel slides between the two forms. Raised cobalt buttons and shallow circular impressions cast small blue-gray shadows.

![Porcelain relief account](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Auth pages](../) |
| **Size** | 576 × 300 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 5.3-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7703827449192172820) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Use the blue button on the greeting panel to move between sign-in and registration.
- Add `#ocean` to switch palettes or `?t=0.9#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py web/auth-pages/porcelain-relief-account` from the repository root.
