# Soft clay record player

A small clay music player rotates a microphone photograph inside a circular record. Violet rails and pressed playback controls sit beneath the track name.

![Soft clay record player](preview.gif)

| | |
| --- | --- |
| **Category** | [Apps › Music](../) |
| **Size** | 864 × 675 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 9-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7698638789480090932) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=4.7#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Play or pause, change the track, drag the volume and seek sliders, and toggle shuffle or repeat. A short original synthesized sequence is available after pressing play. The miniature microphone cover is original vector artwork.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py apps/music/soft-clay-record-player` from the repository root.
