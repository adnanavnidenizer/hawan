# Contact email integration

## Architecture
Cloudflare Pages Functions `/api/contact` sends through smtp.gmail.com:465 with implicit TLS. Sender and recipient are fixed to adnanavni@hawan.co; visitor email is Reply-To. No password or message bodies are logged. The static local preview keeps its explicit email-app draft fallback until a configured API is present.

## Cloudflare configuration
In hawan > Settings > Production (or Preview for testing) > Variables and secrets:
- Secret `GMAIL_APP_PASSWORD`: enter directly in Cloudflare; never in chat or Git.
- Secret `TURNSTILE_SECRET_KEY`: production Turnstile widget secret.
- Text `TURNSTILE_SITE_KEY`: matching public widget key.
- Text `CONTACT_ALLOWED_ORIGINS`: comma-separated exact HTTPS preview origins, no trailing slash; do not allow arbitrary *.pages.dev origins.
- Text `CONTACT_ENABLED`: `true` for the explicitly enabled environment.

Create a managed Turnstile widget for the exact preview hostname (and separately approved production hostnames). Client action is `contact`. Backend verifies success, hostname and action. Tokens are validated server-side and single-use. No SMTP call is made on invalid input or verification failure. Consider an additional Cloudflare rate-limit rule for sustained abuse before a public launch.

The Gmail app password is created by the mailbox owner with 2-step verification enabled. Store it as a Secret. It may have broader mailbox privileges than the send-only API alternative; revoke it when no longer needed.

## Deployment
Production publication was approved on 23 September 2026. GitHub main is the production deployment source. Functions are in the repository-root functions directory; Pages builds bundle them separately from dist. `_routes.json` limits execution to the two API routes. Runtime uses Cloudflare native sockets; no Node compatibility dependencies required. The current plain localhost:4173 server cannot execute Pages Functions. Use Wrangler Pages locally with private .dev.vars for integration development, or a Cloudflare preview for the actual Gmail test.

Secrets apply on the next deployment. Production credentials were configured after launch approval on 23 September 2026. After deployment verify configuration availability, complete Turnstile, send one explicitly authorized test inquiry, confirm Gmail receipt and Reply-To. Do not claim inbox delivery from unit tests. SMTP disconnect after DATA can make delivery uncertain; the client does not automatically retry.

## Checks
`node --test --test-isolation=none tests/contact.test.mjs`
`node build.cjs`
`node scripts/check-routes.cjs`

Tests mock SMTP and Turnstile; live SMTP, Cloudflare bundling and inbox delivery still require a preview deployment and credentials.

