# Cyan command authentication

A cyan command console places an access card beside a circular energy display. Three biometric views and a telemetry-filled welcome screen share the same frame.

![Cyan command authentication](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Auth pages](../) |
| **Size** | 576 × 322 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | System monospace. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 6.3-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7697529602599701812) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Try a local identifier, choose a scan mode or authenticate to reach the status console. No device sensing or credentials leave the page.
- Add `#ocean` to switch palettes or `?t=0.9#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py web/auth-pages/cyan-command-authentication` from the repository root.
