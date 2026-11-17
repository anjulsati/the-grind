# Operations

This document covers deploying the site, publishing database rules, backing up data, and troubleshooting.

## Deploy the site

GitHub Pages serves the `main` branch of `anjulsati/the-grind`.

```bash
git add -A
git commit -m "describe the change"
git push origin main
```

The site is updated about a minute later. Browsers may keep an old copy, so ask users to reload with `Ctrl+Shift+R`.

Before pushing a change to scripts or styles, bump the `?v=` number in `index.html`. It is the cache-busting version added to every script and style reference. See [CONTRIBUTING.md](../CONTRIBUTING.md).

## Publish database rules

Rules are deployed separately from the site:

```bash
npx firebase-tools login      # once per machine
npx firebase-tools deploy --only database
```

You can also paste the contents of `database.rules.json` into the **Realtime Database → Rules** tab in the Firebase console.

After any change to the rules, verify them:

```bash
curl -s https://<your-project>-default-rtdb.firebaseio.com/plan.json
```

An anonymous request should return `Permission denied`.

## Back up the plan

Use **⋯ → Export plan** to download a JSON copy of the plan. Keep it outside the browser. Progress and notes are not included in this export, so they need a separate backup if they matter to you. The shared copy in Firebase is also a backup, but it holds only the latest version.

## Version history and restore

The shared plan keeps one saved version per day for the last 30 days. Older versions are removed automatically each time the admin signs in. The admin can restore one from the **People** panel:

1. Click **People** in the top bar.
2. Under **Version history**, find the time you want and click **Restore**.
3. Confirm. The current version is saved first, so the restore can be undone the same way.

Everyone signed in sees the restored plan within seconds.

## Restore the plan

- **Restore original** (in the **⋯** menu) rebuilds the plan from `data.js`. Progress and notes are kept.
- **Import plan** (in the **⋯** menu) replaces the plan with a previously exported file. When signed in, the import reaches the other signed-in browser.

## Manage people

Only the admin can do this. Sign in with the admin account and click **People** in the top bar.

- **Approve** a waiting request to give that person access.
- **Reject** a request to dismiss it. The person can request again.
- **Remove** an approved person to revoke access. Their open session stops receiving changes.

The same lists are visible in the Firebase console under **Realtime Database → Data**, in `allowed` and `requests`.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| No **Sign in with Google** button | Firebase config is `null`, or the page is cached | Check `firebase-config.js`. Reload with `Ctrl+Shift+R`. |
| Sign-in popup shows an error | The domain is not authorised | Add the site domain under **Authentication → Settings → Authorized domains**. |
| "Waiting for approval" stays on screen | The admin hasn't approved the request yet | Ask the admin to approve in the People panel. |
| "Not allowed to read the shared plan" | The person is not approved, or their email isn't verified | Approve them in the People panel, or verify the email with Google. |
| "Not allowed to change the shared plan" | Same as above, for writes | Same fix. |
| Changes appear on one browser only | The other browser is not signed in | Sign in on that browser. |
| Plan looks outdated after a deploy | Browser cache | Reload with `Ctrl+Shift+R`. |
| Local data looks wrong | Stored plan version differs from `DB_VERSION` | The plan is reseeded automatically. Export first if you need the old data. |
| Sign-in does not work from a file | Sign-in needs `https://` or `http://localhost` | Open the site through `npm start` or GitHub Pages. |

## Clear local data

To reset one browser without affecting the shared copy, clear these keys in the browser's developer tools (Application → Local storage): `the-grind-db-v1`, `the-grind-v1`, and `the-grind-notes-v1`. Reload the page. The plan reseeds, and sync restores the shared copy if you are signed in.
