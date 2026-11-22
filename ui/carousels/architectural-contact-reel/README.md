# Architectural contact reel

A large project name is paired with one crisp architectural photo and two tilted, blurred neighbors. Each project selects its own muted full-canvas color.

![Architectural contact reel](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Carousels](../) |
| **Size** | 1152 × 708 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 10-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7692335850381790484) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=2.5#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Tap a project image, scroll, or use the arrow keys to move between four architectural studies. All four photographs are original generated imagery.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py ui/carousels/architectural-contact-reel` from the repository root.
