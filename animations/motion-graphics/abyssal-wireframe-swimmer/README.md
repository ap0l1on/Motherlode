# Abyssal wireframe swimmer

A pale wireframe swimmer undulates above a deep-blue seabed of fine receding lines.

![Abyssal wireframe swimmer](preview.gif)

| | |
| --- | --- |
| **Category** | [Animations › Motion graphics](../) |
| **Size** | 576 × 318 CSS pixels, 2× export |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | None. The artwork contains no lettering. |
| **Artwork** | Original procedural illustration and SVG geometry, drawn for Motherlode |
| **Animated** | Yes, 5.6-second loop |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7694183241296710932) |

## Every colorway

![Every colorway](colorways.png)

## Files

- `source/design.html` is the standalone artwork. Its address accepts a palette such as `#matcha` and a preview time such as `?t=2.9#ocean`.
- `exports/` contains each palette’s PNG still and H.264 loop.

## Changing it

Change the surface function to reshape the swimmer. Its circumferential rings and longitudinal seams share the same animated coordinates. The seabed is a second perspective mesh. The colorway blocks at the top of the source define the inks and ground. Run `python3 .github/scripts/export_design.py animations/motion-graphics/abyssal-wireframe-swimmer` to regenerate the exports.
