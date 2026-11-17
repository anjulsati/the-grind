# Security

This document describes who can see and change the plan, what is public, and how to keep it that way.

## Access model

| Party | Read the plan | Change the plan | Manage people |
| --- | --- | --- | --- |
| Anonymous visitor | No | No | No |
| Signed in, waiting for approval | No | No | No |
| Approved person, verified email | Yes | Yes | No |
| Admin, verified email | Yes | Yes | Yes |

- The admin is the account named in `database.rules.json` and in `ADMIN_EMAIL` in `sync.js`.
- Approval is stored by Google user ID (`uid`), not by email.
- The only enforcement point is `database.rules.json`, evaluated by Firebase on its servers. A modified browser can't bypass it.

## What is public

- **The Firebase web config** in `src/js/firebase-config.js` (API key, project id, database URL). Firebase web API keys identify the project. They are not secrets, and they do not grant access by themselves.
- **The site source** on GitHub.
- **The plan's default content.** It is seeded from `data.js`, which is public.

## What must stay private

- **Your data.** Once the rules restrict it, the plan, progress, and notes are visible only to allowed accounts.
- **Admin credentials.** Firebase CLI sessions, service-account keys, and tokens must never be committed. Keep the CLI's token file (`~/.config/configstore/firebase-tools.json`) on your machine only.

## Rules

Current rules (see `database.rules.json`):

- The root is closed (`.read` and `.write` are `false`).
- `plan`: reads and writes only for the admin, or for an approved `uid`, with a verified email.
- `allowed`: only the admin can read or change the list. Each person can read their own entry, which tells the site whether they're approved.
- `requests`: the admin can read and manage requests. Each person can create or read only their own request.

Requirements for any change to the rules:
- Keep the root closed. Do not add a broad rule.
- Require `auth != null` and `auth.token.email_verified === true`.
- Use exact checks.

## Known limits

- **Last-write-wins.** Two allowed users editing at once can overwrite each other.
- **Version history is limited.** The last 30 saved versions are kept, at most one every 5 minutes. A change made within 5 minutes of the previous save can't be recovered on its own.
- **Local copies.** Each browser keeps its own copy in localStorage. Anyone with access to a signed-in browser can read it. Sign out on shared computers.
- **Note content is HTML.** Notes are rendered from rich text. Only allowed accounts can write notes, but avoid pasting untrusted content into them.
- **Admin is fixed in code.** The admin email is set in the rules and in `sync.js`. Changing the admin means editing those two places and redeploying.
- **Approval is not time-limited.** An approved person keeps access until you remove them.

## Reporting a problem

If you find a way to read or change the plan without an allowed account, stop sharing the site and check the rules in the Firebase console. Then revoke the account's sign-in or change the allowed list, and redeploy the rules.
