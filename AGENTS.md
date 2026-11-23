# Motherlode: brief for Codex

Motherlode (github.com/ap0l1on/Motherlode) is a public design library with 50 sections and 867 categories, from dashboards and phone home screens to posters, merch and animations. Most categories are still empty. Your job is to fill them.

## Your job

The user sends you TikToks of designs they like. For each TikTok:

1. Rebuild every design in it so it matches the original as closely as you can.
2. Make each design in at least 8 colorways.
3. Put each one in the right category with its exports, a preview and a README.
4. Commit and push.

## The repo

- `README.md` and every section and category `README.md` are generated. Never edit them by hand.
- `.github/scripts/build_catalog.py` holds the list of sections and categories and writes all of those READMEs. It also puts every design, with its preview, on its category page. Run it after every change: `python3 .github/scripts/build_catalog.py`. It fails if any README link is broken.
- Designs live at `<section>/<category>/<design>/`, for example `dashboards/analytics/neon-glass/`.
- `_inbox/` is where the user drops TikToks. Git ignores it. Never commit anything from it.
- `docs/` is the website, live at https://ap0l1on.github.io/Motherlode/. GitHub Pages publishes it straight from `main`. `.github/scripts/build_site.py` writes its `catalog.json`, `posters/` and `demos/` from the design folders, so never edit those by hand. `docs/index.html`, `docs/site.css` and `docs/app.js` are the site's design. Leave them alone unless the user asks you to change the website.
- Other agents, like Claude, also work in this repo. Run `git status` before you start, and never commit or undo changes you didn't make.

## This Mac

- Google Chrome is installed at `/Applications/Google Chrome.app`. Use it headless to render designs.
- Python 3 with Pillow and Swift are installed.
- ffmpeg, Node and Homebrew are not. Ask the user before installing anything.

## 1. Study the TikTok

- You can't open TikTok links. Work from what the user puts in `_inbox/`: a saved video, a screen recording or screenshots. If you only get a link, ask them to save the video into `_inbox/`.
- For a video, extract about 2 frames per second into `_inbox/<clip>-frames/` with AVFoundation. Keep the Swift script for this at `.github/scripts/frames.swift` so it's ready next time.
- Go through the frames and pick the clearest shot of each design. If anything moves, note what moves, how far, how fast and with what easing.
- One TikTok can show several designs. Each one gets its own folder.
- You need the TikTok link and the creator's handle for the credit. If the user didn't give them, ask.

## 2. Pick a home

- Find the best section and category in `README.md`. If a design fits more than one, use the one people would look in first.
- If nothing fits, add a category to `GROUPS` in `build_catalog.py` and run it. Never make category folders by hand.
- Name the design folder after what it looks like, in lowercase with dashes: `neon-glass`, `bento-stats`, `clay-home-screen`. Not `tiktok-3`.

## 3. Rebuild it

Build each design as one page: `<design>/source/design.html`.

- Use plain HTML, CSS, SVG and JavaScript with no build step. If you really need a library (Three.js for 3D, say), copy a pinned build into `source/vendor/`.
- Make the page exactly the design's size and show nothing else. Match the original's aspect ratio. If you're unsure: phone screen 393 × 852, tablet 1024 × 1366, Mac or desktop 1440 × 900, watch 198 × 242, vertical video 1080 × 1920, square post 1080 × 1080, portrait post 1080 × 1350, thumbnail 1280 × 720, slide 1920 × 1080.
- Put these tags in the `<head>` so the export script knows what to do:

  ```html
  <meta name="motherlode:size" content="393x852"> <!-- width x height in CSS pixels -->
  <meta name="motherlode:scale" content="2">       <!-- 2 for screens; 1 for posts, thumbnails and slides -->
  <meta name="motherlode:loop" content="6">        <!-- animated designs only: loop length in seconds -->
  <meta name="motherlode:still" content="1.5">     <!-- animated designs only: the moment to use for stills -->
  ```

- Match everything: layout, spacing, sizes, corner radii, borders, shadows, blur, gradients, type, icons and motion.
- Fonts: work out which font it is. Load it from Google Fonts or bundle the files in `source/fonts/`, but only bundle fonts whose license allows it, like the SIL Open Font License. If the font isn't free, use the closest free one and say so in the README. Check that the render really uses the font you meant.
- Icons: draw them as SVG, or use an open set like Lucide, Phosphor or Material Symbols and name it in the README.
- Animate with CSS or the Web Animations API, not `requestAnimationFrame`, so the export script can freeze any moment.
- Phone status bars show 9:41 and a full battery.
- Check your work. Render the original colorway at the reference frame's size, then use Pillow to put it next to the frame and to overlay the two at 50%. Look at both, fix every difference you can see, and repeat until they look the same at a glance.

## 4. Colorways

Every color comes from CSS variables, with one block per colorway:

```css
:root, [data-colorway="original"] { --bg: #0b0b10; --surface: #16161f; --text: #f5f5f7; --muted: #8a8a99; --accent: #7c5cff; }
[data-colorway="light"] { --bg: #f7f7fa; --surface: #ffffff; --text: #0b0b10; --muted: #5c5c6b; --accent: #5b3df5; }
```

Don't write color values anywhere else, SVGs and shadows included (use `currentColor` or a variable like `var(--shadow)`). End the page with this script, so `design.html#light` shows the light colorway and `design.html?t=2` freezes every animation at 2 seconds:

```html
<script>
  const pick = () => (document.documentElement.dataset.colorway = location.hash.slice(1) || "original");
  pick();
  addEventListener("hashchange", pick);
  const t = new URLSearchParams(location.search).get("t");
  if (t !== null) {
    const freeze = () => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t * 1000; });
    freeze();
    addEventListener("load", freeze);
  }
</script>
```

Every design gets at least 8 colorways:

- `original`: exactly the colors in the TikTok
- `light`, `dark` and `mono` (black, white and grays only)
- at least 4 more that suit the design, named for how they look: `sunset`, `ocean`, `matcha`, `neon`, `sand`, `berry` and so on

Body text needs at least 4.5:1 contrast with its background in every colorway.

## 5. Export

The first time, write `.github/scripts/export_design.py`. After that, use it for every design: `python3 .github/scripts/export_design.py <design folder>`. It should:

1. Read size, scale, loop and still from the meta tags, and the colorway names from the `[data-colorway="…"]` blocks.
2. Render `exports/<colorway>.png` for every colorway with headless Chrome, for example:
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=393,852 --force-device-scale-factor=2 --virtual-time-budget=4000 --screenshot=exports/sunset.png "file:///…/source/design.html?t=1.5#sunset"`
   Leave out `?t=` for designs that don't move. Run several renders at once to save time.
3. For animated designs, render one loop at 24 fps using `?t=` and encode `exports/<colorway>.mp4` (H.264) with AVFoundation, using a small Swift script in `.github/scripts/`. Do every colorway if you can, and at least original, light and dark.
4. Make `preview.png` from the original colorway, about 1200 px on its long side. For animated designs make `preview.gif` instead, about 600 px wide and under 5 MB, so it moves on the category page.
5. Make `colorways.png`: every colorway side by side in one image, at most 4 per row, about 2000 px wide.

Keep every file under 50 MB. GitHub rejects anything over 100 MB.

## 6. Write the README

Every design folder gets a `README.md` like this. Its first line is the design's name, and that's what shows on the category page.

```markdown
# Neon glass dashboard

A dark analytics dashboard with frosted glass cards and glowing charts.

![Neon glass dashboard](preview.png)

| | |
| --- | --- |
| **Category** | [Dashboards › Analytics](../) |
| **Size** | 1440 × 900 |
| **Colorways** | original, light, dark, mono, sunset, ocean, matcha, neon |
| **Fonts** | Inter (Google Fonts) |
| **Icons** | Lucide |
| **Animated** | No |
| **Based on** | [A TikTok by @creator](https://www.tiktok.com/@creator/video/…) |

## Every colorway

![Every colorway](colorways.png)

## Files

- `source/design.html` is the design. Open it in a browser and add `#sunset`, or any colorway name, to the end of the address to switch colors.
- `exports/` has a PNG of every colorway, plus an MP4 loop for animated designs.

## Changing it

The colors are CSS variables at the top of `source/design.html`, one block per colorway. To add a colorway, copy a block, rename it and run `python3 .github/scripts/export_design.py` on this folder.
```

## 7. Finish

1. Run `python3 .github/scripts/build_catalog.py`. It has to report `broken_links=0` and no `WARN` lines for your designs.
2. Run `python3 -B .github/scripts/build_site.py`. It adds the design to the website: its entry in `docs/catalog.json`, a poster in `docs/posters/` and a live demo in `docs/demos/`.
3. Check that the design shows up. Open the category's `README.md` and look for it with its preview. Then run `python3 -m http.server 8765 --directory docs`, open `http://127.0.0.1:8765/#/<section>/<category>/<design>` and check that it plays and that every colorway button recolors it.
4. Commit each design separately. Stage only its folder, the READMEs the catalog script changed, its website files (`docs/catalog.json`, `docs/posters/<section>/<category>/<design>.webp` and `docs/demos/<section>/<category>/<design>.html`) and any scripts you wrote. Never use `git add -A`. Use messages like `Add Neon glass dashboard (dashboards/analytics)`.
5. Once every design from the TikTok is committed, push. GitHub Pages republishes the website from `main` a few minutes later. If the push fails, tell the user and keep the commits.
6. Tell the user what you added: each design's name, folder and colorways.

## Rules, because the repo is public

- Rebuild the design, not the brand. Swap logos, brand names, trademarks, photos of real people and copyrighted artwork for your own versions or neutral placeholders. Keep the layout, style and motion.
- Never commit the TikTok, frames from it or screenshots of it. They stay in `_inbox/`.
- Never commit font files whose license doesn't allow sharing.
- Always credit the creator with a link to the TikTok.

## Done means

- The original colorway is hard to tell apart from the TikTok.
- There are at least 8 colorways, each exported, with MP4 loops if the design moves.
- `README.md`, `preview.png` (or `preview.gif`), `colorways.png` and `source/design.html` are all there.
- The catalog script reports no broken links, the design shows on its category page and on the website, and it's committed and pushed.
