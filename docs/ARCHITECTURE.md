# Architecture

The Grind is a static single-page application. It has no build step and no framework. Plain JavaScript and CSS are loaded directly by `index.html`, in a fixed order. Firebase is the only external library, and it is used only for sign-in and shared storage.

## Repository layout

```
the-grind/
├── index.html                 Entry point; loads styles and scripts in order
├── server.js                  Dependency-free development server
├── package.json               npm scripts and metadata
├── firebase.json              Firebase deploy configuration (database rules)
├── .firebaserc                Firebase project id
├── database.rules.json        Access rules for the shared plan
├── assets/favicon.svg         Site icon
├── docs/                      Documentation
└── src/
    ├── js/
    │   ├── data.js            Plan content: 23 weeks, learning resources, problems
    │   ├── store.js           Plan database: seeding, storage, edits, import/export
    │   ├── ui.js              Renders weeks, days, items, and progress
    │   ├── editor.js          Edit mode and its dialogs
    │   ├── events.js          Clicks, drag and drop, revision panel, shortcuts
    │   ├── notes.js           Sticky notes: create, drag, resize, minimise, pin
    │   ├── pen.js             Pen mode on a canvas, with fading strokes
    │   ├── cursor.js          Cursor glow and sparkle effect
    │   ├── firebase-config.js Firebase web config (public)
    │   ├── sync.js            Google sign-in and shared storage
    │   └── main.js            Boot: toast helper, first render, sync connection
    └── styles/
        ├── theme.css          Design tokens, base styles, top bar, buttons
        ├── layout.css         Page grid, weeks, days, items, tables
        └── components.css     Cards, notes, revision tracker, dialogs, sign-in slot
```

## Script load order

`index.html` loads scripts in this order. Each module attaches to the shared `window.TG` namespace, so the order matters:

1. Firebase app, auth, and database SDKs (CDN)
2. `firebase-config.js`
3. `data.js`: sets `window.CUDATA`
4. `store.js`: sets `TG.store`
5. `ui.js`, `editor.js`, `pen.js`, `events.js`, `cursor.js`, `notes.js`: set their own `TG` members
6. `sync.js`: sets `TG.sync`
7. `main.js`: renders the page and calls `TG.sync.connect()`

## Modules

| Module | Responsibility | Public surface |
| --- | --- | --- |
| `store.js` | Owns the plan (`db`) and progress (`state`). Persists both to localStorage. Calls `TG.sync.changed()` after each save. | `TG.store.db`, `state`, `saveDB`, `saveState`, `setAll`, `exportDB`, `importDB`, `restoreDB` |
| `ui.js` | Builds the HTML for the page and re-renders it. Re-attaches notes after each render. | `TG.ui.render` |
| `events.js` | Handles clicks, drag and drop, the revision panel, and the P / E / Esc shortcuts. | none |
| `editor.js` | Edit-mode controls and the dialogs that change the plan. | `TG.editor` |
| `notes.js` | Creates and renders sticky notes. Saves them and calls `TG.sync.changed()`. | `TG.notes.create`, `renderAll`, `getNotes`, `setNotes` |
| `sync.js` | Connects to Firebase after sign-in. Pushes local changes and applies remote ones. | `TG.sync.connect`, `changed` |
| `main.js` | Defines `TG.toast`, performs the first render, and starts sync. | `TG.toast` |

## Data flow

```
data.js ──(first load)──▶ localStorage ◀── every edit writes here first
                              │
                              ▼
                        sync.js (signed in only)
                              │  debounced push (600 ms)
                              ▼
                  Firebase Realtime Database  /plan
                              │  live "value" listener
                              ▼
                  other signed-in browsers ──▶ store.setAll + notes.setNotes + ui.render
```

Local storage is always the first copy. The shared document is a mirror that lets two browsers see the same state.

## Sync behaviour

- **Starting up.** `main.js` renders from local storage first, so the page works offline. Then `sync.connect()` signs the user in and subscribes to `/plan`.
- **Pushing.** Any save call schedules a push 600 ms later. The push writes the plan, progress, notes, and a timestamp `updated`.
- **Receiving.** A remote update is applied only if its `updated` value differs from the last one this browser pushed. This prevents an echo loop.
- **Conflicts.** The most recent write replaces the whole document. Two people editing at the same moment can overwrite each other's changes.
- **Active notes.** If a note is being typed in, an incoming update waits 1.5 seconds before it is applied.
- **Empty room.** If `/plan` is empty when first read, the browser that connects first seeds it with its local data.

## Rendering model

The plan renders as HTML once, and later changes update that HTML in place. No virtual DOM is used. Week and day state are kept in the DOM (for example, which weeks are open).

## Styling

Design tokens (colours, type, radii) are CSS custom properties in `theme.css`. Component styles are grouped by area. Text sizes use a single scale, with a minimum of 13px for labels and 18px for body text.

## Design decisions

- **No framework.** The page is rendered once and mutated locally. A framework would add a build step and a runtime without a clear benefit.
- **Single shared document.** The data is small (a few hundred kilobytes), and two users need the same view. A single document keeps sync simple.
- **Last-write-wins.** Field-level merging would add complexity for little gain with two users.
- **Public config, private rules.** The Firebase config is embedded in the page. Access control is enforced by the database rules on Firebase's servers.
