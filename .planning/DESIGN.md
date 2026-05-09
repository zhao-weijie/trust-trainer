---
version: alpha
name: Trust Trainer
description: Warm, content-first safety-training UI for low-friction uploads, PII verification, simple drills, and skill dashboards.
colors:
  primary: "#3B82F6"
  primary-hover: "#2563EB"
  primary-bg: "#EFF6FF"
  app-bg: "#FFEBD0"
  panel-bg: "#FFF1E0"
  card-bg: "#FFF8EF"
  border: "#AA9C8B"
  text: "#554E45"
  text-muted: "#AA9C8B"
  white: "#FFFFFF"
  success: "#10B981"
  danger: "#EF4444"
  reserved-accent: "#C026D3"
typography:
  h2:
    fontFamily: Roboto
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  h3:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
  body:
    fontFamily: Roboto
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  label:
    fontFamily: Roboto
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0
  mono-caption:
    fontFamily: Roboto Mono
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.04em
rounded:
  xs: 3px
  sm: 6px
  md: 8px
  lg: 12px
  full: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 24px
components:
  analytics-panel:
    backgroundColor: "{colors.panel-bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    width: 400px
  card:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  button-ghost:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  input:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  segmented-control:
    backgroundColor: "{colors.app-bg}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
  segmented-control-active:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary}"
    rounded: "{rounded.xs}"
    padding: "6px"
  tab-active:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.primary}"
    padding: "10px 16px"
  floating-panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
---

## Overview

Trust Trainer is a mobile-friendly safety workflow for turning suspicious digital content into reviewed scam-awareness drills. The interface should feel calm, trustworthy, and practical: users paste or upload suspicious content with very little friction, immediately verify that PII was masked and links were defanged, then get a cautious scam status or send the case into admin review.

The current visual identity combines warm neutral surfaces with clear blue interaction states. The main submitted content should feel like the immersive base layer, while the analytics panel contains the primary actions and decision controls. Preserve generous mobile touch targets, obvious focus states, and strong separation between AI prefilter output and human-approved training content.

## Colors

- **Primary (#3B82F6):** Main interaction color for submit, review, approve, publish, tabs, focus rings, links, and selected drill answers.
- **Primary Hover (#2563EB):** Stronger blue for hovered primary actions, active tabs, and selected drill states.
- **Primary BG (#EFF6FF):** Pale blue for focus rings, draft badges, selected surfaces, and review queue highlights.
- **App BG (#FFEBD0):** Warm app shell color and segmented-control background.
- **Panel BG (#FFF1E0):** Main workflow panel base for intake, admin review, drills, and dashboard sections.
- **Card BG (#FFF8EF):** Default surface for cards, inputs, review rows, drill options, labels, and compact result panels.
- **Border / Muted (#AA9C8B):** Shared muted text, dividers, borders, status metadata, scrollbar thumbs, and quiet icons.
- **Text (#554E45):** Main body, labels with emphasis, submission text, table values, and card headings.
- **Success (#10B981):** Verified safe/legitimate cues, correct drill feedback, approved status, and positive progress markers.
- **Danger (#EF4444):** Scam risk, unsafe action feedback, blocking validation, and fatal loading or API errors.
- **Reserved Accent (#C026D3):** Reserved accent token for one-off semantic emphasis such as weak-skill highlights or family challenge comparison; do not make it a dominant brand color.

Use status colors sparingly. Blue is for user actions and selected states, green is for approved/correct/legitimate outcomes, and red is for scam risk or unsafe choices. Do not use color alone for scam judgments; pair status color with text labels and explanations.

## Typography

Roboto is the interface font. Roboto Mono is reserved for compact numeric labels, especially dashboard metrics, dataset fields, and small status counters.

Use restrained sizes: 18px for screen titles, 14px for card headers, 13px for controls, submission previews, drill choices, and table rows, 12px for labels and metadata, and 10-11px for dense badges or dataset fields. Avoid hero typography; this is a working safety tool, not a campaign page.

## Layout & Spacing

The first viewport should start with the submitted or sample suspicious content as the base layer. The content preview is the main object on screen: text message, email, link, screenshot placeholder, or seeded artifact. PII masking and URL defanging should be visible directly on that artifact so the user can quickly verify what was uploaded is safe to analyze.

The analytics panel sits above or beside the base content layer and holds the primary actions: paste/upload, run check, confirm redaction, submit for review, approve, publish, next drill, and dashboard filters. Desktop can place the panel on the right or left at 400px wide. Mobile can turn it into a bottom sheet that exposes the content layer behind it and expands when actions or results need attention.

Use an 8px rhythm: 8px gaps for compact rows, 12px for filter grids and internal separation, 16px card padding, 20px panel padding, and 24px for panel placement or floating handles. Controls should remain compact but never cramped.

Cards inside the analytics panel should stack vertically with clear grouping: upload/intake action first, redaction confirmation second, result and next action third, optional submit-for-review fourth. Admin views should prioritize review queue, editable LLM prefilter, drill draft, publish action, and dataset fields. Drill views should prioritize the scenario in the base layer and keep the panel focused on answer choices, immediate feedback, red flags, safest action, and skill progress.

## Elevation & Depth

Use depth only to separate the analytics panel from the base content layer. The base content should not look like a nested card; it is the main canvas. Main panels use a soft 0 4px 20px shadow and optional backdrop blur. Cards, review rows, and drill options use a lighter 0 1px 3px shadow. Dialogs or submission previews may use a slightly stronger 0 4px 12px shadow.

Avoid decorative depth, floating marketing sections, or nested cards. Depth should clarify hierarchy between intake, result, review, drill, and dashboard states.

## Shapes

Use 12px radius for the main panel and mobile sheet, 8px for cards and popups, 6px for inputs and primary controls, 4px or 3px for inner segmented-control states and small labels, and circular shapes only for the panel toggle or semantic round badges.

Selected drill choices, active tabs, and focused input states are blue with clear outlines or filled selected surfaces. Incorrect choices should not disappear after reveal; keep them visible with short, specific feedback about the missed cue.

## Components

**Base Content Layer:** The main visual layer for uploaded or seeded suspicious content. It should show the artifact itself, masked PII, defanged URLs, highlighted red flags after analysis, and enough surrounding context for easy human verification. This layer carries the immersive feel.

**Analytics Panel:** Primary action rail for the current workflow. It contains upload/paste controls, redaction confirmation, scam status, safest action, review/publish controls, drill answer controls, and dashboard filters. It should feel like a compact cockpit, not the place where all content is trapped.

**Cards:** Use inside the analytics panel for grouped workflow steps: upload action, redaction confirmation, scam result, review item, drill draft, answer feedback, dataset row, and skill summary. Headers may be collapsible and use Lucide icons. Do not nest cards.

**Inputs:** Use full-width text areas, file inputs, and link inputs with 13px text, 6px radius, muted borders, and blue focus rings. Intake fields must make pasted or uploaded content easy to review before submission. Upload should feel low-friction: paste text, drop a file, or pick a seeded artifact without mode confusion.

**Buttons:** Primary buttons are filled blue with white text for check, submit for review, approve, publish, and next-question actions. Ghost buttons are border-only with muted text and become warmer on hover. Icon buttons should use Lucide icons and compact square hit areas.

**Segmented Controls:** Use for mode switches such as Check, Review, Drill, Dashboard, or scam status filters. The active segment is white, blue, and slightly elevated.

**Tabs:** Use understated bottom-border tabs. Active tabs are blue with a 2px blue underline.

**Stat Tables:** Two-column key-value tables for exact fields and counts: review status, dataset row labels, attempts, accuracy, weak skills, and published question counts. Use them when the user needs precise values, not a trend.

**Charts:** Compact aggregate visuals for trends or distributions only: skill progress over time, weak-skill mix, approved question growth, or family-level comparison. Do not use charts for single-case results.

**Result Panels:** Single-case decision surfaces for the uploaded artifact: scam status, red flags, safest action, caution notes, redaction notice, and human-review state. LLM-only outputs must be labeled as draft or suspected, not verified.

**Review Queue Rows:** Dense rows showing redacted content, source, scam status, scope status, review status, and draft teaching labels. Seeded examples should be visually indistinguishable from submitted examples except for a clear source label.

**Drill Options:** Answer choices should be large enough for mobile taps, stable in height, and framed around the safest next action. The drill UI should be simple and slick: one scenario, 3-4 plausible actions, one tap to answer, immediate feedback. After answering, show correct answer, red flags, safest action, and missed cue feedback.

**Dataset Labels:** Approved items must expose `scope_status`, `threat_type`, `risk_level`, `red_flags`, `safest_action`, and `skill_tags`. Do not hide teaching labels behind purely visual summaries.

## Do's and Don'ts

Do make the uploaded content, redaction notice, and result visible immediately.

Do use the base layer for the suspicious artifact and the analytics panel for primary actions.

Do favor compact controls, tabs, collapsible cards, and tables over explanatory prose.

Do use blue only for actions, selection, focus, links, and charts.

Do preserve warm neutral surfaces so suspicious content, redaction, and review fields stay readable.

Do use Lucide icons for recognizable actions and section headings.

Do keep AI prefilter output visually distinct from human-approved and verified states.

Do defang suspicious URLs before display, for example `hxxps://example[.]com/login`.

Don't make a landing page, hero, decorative illustration, or marketing layout.

Don't introduce a new dominant palette, especially purple, unless it is a limited semantic accent.

Don't treat spam as phishing, or hide out-of-scope/reject states.

Don't use large rounded cards inside other cards.

Don't add visual noise that competes with uploaded content, redaction verification, scam status, answer choices, review labels, or dashboard metrics.
