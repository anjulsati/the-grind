# The Grind

**Live: https://anjulsati.github.io/the-grind/** · **Local:** `npm start` → http://localhost:5173

A single-page **DSA-only** grind log by **Anjul Sati** — 19 weeks, from arrays to dynamic programming, at FAANG/MAANG interview level.

Every day is one ruled sheet: **watch/read the material first**, then solve that day's problems.

| | |
|---|---|
| **Weeks 1–3** | Endsems · 1 easy problem + a concept video a day |
| **Weeks 4–19** | Two problems a day after the day's video — arrays to graphs to DP |
| **Every week from 10** | Ends with a timed set: 2 unseen mediums, 60 minutes |

102 learn-first items, every one a verified video. 244 unique problems.

The plan is a database in your browser: **Edit plan** (`E`) to add, edit, delete, drag between days, set priorities. **＋** on any box. **Restore original** puts the plan back. **Export/Import** for backups.
## DSA material

The **DSA — the material** section holds the watch-first list (one verified video per pattern, 19 weeks) and the resources the Indian prep community actually recommends — Striver A2Z, NeetCode 150, LeetCode, Aditya Verma, Kunal Kushwaha, Abdul Bari, CTCI.

## Also

- **✎ Pen** (`P`) — draw over the page, strokes fade (10s/30s/60s/keep)
- **Review** — for an auditor: verdicts, comments, exportable markdown
- Keyboard: `P` pen · `E` edit · `C` clear strokes · `Esc` exit

---

## Project structure

```
the-grind/
├── index.html          entry point
├── server.js           dependency-free dev server (npm start)
├── package.json        scripts + metadata
├── docs/ARCHITECTURE.md
├── assets/favicon.svg
└── src/
    ├── js/   data.js · store.js · ui.js · editor.js · pen.js · events.js · main.js
    └── styles/ theme.css · layout.css · components.css
```

Zero dependencies, zero build step. Runs from `file://`, `npm start`, or any static host. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Deploy

```bash
git push origin main   # GitHub Pages — live in ~60s
```

---

MIT © Anjul Sati
