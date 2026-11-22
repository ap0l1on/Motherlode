# Blue orbit running hero

A runner crosses a blue disk above an uphill trail. A pace readout and heart-rate chip sit around the silhouette.

![Blue orbit running hero](preview.png)

| | |
| --- | --- |
| **Category** | [Web › Landing pages](../) |
| **Size** | 1200 × 756 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, sunset, lagoon, moss, orchid |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | No |
| **Based on** | [A TikTok by @ryannaghib](https://www.tiktok.com/@ryannaghib/video/7707006807717301518) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#sunset` to select that colorway.
- [The exports folder](exports/) contains a PNG for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

The runner, trail, avatars and route mark are original vector drawings. The page recreates the final three-color composition at 5.5 seconds. The screenshots use static landing-page controls.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py web/landing-pages/blue-orbit-run` from the repository root.
