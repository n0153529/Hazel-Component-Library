# Hazel Component Library v4

Source of truth for Hazel's UI, rebuilt to match the Figma Make "Create an Offer"
redesign (Sept 2026) exactly. Plain HTML/CSS by design, this is a style and
pattern reference to build the real React/TypeScript components against, not
a framework.

## Files

- `styles.css` - all design tokens and component CSS. Start here.
- `index.html` - landing page / overview, including the brand showcase.
- `components.html` - full catalog of every component with markup examples.
- `create-offer.html` - the actual 5-step "Create an Offer" wizard, rebuilt
  interactively (vanilla JS step-switching) to match the Figma screens exactly.
  This is the best single file to compare directly against the Figma export.
- `dashboard.html` - existing dashboard layout, carried over from v3 (inherits
  the new v4 tokens automatically since it uses the same CSS variables).
- `workflow.html` - the old generic wizard example from v3. Superseded by
  `create-offer.html` for the actual offer flow, kept only as a minimal
  wizard-shell reference.
- `assets/hazel-logo-cream.png` - the cream logomark, for use on dark surfaces.

## Latest pass: buttons, brand, type scale, responsive tables

**Buttons are now fully pill-shaped by default.** `.btn` (and its `-sm` / `-lg`
sizes) all use `border-radius: var(--radius-pill)` out of the box. The old
`.btn-pill` modifier class still exists but is now a no-op, kept only so
nothing breaks if it's referenced somewhere. Icon-only utility buttons (menu
items, pagination numbers, toolbar icons) were left as rounded squares since
they aren't the "buttons" this request was about; flag it if you want those
pill-shaped too.

**Brand identity section added to `index.html`.** Three new named tokens
document Hazel's actual brand colours, separate from the functional UI tokens
(which happen to reuse two of the same hex values for the product interface):

| Token | Value | Note |
|---|---|---|
| `--brand-dark-green` | `#104751` | same value as `--text-strong` / `--panel-dark`, named separately for brand use |
| `--brand-light-green` | `#078c9e` | same value as `--primary`, named separately for brand use |
| `--brand-dark-grey` | `#151719` | new; not previously in the palette |

The overview page now shows all three as swatches, plus the logo lockup on
dark green, dark grey, and a brand gradient, since the logo is cream and needs
a dark surface to sit on. Don't place it on white or light backgrounds.

**Body text is now 16px by default.** `--text-md` moved from `14px` to `16px`
(matching `--text-lg`), and `html, body` sets `font-size: 16px` explicitly
rather than relying on the browser default. `.body`, buttons, inputs, and
most UI copy all read a size larger now. `--text-sm` (13px) and `--text-xs`
(12px) are unchanged, for genuinely secondary text like helper copy, captions,
and table headers.

**Responsive table pattern added.** `.table-wrap` now includes a
`@media (max-width: 640px)` rule that turns table rows into stacked
label/value cards on small screens, the standard accessible pattern for
data tables on mobile. It reads each cell's `data-label` attribute to show
the column name next to its value, so add `data-label="Column Name"` to every
`<td>` when using this pattern. The same ruleset is duplicated under a
`.table-wrap.force-mobile` class so `components.html` can preview the mobile
layout inside a phone-frame mockup without needing to resize the browser;
that class is a demo aid only; the real product should rely on the media
query and simply resize.

## Em dashes

Every em dash in the project (including inside literal Figma-sourced copy
strings, for example the eligibility rule labels) was replaced with a plain
hyphen. None should be reintroduced going forward, in code, comments, or copy.

## A note on nested CSS Grid

If you preview these files with an old headless renderer (for example
`wkhtmltoimage`, which is stuck on roughly 2014 QtWebKit), nested
`display:grid` layouts can collapse to a single column. This is a limitation
of that specific tool, not the CSS; `grid-template-columns` is standard and
renders correctly in Chrome, Firefox, Safari, and Edge. Don't "fix" the grid
rules based on that renderer.

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
