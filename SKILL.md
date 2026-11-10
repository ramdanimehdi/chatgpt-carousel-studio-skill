---
name: chatgpt-carousel-studio
description: Create personalized Arabic social carousels with GPT image generation and a reusable browser editor for ChatGPT Work or Codex. Use for carousel copy, visual templates, editable slides, PNG/ZIP export, publication history, daily batches every three hours, and optional GoHighLevel integration. Supports Windows, macOS and cloud Node hosting.
---

# ChatGPT Carousel Studio

أنشأ هذا السكيل مهدي رمضاني، ونعمل على تحسينه وتطويره باستمرار.
This is the ChatGPT edition; do not substitute a Claude-specific design workflow.

## First use
Ask only for missing essentials: domain, audience, language/tone, name/brand, visual preferences, offer/services and links, desired CTA, timezone. Never copy the author's offers, photos, credentials or accounts. Store nonsecret preferences in the user's workspace or editor brand settings; ask before publishing them publicly.

Read references/workflow.md for content and visual production. Read references/editor.md before launching or changing the editor. Read references/ghl.md only when GHL is requested.

## Deliver the workflow
1. Establish one useful, specific idea and reader outcome. Honor idea-only or copy-only requests.
2. Draft nine slides by default: a concrete hook, useful explanation/examples, actionable summary or CTA, then the user's fixed services slide. Never invent service prices, guarantees, sources or performance statistics.
3. Use GPT's available image-generation tool when artwork is requested. Do not claim a specific image-model version if the tool does not expose it. Inspect Arabic legibility, arrows and consistency. Preserve approved images unless revision is requested.
4. For Arabic use RTL, Cairo, Latin digits, 1080×1350, correct LTR isolation for English/URLs. Use a consistent palette chosen by the user. Label diagrams accurately and never invent chart data.
5. Copy assets/editor into an independent user workspace using scripts/copy_editor.py. Do not modify the installed template with runtime content.
6. Open the editor, import generated images into slides, attach captions/alt text, add the user's signature slide, and export PNG/ZIP as requested. Flattened generated text is changed by regenerating the image, not by editing an invisible text layer.
7. Preserve project IDs, manual edits and publication records on updates. Back up before migrations. Local browser storage is per device/origin; export/import backup for transfer.
8. Mark an item published only using actual remote confirmation or a user-entered real publication date. Scheduled time is not actual publication time. Do not invent dates for old posts.
9. Exclude published, scheduled and uncertain submissions from repeat sending. Preview the chosen day, recipients, ordering, omitted scripts and times before initiating a batch. Space posts three hours apart; allow midnight rollover.
10. Treat scripts as scripts, never ready videos. Do not publish or schedule automatically just because content was designed.

## Tools and cost
Prefer available connectors. Use GPT text reasoning for preparation; image generation is a separate capability. Start medium reasoning for implementation, low for routine copy edits; escalate for observed failures. Reuse images/code and run targeted checks. Do not add paid services without user authorization.

## Privacy and portability
Keep tokens session-only or in a server secret manager, never repository/backup/client bundles/logs. User supplies their own GHL location, user and social account IDs. Never embed the author's live site identity or account settings.
Use Node.js 22.13+ with npm; no Bash, PowerShell or absolute OS-specific paths required. Cloud deployment needs Node server support, HTTPS and access protection. Static hosting alone cannot run /api/ghl.
