# Cross-computer handover

## Source and hosting
- GitHub repository: adnanavnidenizer/hawan; production branch main.
- Cloudflare account910c56f07255048355374f6737b61a30, Pages project hawan. Build: node build.cjs; output: dist; framework: None.
- hawan.co and www.hawan.co are active; www and old /home paths redirect appropriately.
- Registration is GoDaddy; active hawan.co DNS is Cloudflare. Preserve Google Workspace MX/SPF/DKIM/DMARC when changing website DNS.
- hawan.store / www.hawan.store HTTPS still needs provider-side resolution.

## Access from another computer
GitHub write access and Git are enough for code pushes; production deploys remotely, so this computer need not stay on. Sign into Cloudflare to manage builds/domains/secrets; Google Workspace for mailbox settings; GoDaddy for registration/forwarding. Use your own authenticated session on each computer. Do not copy browser profiles, cookies, credential stores or application passwords into the repository. Keep recovery codes in a password manager you control. Localhost previews are local to their computer; use a Cloudflare preview URL for remote/mobile review. Installed local tools and browser sessions do not transfer with Git.

## Contact secrets
GMAIL_APP_PASSWORD and TURNSTILE_SECRET_KEY stay encrypted in Cloudflare production settings. Other settings are documented in CONTACT.md. Secrets are not required for normal source edits/builds and should never be added to Git. If lost, create a replacement through the account owner and update Cloudflare; do not expect GitHub to restore them. No email was sent as part of this cleanup.

## Current design and behavior
EN/TR home, gallery, store, six products, cart, contact and provisional terms. Designs: ORVA, ARDEN, NUMA, OREN, AVELA, TERVA; existing numeric product URLs are preserved. All mortars have three legs. Brand ink #44403C, warm accent #AA927B, cart badge/accent text #DF772F. Quotes white. Only white text has hairline contour; white and badge-colored text share a subtle shadow. Galleries use small grid WebP files and original JPEGs in viewers. Source images and videos are in assets. Assets/CSS/JS caching is handled by build-generated URL hashes where applicable.

## Known incomplete work
Payment/prices/shipping integration and actual legal business details remain pending. Instagram is deliberately a placeholder per user. Terms live page is a temporary notice; original design/content draft is retained for future completion. See WEBSITE-AUDIT.md.

## Historical work
GitHub branch archive/drafts-2026-09-23 preserves the last local experimental drafts plus session history. Do not merge it into main. To retrieve one folder: git fetch origin archive/drafts-2026-09-23, then git restore --source FETCH_HEAD -- drafts/terms-review (choose only the wanted path). Production history remains on GitHub.

The attempted larger media archive upload timed out. Unique historical cutouts/source photos outside the current site are therefore retained locally under outputs/HAWAN-cutouts. They are NOT needed to clone/build the live website. Do not delete these originals until a separate verified external backup exists. Root V1 reference is retained locally under outputs/HAWAN-root-v1. Main includes all current runtime media; historical source variants are a separate archive concern.
