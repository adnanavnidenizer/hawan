# Local cleanup — 23 September 2026

- Active checkout moved to main; origin/main verified at1e78aa23230c554f464d6136c770c63c49af5790 before cleanup.
- Final local experimental draft edits and project history backed up to GitHub archive/drafts-2026-09-23 at e12a5aa1fa7c6da1820407d01cf9dae40c8dfe2b.
- Dist output removed (rebuildable); localized en/tr pages now generated and ignored rather than tracked.
- Obsolete readability/shop/warm-home drafts removed from active main after archive verification; terms review retained.
- Redundant extracted JPEGs and model PNG copies removed only after SHA256 equality checks (46,999,174 bytes).
- Obsolete /home V1 reference and old deployment/typography screenshots/ZIP removed. Correct root V1 reference retained.
- Local Git metadata replaced with an independently verified shallow main snapshot; full published history remains on GitHub. git fetch --unshallow restores history. User name/email and GitHub origin retained; no credentials copied.
- Source current assets, fonts, videos, code, functions and documentation are all in GitHub main. Clean isolated snapshot build, route checks and all six contact tests passed. Portable preview returned200 and video range206.
- Total outputs + active repository reduced from approximately479.7MiB to349.6MiB (~130MiB reclaimed). Unique historical source media remains local because the large archive upload timed out; this is documented in HANDOVER.md. Do not confuse these with current runtime assets, which are backed up.
- No system-wide files, personal originals outside this workspace, browser credentials or Cloudflare secrets were removed. This is a project cleanup, not a device wipe or account sign-out.
