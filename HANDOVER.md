# Handover: Hazel Card Component Library

Paste this whole document as your first message in the new chat (or attach
it as a file), then attach the current project zip alongside it.

## Where things stand

Both dashboards are now at a near-complete, good level:

- `dashboard.html` - the **member-facing** dashboard (persona: "Sunny
  Barker", a Hazel Card Member).
- `dashboard-org.html` - the **organisation-facing** dashboard (persona:
  "Hazelton City Council", a Local Authority). Built after and modelled on
  the member dashboard, with its own content where the audience differs
  (offer management, an org profile, org-level KPIs instead of personal
  ones).

**Next steps, in order:**

1. **Bring the component library up to date.** Several real, working
   components were built directly inside the two dashboards over many
   passes and were never added to `components.html`'s catalogue. At
   minimum, these exist and work but aren't documented there yet:
   - `.journey-stat` / `.journey-icon` / `.journey-stat-top` - the KPI
     tile used for "My Journey" (member) and "Key Metrics" (org), a
     60px icon circle with a number beside it and a label pinned to the
     bottom-right.
   - `.support-item` (with `.status-danger/-warning/-info/-success`
     modifiers) - the coloured support-plan list item on
     `dashboard.html`, reusing the same soft colour tokens as the
     documented Alerts component.
   - `.hazel-dial` - the small circular gauge-with-pointer on
     `dashboard.html` ("Your Hazel Card" completion), built as a plain
     SVG ring plus a dot marking the current position.
   - `.org-metrics-grid` - a fixed 5-column CSS Grid (deliberately not
     using the shared `.grid-3`, see the flexbox note below) used for
     the 10-tile Key Metrics section on the org dashboard.
   Go through both dashboards, find anything else reusable that isn't in
   `components.html` yet, and add it there with the same live-markup
   style already used for everything else in that file. Also worth a
   pass: confirm nothing already in `components.html` has drifted out of
   sync with how it's actually used in the dashboards now.
2. **After that**, the plan is to design new pages within the dashboards
   (not scoped yet - ask before building once you get here).

## Files

- `styles.css` - the single shared stylesheet. Every page links this file
  **except** `components.html` (see the important gotcha below). Design
  tokens live at the top as CSS custom properties.
- `index.html` - library overview: hero, brand identity, logo lockups.
- `components.html` - the component catalogue. Every section has a "View
  code" button that opens a modal with the real HTML and CSS for that
  section (auto-extracted live from the DOM and from the stylesheet, not
  hand-written, so it can't drift out of sync - see below for how this
  works and the one thing to know about it).
- `create-offer.html` - a fully interactive 5-step wizard, genuinely wired
  up in vanilla JS.
- `dashboard.html` / `dashboard-org.html` - see above.
- `workflow.html` - an old, superseded example. Not actively maintained.
- `assets/hazel-logo-cream.png` - cream logomark, dark surfaces only.
- `readme.md` - the full pass-by-pass changelog, 34 passes and counting.
  It's long; search it for a specific topic rather than reading start to
  finish. If something looks like an odd decision, it's almost certainly
  explained there.

## Important gotcha: `components.html` has its own embedded copy of the stylesheet

`components.html` does **not** use `<link rel="stylesheet" href="styles.css">`
like every other page. It has the full contents of `styles.css` pasted
inline into its own `<style id="mainStylesheet">` block instead. This is
required for the "View code" feature to work: real browsers block a page
from reading an externally-linked stylesheet's rules via JavaScript when
opened over `file://` (confirmed directly, not assumed), which is how this
project is normally opened, so the CSS had to live in the same document to
be introspectable.

**This means: if you ever edit `styles.css`, you must also regenerate the
copy inside `components.html`, or its View Code feature will start showing
stale CSS.** The block is clearly marked with a comment explaining this at
the point of duplication. To resync: replace everything between
`<style id="mainStylesheet">` and its matching `</style>` with the current
contents of `styles.css`, verbatim.

## Hard rules, followed throughout this project

1. **Never use em dashes** (the long dash, U+2014), anywhere - code,
   comments, copy, or your own chat responses. Use a plain hyphen.
2. **All buttons are pill-shaped** by default (`border-radius:
   var(--radius-pill)`, 999px).
3. **Test interactivity, don't assume it.** Use jsdom for structural/JS
   checks and a real headless Chromium (via Playwright, already available
   in this environment - see below) for anything visual. Several real
   bugs in this project were only caught this way, not by reading the code.
4. **Line endings are CRLF throughout.** Text-editing tools sometimes
   silently convert edited files to LF-only; check `file <name>` after any
   edit and re-normalise to CRLF if it's changed, or you'll get noisy
   diffs and mixed-ending files.
5. **Don't let dashboard-specific CSS leak into the shared library.** Both
   dashboards intentionally look slightly different from the plain
   component library for a few shared class names (`.btn`, `.card`,
   `.badge`, `.avatar`, `.grid`, headings). These are scoped under
   `.dashboard-shell` in `styles.css` (e.g. `.dashboard-shell .btn{...}`),
   which applies inside both `dashboard.html` and `dashboard-org.html`
   (both use the same outer wrapper class) without affecting
   `index.html`/`components.html`/`create-offer.html`. Follow this same
   pattern for anything new.

## Testing: use a real browser (Playwright/Chromium), not just jsdom

A real headless Chromium is available in this environment at
`/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`,
usable via the `playwright` npm package (already installed globally). This
is now the **preferred method for any visual or interactive check** -
several real bugs (a modal that ignored the `hidden` attribute because of a
CSS specificity issue; a CSS Grid rendering gap in the older screenshot
tool; the `file://` stylesheet-introspection restriction mentioned above)
were only ever caught by actually loading the page in a real browser
engine and checking computed styles / bounding boxes / clicking things,
not by inspecting the HTML/CSS or trusting jsdom alone.

Rough pattern:
```js
const { chromium } = require('playwright');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto('file:///home/claude/hazel/dashboard.html');
// getComputedStyle, click(), boundingClientRect, screenshot, etc.
```

`wkhtmltoimage` (an old WebKit-based screenshot tool) was used earlier in
this project and still works for quick renders, but has several confirmed
quirks that are **not** real browser bugs: patchy CSS Grid support
(`.grid-N` classes are flexbox-based specifically because of this),
`inset:0` not being supported, `:scope` selector issues, and some
JavaScript engine gaps (`for...of` on DOM collections, `let`/`const`
edge cases). If something looks broken only in a `wkhtmltoimage` render,
cross-check with a real Chromium render before assuming it's a real bug -
it's caught out this project more than once. Details of each are in
`readme.md` if useful.

## Design tokens (all in `styles.css`, top of file)

- Background `--bg:#f5f5f3`, surface `--surface:#ffffff`
- Text `--text-strong:#104751` (dark teal), `--muted:#5a7a82`, `--subtle:#7c9499`
- Primary brand teal `--primary:#078c9e`, hover `--primary-hover:#066d7c`
- Semantic `--success`/`--warning`/`--danger`/`--info`, each with a
  matching `-soft` (pale background) and `-border` variant - this is the
  colour system reused for badges, alerts, and the newer `.support-item`
  status colours
- Brand identity (distinct from the functional tokens, for marketing
  surfaces and the logo): `--brand-dark-green:#104751`,
  `--brand-light-green:#078c9e`, `--brand-dark-grey:#151719`
- Radius scale: mostly 6px; buttons use the pill value
- `--sidebar-width:280px` / `--sidebar-collapsed:84px` - dashboard layout
  constants
