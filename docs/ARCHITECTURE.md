# Architecture

The Grind is a **zero-dependency, zero-build** single-page app. Plain JavaScript, plain CSS, no frameworks, no bundler — it runs from `file://` and from any static host.

```
the-grind/
├── index.html              entry point (loads styles + scripts in order)
├── server.js               dependency-free dev server (node server.js)
├── package.json            npm scripts, metadata
├── docs/ARCHITECTURE.md    this file
├── assets/favicon.svg      favicon
└── src/
    ├── js/
    │   ├── data.js         the original 22-week plan (seed data, ~244 problems)
    │   ├── store.js        the plan database: seed → localStorage, CRUD, export/import
    │   ├── ui.js           every HTML builder: overview, weeks, days, FAANG, review
    │   ├── editor.js       edit mode + all mutating modals
    │   ├── pen.js          the annotation layer (canvas, fading strokes)
    │   ├── events.js       delegated events + keyboard shortcuts
    │   └── main.js         boot: toast helper + first render
    └── styles/
        ├── theme.css       design tokens, base, header, nav, buttons
        ├── layout.css      page grid, weeks, days, boxes, tables
        └── components.css  cards, badges, callouts, modal, toast, pen, edit bar
```

## Data flow

```
data.js (seed)  ──first load──▶  localStorage["the-grind-db-v1"]   ← the plan database
                                      │
                                      ├── every edit writes here instantly
                                      ├── week summaries + tables are derived from it
                                      ├── Export → JSON file
                                      ├── Import ← JSON file
                                      └── Restore original → re-seed from data.js

localStorage["the-grind-v1"]  →  progress (checkmarks) + review notes
```

## Why no framework

The app renders ~200 KB of HTML once and mutates it in place. React would add a build step and a runtime for zero benefit here — the DOM is written once and never diffed.

## Deploy

Any static host. GitHub Pages is configured on `main`:

```
git push origin main   # live in ~60s
```

Also runs locally with `npm start`.

---
Built by Anjul Sati.
