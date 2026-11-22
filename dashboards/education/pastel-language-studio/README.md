# Pastel language studio

A pastel language-learning dashboard with course cards, a three-series performance chart, homework and friend scores. The navigation opens a four-card word library.

![Pastel language studio in motion](preview.gif)

| | |
| --- | --- |
| **Category** | [Dashboards › Education](../) |
| **Size** | 1440 × 846 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, lagoon, apricot, cobalt, orchid |
| **Fonts** | Outfit, bundled under the SIL Open Font License |
| **Icons** | Original inline SVG drawings |
| **Animated** | Yes, 3.8333333333 seconds at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7701233556487490836) |

## Every colorway

![All eight colorways](colorways.png)

## Files

- `source/design.html` contains the interface, diagrams and animation. Use the highlighted navigation entries to hold a view, and select the workspace mark to replay.
- Append `#lagoon` to select that palette, or `?t=1.67#lagoon` to freeze the overview.
- `exports/` contains a PNG and an H.264 MP4 for each palette.
- `source/fonts/OFL.txt` contains the font license.
- The same post also shows the [Ember meeting desk](../../project-management/ember-meeting-desk/). This loop follows the language-learning views.

## Changing it

Edit the named CSS variables at the top of `source/design.html`. To export a new colorway, duplicate a palette block, give it a new name and run `python3 .github/scripts/export_design.py dashboards/education/pastel-language-studio`.
