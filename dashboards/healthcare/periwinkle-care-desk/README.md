# Periwinkle care desk

A hospital operations workspace with a bedside monitor, provider directory, shift coverage, department occupancy and reporting views.

![Periwinkle care desk in motion](preview.gif)

| | |
| --- | --- |
| **Category** | [Dashboards › Healthcare](../) |
| **Size** | 1440 × 770 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, lagoon, apricot, cobalt, orchid |
| **Fonts** | Inter and Cormorant Garamond Italic, bundled under the SIL Open Font License |
| **Icons** | Original inline SVG drawings |
| **Animated** | Yes, 5.6666666666 seconds at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7709024653766905108) |

## Every colorway

![All eight colorways](colorways.png)

## Files

- `source/design.html` contains the interface, diagrams and animation. Use the highlighted navigation entries to hold a view, and select the workspace mark to replay.
- Append `#lagoon` to select that palette, or `?t=1.48#lagoon` to freeze the overview.
- `exports/` contains a PNG and an H.264 MP4 for each palette.
- `source/fonts/OFL.txt` and `source/fonts/OFL-CormorantGaramond.txt` contain the font licenses.

## Changing it

Edit the named CSS variables at the top of `source/design.html`. To export a new colorway, duplicate a palette block, give it a new name and run `python3 .github/scripts/export_design.py dashboards/healthcare/periwinkle-care-desk`.
