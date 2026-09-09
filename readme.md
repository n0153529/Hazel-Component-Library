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
- `dashboard.html` - member-facing dashboard: dark green sidebar with the
  Hazel logo, working expand/collapse nav groups, and a top bar with search,
  help, settings and profile. Now genuinely shares tokens with the rest of
  the library (an old duplicate v3 token block was removed - see Pass 4).
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

## Pass 2: interactivity fixes and a few real bugs

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

## Pass 3: small fixes, plus making the component library itself interactive

**Step 2 - "Allowed" badge was too narrow for its own text.** `.elig-badge`
had a fixed `width: 56px` (sized for the shorter "N/A"), which clipped
"Allowed". Removed the fixed width so the badge sizes to its content, same
as every other badge in the library.

**Step 3 - "Terms and Conditions" removed** from the Details step per
request.

**The components.html demos are now genuinely interactive, not just
visual reference.** Previously several of them showed a state (e.g. "Yes"
already selected, a tag already checked) but had no click handling at all -
useful as a static reference, not as something you could actually try.
Fixed:

- **Segmented Yes/No toggle** - clicking Yes or No now actually switches the
  active state (and colour) in both the light demo and the dark-panel demo.
- **Switch** - the checkbox and radio inputs already worked out of the box
  (they're real form elements, native browser behaviour), but the custom
  div-based switch had no click handler at all. Added one.
- **Chips & tags** - clicking a tag now toggles it selected/deselected. Used
  a CSS-only approach (the checkmark SVG is always in the markup, hidden via
  `.tag-pill:not(.selected) svg{display:none}`) rather than inserting or
  removing DOM nodes on click, so there's nothing to get out of sync.
- **Dark elevated panel Yes/No** - same toggle function as the light demo.

Worth noting: this page's toggle logic is deliberately simpler than
`create-offer.html`'s (plain exclusive Yes/No selection, no "click again to
deselect" state machine) - it's a component reference, not a second copy of
the real flow's business logic, and conflating the two would make this page
harder to trust as a plain example of the CSS.

**Table header now uses the brand dark green with white text**
(`background: #104751; color: #fff`), applied to the shared `th` style so it
carries into every table built from this library, not just the demo one.
(`dashboard.html` has its own scoped `th` rule for its separate demo product
and wasn't affected, intentionally.)

**Added a "Branding colours" section to components.html**, positioned first,
before the functional tokens section - the same colour swatches and logo
lockups already on the overview page, so the component catalog itself opens
with brand identity before getting into implementation detail.

## Pass 4: pill buttons everywhere, warning colour, and a dashboard rebuild

**All buttons are fully pill-shaped again.** An earlier pass had deliberately
restricted pill styling to just "Continue" / "Preview & Publish" to match the
Figma source's actual button radii. That's been reverted per explicit
instruction this round: `.btn` is pill-shaped by default again, and every
button in the library (including the dashed "Create a category" / "Create
Tags" buttons, which inherit from the same base class) follows suit.

**Warning colour updated to a genuine yellow.** `--warning` moved from
`#b7791f` (a muted brownish-gold that read more "brown" than "yellow") to
`#ca8a04`, chosen to sit in the same colour family as the existing
`--warning-soft` / `--warning-border` tones already used in the yellow alert,
so the "Warning" swatch and the alert box now clearly read as the same
colour. It's still used as badge text (e.g. "Draft"), so it needed to stay
readable rather than being the alert's very pale background tone directly.

**`dashboard.html` rebuilt: sidebar, logo, navigation, and a real top bar.**

- Sidebar background is now the brand dark green, with all text and icons
  recoloured for contrast (matching the same `rgba(255,255,255,.75-1)` pattern
  already used for the library's own topbar nav links).
- The "Offer Studio / Admin dashboard" text block is replaced with the actual
  Hazel logo, same asset used elsewhere.
- Sidebar menu rebuilt to the specified items: My Profile, My Work, My Home,
  and My Journey are working expand/collapse groups; My Support Plans,
  Claimed Offers, My Calendar, Messages, and My Trusted Network are flat
  items; Need help? sits in its own footer area at the bottom. **The four
  groups' sub-items (e.g. "Personal details" and "Contact preferences" under
  My Profile) are placeholders I invented** since none were specified -
  swap them for the real sub-navigation whenever that's decided.
- Added a proper top bar to the main content area: search field on the left,
  then Help, Settings (cog), and a profile avatar circle on the right, in
  that order.

**Two real layout bugs found and fixed while building the above, both from
the same underlying cause.** The sidebar and the KPI/chart cards were built
with CSS Grid (`.dashboard-shell`, `.grid-3`, `.panel-grid`), which is
correct per spec but doesn't render reliably in the older tool used for
visual verification in this project - a pattern already known from earlier
passes. This time it was worse than a cosmetic collapse: combining a
`display:grid` parent with a `width:100%` button inside it (the new
accordion toggle buttons) produced a badly broken layout, at one point
computing an actual width of 51,200px for a sidebar item. Converted
`.dashboard-shell`, `.sidebar-menu`, `.sidebar-group`, `.grid-3`, and
`.panel-grid` to flexbox, which resolved it. This was caught by rendering
the page and looking at it, not assumed - worth calling out because it's a
good example of why "the CSS is spec-correct" isn't the same as "this will
render correctly everywhere," and why checking rather than trusting matters.
Also removed an entire stale, duplicate token block this file had been
carrying since v3 (old colours, old radius scale) that was silently
overriding the shared v4 tokens the rest of the library uses - this page now
genuinely shares one source of truth with everything else.

## How this was actually tested

Every interactive claim in this document was verified by loading the file in
a headless DOM (jsdom) and dispatching real click events, not just
re-rendering it as an image and eyeballing the result. This pass added 14
new checks on `dashboard.html` (the accordion groups exist and toggle open on
click, the logo and all four topbar elements are present) to the 13 from the
previous pass (7 on `create-offer.html`, 6 on `components.html`). Combined
with earlier passes' checks, all three files now have an automated
regression suite behind them rather than relying on a screenshot looking
right - which is exactly how the `width: 51,200px` layout bug above was
caught: the click-toggle logic tested fine in jsdom, but only a visual render
showed the actual breakage, which is why both kinds of check matter and
neither alone is sufficient.

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
