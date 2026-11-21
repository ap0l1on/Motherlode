# Motherlode

**The mother of all design libraries.**

Every kind of design, for everything, in one place: brand kits, UI, icons, social posts, decks, motion and more. Make something once, drop it here, and nobody has to make it again.

## What's inside

| Folder | What goes in it |
| --- | --- |
| [`brand/`](brand/) | Logos, color palettes, brand kits, style guides |
| [`ui/`](ui/) | UI kits, components, web and app screens |
| [`icons/`](icons/) | Icon sets, SVG first |
| [`illustrations/`](illustrations/) | Illustrations, characters, backgrounds, textures |
| [`social/`](social/) | Posts, stories, banners, thumbnails |
| [`presentations/`](presentations/) | Slide decks and pitch templates |
| [`motion/`](motion/) | Animations, transitions, Lottie files, video templates |
| [`typography/`](typography/) | Fonts, pairings, type specimens |
| [`print/`](print/) | Posters, flyers, business cards, merch |
| [`mockups/`](mockups/) | Device, product and 3D mockups |

Got something that doesn't fit? Make a new folder and add a row here.

## Adding a design

Every design gets its own folder, named in lowercase with dashes:

```text
social/
└── launch-announcement/
    ├── README.md     what it is, where it's used, which fonts and colors it needs
    ├── preview.png   what people see when they browse
    ├── source/       the editable file (.fig, .psd, .ai, .aep, .html …)
    └── exports/      ready-to-use files (.png, .svg, .mp4, .pdf …)
```

`preview.png` matters most. It's how people find the right design without opening every file.

## Big files

GitHub warns about files over 50 MB and rejects anything over 100 MB. For heavy sources like raw video or huge PSDs, use [Git LFS](https://git-lfs.com) or keep the file in shared storage and link to it from the design's README.
