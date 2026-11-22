# Cobalt joint savings

An airy financial workspace combines an expense dot matrix, striped income columns and a segmented balance gauge. Analytics leads into shared savings goals and an individual pocket.

![Cobalt joint savings in motion](preview.gif)

| | |
| --- | --- |
| **Category** | [Dashboards › Banking](../) |
| **Size** | 1440 × 812 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, lagoon, apricot, cobalt, orchid |
| **Fonts** | DM Sans, bundled under the SIL Open Font License |
| **Icons** | Original inline SVG drawings |
| **Animated** | Yes, 5.7916666667 seconds at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7703828911007829268) |

## Every colorway

![All eight colorways](colorways.png)

## Files

- `source/design.html` contains the interface, diagrams and animation. Use the highlighted navigation entries to hold a view, and select the workspace mark to replay.
- Append `#lagoon` to select that palette, or `?t=1.93#lagoon` to freeze the overview.
- `exports/` contains a PNG and an H.264 MP4 for each palette.
- `source/fonts/OFL.txt` contains the font license.

## Changing it

Edit the named CSS variables at the top of `source/design.html`. To export a new colorway, duplicate a palette block, give it a new name and run `python3 .github/scripts/export_design.py dashboards/banking/cobalt-joint-savings`.
