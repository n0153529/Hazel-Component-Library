# Hazel Component Library v4

Source of truth for Hazel's UI, rebuilt to match the Figma Make "Create an Offer"
redesign (Sept 2026). Plain HTML/CSS by design, this is a style and pattern
reference to build the real React/TypeScript components against, not a framework.

## Files

- `styles.css` - all design tokens and component CSS. Start here.
- `index.html` - landing page: hero, brand identity and logo lockups.
- `components.html` - full catalog of every component, including the
  functional UI tokens and typography scale.
- `create-offer.html` - the actual 5-step "Create an Offer" wizard, rebuilt
  interactively (vanilla JS) to match the Figma screens. Every row, toggle,
  and dropdown on this page is genuinely wired up, not a static mockup - see
  below.
- `dashboard.html` - existing dashboard layout, carried over from v3.
- `workflow.html` - old generic wizard example from v3, superseded.
- `assets/hazel-logo-cream.png` - the cream logomark.

## This pass: aligned against the real Figma Make source code

You attached the actual exported project (`src/App.tsx` + `src/index.css`),
which is a step up from working off screenshots: it has exact hex values,
exact hover states, and the real component logic. Went through it in detail
and corrected several things that screenshot-measuring couldn't have caught.

**Step 1 is now genuinely interactive.** Every row (Care experienced people,
Foster carer, Kinship carer, and so on) is a real toggle, not just the first
one. "Care experienced" is its own on/off switch; the other member types are
an independent multi-select, matching the source's `Set<string>` behaviour
exactly. The summary chips at the bottom update live and each has a working
remove button. I tested this with a headless DOM (not just visually) to
confirm clicking actually toggles state, adds/removes the right chips, and
that multiple rows can be selected at once.

**Corrected a button-radius decision from an earlier round.** An earlier
instruction made all buttons pill-shaped. The real source shows only
"Continue" and "Preview & Publish" are pill (`border-radius: 100px`
explicitly in the code) - "Save as template", "Browse Files", and every other
secondary button use the standard 6px radius. Fixed `.btn` back to 6px by
default, with `.btn-pill` as a real (not no-op) modifier reserved for those
two step-navigation actions.

**"Create a category" / "Create Tags" now match your reference image exactly**
- dashed border, 6px radius, muted-foreground text, with the precise icon
paths from the source. New `.btn-dashed` utility class for this pattern.

**Hover states added using the source's exact colour**, not a guess:
`hover:border-muted-foreground` resolves to `#5a7a82`, now `--border-hover`
in the token set. Applied to select-rows, nav-rows, tag pills, option cards,
and the Yes/No segmented buttons.

**Full token correction against the real values:**

| Token | Old (approximated) | New (exact, from source) |
|---|---|---|
| `--border` | `#e3e6e0` | `#ccdde0` |
| `--muted` | `#5b6b6e` | `#5a7a82` |
| `--radius-sm` | `6px` | `4px` |
| `--radius-md` | `6px` | `6px` (unchanged) |
| `--radius-lg` / `--radius-xl` | `6px` | `8px` |
| `--success` / `--success-border` | `#059669` / `#a7e8cf` | `#047857` / `#34d399` (Tailwind emerald-700/400, as used in source) |
| `--danger` / `--danger-border` | `#dc2626` / `#f5c6c6` | `#b91c1c` / `#f87171` (Tailwind red-700/400) |
| stepper ring colour | translucent primary | `#ccfbf1` solid (Tailwind teal-100, exact) |
| stepper line width | `32px` | `30px` (exact) |
| monospace font | system stack | `'DM Mono'` (exact, now imported) |

Also rebuilt the eligibility question card to match the source's actual
structure: a subtle tinted header bar (icon + title + badge) with a
border-bottom, separate from the body below, rather than everything sitting
in one flat padded block.

**Caught and fixed a bug during testing, not before shipping it.** My first
pass at the eligibility card restructuring renamed its wrapper class, which
silently broke the "Includes" accordion's ability to find its own detail
panel. I only caught this because I ran an automated interaction test
afterward rather than trusting the visual render - worth knowing the caveat
that a screenshot alone would have looked fine while the click did nothing.
Fixed and re-verified.

**Benefits and Categories brought up to the same standard.** These two
weren't explicitly flagged this round, but since the real source was
available, checking them too was worth doing:

- Benefits was silently showing items in the wrong order. It had been built
  as two manually-split columns (first 11 items in column one, last 10 in
  column two), but the source renders a flat list through a real 2-column
  CSS grid, which fills left-to-right, top-to-bottom (row 0: item 0 + item 1,
  row 1: item 2 + item 3, and so on). Rebuilt using the same flat item list
  in source order, split by even/odd index into two columns - this produces
  the exact same reading order as a real grid without depending on grid
  support in whatever's rendering it. Also made genuinely clickable, with
  working Select all / Clear all (tested: selecting one item shows 3/21,
  Select all shows 21/21).
- Categories now shows a real per-category info tooltip pulled from the
  source's actual copy (e.g. "Support finding and maintaining a safe, stable
  home." for Housing & Accommodation) instead of a generic placeholder
  string. Categories are genuinely multi-selectable, and selecting more than
  one category now shows a tags subpanel for each one that has tags defined,
  matching the source's behaviour, with the real tag lists pulled from its
  `CATEGORY_TAGS` map rather than only ever showing Housing's tags.

## Latest pass: interactivity fixes and a few real bugs

You asked for a set of specific fixes across Steps 2, 3, 4, and 5. All of
them are implemented and, as with the previous pass, verified by actually
dispatching click events against the page rather than just re-rendering it
as an image (24 automated checks, all passing - see below).

**Step 2 - Care status qualifier now has real checkboxes.** All three
options (Relevant, Former relevant, Qualifying) are independently
toggleable, not just the first one.

**Step 2 - Yes/No buttons are fully functional and deselected by default.**
Clicking Yes shows an "Allowed" badge, clicking No shows "N/A", and clicking
the same option again deselects it. The "Care experienced people X/3" counter
at the top starts at 0/3 and updates live as each of the three questions
gets answered, turning to a success-green badge once it reaches 3/3.

**Step 3 - Start Date alignment fixed.** The root cause: the two-column row
uses flexbox, and flexbox's default `align-items: stretch` was making both
columns the same height (matching whichever one had more content - End Date,
because of its extra checkbox line), which then left Start Date's shorter
content looking vertically centered rather than top-aligned. Fixed by adding
`align-items: flex-start` to the `.cols-2/3/4` utilities.

**Step 3 - Offer Access Route disabled cards and their badges.** This turned
out to be a genuine bug rather than a style tweak: the disabled cards
("Direct", "Referral", "Redeem") and their "Soon" badges were using the exact
same background colour, so the badge was invisible against its own card -
there was no chip there at all, just plain text. Fixed by giving disabled
cards a distinct neutral grey (`--surface-disabled`, not teal-tinted like the
rest of the palette) and giving both "Soon" and "Active" a proper border, so
they now read as pills consistent with "Allowed" / "N/A" elsewhere.

**Step 4 - "X / 21 selected" no longer wraps.** The pill could shrink under
flex pressure and its text would wrap to two lines inside a fixed-height
chip. Fixed with `white-space: nowrap` and `flex: none` on `.pill-counter`.

**Step 5 - "Share offer with local council" now works.** Deselected by
default; clicking Yes enables the "Search for a local authority" field below
it (and visually un-dims it), clicking No or clicking Yes again disables it.

**A bug caught by testing, not by looking at it.** My first version of the
Step 2 counter used `Object.values()`, which is fine in every real browser
but isn't supported by the ancient JS engine in the one screenshot tool I use
for visual checks - it silently halted the script partway through and
produced a truncated, mostly-blank render. Simplified to avoid `Object.values`
entirely (a one-line change), which fixed my ability to verify it visually.
Worth knowing this class of bug exists: a broken script can sometimes still
produce *a* render, just not the right one, so a screenshot alone isn't proof
a step works.

## How this was actually tested

Every interactive claim in this document was verified by loading the file in
a headless DOM (jsdom) and dispatching real click events, not just
re-rendering it as an image and eyeballing the result. This pass added 15
new checks on top of the previous 9 (24 total, all passing): the qualifier
checkboxes toggle independently; Yes/No buttons show the right badge and
toggle off on a second click; the 0/3 to 3/3 counter updates correctly at
every step including going back down when an answer is deselected; the
council search input is disabled by default and becomes enabled exactly when
Yes is clicked. This is also how the `Object.values()` bug above was found -
a visual-only check would have shown a broken-looking render without
explaining why.

## Earlier passes (for reference)

- Border radius brought down from an airy 12-28px scale to the tight 4/6/8px
  scale used throughout this pass (now confirmed exact against source).
- Brand identity tokens (`--brand-dark-green`, `--brand-light-green`,
  `--brand-dark-grey`) plus logo lockups on the overview page.
- No text smaller than 14px anywhere.
- Component library's own top nav uses the brand dark green with the logo.
- Responsive table pattern previewed on desktop and in a phone-frame mockup.
- Every em dash in the project replaced with a plain hyphen.
- Info icons are real hover tooltips; "Includes" is a real accordion.

## Recommended next step

All five steps have now had a line-by-line pass against the real
`App.tsx` (Who, Eligibility, Details, Benefits, Categories). The remaining
gap is the "Local authority" search inside the council-sharing panel - the
source has a real dataset (`LOCAL_AUTHORITIES`, five English regions with
their councils) and filtering behaviour behind that search box, which this
library currently renders as a static input. Worth wiring up if that panel
becomes a priority.

The pattern names map cleanly to React components: `<Stepper>`, `<SelectRow>`,
`<NavRow>`, `<OptionCard>`, `<SegmentedToggle>`, `<TagPill>`, `<Chip>`,
`<PanelDark>`, `<Dropzone>`, `<RichTextEditor>`, `<ResponsiveTable>`,
`<IncludesAccordion>`, `<InfoTooltip>`, `<EligibilityCard>`. Suggest porting
one at a time, using `create-offer.html` as the reference and `styles.css`
custom properties as the token source.
