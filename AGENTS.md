# Notes for coding agents

Follow the shared standards in https://github.com/petravanta/general/blob/main/STANDARDS.md (hub link, theme switch, shared look, built-in knowledge, user data). Take patterns from there, not from the other apps. This file only adds what's specific to Special Trip Planner.

- The app is `index.html` with no build step. Serve the folder (`python3 -m http.server`) to run it; `data/` can't load from `file://`.
- Built-in templates are data: `data/templates/<id>.json`, listed in `data/templates.json`, with the schema in `data/schema/template.schema.json`. Never put template content in `index.html`.
- Keep the split between a plan's `knowledge` (a template copy, exportable) and the private lists (`regimens`, `doses`, `checks`, `packStatus`, `bookings`, `people`, `journal`). Anything personal goes in a private list, so *Export as template* leaves it out by construction.
- `checkTemplate` in `index.html` and `scripts/check-data.js` enforce the same reference rules; change them together, and change the schema enums and the code's `LABELS` together.
- Sensitive templates (the reference surgery template among them) are never committed to this repo; they are imported from files.
- Run `node scripts/check-data.js` and the ajv commands in CONTRIBUTING.md after editing data.
