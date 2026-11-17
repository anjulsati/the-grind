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

Use **Edit plan → Export plan** to download a JSON copy of the plan. Keep it outside the browser. Progress and notes are not included in this export, so they need a separate backup if they matter to you. The shared copy in Firebase is also a backup, but it holds only the latest version.

## Restore the plan

- **Restore original** (in edit mode) rebuilds the plan from `data.js`. Progress and notes are kept.
- **Import plan** (in edit mode) replaces the plan with a previously exported file. When signed in, the import reaches the other signed-in browser.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| No **Sign in with Google** button | Firebase config is `null`, or the page is cached | Check `firebase-config.js`. Reload with `Ctrl+Shift+R`. |
| Sign-in popup shows an error | The domain is not authorised | Add the site domain under **Authentication → Settings → Authorized domains**. |
| "Not allowed to read the shared plan" | The account is not in the rules, or its email is not verified | Add the email to `database.rules.json` and redeploy, or verify the email with Google. |
| "Not allowed to change the shared plan" | Same as above, for writes | Same fix. |
| Changes appear on one browser only | The other browser is not signed in | Sign in on that browser. |
| Plan looks outdated after a deploy | Browser cache | Reload with `Ctrl+Shift+R`. |
| Local data looks wrong | Stored plan version differs from `DB_VERSION` | The plan is reseeded automatically. Export first if you need the old data. |
| Sign-in does not work from a file | Sign-in needs `https://` or `http://localhost` | Open the site through `npm start` or GitHub Pages. |

## Clear local data

To reset one browser without affecting the shared copy, clear these keys in the browser's developer tools (Application → Local storage): `the-grind-db-v1`, `the-grind-v1`, and `the-grind-notes-v1`. Reload the page. The plan reseeds, and sync restores the shared copy if you are signed in.
