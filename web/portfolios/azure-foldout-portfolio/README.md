# Azure foldout portfolio

A cyan-covered portfolio opens into four spreads with a profile, experience, education, services, skills, project thumbnails and a contact form.

![Azure foldout portfolio](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Portfolios](../) |
| **Size** | 543 × 369 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 10.8-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7695070372202384660) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Turn a page using the corner arrows or keyboard, explore the individual links, save the fictional résumé or fill out the local contact form.
- Add `#ocean` to switch palettes or `?t=0.65#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py web/portfolios/azure-foldout-portfolio` from the repository root.
