# Hazel Component Library v4

Source of truth for Hazel's UI, rebuilt to match the Figma Make "Create an Offer"
redesign (Sept 2026). Plain HTML/CSS by design, this is a style and pattern
reference to build the real React/TypeScript components against, not a framework.

## Files

- `styles.css` - all design tokens and component CSS. Start here.
- `index.html` - landing page and overview, including the brand and token showcase.
- `components.html` - full catalog of every component with markup examples.
- `create-offer.html` - the actual 5-step "Create an Offer" wizard, rebuilt
  interactively (vanilla JS step-switching) to match the Figma screens.
  This is the best single file to compare directly against the Figma export.
- `dashboard.html` - existing dashboard layout, carried over from v3 (inherits
  the new v4 tokens automatically since it uses the same CSS variables). Has
  its own self-contained sidebar header for the demo product ("Offer Studio")
  rather than the shared library topbar, so it wasn't touched by the topbar
  rebrand below.
- `workflow.html` - the old generic wizard example from v3, superseded by
  `create-offer.html`, kept only as a minimal wizard-shell reference.
- `assets/hazel-logo-cream.png` - the cream logomark, for use on dark surfaces.

## This pass: fixed a real layout bug, plus four requested changes

**Found and fixed a genuine bug in the Create an Offer rebuild.** Re-checking
against the Figma screenshots turned up a real issue: the two-column sections
(Age eligibility / Care status qualifier in Eligibility, the Offer Access
Route cards in Details, and the two-column checklist in Benefits) were built
with CSS Grid, which is correct per spec but rendered unreliably with complex
nested content in at least one tool. Rather than leave any doubt, those
specific sections were switched to a small flexbox utility (`.cols-2`,
`.cols-3`, `.cols-4` in `styles.css`) which lays out identically but has no
edge cases with nested content. Re-verified and all three sections now sit
correctly side-by-side. I couldn't fetch the live Figma Make site directly
(it blocks automated access), so this check was done against the screenshots
already shared; if anything on the live site still looks off, point me at the
specific step and I'll target it directly.

**"Core tokens" section rebuilt to actually explain itself.** It was a grid
of KPI-style boxes with just a label and a hex code, not obviously a colour
reference. It's now a proper swatch grid ("Functional UI tokens"), each one
showing the actual colour, its name, its hex value, and a one-line note on
where it's used in the interface (for example, Selected background: "Behind
a selected row, tag or option").

**No text smaller than 14px anywhere.** `--text-xs` and `--text-sm` both moved
up to 14px (previously 12px and 13px), and every hardcoded sub-14px
`font-size` declaration across all five files (badges, table headers,
avatars, tooltips, sidebar labels, kpi labels, and so on) was replaced with
the token so nothing falls below the floor. `--text-xs` and `--text-sm` are
now equal; they're kept as separate tokens in case you want to reintroduce a
distinction later, but neither should go below 14px again.

**Component library's own top nav is now on-brand.** `.topbar` (used by
`index.html` and `components.html`, the documentation shell, not the in-app
wizard) now uses the dark green brand colour with your logo in the top left,
replacing the placeholder gradient square. Nav links were recoloured for
contrast on the dark background. This does not touch `.wizard-topbar`, which
is deliberately still white to match the actual product screen in Figma, or
`dashboard.html`'s own sidebar header, which represents a different mock
product ("Offer Studio") rather than the library's own chrome, flag it if you
want that changed too.

## Earlier pass: buttons, brand, type scale, responsive tables

**Buttons are fully pill-shaped by default.** `.btn` and its `-sm` / `-lg`
sizes all use `border-radius: var(--radius-pill)`. `.btn-pill` still exists
as a harmless no-op alias. Icon-only utility buttons (menu items, pagination
numbers, toolbar icons) were left as rounded squares since they aren't really
"buttons" in the same sense, flag it if you want those pill-shaped too.

**Brand identity section on `index.html`.** Three named tokens document
Hazel's brand colours, distinct from the functional UI tokens (which happen
to reuse two of the same hex values inside the product interface):

| Token | Value | Note |
|---|---|---|
| `--brand-dark-green` | `#104751` | same value as `--text-strong` / `--panel-dark`, named separately for brand use |
| `--brand-light-green` | `#078c9e` | same value as `--primary`, named separately for brand use |
| `--brand-dark-grey` | `#151719` | not previously in the palette |

The overview page shows all three as swatches, plus the logo on dark green,
dark grey, and a brand gradient, since it's a cream mark and needs a dark
surface. Don't place it on white or light backgrounds.

**Body text is 16px by default.** `--text-md` is `16px` (matching
`--text-lg`), and `html, body` sets `font-size: 16px` explicitly.

**Responsive table pattern.** `.table-wrap` includes a
`@media (max-width: 640px)` rule that turns table rows into stacked
label/value cards on small screens, reading each cell's `data-label`
attribute for the row heading. `components.html` previews this inside a
phone-frame mockup (`.table-wrap.force-mobile`) so you can see the mobile
layout without resizing the browser; that class is a demo aid only, the real
product should rely on the media query and just resize.

## Em dashes

Every em dash in the project was replaced with a plain hyphen, including
inside literal Figma-sourced copy strings. None should be reintroduced going
forward, in code, comments, or copy.

## A note on nested CSS Grid

`grid-template-columns` is standard and works correctly in every modern
browser. If a layout ever looks collapsed to a single column in an automated
screenshot or an old headless tool, that's a renderer limitation, not a CSS
bug, but as of this pass the wizard's own two/three/four-column sections use
the flexbox `.cols-N` utilities instead specifically to remove that doubt.
General-purpose layout elsewhere (`components.html`, `dashboard.html`) still
uses the standard `.grid` utility, which is appropriate for the real product.

## Recommended next step

The pattern names map cleanly to React components: `<Stepper>`, `<SelectRow>`,
`<NavRow>`, `<OptionCard>`, `<SegmentedToggle>`, `<TagPill>`, `<Chip>`,
`<PanelDark>`, `<Dropzone>`, `<RichTextEditor>`, `<ResponsiveTable>`. Suggest
porting one at a time, starting with whatever the backend dev's retrofit of
"Create an Offer" is currently missing, using `create-offer.html` as the
pixel reference and `styles.css` custom properties as the token source.

Still to design or spec when needed: date picker popover, multi-select
combobox, inline validation summary, and a mobile nav drawer; none of these
appeared in the Create an Offer screens yet, so they're left out rather than
guessed at.
