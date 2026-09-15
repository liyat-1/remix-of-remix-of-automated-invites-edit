# Marketing Messages workflow and UI refinement

## Goal

Restore the simpler campaign-management patterns, move promotions into the right workflows, and polish the full Marketing area without changing Directful’s blue visual identity or removing existing safety behavior.

## Campaign list and cards

- Replace the small `ON/OFF` card label with the familiar interactive toggle on every campaign card.
- Keep the page-level action state-aware: show **Enable all campaigns** unless every campaign is active, then show **Disable all campaigns**.
- Remove campaign timing, descriptive message-purpose copy, Direct/OTA `Default/Customized` rows, and promotion details from cards.
- Restore the compact updater treatment near the card footer: avatar/initials, editor name, and readable update date/time, with the existing detailed tooltip where useful.
- Retain Test, Edit content, overflow actions, enabled state, strategy, and selection affordances.

## Channel strategy management

- Keep card checkboxes hidden until **Manage channel strategy** is active.
- Add **Select all** / **Clear all** beside the management controls.
- Restore a compact, polished floating strategy panel based on the earlier three-strategy treatment.
- Under each strategy, show the currently staged invite names as chips; display at most three names and summarize the rest as `+N more`.
- Preserve staged behavior: selection changes only the draft assignment, **Apply changes** commits it, and cancel/close discards it.

## Promotion management

- Replace the single promotion picker opened from **Manage promotions** with a two-part assignment workspace:
  1. **Invites**: select one or more campaigns, then choose Direct, OTA, or both for each; include global Direct guests and OTA guests choices for applying a default broadly.
  2. **Promotions**: search, select, create, or remove the promotion to assign.
- Stage assignments until **Apply**; keep **Done/Close** separate so accidental clicks do not immediately change campaigns.
- Update the promotion state so Direct and OTA can hold independent campaign overrides instead of one shared campaign promotion.
- Move per-campaign promotion controls into the editor, with a clear promotion section in both the Direct and OTA content views showing inherited, custom, or no promotion.
- Fix dialog height, clipping, and scrolling so all promotion cards and controls remain visible on smaller screens.

## Edit warning and editor overlay

- Keep Edit content opening a closable overlay with a visible X and the current explicit Save / unsaved-change safeguards.
- Replace the current confirmation copy with a short warning: editing affects future invites only; previously sent invites are unchanged.
- Keep Direct and OTA content independently editable.

## Text media and media library

- Enforce media attachments for Text only; remove email media state and any email preview dependence on attached library media.
- In the Text media picker, remove the folder-button/sidebar navigation beneath search, while keeping search and file-type filtering useful.
- Give media tiles a stable, readable height and make the results area scroll independently.
- Restyle the top upload action as a clear blue icon button and retain drag-and-drop upload.
- Keep folders in the central Media page, where they belong.
- Add representative PPTX, CSV, XLS/XLSX, DOC/DOCX, and PDF samples with recognizable file visuals alongside existing images and videos.

## Email templates and layouts

- Expand the template library with more realistic choices.
- Replace image-only template cards with miniature email previews showing the actual hero, heading/body hierarchy, and CTA styling; keep the library scrollable.
- Restore and expand the layout set with more structural variations.
- Make layouts structure-only: selecting one rearranges the current template’s existing image, heading, body, and CTA without adding, removing, or replacing content.
- Show accurate miniature layout previews and keep the live email preview visible while browsing layouts.

## Visual polish and validation

- Apply a restrained Directful blue system, stronger hierarchy, consistent spacing, aligned controls, and stable card/modal sizing across all Marketing pages.
- Preserve existing navigation, campaign testing, reverts, draft/save behavior, media-folder management, and other working actions.
- Verify campaign toggles, bulk strategy assignment, per-audience promotions, warning/close/save flows, Text media upload/library selection, template selection, and layout preservation in the live preview.
- Check desktop and narrow mobile widths for clipping, overlap, readable media/template previews, and independent scrolling.

## Technical notes

- This remains a front-end/local-state refinement; no backend or sending infrastructure is added.
- Campaign promotion storage will change from one campaign-wide override to per-audience overrides, with backward normalization for the current seeded state.
- Email template content remains the source of content; layouts only determine rendering order and proportions.