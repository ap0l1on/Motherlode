# Striped football club login

The recording opens with a bright striped football fan page, a beveled gray sign-in form and a narrow scrolling match ticker.

![Striped football club login](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Auth pages](../) |
| **Size** | 576 × 332 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Georgia and Arial for the fan-site heading, striped-page labels and compact fields. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 5-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7699384682189704468) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Edit the player details, choose Kick Off or switch to the club sign-up state.
- Add `#ocean` to switch palettes or `?t=1.2#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py web/auth-pages/striped-football-club-login` from the repository root.
