---
name: fairy-tale-ui
description: >
  Visual system of the Fairy-tale-generator: warm paper, forest night, Literata
  for the story, and restrained Apple-style motion. Use when changing layout,
  color, type, spacing, or animation in this app, or when the user runs
  /fairy-tale-ui.
---

# Fairy-tale interface

Product behavior and the locale switcher live in `/fairy-tale`. Color and motion live here, in `src/app/globals.css` and the studio components.

## Color

One warm ground and one accent. Tokens are CSS variables, not Tailwind theme keys.

Light: background `#f3f0ea`, card `#fffdf9`, fill `#e6e1d8`, text `#4a3b32`, secondary `#544f4a`, accent `#1b5e4a` (press `#144a3a`, on-accent `#ffffff`), danger `#b42318`. Theme color `#f3f0ea`.

Dark is forest night, chosen because a near-black ground does not fit a children's tale: background `#2f4a42`, card `#3a5850`, fill `#46685e`, text `#f6f1e8`, secondary `#e2d8ca`, accent `#e8c48a` (press `#f4d6a8`, on-accent `#243f38`), danger `#ffc9c2`. Theme color `#2f4a42`.

Keep body text and the accent at least about 4.5:1 on the surface they sit on. The reading sheet is the only shadowed surface. No purple gradient, no emoji icons, no left-border accent cards, no device frame.

## Type and chrome

Chrome is the system UI font. The story body is Literata (`--font-story`, Cyrillic and Cyrillic Extended). Titles use `text-wrap: balance`; body copy uses `pretty`. Story measure is 65ch and line-height 1.7. Quotes in Russian catalog labels use «».

Controls are at least 44px tall. Inputs are at least 16px. The header locale control reuses `.segment` with the `.locale` modifier so «Русский | Қазақша» stays on one line beside the brand. Pressed controls scale to 0.97 for 100ms. Hover styles apply only for a fine pointer.

## Motion

`StoryStudio` swaps the form and the stream on a horizontal axis: spring `{ type: "spring", bounce: 0, duration: 0.4 }`, enter `x: direction * 24`, exit `x: direction * -24`. Submit uses direction 1, «Параметры» uses -1. `AnimatePresence` is `mode="popLayout"` with `initial={false}`. Reduced motion is a 0.2s opacity fade, and `MotionConfig` is `reducedMotion="user"`. The scroll-top button fades opacity in 160ms and does not travel. `overflow-x: clip` stays on the body.
