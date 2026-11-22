# Kepler orbital command console

A ringed planet and orbiting satellite accompany flight metrics, system rings and a crew manifest. The sequence inspects a commander, scrolls to telemetry and opens a destination dossier.

![Kepler orbital command console in motion](preview.gif)

| | |
| --- | --- |
| **Category** | [Dashboards › Analytics](../) |
| **Size** | 1440 × 822 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, lagoon, apricot, cobalt, orchid |
| **Fonts** | Inter, bundled under the SIL Open Font License |
| **Icons** | Original inline SVG drawings |
| **Animated** | Yes, 7.7083333333 seconds at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7698710983757335828) |

## Every colorway

![All eight colorways](colorways.png)

## Files

- `source/design.html` contains the interface, diagrams and animation. Use the highlighted navigation entries to hold a view, and select the workspace mark to replay.
- Append `#lagoon` to select that palette, or `?t=1.12#lagoon` to freeze the overview.
- `exports/` contains a PNG and an H.264 MP4 for each palette.
- `source/fonts/OFL.txt` contains the font license.
- The same post opens with the [White mission status sheet](../white-mission-status/). The planet, satellite and destination imagery in this source are original vector drawings.

## Changing it

Edit the named CSS variables at the top of `source/design.html`. To export a new colorway, duplicate a palette block, give it a new name and run `python3 .github/scripts/export_design.py dashboards/analytics/kepler-orbital-command`.
