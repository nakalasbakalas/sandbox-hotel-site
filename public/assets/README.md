# Asset folders

Put your website images in these folders so `index.html` can load them directly.

## Room photos
- `assets/images/rooms/twin-room-sandbox.jpg`
- `assets/images/rooms/standard-twin.jpg`
- `assets/images/rooms/standard-double.jpg`
- `assets/images/rooms/premium-twin.jpg`
- `assets/images/rooms/premium-double.jpg`

## Gallery photos
- `assets/images/gallery/entrance.png`
- `assets/images/gallery/lobby.png`
- `assets/images/gallery/evening-view.png`
- `assets/images/gallery/flower-view.png`
- `assets/images/gallery/staircase.png`

## Tips
- You can use `.jpg`, `.jpeg`, `.png`, or `.webp` files.
- If you use a different extension or filename, update the matching `src="assets/..."` path in `index.html`.
- Recommended image ratio is around `800x520` (or any 1.54:1 ratio) for best fit.


## Logo files
- `assets/images/logo/` for brand logo files (PNG/SVG/WebP).
- `assets/images/logo/social/` for social/profile logo variants.
- Optional suggested filenames: `sandbox-logo.png`, `sandbox-logo-mark.png`, `favicon.png`.


## PNG auto-link behavior
- `index.html` now tries `.png` first for existing room/gallery image tags and falls back to the original `.jpg/.webp` path automatically if the PNG is missing.
- This lets you drop in new PNG files with the same base filename without editing HTML.
