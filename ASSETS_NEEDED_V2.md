# Assets Needed (V2 — post V10 rebuild)

Every real photograph/video the site is still waiting on. Nothing here was
guessed with stock imagery — each slot currently renders a deliberate,
art-directed placeholder (gradient/texture/typography treatment) tagged in
code with a `data-asset="<id>"` attribute matching the ID below, so the
real file can be dropped in later without touching layout code.

**What changed since V1:** nothing on the asset list itself. The V10 rebuild
(Hero repositioning, the AI/WhatsApp chat interface, the Process/Method
sequence, and the final brand moment + footer) touched typography, 3D
composition, and UI systems only — none of it introduced or removed a
photography slot. All five placeholders below are unchanged and still
accurate; `method-human-moment-01` in particular kept its exact ID, aspect
ratio, and intent through the Method section's full rebuild.

---

### 01 — `lab-luxury-01`

1. **File name:** `lab-luxury-01.webp`
2. **Section:** Digital Lab — "Luxury" world (hospitality / real estate / premium brands)
3. **Purpose:** The full-bleed image standing in for that world's visual identity as the user scrolls into it
4. **Aspect ratio:** ≈ 4:5 portrait (desktop panel) — same source works cropped to ≈ 3:1 for the mobile band
5. **Desktop resolution:** 1400×1750px
6. **Mobile resolution:** 1200×400px crop (same source, wider crop)
7. **What must appear:** An editorial hospitality/real-estate interior or a premium product detail shot — warm limestone tones, unhurried
8. **Subject position:** Centered or slightly right-weighted — the panel is cropped by an angled edge on desktop (`clip-path` polygon), so keep the subject clear of the far-left 15%
9. **Empty space for text:** None needed — no text sits on this image; the copy lives in a separate column
10. **Lighting:** Soft, warm, editorial — low contrast, golden-hour or warm studio light
11. **Color palette:** Warm limestone / champagne gold (`#e0c477` accent, `#0d0c0a` shadow)
12. **Camera/lens feel:** Medium-format editorial stillness, shallow depth of field, no wide-angle distortion
13. **Motion version needed?** No
14. **Generation prompt:** "Editorial architectural photograph of a luxury hospitality interior, warm limestone and brushed gold tones, soft directional light, shallow depth of field, minimal composition, premium real estate / hospitality brand campaign, no people, 4:5 portrait crop"

---

### 02 — `lab-energy-01`

1. **File name:** `lab-energy-01.webp`
2. **Section:** Digital Lab — "Energy" world (commerce / performance / culture)
3. **Purpose:** Full-bleed image for the high-contrast, fast-motion world
4. **Aspect ratio:** ≈ 4:5 portrait (desktop), ≈ 3:1 crop (mobile)
5. **Desktop resolution:** 1400×1750px
6. **Mobile resolution:** 1200×400px crop
7. **What must appear:** Commerce/culture/performance energy — motion, contrast, immediacy (product in motion, culture/fitness/automotive context)
8. **Subject position:** Centered, tolerant of an angled left-edge crop on desktop
9. **Empty space for text:** None — no overlaid text
10. **Lighting:** High contrast, hard directional light or flash-lit
11. **Color palette:** Near-black to warm white with a `#c59a45` gold accent — high contrast, not multicolor
12. **Camera/lens feel:** Fast shutter, slight motion blur acceptable, dynamic angle
13. **Motion version needed?** No (a short seamless-loop clip is a reasonable future upgrade but not required now)
14. **Generation prompt:** "High-contrast editorial photograph capturing motion and energy — commerce or performance culture, fast dynamic composition, hard directional light, near-black background with warm gold highlight, no people's faces prominent, 4:5 portrait crop"

---

### 03 — `lab-precision-01`

1. **File name:** `lab-precision-01.webp`
2. **Section:** Digital Lab — "Precision" world (health / services / technology)
3. **Purpose:** Full-bleed image for the minimal, clinical-but-premium world
4. **Aspect ratio:** ≈ 4:5 portrait (desktop), ≈ 3:1 crop (mobile)
5. **Desktop resolution:** 1400×1750px
6. **Mobile resolution:** 1200×400px crop
7. **What must appear:** Health/services/technology context — clean lines, precision, minimal clutter
8. **Subject position:** Centered, aligned to an implied grid
9. **Empty space for text:** None — no overlaid text
10. **Lighting:** Bright, even, clinical-clean — soft shadows only
11. **Color palette:** White/silver/light graphite (`#ffffff` → `#b8b5ac`)
12. **Camera/lens feel:** Sharp, architectural, straight-on or slight top-down angle
13. **Motion version needed?** No
14. **Generation prompt:** "Minimal clean photograph representing precision and technology — white and silver tones, architectural grid alignment, bright even lighting, clinical but premium feel, no clutter, 4:5 portrait crop"

---

### 04 — `method-human-moment-01`

1. **File name:** `method-human-moment-01.webp`
2. **Section:** Process/Method — the closing "technology should feel human" beat, at the end of the new 7-stage horizontal sequence
3. **Purpose:** A real, human moment behind the process — not a diagram, a person
4. **Aspect ratio:** ≈ 6:7 portrait (desktop), ≈ 16:9 crop (mobile band)
5. **Desktop resolution:** 1140×1320px
6. **Mobile resolution:** 1000×560px crop
7. **What must appear:** Hands sketching, real creative material on a desk, or an architectural/creative workspace — a genuine working moment. Explicitly **not** a stock "handshake" or "meeting room" photo
8. **Subject position:** Off-center, roughly rule-of-thirds — leave the opposite third relatively calm/uncluttered
9. **Empty space for text:** None needed — the headline sits beside the image, not over it
10. **Lighting:** Natural window light, warm, unforced
11. **Color palette:** Warm neutrals — now sits on the section's dark graphite background rather than a light one (V10 corrected a dark-text-on-dark-background bug in this closing beat), so the image itself should still read warm/light against that dark frame
12. **Camera/lens feel:** Documentary/editorial, shallow depth of field, candid rather than posed
13. **Motion version needed?** No
14. **Generation prompt:** "Candid documentary-style photograph of hands sketching on paper next to creative material on a studio desk, natural warm window light, shallow depth of field, editorial and authentic, not corporate stock photography, 6:7 portrait crop"

---

### 05 — `web-editorial-01`

1. **File name:** `web-editorial-01.webp`
2. **Section:** Expertise / Web Expansion (the "ACCIÓN." state of the Attention → Interés → Acción sequence)
3. **Purpose:** The large editorial image panel demonstrating a real web/landing-page composition
4. **Aspect ratio:** ≈ 3:4 portrait (desktop right-hand panel), ≈ 4:5 crop (mobile band)
5. **Desktop resolution:** 1300×1730px
6. **Mobile resolution:** 1000×1250px crop
7. **What must appear:** A real, premium web/landing-page composition — editorial layout, typography-forward, not a literal browser screenshot
8. **Subject position:** Fills the frame; the panel is intersected by a diagonal gold plane entering from the upper right, so keep the main subject weighted toward the lower-left two-thirds
9. **Empty space for text:** None on the image itself — the small `Web Editorial — 01` label sits in the lower-left corner at low opacity, needs a slightly darker area there to stay legible
10. **Lighting:** Bright, warm-white, editorial studio lighting
11. **Color palette:** Champagne gold → graphite gradient, matching the site's signature palette
12. **Camera/lens feel:** Clean flat-lay or screen-composition photography, not a 3D device mockup
13. **Motion version needed?** No
14. **Generation prompt:** "Editorial flat-lay composition of a premium website/landing-page layout — bold typography, champagne gold and graphite color field, clean grid, warm studio lighting, no browser chrome or device frame, 3:4 portrait crop"
15. **Still pending a richness pass:** this scene (V10 §03/§20, "Web Experience richness pass") is flagged for more floating UI-fragment detail around this image — the image spec itself doesn't change, but expect more small annotated elements nearby once that pass lands.

---

## Notes

- All five slots are read from `data-asset` attributes already present in the
  relevant components (`ExpertiseNarrative.tsx`, `DigitalLabNarrative.tsx`,
  `MethodNarrative.tsx`) and from filename constants in `lib/content/lab.ts`
  and `lib/content/method.ts` — swap the placeholder `background` styles for
  a real `<Image>`/`<img>` once files exist, no other code changes needed.
- WebP suggested for delivery weight; any high-resolution source works for
  commissioning/generation and can be converted at build time.
- No other section needs new photography. Hero, Intelligence (the WhatsApp
  AI chat), Process/Method's main sequence, the final brand moment, and the
  footer are all typographic/3D/UI-system compositions by design — the AI
  section's phone/chat interface and the Process section's fragment/
  interface/chat-bubble visuals are original, code-drawn, and not photography
  placeholders.
