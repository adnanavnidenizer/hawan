# HAWAN — Custom Mortars & Pestles

Live site: https://hawan.co/ • Source: https://github.com/adnanavnidenizer/hawan

`main` is the live source of truth. Cloudflare Pages automatically builds pushes to main with `node build.cjs`, output `dist`, framework None. No dependency installation is needed for normal builds.

## Continue on another computer

Install Git and Node.js24, sign into GitHub with access to this repository, then:

```sh
git clone --depth 1 --single-branch --branch main https://github.com/adnanavnidenizer/hawan.git
cd hawan
node build.cjs
node scripts/check-routes.cjs
node --test --test-isolation=none tests/contact.test.mjs
node scripts/preview.cjs
```

Open http://127.0.0.1:4173/en/home/ or /tr/ana-sayfa/. PORT can be changed if occupied. Preview binds only to this computer and serves dist, never source files or secrets. Email submission requires the Cloudflare runtime; use the published site/preview for integration checks. Stop preview with Ctrl+C when finished.

Before editing: `git pull --ff-only`. Commit verified changes and `git push origin main` to deploy. Always verify Cloudflare deployment and the live result. Never force-push main. For simultaneous work, use separate branches; fetch/pull before merging. A shallow clone can obtain full remote history with `git fetch --unshallow`.

## Editable sources

- `index.html`, `index-tr.html`: home templates.
- `generate-pages.cjs`: shared header/footer, gallery, store, product, contact, cart and localized routes.
- `css/`, `js/`: design and browser behavior.
- `assets/`: all runtime images, product PNGs, fonts, video. Original gallery images retained; thumbnails are separate.
- `server/`, `functions/`, `tests/`: contact backend and tests.
- `commerce.json`: store adapter; checkout not connected yet.
- `docs/`: brand guidance, contact configuration, audit and handover.

`en/`, `tr/` and `dist/` are generated, ignored files. Do not edit them. Do not publish `drafts/` or historical archives. The legal review draft is retained in `drafts/terms-review/`.

See [handover](docs/HANDOVER.md) for accounts, known issues and archive recovery.
