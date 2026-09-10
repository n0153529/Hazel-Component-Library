# Handover: Hazel Card Component Library

Paste this whole document as your first message in the new chat (or attach it
as a file), then attach the current project zip alongside it. That gives the
new session everything it needs to pick up exactly where this one left off.

## What this project is

A component library and set of reference pages for **Hazel Card**, a support
platform for care-experienced young people (offers, applications, a digital
membership card, and a personal dashboard). It started as a component
library matching a Figma Make design for a "Create an Offer" flow, and has
since grown to include a full member-facing dashboard. The next piece of
work is a second dashboard variant for organisations (see bottom of this
document).

## Files

- `styles.css` - the single stylesheet for the entire project. Every page
  links this file; **no page has its own embedded `<style>` block**. Design
  tokens live at the top of this file as CSS custom properties.
- `index.html` - library overview: hero, brand identity, logo lockups.
- `components.html` - the full component catalogue (buttons, badges, form
  elements, the wizard-specific components, tables, etc.) with live markup
  examples. If you build new reusable components for the org dashboard,
  they should probably get documented here too.
- `create-offer.html` - a fully interactive 5-step wizard ("Who?",
  "Eligibility", "Details", "Benefits", "Categories"). Genuinely wired up in
  vanilla JS, not a static mockup, this was built to match a real Figma Make
  export pixel-for-pixel.
- `dashboard.html` - the **member-facing** dashboard (see below). This is
  the page you'll be using as your visual/structural reference when you
  build the organisation dashboard.
- `workflow.html` - an old, superseded example. Not actively maintained.
- `assets/hazel-logo-cream.png` - the cream logomark, used on dark surfaces
  only (dark green, dark grey, or the brand gradient). Never on light
  backgrounds.
- `readme.md` - the detailed pass-by-pass changelog for this whole project.
  If you want to understand *why* something is built a certain way, or
  need the history of a specific decision, it's almost certainly explained
  there. It's long; search it rather than reading start to finish.

## Hard rules, followed throughout this project

1. **Never use em dashes** (Unicode U+2014, the long dash character),
   anywhere, in code, comments, or copy. Use a plain hyphen instead. This was requested explicitly and
   applies to everything going forward, including your own chat responses
   in the new session.
2. **All buttons are fully pill-shaped** by default (`border-radius:
   var(--radius-pill)`, i.e. 999px). This was flip-flopped once earlier in
   the project (briefly matched a stricter 6px-radius Figma source) but the
   final, current, explicit instruction is: all buttons pill-shaped.
3. **Test interactivity, don't assume it.** Several real bugs in this
   project were only caught by loading pages in a headless DOM (jsdom) and
   dispatching real click events, or by actually rendering the page and
   looking at the pixels, rather than trusting that the HTML/CSS/JS was
   correct by inspection. Do this for anything you build that has state or
   click behaviour. See the "Testing approach" section below for the exact
   method used.
4. **Don't let dashboard-specific CSS leak into the rest of the library.**
   `dashboard.html` intentionally has its own visual identity for a few
   components that also exist in the shared library (see the token/scoping
   section below). If you add new organisation-dashboard-specific overrides
   of shared class names, scope them the same way.

## Design tokens (all in `styles.css`, top of file)

Sampled from a real Figma Make source export where possible, not guessed.
Key values:

- Background: `--bg:#f5f5f3`, Surface (cards): `--surface:#ffffff`
- Text: `--text` / `--text-strong:#104751` (dark teal, used for both body
  and headings), `--muted:#5a7a82`, `--subtle:#7c9499`
- Primary brand teal: `--primary:#078c9e`, hover `--primary-hover:#066d7c`
- Semantic: `--success:#047857`, `--warning:#ca8a04`, `--danger:#b91c1c`,
  `--info:#2563eb`, each with a matching `-soft` (pale background) and
  `-border` variant
- Brand identity (distinct from the functional tokens above, for marketing
  surfaces and the logo): `--brand-dark-green:#104751`,
  `--brand-light-green:#078c9e`, `--brand-dark-grey:#151719`
- Radius scale: `--radius-sm:4px`, `--radius-md:6px`, `--radius-lg:8px`,
  `--radius-xl:8px`, `--radius-pill:999px`. Almost everything uses 6px;
  buttons use the pill value (see rule 2 above).
- `--sidebar-width:280px` / `--sidebar-collapsed:84px` - dashboard-only
  layout constants, also live in the main `:root` block.

## The `.dashboard-shell` scoping pattern (important if you touch CSS)

`dashboard.html` used to carry ~500 lines of its own embedded CSS. That was
recently moved into `styles.css` (see the readme's "Pass 10" for the full
story), but several dashboard components deliberately look slightly
different from their shared-library counterparts:

- `.avatar` - dashboard's is a gradient circle; the shared one is flat.
- `.card` - dashboard's has a gradient background; the shared one is flat.
- `.btn` - dashboard's is 44px tall with 700-weight text; the shared one is
  42px with 600-weight.
- `.badge`, `.grid` (flexbox instead of real CSS grid, see rendering caveat
  below), `.h3`/`.h5`/`.h6`, `.small`, `.searchbar` - also all deliberately
  different.

All of these are scoped under `.dashboard-shell` (the outer wrapper div in
`dashboard.html`, id `dashboardShell`) in `styles.css`, e.g.
`.dashboard-shell .btn{...}`. This means they only apply inside
`dashboard.html` and don't change how buttons/cards/badges look on
`index.html`, `components.html`, or `create-offer.html`.

**If the organisation dashboard needs a different visual treatment again**
(likely, if it's meant to feel distinct from the member dashboard), give it
its own outer wrapper class (e.g. `.org-shell`) and scope any overrides
under that, following the exact same pattern. Don't add a third, unscoped
copy of `.btn`/`.card`/etc. to the shared stylesheet, it'll leak everywhere.

## A rendering-tool caveat (not a real browser bug)

Screenshots and visual checks in this project were done with `wkhtmltoimage`,
which uses a very old WebKit engine. It has two known quirks that are **not**
real bugs and won't affect actual users in real browsers:

1. It sometimes fails to lay out `display:grid` containers as multiple
   columns (collapses them to one column). Real Chrome/Firefox/Safari
   handle CSS Grid correctly. Where this actually mattered for demo
   reliability, grid was replaced with flexbox (`.grid-N` in this project is
   flexbox-based specifically for that reason, not because grid is broken).
2. It has strict, sometimes fatal, network-error handling. `styles.css`
   starts with two `@import` statements pulling Inter and DM Mono from
   Google Fonts; if that network call is blocked in the sandbox this tool
   runs in, some render attempts fail or silently truncate. Real browsers
   just fall back to system fonts and keep going. If you need to visually
   verify something and hit a blank/broken render, try stripping those two
   `@import` lines from a scratch copy of `styles.css` first before assuming
   the actual CSS is broken.

Given these two quirks specifically, prefer testing interactivity with
jsdom (see below) and only use image rendering for genuine visual/layout
checks, cross-checking anything that looks wrong against the theory that
it's a tool artifact before treating it as a real bug.

## Testing approach used throughout this project

For any interactive feature:

```bash
mkdir -p /tmp/t && cd /tmp/t && npm install jsdom --no-save
```

Then a small Node script loads the HTML file with `runScripts:
'dangerously'`, dispatches real `click` events at the relevant elements, and
asserts on the resulting DOM state (classList, `hidden`, `style.display`,
text content, element counts), not just that a function exists. This is how
several real bugs were caught in this project, including:

- A CSS combination (`display:grid` parent + `width:100%` child) that
  produced a computed width of 51,200px in the legacy render tool.
- An accordion toggle that silently broke after a refactor renamed its
  container class.
- A QR-code placeholder that was present in the DOM but invisible, because
  a global `svg{width:16px;height:16px}` reset was overriding its explicit
  size attributes (CSS always wins over presentational HTML attributes,
  even at low specificity).

For visual checks, render with `wkhtmltoimage --enable-local-file-access
--width 1400 --javascript-delay 400 file.html output.png`, crop with
Pillow, and view the crop, factoring in the caveat above.

## Current state of `dashboard.html` (member dashboard)

This is the reference you'll be working from. Persona: an individual member
named "Sunny Barker", a "Hazel Card Member".

**Sidebar** (dark green gradient background, `--brand-dark-green` to
`--panel-dark-2`, logo at 42px tall, collapsible to an 84px icon rail with a
working toggle button):
- My Profile (expand/collapse group): Account & Privacy, Membership Card,
  Documents & Readiness
- My Work (group): CV Builder, Documents & Readiness
- My Home (group): Home Essentials, Life Skills, Home Goals
- My Journey (group): My Growth Map, Evaluation, Opportunities
- My Support Plans (flat, currently marked active)
- Claimed Offers (flat)
- My Calendar (flat)
- Messages (flat)
- My Trusted Network (flat, has a real two-person SVG icon)
- Footer: a "Need support?" card (heading, body copy, full-width "Chat to
  us" button, no icon) that hides entirely when the sidebar is collapsed

**Top bar**: user name block ("Sunny Barker" / "Hazel Card Member") to the
left of a search field that fills remaining space, then Help icon, Settings
(cog) icon, and a profile avatar with a working dropdown menu (Membership
card, Account & Privacy, Logout) built from the shared `.dropdown` / `.menu`
/ `.menu-item` components.

**Main content**, top to bottom:
1. Action Center - three solid-colour cards (red/yellow/green via
   `.action-card.danger/.warning/.success`) with a "See all" link and a
   pending-count badge above them. The red card has a slow pulsating glow
   animation (`hazel-danger-pulse` keyframe).
2. "Your Hazel Card is active" status panel - progress badge and bar, six
   status chips (Done/Next), a dismissable "Application approved" banner, a
   member detail list, and a dark digital membership card mockup with a
   generated placeholder QR code.
3. "My journey" - **currently commented out** (not deleted) per request,
   ready to be reinstated later. It was three stat cards (Opportunities
   completed, Skills developed, Verified hours).
4. "My Calendar" (left) and "Recent activity" (right), side by side. The
   calendar shows three example entries, each with a coloured dot (5 types
   defined: reminder=yellow, appointment=green, deadline=red, offer=purple,
   activity=light green) and a reminder badge on the title row rather than
   a separate line.

## An open, unresolved report to check first

The user reported "no styles are loading" on the dashboard shortly after the
CSS-consolidation work (moving all of dashboard.html's embedded CSS into
`styles.css`). Investigation from this side could not reproduce it: the
page rendered correctly, the CSS passed a real parser with zero syntax
errors, the delivered zip matched the working files exactly, and serving
both files over plain HTTP returned the correct status codes and
`Content-Type: text/css`. The likely explanation offered was a deployment
mismatch (their live server serving an old, smaller `styles.css` alongside
a new `dashboard.html` that now depends on it entirely, with no embedded
fallback left). **This was not confirmed resolved before the session ended.**
If you're continuing this thread of work, it's worth explicitly asking
whether that got sorted out before doing anything else, since it would
affect how much you can trust that "it looks right in the browser" reports
mean the same thing as "it looks right in the delivered files."

## Next feature: Dashboard for Organisations ("Dashboard org")

This hasn't been scoped yet, this session ended right as it was being
introduced. Likely a second dashboard, structurally similar to
`dashboard.html` but for an organisation-type user rather than an individual
member (the existing product data model appears to distinguish "Hazel Card
Member" from "Organisation partner" as member types, per the top-bar badge
text already built). Reasonable opening questions for whoever picks this up:

- Is this a new file (e.g. `dashboard-org.html`) or a variant/mode of the
  existing `dashboard.html`?
- What does an organisation actually need to see/do that a member doesn't?
  (Likely candidates given the rest of this product: managing offers they've
  published, reviewing applications, member/audience management, something
  resembling the old admin-style "Offer Studio" content this dashboard used
  to show before it became member-facing, worth checking the readme's
  earlier passes for what that looked like.)
- Does the sidebar navigation structure carry over at all, or is it
  completely different for this persona?
- Brand/visual treatment: same dark green sidebar and component styling, or
  does "organisation" warrant its own distinct identity the way the member
  dashboard's cards/avatar/buttons already deviate slightly from the shared
  library?

Don't guess at scope, ask before building.
