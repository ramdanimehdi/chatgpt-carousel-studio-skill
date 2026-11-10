# Optional GoHighLevel
GHL integration is intended for users who manage their training business in GoHighLevel. Their social accounts MUST already be connected to Marketing > Social Planner in THEIR location. No author account is bundled.
Enter your own Location ID, GHL user ID and session-only Private Integration Token. Load and select accounts explicitly. Do not paste tokens in chat or commit them.
Required scopes depend on operation: socialplanner/account.readonly, socialplanner/post.write, medias.write; socialplanner/post.readonly for delivery reconciliation.
The editor proxies requests from /api/ghl to services.leadconnectorhq.com to avoid browser CORS. Never expose an unrestricted proxy or persist keys in public hosting. Cloud installations require HTTPS and authenticated/private access.
First validate against a user-authorized draft; no live integration test is implied by unit tests.
The day batch supports images/carousels and excludes unrendered reel scripts. Review the plan and target accounts, then publish first now or choose a future start, with subsequent items at +3h/+6h/+9h. Keep the browser open during upload/submission. Accepted scheduled posts are executed by GHL after the browser closes.
Store remote post IDs and attempt states before accepting a retry. Network uncertainty requires manual GHL review, never an automatic duplicate create call. Local locks protect the same browser origin; they are not a cross-device exactly-once guarantee.
The update-status action reconciles known remote post IDs. Old external posts without IDs/timestamps require the user's actual date entry; never infer publication from creation time.
API reference: https://marketplace.gohighlevel.com/docs/ghl/social-planner/
Verify the current API contract before changing integration code. Subject to GHL scopes, account connection health and platform media limits; this is not an affiliation or guaranteed delivery claim.
