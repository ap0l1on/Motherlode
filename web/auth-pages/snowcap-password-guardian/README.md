# Snowcap password guardian

A friendly snow creature watches the email field and raises both furry hands when the password field receives focus.

![Snowcap password guardian](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Auth pages](../) |
| **Size** | 408 × 398 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ocean, matcha, sunset, berry |
| **Fonts** | Inter, embedded under the SIL Open Font License. The HTML includes the license. |
| **Artwork** | Original SVG and CSS |
| **Animated** | Yes, 5.2-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7702505397352959252) |

## Every colorway

![Every colorway](colorways.png)

## Files

- [Open the standalone design](source/design.html). Focus Email or Password to direct the original illustrated character’s gaze and hands.
- Add `#ocean` to switch palettes or `?t=3.65#ocean` to freeze the preview.
- [Exports](exports/) contains a PNG and an H.264 MP4 for every colorway.

## Changing it

The CSS variables at the top of `source/design.html` control the palette. Copy a palette block, rename it, then run `python3 .github/scripts/export_design.py web/auth-pages/snowcap-password-guardian` from the repository root.
