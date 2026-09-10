# Hazel Component Library v4

Source of truth for Hazel's UI, rebuilt to match the Figma Make "Create an Offer"
redesign (Sept 2026). Plain HTML/CSS by design, this is a style and pattern
reference to build the real React/TypeScript components against, not a framework.

## Files

- `styles.css` - all design tokens and component CSS for the whole library,
  including a dedicated section at the end for `dashboard.html`'s own
  layout and components (see Pass 10). This is the only stylesheet in the
  project; no page carries its own embedded `<style>` block anymore.
- `index.html` - landing page: hero, brand identity and logo lockups.
- `components.html` - full catalog of every component, including the
  functional UI tokens and typography scale.
- `create-offer.html` - the actual 5-step "Create an Offer" wizard, rebuilt
  interactively (vanilla JS) to match the Figma screens. Every row, toggle,
  and dropdown on this page is genuinely wired up, not a static mockup - see
  below.
- `dashboard.html` - member-facing dashboard: dark green sidebar with the
  Hazel logo, working expand/collapse nav groups, and a top bar with search,
  a user info block, and a profile dropdown menu. Fully shares tokens with
  the rest of the library and, as of Pass 10, has no CSS of its own left in
  the file at all - everything lives in `styles.css`, scoped under
  `.dashboard-shell` wherever it needed to differ from the shared defaults.
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

## Pass 5: sidebar collapse, full menu with sub-items, and Action Center colours

**Sidebar collapse now actually works.** The collapse button existed
visually before but did nothing. It now toggles an `is-collapsed` class on
the shell: the sidebar shrinks to an icon-only rail (labels, chevrons, and
open sub-menus all hidden), and the main content area grows to fill the
freed space automatically, since it was already `flex:1` from the earlier
flexbox fix.

**Search bar now fills the available space** in the top bar (removed the
`max-width: 420px` cap it had), rather than sitting at a fixed width with
empty space next to it before the Help/Settings/avatar cluster.

**Action Center cards now use solid colour**, mapped to urgency: "Review
offer draft" is red (`--danger`), "Fix audience rule" is yellow
(`--warning`), "Publish scheduled" is green (`--success`). Text and the
"Open" / "Fix" / "View" buttons switch to white-on-colour for contrast. This
is scoped to `.action-card.danger/.warning/.success` specifically, so the
plain white cards used in "Recent activity" below (same base `.action-card`
class, no colour) are untouched.

**Offers table header is now white text on the dark green background** -
this dashboard has always kept its own scoped table styling separate from
the shared library (a deliberate choice, since it represents a different
demo product), and that scoped style had never actually been given a
background colour at all before. Fixed directly in its own `th` rule.

**Sidebar menu updated with the full item list and real sub-items**,
replacing the placeholder sub-items from the previous pass: My Profile
(Account & Privacy, Membership Card, Documents & Readiness), My Work (Work
Essentials, CV Builder), My Home (Home Essentials, Life Skills, Home Goals),
My Journey (My Growth Map, Evaluation, Opportunities), plus the five flat
items and "Need help" (no question mark, matching the latest list exactly).

**Sidebar logo increased to 42px tall** (was 26px), and its `img` element is
now specifically hidden (not just shrunk) when the sidebar is collapsed,
since it wouldn't be legible at the 84px collapsed rail width.

## Pass 6: sidebar scroll, bigger icons, a real people icon, and "Your Hazel Card"

**Sidebar now scrolls when the expanded dropdowns push content past the
bottom of the screen.** The nav area (`.sidebar-section`) was `overflow:
hidden` at the parent level with no scroll mechanism of its own, so
expanding all four groups at once simply clipped everything below the fold
with no way to reach it. It's now `overflow-y: auto` with the scrollbar
hidden across all three engines (`scrollbar-width: none` for Firefox,
`-ms-overflow-style` for legacy Edge, `::-webkit-scrollbar{display:none}`
for Chrome/Safari), so the content scrolls but no scrollbar is visible, per
the request. The logo at the top and "Need help" at the bottom stay fixed in
place; only the nav list in between scrolls. Worth flagging: the tool used
for visual verification in this project shows a thin horizontal bar at the
bottom of the scroll area that doesn't fully match a normal scrollbar's
appearance - based on the pattern of similar rendering quirks found
elsewhere in this project with that same tool, this looks like another tool
artifact rather than a real issue, but it's worth a quick check in an actual
browser to be certain, since I can't fully rule it out from here.

**Sidebar icons increased to 18px**, up from 14px, with the icon's own box
enlarged slightly (18px to 20px) so the larger glyph doesn't feel cramped.
This applies identically whether the sidebar is expanded or collapsed, since
the collapsed state only hides the text label, not the icon itself.

**"My Trusted Network" now uses an actual two-person icon** (an inline SVG)
instead of the generic square placeholder every other unassigned icon in
this list still uses.

**Added the "Your Hazel Card" application-status section**, positioned
between the KPI cards and the Performance/Recent Activity panels, matching
the attached screenshot: the application progress badge (83%, 5/6 complete)
with a progress bar; the six status chips (Profile, Address, Care details,
Evidence, Review, Card) each showing "Done" or "Next"; the approved banner
and member detail list; and the dark membership card itself with a photo
placeholder, member details, a QR code, and Verify card / Download PDF
buttons. A few notes on how this was built:

- The QR code is a generated placeholder pattern (finder squares in three
  corners plus pseudo-random fill), not a real scannable code - there's
  nothing to encode yet since this is a static mockup, but it's built as a
  proper SVG so swapping in a real QR generator later just means replacing
  that one element.
- The screenshot's approved banner reads "Application approved" with an em
  dash before "card issued". Per the project's standing instruction to
  remove and never reintroduce em dashes, this was typed as "Application
  approved - card issued" instead, even though it's replicating an existing
  screenshot rather than newly authored copy.
- Colours and the dark card background were pulled from the library's
  existing tokens (`--success`, `--success-soft`, `--primary`, and
  `--brand-dark-grey` for the near-black membership card) rather than
  introducing new one-off values, so this section stays visually consistent
  with everything else on the page.
- Found the same bug pattern as before while building this: the shared
  `svg{width:16px;height:16px}` reset in `styles.css` was silently shrinking
  the QR pattern down to 16x16px despite its own explicit width/height
  attributes, because CSS always wins over presentational HTML attributes,
  even from a low-specificity rule. Added a scoped `.qr-box svg{width:100%;
  height:100%}` override, the same fix pattern already used for the sidebar
  icon SVG earlier in this file.

## Pass 7: layout polish on the dashboard

**Fixed a real layout-shift bug on sidebar collapse.** Collapsing the
sidebar hides the logo, and the logo (42px tall) was taller than the
collapse button next to it (34px), so `.sidebar-top`'s height was
determined by whichever child happened to be visible - shrinking by about
8px whenever the logo disappeared, and nudging everything below it up
slightly. Fixed with an explicit `min-height: 82px` on `.sidebar-top` so the
row holds its height regardless of which child is showing.

**Reordered the dashboard sections**: Active offers / Pending approvals /
Live audiences now sit below "Your Hazel Card" rather than above it.

**"Your Hazel Card" card background is now solid white**, not the
`linear-gradient(180deg,#fff,var(--surface-2))` every other `.card` uses by
default. Overrode with a `.card.hazel-status` compound selector rather than
just restyling `.hazel-status` alone, since the base `.card` gradient rule
appears later in the stylesheet and would otherwise still win the
tie-breaking on source order despite matching specificity.

**Membership card visual elements resized**: the photo placeholder is now
115x145px (was 64x80), the logo on the dark card is 50px tall (was 20px),
and the QR code box is 120x120px (was 88x88), with its "Scan to verify
membership" caption's max-width updated to match so it still wraps and
centres correctly under the larger box rather than under the old, narrower
one.

**Removed the "Offers table" section and the "Main content example area"
placeholder text** in the Performance card, both per request.

**Added a slow pulsating glow to the red Action Center card**, a 2.6-second
`box-shadow` ring animation (expanding and fading, then repeating) using the
card's own `--danger` colour at low opacity, so it doesn't introduce a new
one-off colour just for this effect.

## Pass 8: sidebar help card, dismissable banner, "My journey" and "My Calendar"

You attached an updated `dashboard.html` from a zip this round. Diffed it
against my last output first: everything else in the zip (styles.css,
components.html, create-offer.html, index.html, workflow.html) was byte-for-
byte identical, and dashboard.html had a small set of manual edits - the "My
Profile" dropdown group commented out, a couple of sub-items moved between
groups, and the Action Center copy rewritten to be member-facing rather than
admin-facing ("Review offer starting soon!", "Your card is now active", and
so on). Adopted that file as the new baseline rather than my own last
version, so none of those edits were lost.

**Sidebar footer rebuilt as a proper card.** The plain "Need help" text link
is now a bordered card with a chat icon, "Need support?" heading, "We're
here if you need help with anything." body copy, and a full-width "Chat to
us" button. When the sidebar is collapsed, the card collapses down to just
the chat icon as a circular button - this took two passes to get right:
my first attempt left both the decorative header icon and the button's own
icon visible at once when collapsed, since I'd only hidden the text labels.
Caught by rendering the collapsed state and looking at it, not assumed.

**"See all" link added** next to the "4 pending" badge in Action Center,
using the existing `.btn-link` utility rather than a new one-off style.

**"Application approved - card issued" banner is now dismissable.** Added an
X button that hides the whole banner on click. Tested: the banner is visible
by default, and clicking the dismiss button sets it to hidden, confirmed via
its actual `display` value in a headless DOM rather than just checking the
button exists.

**KPI cards replaced with a "My journey" panel** - heading, an "Edit my
plan" link, an intro sentence, and three stat cards (Opportunities
completed, Skills developed, Verified hours) each with their own icon and a
count starting at 0, using the library's existing success/warning/info
colour tokens for the three icon circles rather than new ones.

**"Performance" replaced with "My Calendar"** - "View calendar" link plus an
"Add Event" button in the header, and three example calendar entries below,
each with a coloured dot indicating its type, a title, a date/time line, a
description, a location, and its reminder schedule. Defined dot colours for
all five types you specified (Reminder = yellow, Appointment = green,
Deadline = red, Offer = purple, Activity = light green) even though the
three example entries only use three of them, so the other two are ready to
use without needing new CSS. Reused `--danger` for Deadline and introduced
two new one-off colours (a purple and a lighter green) specifically for
Offer and Activity, since the existing token set doesn't have anything in
that family already.

One small deliberate deviation: your example event time read "09:00-17:00"
with what could be read as an en dash; typed as a plain hyphen throughout,
consistent with the project's standing rule against em dashes and to avoid
introducing a different dash character elsewhere in the codebase.

## Pass 9: commenting out "My journey", reminder badges, and a profile menu

**"My journey" is commented out, not deleted**, wrapped in a single HTML
comment block per request, ready to bring back when you're ready to revisit
it. Confirmed via a headless DOM check that none of its content actually
renders (no `.journey-stat` elements exist in the live page) rather than
just eyeballing that the text disappeared.

**Calendar reminders moved into a badge on the title row**, right-aligned,
replacing the separate "Reminders: ..." line entirely. The three example
events now show "Starting in 2 hours" (red, most urgent), "Reminder: 1 day
to go" (yellow), and "Reminder: 3 days to go" (neutral grey) - varying the
badge colour by urgency rather than using one flat style throughout.

**Recent activity now has 5 items**, up from 3 (added "Document uploaded"
and "Message received").

**Removed the SVG icon from "Need support?"** - both the decorative circle
above the heading and the icon inside the "Chat to us" button. Since there's
no icon left to shrink to, simplified the collapsed-sidebar behaviour for
this card to just hide entirely rather than leaving an empty circle behind,
which is what my first pass at "remove the icon" would have produced if I
hadn't checked the collapsed state again.

**Removed "Work Essentials"** from the sidebar. Worth noting where it
actually was: your uploaded file had moved it under "My Home" (alongside
Home Essentials, Life Skills, Home Goals) rather than "My Work", likely
mid-reorganisation - removed it from that location since that's where it
existed in the file I was given.

**"See all" now sits to the left of the "4 pending" badge**, swapped from
the previous pass.

**Top bar rebuilt** with two more pieces: "Sunny Barker" / "Hazel Card
Member" to the left of the search field, and a working dropdown menu on the
profile avatar (Membership card, Account & Privacy, Logout) built from the
library's existing `.dropdown` / `.menu` / `.menu-item` components rather
than new one-off markup. Tested: the menu is hidden by default, opens on
clicking the avatar, and closes again when clicking anywhere outside it.

## Pass 10: all of dashboard.html's CSS moved into styles.css

`dashboard.html` had carried its own embedded `<style>` block since v1,
roughly 500 lines. Moved all of it into `styles.css` so there's genuinely
one stylesheet for the whole library, `dashboard.html` now only has a
`<link rel="stylesheet" href="styles.css">` and nothing else.

This wasn't a plain copy-paste, and here's why: dashboard.html's embedded
block had accumulated its own versions of several classes that also exist in
the shared stylesheet - `.btn`, `.badge`, `.card`, `.avatar`, `.grid`,
`.h3`/`.h5`/`.h6`, `.small`, and `.searchbar` - each with genuinely different
values (different button height and font-weight, a gradient card background
instead of flat, a gradient avatar instead of a flat one, flexbox instead of
grid for `.grid-3`, and so on). Appending all of that to the end of
`styles.css` unscoped would have made dashboard's versions win the cascade
everywhere, on every page that links the same stylesheet, silently changing
how buttons, badges, and cards look on `index.html`, `components.html`, and
`create-offer.html` too.

Instead, every one of those colliding selectors was scoped under
`.dashboard-shell` (the dashboard's own outer wrapper element, which no
other page has), so they only apply inside the dashboard and can't leak
anywhere else. Classes that are already unique to the dashboard
(`.sidebar-*`, `.hazel-*`, `.calendar-*`/`.cal-*`, `.journey-*`, `.kpi`,
`.action-card`, `.topbar-*`, and so on) needed no scoping and were moved
across as-is. A handful of genuinely duplicate global rules (`*`,
`html,body`, `a`, `img`, `button,input,select,textarea`, and an unused
leftover table style from the "Offers table" section removed a few passes
ago) were dropped entirely rather than moved, since the shared stylesheet
already covers them identically. The two dashboard-only layout constants
(`--sidebar-width`, `--sidebar-collapsed`) were added to the main `:root`
block rather than kept in a separate one.

The new dashboard section in `styles.css` has its own header comment
explaining this scoping decision, so it's clear later why some rules there
look like near-duplicates of ones higher up in the file rather than reused
directly.

## How this was actually tested

Every interactive claim in this document was verified by loading the file in
a headless DOM (jsdom) and dispatching real click events, not just
re-rendering it as an image and eyeballing the result. This pass added 10
new checks (all four dropdown groups can be open simultaneously without
interfering with each other, "My Trusted Network" genuinely has an SVG icon
now, the "Your Hazel Card" section renders with its 6 status chips, the
membership card, and the QR pattern all present, and the approved banner
uses a hyphen rather than an em dash) to the 11 from the previous pass.
Also visually re-rendered the sidebar with all four groups expanded at once
to confirm the scroll behaviour actually works rather than just trusting the
CSS, which is also how the QR-code sizing bug above was caught: it looked
fine in the DOM check (the SVG element existed) but was invisible in the
actual render until inspected. This pass added a further 5 checks (Offers
table and the Performance placeholder text are genuinely gone from the
rendered output, the Hazel Card section still renders, and the KPI section
now appears after it in DOM order, not just visually) plus a pixel-level
check on the actual rendered output confirming the sidebar's internal
divider sits within 1px of the same position whether the sidebar is
expanded or collapsed, rather than trusting the CSS `min-height` fix by
inspection alone.

This pass added a further 17 checks: the dismiss button genuinely hides the
approved banner (checked its computed `display`, not just that the button
exists); the sidebar help card's text is present and the old "Need help"
wording is gone; the KPI cards are fully removed and replaced by exactly
three `.journey-stat` elements; the Performance heading is gone and exactly
three `.calendar-item` elements exist with the correct dot classes; and the
sidebar collapse still works after all of the above. Also re-rendered the
collapsed sidebar specifically to check the new help card, which is how the
duplicated-icon bug mentioned above was actually caught.

This pass added a further 17 checks: the profile menu is hidden by default,
opens on avatar click, and closes on an outside click; "My journey" no
longer renders (zero `.journey-stat` elements in the live DOM, not just the
heading text missing); "Work Essentials" and the old "Reminders: ..." line
are both genuinely gone from the page text; exactly three reminder badges
and five Recent Activity items exist; and the sidebar help icon has been
removed from the DOM entirely while "Chat to us" still renders correctly.

Moving all of dashboard.html's CSS into the shared stylesheet was tested two
ways. First, confirmed the file itself has zero `<style>` elements left and
correctly links `styles.css`, then re-ran the full existing dashboard
interaction suite (profile menu, sidebar collapse, all three dropdown
groups, and the banner dismiss) against the file with its CSS removed, to
make sure none of that broke in the move. Second, and more importantly,
rendered `index.html`, `components.html`, and `create-offer.html` and
compared them against known-good screenshots from before this change -
buttons, badges, cards, and avatars on those pages needed to look exactly
as they did before, since the whole point of scoping every colliding
selector under `.dashboard-shell` was to prevent dashboard's slightly
different button height, gradient cards, and gradient avatar from leaking
into the rest of the library. All three pages rendered pixel-identical to
their prior versions.

## Pass 11: dashboard-org.html built, and a real CSS bug fixed

**New file: `dashboard-org.html`**, the organisation-facing dashboard. Built
heavily off `dashboard.html`, reusing the same `.dashboard-shell` wrapper
(and therefore all its scoped `.btn`/`.card`/`.badge`/`.grid`/etc.
overrides) rather than introducing a second visual identity, since this
pass was for the same look with different content, not a redesign.

- Top bar shows the organisation name ("Hazelton City Council") and member
  type ("Local Authority") in place of an individual member's name/type.
  Profile dropdown items changed to Organisation Profile / Account &
  Privacy / Logout.
- Sidebar rebuilt for the organisation persona: a new "Organisation" expand
  group (Structure, Staff, Permissions, Care leavers, Foster care families,
  Activity, Bulk import) plus flat items (Overview & offers, Curriculum
  Centre, Create offer, Saved offers, Offer claims, Local Offer management,
  Offer messages). "Overview & offers" is the active item, matching this
  page. Sidebar footer "Need support?" card carried over unchanged.
- Action Center reused with three organisation-relevant items (offer
  approval pending, a message from an applicant, a partnership offer
  accepted). Note the middle card intentionally uses the plain, uncoloured
  `.action-card` (no `.danger`/`.warning`/`.success` modifier) since it is
  informational rather than urgent or positive, and the third card has no
  button since none was specified.
- "Your Hazel Card is active" panel replaced with a "Local authority
  profile" card: an org summary line plus four info tiles (Provider type,
  Account contact, Email, Address). New `.org-info-tile` class added to
  `styles.css`, unscoped since the class name is unique to this content and
  won't collide with the shared library, following the same pattern as
  `.kpi` / `.journey-stat` / `.action-card`.
- New full-width "Saved offers workspace" card: a status-count row (Live /
  Awaiting approval / Drafts / Archived, with a "See offer library" link),
  then a list of the 5 latest offers as `.offer-row` items (thumbnail, title
  with a category tag, description, status + valid-date chips, redemption
  count, "View offer" button). Only the first offer ("Meet Your Housing
  Provider Before Release") was supplied content; the other four are
  invented placeholders in the same style, worth swapping for real data.
- Calendar / Recent activity from the member dashboard was deliberately not
  carried over, since nothing was specified for this page yet.
- Tested the same way as prior passes: jsdom click-event tests confirmed
  sidebar collapse, the new Organisation group expand/collapse, and the
  profile dropdown all update the DOM correctly, and a `wkhtmltoimage`
  render was cross-checked for layout.
- One new tool-only rendering quirk found and confirmed harmless: this
  project's old WebKit screenshot tool doesn't support flexbox `gap` at all
  (isolated with a minimal test case), so the offer status-count row's
  spacing looks collapsed in screenshots. Real Chrome/Firefox/Safari all
  support flex `gap` and render it correctly; left the CSS as-is.

**Real bug found and fixed in `styles.css`**: the shared `.action-center,
.dashboard-shell .card` rule had a stray `background:#fff;);` (an extra
`);` left over from an earlier edit). Running the stylesheet through an
actual CSS parser (rather than just checking brace balance, which this
error passed) surfaced it immediately: `undefined:921:19: missing '}'`.
Depending on a given browser's error-recovery behaviour this kind of
malformed declaration can knock out far more than the one rule, which
lines up with the "no styles are loading" report from the end of the
previous session that could not be reproduced at the time. Confirmed fixed
by re-parsing the whole file (540 rules, zero parsing errors) and
re-rendering both `dashboard.html` and `dashboard-org.html`. **Lesson for
next time: use a real CSS parser to validate `styles.css` after any edit,
not just a brace-count check**, since brace-matching alone missed this.

**`index.html` nav updated**: the existing "Dashboard (ORG)" link (already
present as a `href="#"` placeholder) now points to `dashboard-org.html`.
"Dashboard (Admin)" is still a placeholder, nothing built for it yet.

## Pass 12: dashboard-org.html refinements

Four small, targeted changes to `dashboard-org.html`, all reusing existing
library CSS/components rather than introducing new visual patterns:

- **Action Center is now red/yellow/green** (`.danger`/`.warning`/`.success`
  on the three cards, in that order), matching the pattern already
  established on the member `dashboard.html`. The first card now also
  carries the pulsing glow animation that comes with `.danger`, same as the
  member dashboard's urgent card.
- **"Create offer" sidebar icon fixed.** It was a plain Unicode heavy-plus
  glyph (`&#10133;`), which some fonts/platforms render with an emoji
  colour presentation regardless of the surrounding text colour. Replaced
  with an inline `stroke="currentColor"` SVG, the same approach already
  used for the Organisation group icon and the member dashboard's Trusted
  Network icon, so it always matches the sidebar label colour.
- **Local authority profile card** now has a square logo tile on the left
  (new `.org-logo` class, 64px, bordered, `--surface-3` background)
  indenting the org name and description. Reuses the same building SVG
  already used for the Organisation sidebar group, since there's no real
  logo asset yet.
- **Saved offers workspace header restructured.** The status counts (Live
  / Awaiting approval / Drafts / Archived), the "See offer library" link,
  and the "Create offer" button now all sit on one line in the card
  header, in that left-to-right order. Renamed `.offer-status-row` to
  `.offer-status-inline` and dropped its border/margin, since it's now
  inline in the header rather than a separate row above the offer list.
- Re-validated with the same process as Pass 11: parsed `styles.css` with a
  real parser (542 rules, zero errors), re-ran and extended the jsdom
  interactivity tests (18 assertions, all passing, including new checks for
  card colour order and the header's element order), and re-rendered the
  page to confirm layout.

## Pass 13: sidebar shift investigation, back button, and offer-list refinements

**Sidebar "shifts slightly" when expanding a group.** Root-caused as
CSS scroll anchoring: browsers try to auto-compensate scroll position when
content changes above the visible area, and the "Organisation" group's 7
subitems (vs 2-3 per group on the member dashboard) are large enough to
tip `.sidebar-section` into needing that compensation, where the member
dashboard's smaller groups never do. Fixed by adding `overflow-anchor:
none` to `.sidebar-section` (shared CSS, so both dashboards benefit).
**Caveat worth flagging: this could not be visually confirmed pixel-for-
pixel**, since Playwright's Chromium download is blocked by this
environment's network egress allowlist (`cdn.playwright.dev` isn't on it)
and `wkhtmltoimage`'s screenshot diffs proved too noisy (non-deterministic
font antialiasing between runs) to use as a substitute. This is the
standard, correct fix for this exact symptom, but flagging the unverified
step explicitly rather than presenting it as confirmed.

Other `dashboard-org.html` changes, all reusing existing library CSS
patterns and added to `styles.css`, not inline:

- **Back button** added to `sidebar-top`, next to the collapse control.
  New `.sidebar-backbtn` class (translucent pill, matches the collapse
  button's existing style), wired to `history.back()`. Collapses to an
  icon-only circle when the sidebar itself is collapsed, same treatment as
  the rest of the sidebar's collapsed state.
- **Action Center** cards now map to `.danger`/`.warning`/`.success` (red/
  yellow/green) in that order, same modifiers used on the member
  dashboard, just applied to different cards.
- **`.org-logo`** bumped from 64px to 80px, icon scaled up to match.
- **"Saved offers workspace" renamed to "Latest Offer Library."**
- **Offer meta row** (`Live` / `Now onwards` / redemptions) changed from a
  stacked column to a single inline row, so it reads as one line next to
  the status chip as asked.
- **`.offer-desc`** max-width increased from 60ch to 100ch.
- **Category chips are now colour-coded**: Custody=grey (`.badge-neutral`,
  unchanged), Housing=red (`.badge-danger`), Employment=green
  (`.badge-success`), Independent Living=yellow (`.badge-warning`),
  Education=orange. No orange badge existed in the library before this,
  so added `--orange`/`--orange-soft`/`--orange-border` tokens and a
  `.badge-orange` class (base + `.dashboard-shell`-scoped pill variant),
  following the exact same pattern as the other badge colours.
- **"See offer library"** converted from a `.btn-link` text link to a real
  `<button class="btn btn-secondary btn-sm">`, matching the project's
  existing convention of using `<button>` rather than styled `<a>` tags
  for in-page actions.
- Removed the now-dead `.offer-library-link` CSS rule and simplified a
  responsive rule that became redundant once `.offer-meta` defaulted to a
  row layout.
- Re-validated the same way as prior passes: `styles.css` re-parsed with a
  real parser (549 rules, zero errors), jsdom interactivity tests extended
  to 24 assertions covering the new button, badge colours, and element
  order (all passing), full JS-error scan across every page in the
  project (clean), and a visual render confirming the action center
  colours, back button, 80px logo, single-line offer meta, and all five
  chip colours.

## Pass 14: icon-only back button, Team Members, combined profile tile

- **Back button is now icon-only** (dropped the "Back" label span
  entirely) on both `dashboard-org.html` and, newly, `dashboard.html`.
  `.sidebar-backbtn` simplified to a fixed 34px circle matching
  `.sidebar-collapse`'s existing look, rather than a wider pill.
- **Fixed the collapsed-sidebar overflow.** Back+collapse side by side
  need ~76px (34+8+34), but the collapsed rail only has ~48px of usable
  width once `.sidebar-top`'s padding is subtracted, so the hamburger was
  getting clipped. `.dashboard-shell.is-collapsed .sidebar-top-actions`
  now stacks the two buttons vertically instead, which fits comfortably.
- **"Team Members"** added to the Organisation sidebar group, directly
  below "Staff".
- **"Account contact", "Email" and "Address" combined into one "Account
  details" tile**, sitting alongside "Provider type" (now 2 tiles instead
  of 4). Since `.grid`/`.grid-4` resolve to flexbox rather than real CSS
  Grid inside `.dashboard-shell` (a Pass 10 change for the old screenshot
  tool's benefit), the merged layout uses a dedicated `.org-profile-grid`
  wrapper with explicit `flex: 1` / `flex: 3` shares instead of
  `grid-column: span`, so "Account details" occupies the same ~75% width
  the three original tiles used to share. Its three fields render as
  internal sub-columns via a new `.org-info-subgrid`.
- **Found and fixed a real overflow bug while building the above**: the
  email address, being one unbroken string, doesn't wrap at whitespace and
  was overflowing its narrower sub-column into the "Address" column next
  to it. Added `overflow-wrap: anywhere` (for real browsers) plus
  `word-break: break-word` (confirmed needed as a fallback - the project's
  old `wkhtmltoimage` screenshot tool doesn't support `overflow-wrap:
  anywhere` at all, verified with an isolated test case) to `.org-info-tile
  .h6`, so long unbroken values wrap instead of colliding with a neighbour.
- **Third Action Center card** ("Your latest offer has been accepted!")
  now has a "View" button, matching the other two cards.
- Re-validated per the established process: `styles.css` re-parsed clean
  (555 rules, zero errors), jsdom interactivity tests extended to 33
  assertions on `dashboard-org.html` plus 5 new ones on `dashboard.html`'s
  back button (all passing), full JS-error scan across every page (clean),
  and visual renders of the expanded sidebar, the collapsed sidebar
  (confirming neither button is cut off), and the combined profile tile
  (confirming the email-overflow fix).

## Pass 15: collapsed-sidebar alignment, accordion animation, and dashboard.html fixes

- **Collapsed sidebar back/collapse alignment fixed.** `.sidebar-top`'s
  `gap: 12px` was adding phantom space between the now-empty `.brand` div
  (its logo `<img>` is hidden when collapsed, but the wrapping div was
  still there) and the button cluster, throwing off centering. Removed the
  gap entirely - safe for the expanded state too, since `justify-content:
  space-between` with exactly two children doesn't need it.
- **Sidebar shift on expand, second attempt.** Pass 13's `overflow-anchor:
  none` fix apparently wasn't sufficient. Took a more robust approach this
  time: `.sidebar-group-body` now animates open/closed via `max-height` +
  `opacity` (with a `visibility` transition timed to match, so hidden
  sub-items aren't tab-focusable while collapsed) instead of an instant
  `display:none`/`flex` swap. This converts any snap into a deliberate
  200ms animation regardless of the precise underlying cause, which
  couldn't be conclusively pinned down without a real browser (Playwright
  is blocked by this environment's network allowlist; `wkhtmltoimage`
  screenshots confirmed the main content area never shifts, only pixels
  inside the sidebar itself change, but couldn't get a clean enough signal
  beyond that). **This one is still not independently confirmed by a real
  browser test - please verify.**
- **"Account details" heading removed** from the combined profile tile
  (Pass 14 had added it as the tile's label; the three fields now sit
  directly at the top of the tile with no heading above them).
- **"Team Members"** confirmed sitting directly below "Staff" in the
  Organisation sidebar group (added in this pass, not Pass 14 as an
  earlier draft of this note implied).

`dashboard.html`:

- Removed the redundant sentence above the approved-card banner ("Your
  application has been approved and your digital card is now active.").
- `.hazel-id-card` padding increased from 20px to 30px.
- **Real bug found and fixed**: `.hazel-step` unconditionally used the
  green success colours for every step box regardless of status, so the
  "Evidence" step (not yet done, chip already read "Next") was rendering
  with a green box despite being incomplete. Added a `.hazel-step
  .incomplete` modifier (danger/red soft background + border) and applied
  it to the Evidence step, and changed its chip from `.badge-primary` to
  `.badge-danger` to match.
- Replaced the "Offer published" / "Audience synced" Recent Activity items
  with "Claimed offer" (Receptionist Taster Session, with a View button)
  and "CV Update Saved" (with a View button), reusing the same plain
  `.action-card` + `.btn.btn-secondary.btn-sm` pattern already used by the
  other Recent Activity and Action Center items on this page.
- Re-validated per the established process: `styles.css` re-parsed clean
  (556 rules, zero errors), jsdom test suite extended to 38 assertions
  covering both `dashboard.html` and `dashboard-org.html` (all passing),
  full JS-error scan across every page (clean), and visual renders of the
  collapsed sidebar on both dashboards, the expanded Organisation group,
  the Evidence step colours, the wider ID card padding, and the two new
  activity items.

## Pass 16: mobile responsiveness for both dashboards

Both `dashboard.html` and `dashboard-org.html` are now usable on mobile,
where the sidebar previously just disappeared with no way to reopen it.

- **Mobile sidebar drawer.** The cog icon in the top bar now calls
  `mobileSidebarToggle()`, which slides `.dashboard-sidebar` in from the
  left (`position:fixed` + `transform:translateX()`, animated) with a
  dimmed backdrop behind it; tapping the backdrop or the cog again closes
  it. Body scroll locks while open. Replaces the old `display:none` that
  removed the sidebar entirely below 1100px. Added to both dashboards.
- **"4 pending" / "3 to review" badge wrapping fixed.** Root cause:
  `.badge` had no `white-space:nowrap`, so under width pressure its own
  text could wrap onto a second line inside the pill shape. Fixed at the
  source (`white-space:nowrap`, `flex:none` on `.badge`, `flex-wrap:wrap`
  on `.section-title` so the *row* wraps instead of the text inside the
  pill). Also added the suggested shorter variant: below 560px both
  badges show just the number, via paired `.badge-text-full`/
  `.badge-text-short` spans.
- **Membership card mobile stacking** (`dashboard.html`). Below 640px,
  `.hazel-id-body` switches to `flex-direction:column`, giving the
  requested order: logo/Verified chip (already its own row), then avatar,
  then details, then QR - all readable instead of cramped into one row.
- **Org dashboard topbar icons pushed out of place, fixed.** Root cause
  (found via an isolated test case): this project's `wkhtmltoimage`
  screenshot tool doesn't correctly compute a flex item's available width
  before laying out its text when the item uses `flex-grow`/`flex-shrink`
  - it hands the item its full unwrapped content width regardless of
    siblings, even with `min-width:0`. A plain `max-width` or grid `1fr`
    column hit the same problem. The fix that actually works in this
    tool (and is guaranteed to work in real browsers, which don't have
    this limitation): give `.topbar-user` a hard `calc(100% - 160px)`
    width instead of relying on shrink math, so "Hazelton City Council"
    wraps onto 2 lines and the icon cluster keeps its place on the right.
  - **Real, unrelated tool limitation newly confirmed this pass**: this same
    screenshot tool also doesn't support `overflow-wrap: anywhere` at all
    (falls back to no wrapping), unlike `word-break: break-word` which it
    handles fine - relevant if a future pass adds more wrapping text.
- **"Latest Offer Library" mobile restructuring** (`dashboard-org.html`).
  Split the single `.offer-status-inline` wrapper (which held both the
  status chips and the two buttons) into separate siblings -
  `.offer-library-title`, `.offer-library-actions`, `.offer-status-inline`
  - so `order` plus a `flex-basis:100%` break can put the title and
  buttons on one row and the status chips on their own row below, without
  touching the existing desktop layout (title left, chips + buttons
  clustered right, via `margin-right:auto` on the title). Below 640px the
  buttons drop their text labels and become icon-only: a star for "See
  offer library" (same glyph as the sidebar's "Saved offers" icon) and a
  plus for "Create offer". "View offer" on each offer row goes full-width
  below 640px.

**A real regression was introduced and fixed during this pass, and is
worth recording in full.** While verifying the above at desktop width, the
whole "Latest Offer Library" section broke badly - offer titles collapsing
into a single word per line, header buttons cut off. Root-caused through
extensive bisection (rebuilding the page from a known-good baseline and
adding changes back one at a time) to **a fragility in `wkhtmltoimage`
itself, confirmed unrelated to CSS correctness**: past a certain point of
stylesheet complexity, adding literally any further rule to this file -
including a deliberately inert, unused test rule matching no element on
the page - was enough to corrupt this tool's layout computation for
unrelated content elsewhere on the page. This was proven conclusively (not
just suspected) by isolating it down to that single unused rule. It is not
a real bug for actual users: `styles.css` re-parses with zero errors under
a standards-based parser, and an isolated test of just the affected
component (outside the full page's complexity) renders exactly as
designed at mobile width. Two smaller, real duplicate-`@media`-block
issues were also found and fixed along the way (multiple separate
`@media (max-width: 640px)`/`960px)` blocks had accumulated across this
and earlier passes - consolidated into one of each, which is better
practice regardless of the tool issue).

Given this tool's now well-documented fragility at higher complexity,
future passes should expect that a full-page `wkhtmltoimage` render of
`dashboard-org.html` may become unreliable past some point, and should
prefer verifying new mobile/responsive CSS with a small isolated test
snippet (linking the real `styles.css`) rather than trying to screenshot
the entire page, alongside jsdom for structural checks and the CSS parser
for syntax validation.

Re-validated per the established process: `styles.css` parses clean (563
rules, zero errors), jsdom test suite at 57 assertions (all passing), zero
JS errors across every page, and visual confirmation of the mobile drawer
on both dashboards, the badge fix, the membership card stacking, the
topbar wrap, and the full "Latest Offer Library" mobile layout including
the icon buttons and full-width "View offer" - all on the real, complete
page at mobile width, where it matters most.

## Pass 17: dedicated mobile menu control, cog removed

Pass 16 had the cog icon doubling as the mobile sidebar trigger, which the
person flagged as a duplicated/confusing control. Replaced with a proper
dedicated mobile menu button, on both dashboards:

- **Cog/Settings icon removed entirely** from `.topbar-actions` on both
  `dashboard.html` and `dashboard-org.html`. It only ever existed to
  trigger the mobile drawer; with a dedicated control for that, it had no
  remaining purpose.
- **New hamburger button added to the top-left of `.dashboard-topbar`**,
  first element in the row, reusing `.icon-btn`'s circular styling via a
  second `.mobile-menu-btn` class. Wired to the same `mobileSidebarToggle()`
  used by the backdrop. Hidden on desktop, shown below 1100px.
- **`.topbar-user` (name/type) now hides below 1100px** to make room for
  the hamburger, since the org dashboard's long "Hazelton City Council"
  name and the hamburger both competing for top-left space would have
  been cramped. This also retires Pass 16's `calc(100% - 160px)` wrapping
  workaround for the org name, since the element hiding it is now gone
  and the topbar-actions icon cluster is simpler (one fewer icon since
  the cog is gone).
- **Internal sidebar hamburger (`.sidebar-collapse`, used to collapse the
  sidebar to an icon rail) now hides while the mobile drawer is open**
  (`.dashboard-shell.mobile-sidebar-open .sidebar-collapse{display:none}`),
  since collapsing to an icon rail isn't a mobile concept - the back
  button next to it stays visible.

**One real, non-obvious bug found and fixed while building this**: the
first implementation (unconditional `.mobile-menu-btn{display:none}`,
overridden to `display:grid` inside `@media (max-width: 1100px)` later in
the file - the same pattern used successfully elsewhere in this project)
silently failed. The button never appeared on mobile despite the CSS
being textbook-correct per the cascade spec, confirmed via a battery of
isolated test pages that ruled out a simple typo or specificity clash.
Restructuring to the equivalent `@media (min-width: 1101px){
.mobile-menu-btn{display:none} }` pattern instead - hiding on desktop
rather than overriding to show on mobile - fixed it immediately with no
other change. Root cause not fully pinned down (possibly related to the
same rendering-engine fragility documented in Pass 16), but the fix is
confirmed working via direct visual renders on both dashboards at both
mobile and desktop widths, so if a future pass adds another responsive
toggle button, prefer the min-width "hide on desktop" pattern over the
max-width "show on mobile override" pattern used elsewhere in this file,
since only the latter has shown this failure.

Re-validated: `styles.css` parses clean (564 rules, zero errors), jsdom
test suite at 64 assertions (all passing, including new checks that the
cog is gone and the hamburger is wired and positioned first in the
topbar), zero JS errors across every page, and visual confirmation on
both dashboards of the closed mobile state (hamburger top-left, no cog,
name hidden), the open drawer state (internal collapse hidden, back
button still visible), and the desktop state (unaffected - no hamburger,
name shows normally).

## Pass 18: search bar stays on the top row on mobile

Small follow-up to Pass 17. On both dashboards, the search bar previously
dropped to its own full-width row below the hamburger/icons row on
mobile (`order:3;width:100%`). Changed to `flex:1;min-width:0` instead,
so it now sits on the same top row, filling the space between the
hamburger button and the help/avatar icons - one row instead of two.
Desktop is unaffected (that CSS only applies below 1100px).

Re-validated: `styles.css` parses clean (564 rules, zero errors), full
jsdom suite still at 64 passing assertions, zero JS errors across every
page, and visually confirmed on both dashboards at mobile width (search
bar correctly fills the row) and desktop width (unchanged).

## Pass 19: fixed horizontal overflow from Pass 18's search bar change

Pass 18 gave `.dashboard-shell .searchbar` `flex:1;min-width:0` so it
could shrink to share the top row on mobile, but missed that its child
`<input>` still had no `min-width:0` of its own. A flex item's automatic
minimum size defaults to its content size unless overridden - the input's
placeholder text ("Search offers, users, campaigns...") has a real
intrinsic width, and without `min-width:0` the input refused to shrink
below that, forcing the search bar (and the whole topbar row) wider than
the viewport. That's what caused the placeholder text spilling out of
the pill and the horizontal scrollbar.

Fixed by adding `min-width:0` to `.dashboard-shell .searchbar input` as
well, and `flex:none` to the search icon `<svg>` so it can't get squeezed
either. Both are additive, desktop-safe changes (the search bar has
plenty of room at desktop widths regardless).

Checked specifically for recurrence this time: scanned the full page's
right-hand edge pixel column across its entire height in the rendered
mobile screenshot for any bleed past the 390px canvas (found none, solid
background throughout), and spot-checked the Action Center and Offer
Library header sections too.

Re-validated: `styles.css` parses clean (565 rules, zero errors), full
jsdom suite still at 64 passing assertions, zero JS errors across every
page, and visually confirmed no overflow on both dashboards at mobile
width.

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
