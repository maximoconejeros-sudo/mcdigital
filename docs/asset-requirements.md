# MC Digital — Image Asset Requirements

The site currently ships with tasteful gradient placeholders wherever real
photography is needed — no stock photography and no invented imagery was
used, per the brief. This document lists every real image slot still
pending, so they can be commissioned/sourced and dropped in without
touching any component code (each filename below is the exact name the
code already expects, in `lib/content/lab.ts` and `lib/content/method.ts`).

| # | Filename | Section | Desktop / Mobile | Aspect ratio | Suggested resolution | Description | Type |
|---|----------|---------|-------------------|--------------|------------------------|--------------|------|
| 1 | `lab-luxury-01.webp` | Digital Lab — "Luxury" world (hospitality / real estate / premium brands) | Both (desktop: tall right-hand panel; mobile: full-width band) | Desktop ≈ 4:5 portrait · Mobile ≈ 3:1 wide band | 1400×1750px (desktop crop source) | Editorial, elegant, low-contrast warm tones — a hospitality/real-estate interior or premium product detail shot. Should read as unhurried and refined, matching the copy "Elegancia editorial, sin prisa." | Image (static) |
| 2 | `lab-energy-01.webp` | Digital Lab — "Energy" world (commerce / performance / culture) | Both (desktop: tall right-hand panel; mobile: full-width band) | Desktop ≈ 4:5 portrait · Mobile ≈ 3:1 wide band | 1400×1750px (desktop crop source) | High-contrast, fast-motion energy — commerce/culture/performance context. Should read as immediate and kinetic, matching "Contraste alto, movimiento rápido." | Image (static; a short seamless-loop video is a reasonable upgrade later if available) |
| 3 | `lab-precision-01.webp` | Digital Lab — "Precision" world (health / services / technology) | Both (desktop: tall right-hand panel; mobile: full-width band) | Desktop ≈ 4:5 portrait · Mobile ≈ 3:1 wide band | 1400×1750px (desktop crop source) | Minimal, exact, light — health/services/technology context on a light background. Should read as clean and precise, matching "Mínimo, claro, exacto." | Image (static) |
| 4 | `method-human-moment-01.webp` | Method — closing "Technology should feel human" beat | Both (desktop: 380×440px panel; mobile: 70vw × 32vh band) | ≈ 6:7 portrait (desktop) | 1140×1320px (desktop crop source) | A real, human moment behind the work — people in conversation, a team/client interaction, not a stock "meeting room" photo. Supports the copy "Por eso cada proyecto empieza entendiendo a las personas detrás del negocio." | Image (static) |

## Notes

- All four slots are read from the content files as plain filenames
  (`imageSlot` in `lib/content/lab.ts`, a comment-documented constant in
  `lib/content/method.ts`) — they are not yet wired to actual `<img>`/`next/image`
  elements, since no real files exist. Once assets are supplied, each
  gradient placeholder (`.worldImage` background in
  `DigitalLabNarrative.module.css`, `.humanImage` background in
  `MethodNarrative.module.css`) should be swapped for the real image.
- WebP is suggested for delivery weight; any high-resolution source format
  works for commissioning and can be converted at build time.
- No other section requires new photography — Hero, Expertise, Intelligence,
  Why It Matters, and Contact are typographic/3D/gradient compositions by
  design, not photography-driven.
