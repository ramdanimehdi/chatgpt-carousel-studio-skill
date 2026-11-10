# Portable editor
This is a generalized source edition of the working carousel editor, not an executable installer.
Requirements: Node.js >=22.13 and npm. Copy first:
- Windows: py scripts/copy_editor.py --output "C:/Users/YourName/carousel-studio"
- macOS/Linux: python3 scripts/copy_editor.py --output "$HOME/carousel-studio"

Inside the output directory, run on all systems:
npm install
npm run dev
Open http://localhost:3000.
Production: npm run build, then npm start.
Cloud: deploy assets/editor as the application root on a Node-compatible host, or build its Dockerfile. Configure HTTPS and owner authentication at the hosting layer before using accounts/tokens. No cloud vendor credentials included.
GitHub Pages can serve a separate static export only; it cannot execute the GHL proxy.

The studio contains project cards, captions, alt text, slides, image import, text placement, PNG/ZIP exports, backup/restore and manual publication dates. Brand settings provide a reusable services slide; edit existing slides separately. The editor does not generate images by itself; ChatGPT generates them then they are imported.
No photos, daily projects or account connections are preloaded.
Browser storage is not a shared cloud database. Back up when switching browsers/devices. A cloud deployment does not automatically synchronize local records between users/devices.
Validate npm test, npm run check and npm run build after changes. Do not claim native Windows/macOS tests if only Linux was tested.
