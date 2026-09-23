# Gallery delivery assets

Both home and gallery grids share 320/640px square WebP thumbnails, responsive srcset, lazy loading and asynchronous decoding. Both viewers load the original full-resolution photo from assets/images on selection. Only grid thumbnails are reduced. Previously generated viewer WebPs are no longer referenced by the site. Original photos remain in assets/images unchanged.

Asset filenames use source content hashes and receive a one-year immutable cache header. Files are committed so Cloudflare builds need no image processing dependencies.

After adding photos, run `node build.cjs`, then `python optimize-gallery.py` with Pillow installed, then `node build.cjs` again. Commit gallery-assets.json and assets/gallery together with generated pages. The first build retains original-image fallback for new entries so the optimizer can discover them. If encoding settings change, version the generated filenames before replacing cached files.
