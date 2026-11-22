# Cherry cola product morph

A small glowing bottle tile expands into a product page. The dark panel changes between cherry and lime lighting as flavor, quantity and cart state change.

![Cherry cola product morph](preview.gif)

| | |
| --- | --- |
| **Category** | [Web › Product pages](../) |
| **Size** | 864 × 624 CSS pixels, exported at 2× |
| **Colorways** | original, light, dark, mono, ember, lagoon, orchid, olive |
| **Fonts** | Inter (bundled Latin subset from Google Fonts, SIL Open Font License) |
| **Icons** | Original inline SVG and CSS |
| **Animated** | Yes, 20-second loop at 24 fps |
| **Based on** | [A TikTok by @paulcodes4](https://www.tiktok.com/@paulcodes4/video/7700873938636688641) |

## Every colorway

![Every colorway](colorways.png)

## Files

- Open [the design](source/design.html) in a browser and append `#ember` to select that colorway. Add `?t=2.65#ember` after the filename to show the export still.
- [The exports folder](exports/) contains a PNG and an H.264 MP4 loop for each colorway.
- [The font folder](source/fonts/) includes the font files and their licenses.

## Changing it

Open the product tile, switch flavor, set a quantity and add it to the local bag. The bottles and label system are original artwork. A compact and an expanded state share the same product.

The custom properties at the top of `source/design.html` define each palette. Copy a palette block, give it a new colorway name, then run `python3 .github/scripts/export_design.py web/product-pages/cherry-cola-morph` from the repository root.
