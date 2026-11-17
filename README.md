# The Grind

**Live: https://anjulsati.github.io/the-grind/** · **Local:** `npm start` → http://localhost:5173

A single-page **DSA-only** study planner by **Anjul Sati**: 23 weeks, arrays to dynamic programming, built for placement interviews.

- Every day opens with the **video/article to learn from**, then that day's problems
- **469 tasks**, one per slot, never repeated
- **Edit plan** (`E`): add, edit, delete, drag tasks between days, set priorities
- **↻ revision tracker** on each problem: log, edit and delete revision dates
- **💬 Notes** (`N`): sticky notes you can drag, resize, minimise, or pin to a study day
- **✎ Pen** (`P`): write on the page, strokes fade
- **Export / Import**: a JSON backup of the plan
- **Sign in with Google** (top bar): shares the plan, progress and notes between the two allowed accounts

Keyboard: `P` pen · `E` edit · `N` note · `C` clear strokes · `Esc` exit

## Sharing setup

Sharing uses Firebase. The config lives in `src/js/firebase-config.js`, and the access rules in `database.rules.json`. Only the two accounts listed in those rules can read or change the plan. To publish rule changes: `npx firebase-tools deploy --only database`.
