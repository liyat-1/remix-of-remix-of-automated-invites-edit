# Directful Marketing Messages UX overhaul

## Goal

Reorganize the existing product around a clear global-default and campaign-override model, while preserving every working marketing, campaign, template, layout, and media capability. The finished interface will use Directful blue, compact white surfaces, restrained borders and shadows, and a denser hotel-operations hierarchy.

## What will change

### 1. Marketing Messages frame and global controls
- Present **Marketing messages** as the product area with Automated invites, Automated transactional, and Drip campaign navigation.
- Keep **Copy from...** at the page level and add the compact complimentary-text banner with **Create a drip campaign**.
- Add a global **Promotions** area for Direct and OTA defaults, plus **Manage promotions**.
- Keep global **Enable all campaigns**, **Manage channel strategy**, and **Revert to suggested content** actions, with confirmation for destructive bulk resets.

### 2. Promotion model
- Add a reusable promotion catalog with names, offer details, audience relevance, and search.
- Store separate Direct and OTA global defaults.
- Allow each campaign to inherit the default, override it with another promotion, or explicitly use no promotion.
- Add a contextual promotion selector titled for the campaign being configured, supporting select, change, remove, and creation.

### 3. Campaign cards and actions
- Give every campaign a specific purpose line rather than repeating message copy.
- Show active state, one of the three supported channel strategies, Direct/OTA channel-level Default or Customized status, and effective promotion.
- Keep **Test** and **Edit content** visible; move promotion, revert, and enable/disable into a lightweight overflow menu.
- Retain editor attribution and timestamps beside customization information.

### 4. Safe content editing
- Add a contextual **Edit automated content** confirmation showing the selected campaign, timing, guest types, and strategy.
- Change the editor from immediate writes to a local draft with explicit **Save changes**.
- Warn before discarding unsaved work, before reverting customized content, and before saving substantial changes to an active campaign.
- Scope campaign reverts to the selected campaign and current guest/channel configuration; global revert remains a separate bulk action.

### 5. Editor hierarchy
- Show the campaign name and timing in the editor header with a clear return to its parent section.
- Keep Direct and OTA content separate, then Text and Email separate within each guest type.
- Track customization independently for Direct Text, Direct Email, OTA Text, and OTA Email.
- Keep personalization, character count, and media within Text only.
- Remove media attachments from Email while preserving its selected template, layout, subject, preview text, content fields, and live preview.

### 6. Templates and layouts
- Keep templates and layouts as distinct visual libraries using real hotel imagery.
- Define available pre-made layouts per template; choosing a template loads its default layout.
- Preserve written content when changing layouts.
- Warn before changing a template only when customized content could be replaced, and explain what will be preserved.

### 7. Channel strategy bulk workflow
- Enter selection mode only after **Manage channel strategy** is chosen.
- Stage strategy assignments without changing saved campaigns immediately.
- Keep a floating control visible while scrolling, with dynamic groupings under Text only, Text + Email, and Text with Email fallback.
- Support selecting different groups in sequence, then commit all staged changes once with **Apply** or discard them with **Cancel**.

### 8. Media management
- Keep centralized Media under Marketing Assets for upload, drop, folder creation, rename, move, deletion, preview, search, and filtering.
- Make folder changes immediately available inside the Text editor.
- Keep search global across folders and add upload/drop directly inside the Text media picker.
- Add confirmation before deleting a folder and its contents.

### 9. Drip campaign alignment and visual polish
- Retain the existing Drip Campaign builder and its promotions, sequence, content, and test functionality.
- Remove Email only from its channel choices so the product consistently exposes exactly the three approved strategies.
- Apply the semantic Directful blue system and the same compact typography, spacing, controls, and interaction states throughout the marketing experience.

## Technical details
- Extend the existing local marketing store and migration logic for promotions, campaign overrides, per-channel customization, and campaign purpose text.
- Reuse the existing dialog, alert-dialog, dropdown-menu, and button primitives rather than native browser dialogs.
- Keep all presentation colors behind semantic tokens; remove remaining hardcoded marketing colors and gradients touched by this work.
- Preserve existing routes and add no backend dependency; this remains a fully interactive local product prototype.

## Validation
- Verify global promotion inheritance and campaign overrides.
- Verify campaign and global revert scopes.
- Verify edit confirmation, explicit save, active-campaign confirmation, and unsaved-change protection.
- Verify staged strategy grouping, cancel, and one-time apply behavior.
- Verify Direct/OTA and Text/Email independence plus channel-level customization states.
- Verify text media search, folders, upload/drop, and centralized media organization.
- Verify template and layout selection, content preservation, and live preview.
- Check Automated invites, Automated transactional, In-property, Drip campaign, and Media at desktop and phone widths with no console errors.