# Navratri garba circle

Seven colorful festival dancers gather around a floral rangoli beneath a hanging garland, a painted pot and a Navratri greeting.

![Navratri garba circle](preview.gif)

| | |
| --- | --- |
| **Category** | [Animations › Animated illustrations](../) |
| **Size** | 576 × 338 CSS pixels, 2× export |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Chalkboard SE and Gujarati Sangam MN from the system, with sans-serif fallbacks. |
| **Artwork** | Original procedural illustration and SVG geometry, drawn for Motherlode |
| **Animated** | Yes, 7-second loop |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7695671911119965461) |

## Every colorway

![Every colorway](colorways.png)

## Files

- `source/design.html` is the standalone artwork. Its address accepts a palette such as `#matcha` and a preview time such as `?t=5.6#ocean`.
- `exports/` contains each palette’s PNG still and H.264 loop.

## Changing it

The dancers have independent poses and costumes. Their orbit settles onto a final line beneath the Gujarati festival greeting. The recording also displays the signature codewithayansh. The colorway blocks at the top of the source define the inks and ground. Run `python3 .github/scripts/export_design.py animations/animated-illustrations/navratri-garba-circle` to regenerate the exports.
