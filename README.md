# bevanmauya.com

Personal site of Bevan Mauya: one static `index.html`, served by GitHub Pages at [bevanmauya.com](https://bevanmauya.com).

- **Content:** edit `PROJECTS`, `CERTS` and `GALLERY` in `assets/content.js`. Page logic lives in `assets/app.js`.
- **Security:** `index.html` carries a Content-Security-Policy that only allows scripts from this site — keep scripts in files, not inline.
- **Images:** `assets/img/`. Project tiles are square; anything else gets centre-cropped.
- **Preview locally:** `python -m http.server 4173`, then open http://localhost:4173.

Copyright © 2026 Bevan Mauya. All rights reserved.
