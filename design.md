# Design System — Dimitrije & Jing

## Aesthetic Direction

Scandinavian editorial. Calm, confident, quietly luxurious. Wide margins, restrained typography, full-bleed photography, and a palette built on Cloud Dancer and Viva Magenta. No decorations. Let space do the work.

---

## Colour Palette

| Role | Name | Hex |
|---|---|---|
| Background | Cloud Dancer | `#F4F0EB` |
| Text | Deep Charcoal | `#1C1A17` |
| Accent | Viva Magenta | `#BB2649` |
| Accent hover | Viva Magenta Dark | `#9E1F3D` |
| Dark section bg | Deep Charcoal | `#1C1A17` |
| Dark section text | Cloud Dancer | `#F4F0EB` |

- Never use pure white `#FFFFFF` or pure black `#000000`
- Dark sections: `#1C1A17` background, `#F4F0EB` text, `#BB2649` accents

### Viva Magenta Usage Rules

Viva Magenta is HIGH IMPACT — use it sparingly. One element per section maximum (a button, a number, a hairline rule). Cloud Dancer and charcoal carry most of the page. Magenta should feel like a surprise, not wallpaper.

Valid uses: CTAs, hover states, countdown numbers, active nav links, key dividers.

---

## Typography

### Typefaces

- **Default (everything):** Cormorant Garamond — serif, elegant, airy
- **Body paragraphs (`p` only):** Open Sans — clean, readable, neutral

### Scale & Defaults

| Element | Font | Size | Weight | Tracking | Transform | Line-height |
|---|---|---|---|---|---|---|
| h1 (display) | Cormorant Garamond | 5xl–7xl | 300 | 0.2em | uppercase | 1.1 |
| h2 | Cormorant Garamond | 3xl–4xl | 400 | 0.15em | uppercase | 1.2 |
| h3 | Cormorant Garamond | 2xl | 400 | 0.08em | — | 1.3 |
| h4 | Cormorant Garamond | xl | 400 | 0.05em | — | 1.4 |
| `p` | Open Sans | lg | 300–400 | 0.08em | — | 1.75 |
| `small` | Cormorant Garamond | sm | 400 | 0.06em | — | — |
| `label` | Open Sans | base | 400 | 0.1em | uppercase | — |

- Display headings: tight line-height (1.1)
- Body: generous line-height (1.75)
- Type scale is large and confident — err toward bigger

---

## Layout

- **Hero:** Full-bleed photograph edge to edge. Couple's names centred in oversized serif, overlaid with a subtle dark vignette (gradient, no flat overlay).
- **Content sections:** Asymmetric 2-column grid — text left / image right, or large text offset to one side.
- **Vertical rhythm:** 120–160px padding between sections. Sections breathe.
- **Margins:** Wide. Content max-width ~1200px, with generous side gutters.

---

## Event Naming

There are three events: ceremony, reception, and party. The event key `party` is used in the database, API, and admin interface throughout. Display names differ by context:

| Context | Display name |
|---|---|
| Admin UI (contacts, RSVPs) | Party |
| Guest-facing RSVP page | After Dark Party |

The guest-facing name is intentionally playful and distinct. Do not change the key — `party` is the canonical identifier everywhere in code.

---

## Navigation

- Minimal top bar, transparent over the hero, opaque (Cloud Dancer) on scroll
- Couple's names or monogram on the left, page links on the right
- No borders, no background card, no box shadow
- Links: charcoal, underline on hover with a slow `0.4s` transition, active = Viva Magenta

---

## Motion & Interaction

- Sections **fade and slide up** gently on scroll — subtle entrance, not dramatic
- Nav links underline on hover: `transition: 0.4s`
- Countdown numbers: smooth fade or flip on tick
- No bouncing, no parallax, no flashy transitions
- Prefer `opacity` + `transform: translateY` for entrance animations

---

## Components

### 1. Hero
- Full-bleed photo, dark vignette at bottom
- Couple's names in oversized Cormorant Garamond, centred
- Wedding date below the names, small Open Sans, wide tracking
- Two CTAs: primary (Viva Magenta filled) and secondary (outline or text-only)

### 2. Countdown
- Live timer in large Cormorant Garamond numerals
- Label beneath each unit in small Open Sans uppercase
- Countdown numbers in Viva Magenta; labels in charcoal

### 3. Navigation
- Sticky, minimal, transitions from transparent to Cloud Dancer on scroll
- No borders or shadows — separation comes from background colour change only

### 4. Section Dividers
- Single hairline rule (`1px`, charcoal at low opacity) or a small typographic ornament
- No decorative flourishes, scrollwork, or clip art

---

## Do Not

- Use purple, blush pink, baby blue, or gold
- Use script or cursive fonts (Pacifico, Dancing Script, Great Vibes, etc.)
- Add drop shadows, card borders, or rounded corners
- Use pure white or pure black anywhere

---

## Accessibility

This site targets WCAG 2.1 Level AA.

### Contrast Ratios

| Combination | Ratio | Level |
|---|---|---|
| Deep Charcoal `#1C1A17` on Cloud Dancer `#F4F0EB` | 15.7 : 1 | ✓ AAA |
| Cloud Dancer `#F4F0EB` on Deep Charcoal `#1C1A17` | 15.7 : 1 | ✓ AAA |
| Viva Magenta `#BB2649` on Cloud Dancer `#F4F0EB` | 5.3 : 1 | ✓ AA |
| Viva Magenta `#BB2649` on Deep Charcoal `#1C1A17` | 3.0 : 1 | large text only |

### Opacity-Reduced Text — Design Minimum

**All visible text must use opacity > 0.75.** This is stricter than WCAG AA and is a deliberate design choice — lower opacities read as weak and undermine the editorial tone.

Opacity-reduced text is composited against the background before measuring contrast.

**On Cloud Dancer `#F4F0EB`:**

| Opacity | Effective ratio | Use for |
|---|---|---|
| 1.00 | 15.7 : 1 | Any text |
| 0.80 | ~9.1 : 1 | Secondary body text, supporting labels |
| 0.75 | ~8.0 : 1 | Minimum for any visible text ← hard floor |
| < 0.75 | < 8 : 1 | Decorative only — must be `aria-hidden` |

**On Deep Charcoal `#1C1A17`:**

| Opacity | Effective ratio | Use for |
|---|---|---|
| 1.00 | 15.7 : 1 | Any text |
| 0.80 | ~9.1 : 1 | Secondary body text, supporting labels |
| 0.75 | ~8.0 : 1 | Minimum for any visible text ← hard floor |
| < 0.75 | < 8 : 1 | Decorative only — must be `aria-hidden` |

### Decorative vs. Informational Text

**Decorative** — no contrast requirement, must carry `aria-hidden="true"`:
- Watermarks and ghost text (e.g. year behind hero)
- Section number labels (01 —, 02 —, 03 —)
- Masthead branding (D & J, year, city)
- Scroll indicator text and lines
- Ornamental Roman numerals (I, II, III)
- Photo placeholder captions

**Informational** — must meet AA contrast minimums above:
- All headings (`h1`–`h4`)
- Body copy and paragraphs
- Event details: dates, times, venues
- CTA button labels
- Navigation links

### Viva Magenta on Dark — Documented Exception

Countdown numbers (`#BB2649` on `#1C1A17` = 3.0:1) sit at large size (≥ 48px) and are decorative — the same information is present in the plain-text date/venue block below. This is an intentional design exception; the unit labels ("Days", "Hours", etc.) must meet contrast separately.

### Focus

- `:focus-visible` outline: `2px solid #BB2649`, `offset 4px`
- Never suppress the focus ring; use `:focus-visible` to avoid showing it on mouse click
- Focus order follows visual reading order (top → bottom, left → right)
- Skip-to-content link is the first focusable element on every page

### Motion

- All CSS animations and `scroll-reveal` transitions respect `prefers-reduced-motion: reduce`
- Under reduced motion: animations are instant; scroll-reveal elements appear immediately
- No animation runs longer than 1 second

### Semantic HTML

- One `<h1>` per page; `<h2>` for section titles; `<h3>` for sub-sections
- Every `<section>` carries `aria-label` or `aria-labelledby`
- The page root is `<main>`, not `<div>`
- A skip-to-content link (`#main-content`) is the first focusable element
- Uppercase is applied via CSS `text-transform`; source text is written in sentence case
- Decorative elements carry `aria-hidden="true"`

---

## Reference Feel

- kinfolk.com — warmth within minimalism
- augustinusfonden.dk — editorial restraint, whitespace, typography
