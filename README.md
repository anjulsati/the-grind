# The Grind

A study planner for data structures and algorithms (DSA) interview preparation. It runs as a static web page with no build step.

**Live site:** https://anjulsati.github.io/the-grind/

The plan runs for 23 weeks from 16 November 2026 to 25 April 2027. It has 469 tasks, each a learn-first video or article followed by that day's problems. Progress, revision history, and notes can be shared between two signed-in accounts.

## Features

| Feature | Description |
| --- | --- |
| Day-by-day plan | Each study day starts with a learning resource, then its problems. Problems do not repeat. |
| Progress tracking | Tick a task to mark it done. Done tasks stay readable, with a strike-through and a green line. |
| Revision tracker | The ↻ button on each problem logs revision dates and times. Entries can be edited or deleted. |
| Sticky notes | Notes can be dragged by their grip, resized, set to a larger or smaller text size, minimised, and pinned to a study day. Pinned notes hide when their week is collapsed. |
| Plan editing | Add, edit, delete, and drag tasks between days. Set priorities. |
| Pen | Draw on the page. Strokes fade after a set time. |
| Backup | Export the plan as JSON, and import it again. |
| Shared sync | Sign in with Google to share the plan, progress, and notes between the two allowed accounts. |

## Quick start

Run the site locally:

```bash
npm start
```

Then open http://localhost:5173. See [docs/SETUP.md](docs/SETUP.md) for full setup, including the Firebase project for sharing.

## Documentation

| Document | Contents |
| --- | --- |
| [docs/SETUP.md](docs/SETUP.md) | Local development and Firebase project setup |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Code layout, modules, and how data flows through the app |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Stored data: plan, progress, notes, and the shared document |
| [docs/SECURITY.md](docs/SECURITY.md) | Access model, what is public, and what must stay private |
| [docs/OPERATIONS.md](docs/OPERATIONS.md) | Deploying the site and rules, backups, and troubleshooting |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Workflow for changing the code |

## Editing the plan

There is no global edit mode and no dialogs. Each week has one **Edit** button in its header.
Clicking it turns that week's content into directly editable text — click any text and type:

- Week title, goal and note
- Day labels and time
- Task titles, links and how-to lines

While a week is being edited it also shows `＋` to add a task to a day, `▲` `▼` to move a task,
and `✕` to delete it. Click **Done** in the week header to finish. Changes save as soon as you
click away (or press Enter), in the browser and in the shared copy when you are signed in.

Export, import and restore live in the admin **People** panel (account menu), so they are not
accidentally reachable from the main screen.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `P` | Toggle pen mode |
| `N` | Toggle the notes panel |
| `Esc` | Exit pen mode |

## Technology

Plain HTML, CSS, and JavaScript, with no framework and no bundler. The only external dependency is the Firebase SDK, used for Google sign-in and shared storage. Fonts come from Google Fonts. The site is hosted on GitHub Pages.

## License

MIT. See [LICENSE](LICENSE).

---
Built by Anjul Sati.
