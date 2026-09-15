# Hazel Card — Project Handover

Static HTML/CSS/vanilla-JS prototype for the Hazel Card application: a component
library (`components.html`) plus a growing set of real application pages built
on top of it. No build step, no framework — every page is a single self-contained
`.html` file that pulls in the shared `styles.css`.

This document exists to bring a fresh chat up to speed. The next piece of work
is a **CSS cleanup pass**: consolidating patterns that have accumulated across
many pages, tidying up naming, and making sure `components.html` documents
everything that's actually in use. Read this whole document before starting
that work — Section 6 specifically flags what needs attention.

---

## 1. IMPORTANT — file sync status

The user has **local edits to four files that are newer than what's in this
environment**: `home-readiness.html`, `my-health.html`, `my-money.html`, and
`curriculum-completed.html`. Only `curriculum-completed.html` was actually
re-uploaded and applied in this session (see Section 7). **Before doing any
work on `home-readiness.html`, `my-health.html`, or `my-money.html`, ask for
current copies** — do not assume the versions in this handover/zip are
up to date for those three.

`firm-recommendation.html` was also uploaded this session as a reference (it
matched the existing build exactly, no local edits) and was then redesigned —
see Section 7.

---

## 2. Hard rules (apply to every file, every edit)

- **No em dashes** anywhere in copy.
- **All buttons pill-shaped** (`--radius-pill: 999px`).
- **CRLF line endings throughout, always.** Every `.html` and `.css` file in
  this project uses `\r\n`. When editing with a script, read/write files as
  **raw bytes**, never as Python text mode — text mode applies universal
  newline translation and silently converts everything to LF. This has bitten
  us more than once; always verify with a byte-level CRLF count after any
  scripted edit.
- **`components.html` has the full `styles.css` embedded inline** in
  `<style id="mainStylesheet">` (needed for the "View code" feature to work
  over `file://`). Whenever `styles.css` changes, this embedded copy must be
  resynced — replace everything between that opening tag and `</style>`.
  Verify by diffing the extracted block against the real `styles.css`; they
  must be byte-identical.
- **Test everything with Playwright** (Chromium headless at
  `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`)
  before considering a change done. At minimum: load the page and check for
  console/page errors, and click through any new interactive element.

---

## 3. Full page inventory

### Component library
| File | Purpose |
|---|---|
| `components.html` | The component catalogue/library. Every reusable pattern should eventually be documented here with a live demo and "View code". **Currently behind** — several patterns built across recent pages are not yet catalogued here. This is the main gap for the next session's cleanup pass. |
| `styles.css` | The single shared stylesheet. ~1,820 lines. |

### Core dashboard shell
| File | Purpose |
|---|---|
| `dashboard.html` | Member-facing dashboard (persona: Sunny Barker). |
| `dashboard-org.html` | Org/council-facing dashboard (persona: Hazelton City Council). |
| `index.html` | Landing/entry page. |
| `create-offer.html` | Standalone offer-creation wizard — this is the **original reference** for the `.owizard-*` stepper pattern later reused in `guarantor-scheme.html`. |

### My Home group (top-level sidebar)
| File | Purpose | Status |
|---|---|---|
| `my-home.html` | "My Home" overview — curriculum cards (Home Essentials, Life Skills, Planning My Move, etc). | Built. **User has newer local copy** (see Section 1). |
| `home-ready-essentials.html` | Young-person view of the Home Essentials curriculum (24 items across 4 sections, click-through detail panel, shared/discussion notes, Mic/Upload/AI action buttons). | Built. **User has newer local copy.** |
| `home-ready-essentials-pa.html` | PA/support-worker view of the same curriculum. Adds: PA-view badge, Download PDF button, Upload button on Resource Documents (+ per-document Edit/Remove), Outcome-for-topic 3-box workflow (Complete / Needs more support / Ready for assessment — genuinely gated), restored Assessment section, Section-achievement notice. | Built, stable. |
| `curriculum-completed.html` | Success page shown once Home Essentials is 100% complete. Big green tick, Curriculum Summary checklist (View buttons to Guarantor Scheme / Firm Recommendation / Planning My Move). | **Just updated** this session — see Section 7. |
| `firm-recommendation.html` | "Request a Firm Recommendation for Social Housing" page. | **Just redesigned** this session — see Section 7. |
| `guarantor-scheme.html` | 5-step wizard (Eligibility → Property → Application (placeholder) → Charter & Signature → Approval) using the `.owizard-*` pattern from `create-offer.html`, wrapped in `.wizard-container.page` inside the dashboard shell. Interactive signature boxes (dropzone-style), live signed-count. | Built, stable. |

### Planning My Move (reached via curriculum cards on `planning-my-move.html`)
This is the big architectural family. All five of these pages share **one
identical pattern** — see Section 4 for the full breakdown.

| File | Category card it's linked from | Status |
|---|---|---|
| `planning-my-move.html` | (the hub page itself — 6 category cards) | Built. Each card's whole body + Continue button are both clickable (only for the 3 built destinations; unbuilt categories are inert). |
| `my-money.html` | My Money | Built. **User has newer local copy** (see Section 1). |
| `home-readiness.html` | My Home | Built. **User has newer local copy.** Note: filename is `home-readiness.html`, not `my-home-2.html` or similar — chosen specifically to avoid colliding with the top-level `my-home.html` overview page. Page title reads "My Home" even though the filename differs. |
| `my-health.html` | My Health | Built. **User has newer local copy.** |
| `my-area.html` | My Area | Built, stable. 6 sections (Overview, Transport, Important Places, My Support Network, Community & Local Life, Emergency Help — Emergency Help was split into its own tab after initially living on the Overview). |
| `people-support.html` | People & Support | Built, stable. Deliberately distinct from the separate "My Trusted Network" sidebar feature — this is scoped to "people helping with this specific move," not the wider trusted-network concept. |

---

## 4. The "5 (or 6) section tab" pattern

`my-money.html`, `home-readiness.html`, `my-health.html`, `my-area.html`, and
`people-support.html` are all built from **one identical architecture**. If
you understand one, you understand all five. This is the pattern to formalize
in `components.html` during the cleanup pass.

**Layout**: `.hre-layout` (flex row) containing `.hre-sidebar` (narrower,
sticky) and `.hre-main` (flexible width) — this itself reuses the two-column
layout first established on `home-ready-essentials.html`.

**Left nav**: a list of `.money-nav-item` boxes (yes, the class name says
"money" — it was named for the first page built, `my-money.html`, and then
reused as-is on every subsequent page rather than renamed. **This is exactly
the kind of naming debt the CSS cleanup should address** — consider renaming
to something generic like `.section-nav-item` and updating all five pages in
one pass). Each item: an icon circle + title + a live caption (e.g. "Added",
"3 saved", "1 of 6 completed"). Clicking sets it active (teal border, pale
teal background — the `:not(.active):hover` rule specifically avoids touching
`border-width`, only `border-color`, to prevent a bug where an earlier hover
implementation shifted content sideways by resetting the 3px active-state
border back to 1px).

**Right content**: one `<div id="xContent">` whose `innerHTML` is fully
replaced on every navigation/edit via a `renderXContent()` function and a
`renderers` object keyed by section id. No virtual DOM, no diffing — brute
force full re-render, which is fine at this scale but does mean text inputs
use `onchange` (fires on blur) rather than `oninput`, specifically to avoid
wiping focus/cursor position on every keystroke.

**Shared data model**: one plain JS object per page (`MONEY_DATA`,
`HOME_DATA`, `HEALTH_DATA`, `AREA_DATA`, `SUPPORT_DATA`) holding everything
for that page, pre-filled with sample data. All in-memory — no
`localStorage`, no backend. Repeatable lists (income streams, providers,
places, tasks, contacts) use a shared incrementing id counter and standard
add/update/remove functions per collection.

**The Overview tab** is the one place these five pages diverge slightly by
age:
- `my-money.html`'s Overview uses `summaryRow()` (label/value rows, with
  `.total`/`.tight`/`.big` modifiers — `.tight` removes a row's own
  bottom border when the next row is a `.total`, to avoid a doubled-line
  visual bug; `.big` bumps font size for the single most important figure).
- `home-readiness.html`, `my-health.html`, `my-area.html`, and
  `people-support.html`'s Overviews were built **later** and use a different,
  preferred pattern: a bordered list of `.curr-item` rows (reusing the marker
  circle + title + trailing button shape from the Eligibility Check on
  `guarantor-scheme.html` and the Curriculum Summary on
  `curriculum-completed.html`), each with a ticked/unticked marker and a
  **View** button that jumps straight to that section. **This is the pattern
  to standardize on** — if `my-money.html` gets touched during cleanup,
  consider migrating its Overview to match (the user explicitly asked for
  this migration on My Health's Overview partway through the project and
  confirmed they liked it better).

**Status box**: every Overview ends with a `renderXStatusBox()` — reuses the
same visual shape everywhere (icon circle + `.h3` title + `.small` paragraph,
colored via `--success-soft`/`--warning-soft`/`--info-soft` background pairs)
but each page supplies its own copy and its own thresholds. Thresholds are
always named constants (e.g. `AFFORDABILITY_RULES.tightBuffer`,
`READINESS_RULES.nearlyReadyMax`) rather than magic numbers, specifically so a
backend dev can retune them later without hunting through logic.

**Reused form primitives** (all pre-existing, none invented for this
pattern): `.field` / `.label` / `.input` / `.select` / `.textarea`,
`.field-grid` (2-column, collapses to 1 column under 640px), `.segmented` +
`.seg-btn` (Yes/No toggles, e.g. "Is this your current provider?"), and the
repeatable-card pattern (`.card.padded` with `background:var(--surface-2)`,
category `<select>` + remove icon-button in the header row, fields below).

**Known micro-bug pattern to watch for**: inline `style="flex:1"` /
`style="flex:2"` on row children will silently override mobile media-query
rules that try to set `flex-basis:100%` for stacking (inline styles always
win). This has been hit and fixed twice (once on `my-money.html`'s income/
expenditure rows, once on the furniture-style rows in `home-readiness.html`).
The fix each time was to move the sizing into a CSS rule like
`.money-item-row > *:not(button){flex:1}` /
`.money-item-row > *:first-child{flex:2}` with a matching mobile override,
and strip the inline styles from the row-generator JS. **When auditing CSS,
grep for `style="flex:` inside any `*RowHtml(` function and check the mobile
behavior specifically.**

---

## 5. Sidebar navigation map

The sidebar is duplicated verbatim (not templated — this is static HTML) at
the top of every page. The "My Home" group's sub-items, in order:

1. Overview → `my-home.html`
2. Home Essentials → `home-ready-essentials.html`
3. Home Essentials PA → `home-ready-essentials-pa.html` *(added "temporarily"
   per the user — flag for removal/promotion decision at some point)*
4. Life Skills → `#` (not built)
5. Planning My Move → `planning-my-move.html`
6. Firm Recommendation → `firm-recommendation.html`
7. Guarantor Scheme → `guarantor-scheme.html`

**Deliberately NOT in the sidebar**: `my-money.html`, `home-readiness.html`,
`my-health.html`, `my-area.html`, `people-support.html`, and
`curriculum-completed.html`. These are second-level pages reached only via
in-page navigation (curriculum cards on `planning-my-move.html`, or the
Submit-button flow on `home-ready-essentials.html`). This was a deliberate,
confirmed decision — don't "fix" it by adding them to the sidebar without
checking first.

Other sidebar groups (My Work, My Journey) and standalone items (My Support
Plans, Claimed Offers, My Calendar, Messages, My Trusted Network) are all
placeholder `href="#"` — not built, not in scope so far.

---

## 6. Known issues / CSS cleanup candidates

This is the punch list for the next session:

1. **`.money-nav-item` naming.** Used identically on 5 pages, only one of
   which is about money. Rename to something generic.
2. **Two different Overview patterns co-exist** (`summaryRow()` label/value
   list on `my-money.html` vs. the checklist-with-View-button on the other
   four). Decide whether to migrate `my-money.html` for consistency.
3. **`components.html` is behind.** None of the following are catalogued
   there yet, despite being established, reused patterns: the 5-tab section
   layout (`.hre-layout`/`.hre-sidebar`/`.hre-main`), `.money-nav-item`, the
   checklist-row-with-View-button pattern, `.progress-ring` (full circular
   ring — distinct from the pre-existing `.hazel-progress-dial` half-circle
   gauge, easy to confuse), `.field-grid`, the repeatable-card-list pattern,
   `.summary-row` and its modifiers, `.hre-section-num` (plain and `.filled`
   variants), the `.owizard-*` wizard stepper (exists from `create-offer.html`
   but may not be documented either — check), `.icon-btn-ai` (the gradient
   AI-assist icon button variant), `.dropzone` reused as a signature-capture
   UI on `guarantor-scheme.html`, and the `.curr-item`/`.marker` checklist row
   (originally from the curriculum click-through, now reused everywhere for
   "list of things with a status and maybe a button").
4. **Heavy reliance on inline `style="..."` attributes** throughout every
   page built after `components.html` itself. This was a deliberate
   speed/pragmatism tradeoff during rapid page-building, but a lot of it
   (spacing, flex layout, one-off color overrides) could reasonably be
   promoted into real classes now that patterns have stabilized across 5+
   pages using the same inline combinations repeatedly.
5. **`.info-tip` has accumulated modifiers** (`.tip-below`, `.tip-wide`,
   `.tip-align-right`) added incrementally as specific pages needed them.
   Worth reviewing whether these should just be the default behavior with an
   opt-out, rather than three separate opt-in modifiers.
6. **The flex/inline-style mobile-stacking bug** described in Section 4 —
   worth a proactive grep across all row-generator functions rather than
   waiting to hit it again on the next new page.
7. **`.btn-complete` vs `.btn-submit-ready`** — two different "success,
   solid-colored button" variants exist for subtly different semantics
   (`.btn-complete` is non-interactive/`cursor:default` for a finished state;
   `.btn-submit-ready` is the same visual but stays clickable). Worth
   confirming this distinction is intentional and documenting it clearly
   rather than letting a future edit merge them incorrectly.

---

## 7. This session's changes

1. **`curriculum-completed.html`** — adopted the user's locally-edited version
   as-is (moved the "View Certificate" button to sit inside the top green
   card, directly after the description, rather than as a separate full-width
   button below the Curriculum Summary card).
2. **`firm-recommendation.html`** — redesigned to match
   `curriculum-completed.html`'s visual language:
   - Top card changed from a horizontal icon+text+button layout to the same
     big centered 96px green tick circle, `.h3` title, description, and
     button-inside-the-card pattern.
   - "What happens next?" rows changed from plain padded flex rows to the
     exact `.curr-item` structure used by "Curriculum Summary" (bordered list
     container, `align-items:center` override, bold `.curr-item-title` text)
     — kept the numbered circles (`.hre-section-num.filled`) instead of
     checkmarks since these are sequential steps, not completed items, and
     kept all original step text unchanged. No trailing button on these rows
     since there's nothing to navigate to per step.
   - Verified via side-by-side screenshot comparison against
     `curriculum-completed.html` and confirmed the two now share an
     identical visual pattern.
3. Full 17-page regression run — zero console errors.

---

## 8. Not yet built (out of scope so far, for reference)

- Life Skills, My Growth Map, Evaluation, Opportunities (sidebar links exist,
  all `href="#"`)
- My Support Plans, Claimed Offers, My Calendar, Messages, My Trusted Network
  (standalone sidebar items, all `href="#"`)
- Real backend/persistence anywhere — everything is in-memory sample data,
  by design, per the user's explicit "keep the code light, a backend dev
  will wire it up later" direction early in the project
- `guarantor-scheme.html` Step 3 ("Submit Application") is a deliberate
  placeholder — the user said they didn't yet know what should go there
