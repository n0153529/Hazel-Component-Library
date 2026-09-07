# Hazel Component Library v4

Source of truth for Hazel's UI, rebuilt to match the Figma Make "Create an Offer"
redesign (Sept 2026). Plain HTML/CSS by design, this is a style and pattern
reference to build the real React/TypeScript components against, not a framework.

## Files

- `styles.css` - all design tokens and component CSS. Start here.
- `index.html` - landing page: hero, brand identity and logo lockups, and links
  into the rest of the library.
- `components.html` - full catalog of every component, including the
  functional UI tokens and typography scale (moved here from the overview
  page in this pass).
- `create-offer.html` - the actual 5-step "Create an Offer" wizard, rebuilt
  interactively (vanilla JS step-switching) to match the Figma screens.
- `dashboard.html` - existing dashboard layout, carried over from v3, has its
  own self-contained header for the demo product ("Offer Studio").
- `workflow.html` - old generic wizard example from v3, superseded by
  `create-offer.html`.
- `assets/hazel-logo-cream.png` - the cream logomark, for use on dark surfaces.

## This pass: precision pixel-matching against new Figma screenshots

You flagged that the library's corners were too round, the stepper lines too
wide, and the Details step didn't match. Re-measured directly off the pixels
in the two new screenshots (not eyeballed) and found:

**Border radius was too large everywhere.** Measured the actual corner
curvature in the screenshots: the outer wizard card is ~8px, everything else
(rows, subpanels, option cards, badges, modals, menus) is ~6px. `--radius-sm`,
`--radius-md`, and `--radius-lg` are now all `6px`, `--radius-xl` is `8px`.
Went through every hardcoded pixel radius in `styles.css` individually (17 of
them) rather than just the tokens, so nothing was left on the old 12-28px
scale. Genuinely circular elements (avatars, switches, pill badges, the
segmented toggle) were left alone.

**Stepper was stretched full-width; Figma's is compact.** The connecting
lines were using `flex:1`, so they stretched to fill whatever space was
available, making the whole stepper spread across the full card width. Measured
the actual line length in the screenshot (~32px, fixed) and rebuilt it as a
fixed-width, left-aligned row instead. Also added the soft mint glow ring
around the active step's circle, which was in the Figma design but missing
from the rebuild entirely.

**"Includes" is now a real accordion, not a static link.** The screenshot
showed it expands to reveal a detail panel with a left border accent, and the
chevron flips direction. Rebuilt with a `toggleIncludes()` function so it
actually opens and closes, matching the collapsed and expanded states shown
in your screenshot exactly (including reusing the row's own description text
in the expanded panel, which is what the Figma design does).

**Info icons are now real tooltips.** The category rows, "Offer Access
Route" label, and "share with council" panel all had static, non-functional
"i" icons. They now use a proper hover/focus tooltip (`.info-tip`), consistent
with the rest of the library's tooltip component.

**Start Date field was oversized and misaligned.** Root cause: inputs were
using `min-height: 44px` with no explicit `height`, which let native date
inputs grow taller than a normal text field in some browsers. Inputs and
selects now use a fixed `height: 44px` with `box-sizing: border-box`, and
date/time inputs get an explicit `line-height: normal` to stop that growth.
Re-verified the Details step's Start Date / End Date row renders as two
equal, aligned fields.

**Details step re-checked element by element** against your new screenshot.
Structure, spacing, and copy all line up; the two differences you'll see if
previewing with an old screenshot tool (a blank date field with no calendar
icon, and a "+" instead of a sparkle on "Generate Image with Hazel AI") are
both rendering limitations of that specific tool, not the underlying code.
Native `type="date"` inputs and the `✦` sparkle character both render
correctly in real browsers.

**Overview page decluttered.** Removed the "Typography scale" section
entirely (per your request) and moved "Functional UI tokens" into
`components.html`, right above the Typography section that already lived
there. The overview page is now just the hero, the brand identity and logo
section, and the three links into the rest of the library.

## A note on what I couldn't verify directly

The live Figma Make site blocks automated fetching, so this pass (like the
last one) was done by pixel-measuring the screenshots you attached rather
than inspecting the site or exported code directly. If you do have a Figma
code export, attaching it would let me check things like exact spacing values
and font weights more precisely than measuring screenshot pixels. If
anything still looks off after this pass, telling me which step and what
specifically looks wrong (with a fresh screenshot if possible) is the fastest
way for me to close the gap.

## Earlier passes (for reference)

- All standard buttons are fully pill-shaped (`border-radius: var(--radius-pill)`).
- Brand identity tokens (`--brand-dark-green`, `--brand-light-green`,
  `--brand-dark-grey`) plus logo lockups on the overview page.
- No text smaller than 14px anywhere (`--text-xs` / `--text-sm` both 14px,
  `--text-md` / `--text-lg` both 16px).
- Component library's own top nav (`index.html`, `components.html`) uses the
  brand dark green with the logo top-left.
- Responsive table pattern (`.table-wrap` + `data-label`) previewed on
  desktop and inside a phone-frame mockup in `components.html`.
- Every em dash in the project replaced with a plain hyphen; none should be
  reintroduced going forward.
- The wizard's two/three/four-column sections use flexbox (`.cols-2/3/4`)
  rather than CSS Grid, specifically to avoid any rendering ambiguity in
  older tools; general-purpose layout elsewhere still uses `.grid`.

## Recommended next step

The pattern names map cleanly to React components: `<Stepper>`, `<SelectRow>`,
`<NavRow>`, `<OptionCard>`, `<SegmentedToggle>`, `<TagPill>`, `<Chip>`,
`<PanelDark>`, `<Dropzone>`, `<RichTextEditor>`, `<ResponsiveTable>`,
`<IncludesAccordion>`, `<InfoTooltip>`. Suggest porting one at a time,
starting with whatever the backend dev's retrofit of "Create an Offer" is
currently missing, using `create-offer.html` as the pixel reference and
`styles.css` custom properties as the token source.
