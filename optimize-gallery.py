"""Generate committed gallery delivery assets; originals remain untouched.
Run node build.cjs first to include newly added photos, then this script and build again.
Requires Pillow; normal Cloudflare builds use the committed files without Python.
"""
import hashlib, json, re
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent
html = (root / 'tr/galeri/index.html').read_text(encoding='utf-8')
files = list(dict.fromkeys(re.findall(r'data-original="/assets/images/([^"]+)"', html)))
if not files:
    files = list(dict.fromkeys(re.findall(r'<button class="gallery-thumb"[^>]*><img src="/assets/images/([^"]+)"', html)))
out = root / 'assets/gallery'
out.mkdir(exist_ok=True)
manifest = {}
for name in files:
    source = root / 'assets/images' / name
    key = hashlib.sha256(source.read_bytes()).hexdigest()[:16]
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        paths = {}
        for size in (320, 640):
            filename = f'{key}-{size}.webp'
            target = out / filename
            if not target.exists():
                ImageOps.fit(image, (size, size), method=Image.Resampling.LANCZOS).save(target, quality=80, method=6)
            paths[str(size)] = '/assets/gallery/' + filename
        filename = f'{key}-viewer.webp'
        target = out / filename
        image.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
        if not target.exists():
            image.save(target, quality=88, method=6)
        paths.update(viewer='/assets/gallery/' + filename, width=image.width, height=image.height)
        manifest[name] = paths
(root / 'gallery-assets.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
source_bytes = sum((root / 'assets/images' / name).stat().st_size for name in files)
for size in ('320', '640'):
    total = sum((root / item[size].lstrip('/')).stat().st_size for item in manifest.values())
    print(f'{len(files)} images: original={source_bytes:,} bytes; {size}px grid={total:,} bytes; reduction={100*(1-total/source_bytes):.1f}%')
