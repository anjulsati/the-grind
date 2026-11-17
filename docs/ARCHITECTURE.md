# Architecture

The Grind is a **zero-build** single-page app. Plain JavaScript and CSS, no framework, no bundler. The only external library is the Firebase SDK, loaded from a CDN, and it is used only for sign-in and shared storage.

```
the-grind/
├── index.html              entry point (loads styles + scripts in order)
├── server.js               dependency-free dev server (node server.js)
├── package.json            npm scripts, metadata
├── firebase.json           Firebase deploy config (database rules)
├── .firebaserc             Firebase project id
├── database.rules.json     who may read/write the shared plan (two accounts)
├── docs/ARCHITECTURE.md    this file
├── assets/favicon.svg      favicon
└── src/
    ├── js/
    │   ├── data.js           23-week plan seed data, learn-first videos, problems
    │   ├── store.js          plan database: seed → localStorage, edits, export/import
    │   ├── ui.js             renders the week list, days, items, progress
    │   ├── editor.js         edit mode + modals
    │   ├── events.js         clicks, drag-and-drop, revision panel, shortcuts
    │   ├── notes.js          sticky notes: drag, resize, minimise, pin to a day
    │   ├── pen.js            annotation layer (canvas, fading strokes)
    │   ├── cursor.js         cursor glow and sparkles
    │   ├── firebase-config.js  Firebase web config (public; security is in the rules)
    │   ├── sync.js           Google sign-in + shared plan/progress/notes
    │   └── main.js           boot: toast helper, first render, sync connect
    └── styles/
        ├── theme.css         design tokens, base, header, nav, buttons
        ├── layout.css        page grid, weeks, days, items, tables
        └── components.css    cards, notes, revision tracker, modals, sign-in slot
```

## Data flow

```
data.js (seed)  ──first load──▶  localStorage["the-grind-db-v1"]   plan database
localStorage["the-grind-v1"]    progress (ticked tasks)
localStorage["the-grind-notes-v1"]  sticky notes

Every change saves to localStorage, then sync.js (if signed in) pushes
the plan, progress and notes to Firebase, and other signed-in browsers
receive the update.
```

## Sign-in and sharing

- `sync.js` does nothing until `firebase-config.js` has a config.
- The top bar shows **Sign in with Google**. After sign-in, changes are saved to Firebase under `plan`.
- `database.rules.json` allows read and write only for the two listed accounts, with a verified email. Anyone else gets "Not allowed" and can't see the plan.
- Sign-in needs the site to be served over `https://` or `http://localhost`. It won't work from `file://`.
- Sync uses last-write-wins for the whole plan. A change from one browser replaces the copy in the other.

## Why no framework

The app renders the plan once and mutates it in place. A framework would add a build step and runtime without a benefit here.

## Deploy

GitHub Pages serves `main`:

```
git push origin main   # live in about a minute
```

Database rules are separate from the site. Publish them with `npx firebase-tools deploy --only database`.

Also runs locally with `npm start`.

---
Built by Anjul Sati.
