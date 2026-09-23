# HAWAN working instructions

Read README.md and docs/HANDOVER.md first. main is the live source of truth; the user authorized ongoing live updates. Build/test before push and verify the deployed site afterward. Preserve unrelated edits. Do not force-push.

Edit index.html/index-tr.html, generate-pages.cjs, css/, js/ and appropriate assets. en/, tr/ and dist/ are generated: never hand-edit them. Build with node build.cjs; check node scripts/check-routes.cjs and node --test --test-isolation=none tests/contact.test.mjs. Preview with node scripts/preview.cjs. No package install needed for ordinary builds.

Preserve HAWAN brand language, localized routes and product geometry (three legs). Consult docs/DESIGN.md, docs/COMMERCE.md and docs/CONTACT.md. Original gallery quality in viewers must remain distinct from small thumbnails. Test desktop/mobile changes.

Credentials stay in Cloudflare or the user's credential manager, never source control. Local preview cannot send email through Pages Functions. Do not send real test mail without explicit authorization and never infer inbox delivery from a successful mock test.

Historical draft branch archive/drafts-2026-09-23 is reference only. Keep the legal review draft; do not publish fictional legal information. Instagram placeholder intentionally retained. Current audit limitations: docs/WEBSITE-AUDIT.md. No other computer requires the old local outputs folder to build the current site.
