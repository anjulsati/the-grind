# Data model

The Grind stores four things: the plan, progress, notes, and the shared copy in Firebase. This document describes their shape and where each lives.

## Storage locations

| Key | Where | Contents |
| --- | --- | --- |
| `the-grind-db-v1` | localStorage | The plan (`db`) |
| `the-grind-v1` | localStorage | Progress (`state`) |
| `the-grind-notes-v1` | localStorage | Sticky notes (array) |
| `plan` | Firebase Realtime Database | The shared document (see below) |

## Plan (`the-grind-db-v1`)

```json
{
  "v": 10,
  "by": "Anjul Sati",
  "seededOn": "2026-11-17",
  "weeks": [
    {
      "n": 1,
      "mode": "normal",
      "theme": "Exam window · arrays without pressure",
      "goal": "...",
      "note": "...",
      "pattern": "...",
      "pre": null,
      "cs": "",
      "days": [
        {
          "n": 1,
          "week": 1,
          "date": "2026-11-16",
          "idx": 1,
          "title": "...",
          "time": "...",
          "revision": false,
          "light": false,
          "items": [ ]
        }
      ]
    }
  ]
}
```

- `v` is the schema version. `DB_VERSION` in `store.js` must match it. If it differs, the stored plan is discarded and the plan is reseeded from `data.js`. Increase `DB_VERSION` when the plan's structure changes.
- `weeks` has 23 entries. Each week has its days, and each day has its items.

### Items

```json
{
  "id": "l2026-11-16-1",
  "type": "watch",
  "track": "dsa",
  "title": "Learn first — Big-O notation",
  "url": "https://www.youtube.com/watch?v=...",
  "vtitle": "Big-O notation",
  "vauthor": "...",
  "hint": "Watch or read this first, then that day's problems below."
}
```

| Field | Values | Notes |
| --- | --- | --- |
| `id` | string | Unique within the plan. Progress and revisions refer to it. |
| `type` | `watch`, `theory`, `dsa`, `stretch`, `review`, `task` | Controls the badge. Only `dsa` and `stretch` items get a revision tracker. |
| `track` | `dsa` | Only DSA content is seeded. |
| `title`, `url` | string | The problem or resource. |
| `diff` | `E`, `M`, `H` | Difficulty. Optional. |
| `priority` | `P1`, `P2`, `P3` | Optional. |
| `revisions` | array of strings | Revision timestamps, for example `"17 Nov · 12:06 am"`. Added by the tracker. |

## Progress (`the-grind-v1`)

```json
{ "done": { "l2026-11-16-1": true, "...": true } }
```

`done` maps item ids to `true`. An unticked item is removed from the map.

## Notes (`the-grind-notes-v1`)

```json
{
  "id": "n1l3k2a9f",
  "author": "Anjul",
  "created": "17 Nov 2026 · 09:30 pm",
  "updated": "17 Nov 2026 · 09:32 pm",
  "day": "2026-11-16",
  "x": 24,
  "y": 120,
  "w": 380,
  "h": 260,
  "fs": 17,
  "minimized": false,
  "html": "<p>Review two pointers.</p>"
}
```

- `author` is `"Anjul"` or `"Anurag"`. Older values (`"Anjul Sati"`, `"Reviewer"`) are converted when loaded.
- `day` is `null` for a free-floating note. Otherwise it is a date key (`YYYY-MM-DD`). For a pinned note, `x` and `y` are relative to that day's box. For a free note, they are page coordinates.
- `html` holds the rich text from the note editor. Treat it as HTML content from a trusted account, and avoid pasting untrusted markup into notes.

## Shared database (Firebase Realtime Database)

| Path | Who can read | Who can write | Contents |
| --- | --- | --- | --- |
| `plan` | Admin and approved people | Admin and approved people | `{ plan, progress, notes, updated }` |
| `allowed/<uid>` | The person themselves, and the admin | The admin | `{ email, at }`. Presence means approved. |
| `requests/<uid>` | The person themselves, and the admin | The person themselves (create), and the admin (approve, reject) | `{ email, at }`. Presence means waiting. |
| `history/<timestamp>` | Admin only | Approved people can add a new entry. Only the admin can change or delete entries. | A saved copy of `plan`, keyed by the time it was saved. One is saved per day, and the last 30 are kept. |
| `historyIndex/<timestamp>` | Admin only | Same as `history` | `true`. A small list of saved copies, so cleanup doesn't download the full copies. |

- `uid` is the Google account's permanent identifier. Approval uses it instead of the email, so an approval can't be transferred by changing an email address.
- `updated` is a millisecond timestamp. A browser ignores an update whose `updated` matches the last one it pushed.
- The whole `plan` document is written at once. Writes are last-write-wins.

## Export and import

Export writes `the-grind-plan-<date>.json`, which contains the plan only. Progress and notes are not included. Import replaces the plan with a JSON file that has a non-empty `weeks` array. Restore re-seeds the plan from `data.js`.

When the site is signed in, every change, including an import or restore, is pushed to the shared document and so reaches the other signed-in browser.
