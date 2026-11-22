# Ember leave calendar

A near-black monthly calendar uses a red-orange selected date. A neighboring editor records a date range and shows the resulting highlighted days.

![Ember leave calendar](preview.gif)

| | |
| --- | --- |
| **Category** | [UI › Calendars](../) |
| **Size** | 864 × 855 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 8.4-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7693823969274776852) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=3.5#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Select a date, navigate months or add a leave period using the date, time, type and reason controls. Applying the form updates the local event count and date range.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py ui/calendars/ember-leave-calendar` from the repository root.
