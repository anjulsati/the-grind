# Security

This document describes who can see and change the plan, what is public, and how to keep it that way.

## Access model

| Party | Can read the plan | Can change the plan |
| --- | --- | --- |
| Anonymous visitor | No | No |
| Signed-in account not in the rules | No | No |
| Signed-in allowed account, verified email | Yes | Yes |

The only enforcement point is `database.rules.json`, evaluated by Firebase on its servers. The client code does not decide who has access. A browser can be modified freely, but Firebase still refuses reads and writes that the rules do not allow.

## What is public

- **The Firebase web config** in `src/js/firebase-config.js` (API key, project id, database URL). Firebase web API keys identify the project. They are not secrets, and they do not grant access by themselves.
- **The site source** on GitHub.
- **The plan's default content.** It is seeded from `data.js`, which is public.

## What must stay private

- **Your data.** Once the rules restrict it, the plan, progress, and notes are visible only to allowed accounts.
- **Admin credentials.** Firebase CLI sessions, service-account keys, and tokens must never be committed. Keep the CLI's token file (`~/.config/configstore/firebase-tools.json`) on your machine only.

## Rules

Current rules (see `database.rules.json`):

- `.read` and `.write` at the root are `false`, so nothing outside `plan` is accessible.
- `plan` allows reads and writes only when the request is signed in, the email is verified, and the email is one of the two listed accounts.

Requirements for any change to the rules:
- Keep the root `false`. Do not add a broad rule.
- Require `auth != null` and `auth.token.email_verified === true`.
- Use exact email matches.

## Known limits

- **Last-write-wins.** Two allowed users editing at once can overwrite each other.
- **No audit trail.** The database keeps only the latest version of the plan.
- **Local copies.** Each browser keeps its own copy in localStorage. Anyone with access to a signed-in browser can read it. Sign out on shared computers.
- **Note content is HTML.** Notes are rendered from rich text. Only allowed accounts can write notes, but avoid pasting untrusted content into them.
- **Shared code removed.** An earlier design used a shared code. It is no longer used, and no code is stored in the database.

## Reporting a problem

If you find a way to read or change the plan without an allowed account, stop sharing the site and check the rules in the Firebase console. Then revoke the account's sign-in or change the allowed list, and redeploy the rules.
