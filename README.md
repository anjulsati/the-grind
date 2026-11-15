# The Grind

**Live: https://anjulsati.github.io/the-grind/** · **Local:** `npm start` → http://localhost:5173

A dynamic, single-page 22-week plan by **Anjul Sati**, built for one goal: a **FAANG/MAANG-level offer**.

Every week and every day has **two boxes**:

| | |
|---|---|
| **01 DSA** | pattern of the week · watch-first video · problems · CS study · career tasks · the day-7 timed test |
| **02 DEV** | **reserved** — still being decided |

The top of the page is **"Things to do till August 2027"** — the three tracks as editable cards.

```
W1-3   16 Nov - 6 Dec    EXAMS        45 min/day
W4     7 Dec - 13 Dec    TRANSITION   last paper Mon 7th, full block from Tue 8th
W5-19  14 Dec - 21 Mar    FULL PLAN    2h 45m/day
W20-22 22 Mar - 18 Apr    SPRINT       repair, 5 mocks, portfolio, 45+ applications
```

---

## The plan is a database

The whole plan lives in your browser as an editable database, seeded once from the original.

**Edit plan** (`E`) turns on edit mode:

| Action | How |
|---|---|
| Add a task | **＋** on any box |
| Edit / delete a task | **✎ / ✕** on hover |
| Rename a week / day | **✎** on the header |
| Edit a track card | **✎** on "Things to do till" cards |
| Undo everything | **Restore original** (checkmarks stay) |
| Backup | **Export plan** → JSON |
| Restore backup | **Import plan** |

Week summaries, the week table and problem counts **re-derive from your edits**.

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
