# Contributing

Thank you for helping improve The Grind. The project is small and personal, so the process is light.

## Ground rules

- The site has no build step. Keep it that way: plain JavaScript and CSS, loaded directly by `index.html`.
- Keep changes focused. One change per commit, with a clear message.
- Match the code around your change: naming, indentation (two spaces), and the `TG` module pattern.
- Do not add a framework or a bundler without discussing it first.

## Local workflow

```bash
npm start            # serves http://localhost:5173
node --check src/js/<file>.js   # syntax check after editing a script
```

Test in a browser. Check the browser's console for errors before committing.

## Change checklist

1. Make the change.
2. Run `node --check` on every script you touched.
3. Test the affected feature in the browser, including a hard reload.
4. If the plan's structure changed, increase `DB_VERSION` in `src/js/store.js` so that stored plans are reseeded.
5. Bump the `?v=` number in `index.html` for every changed script or style.
6. Update the documentation in `docs/` if the change affects setup, data, security, or behaviour.
7. Commit and push to `main`.

## Commit messages

Use the imperative mood and describe what changed:

```
notes: pin to a day when dropped on it
sync: require verified email in database rules
docs: document the data model
```

## Documentation

| Document | Update when |
| --- | --- |
| `README.md` | Features, quick start, or the list of documents change |
| `docs/SETUP.md` | Setup steps change |
| `docs/ARCHITECTURE.md` | Modules, script order, or sync behaviour change |
| `docs/DATA_MODEL.md` | Stored fields or storage keys change |
| `docs/SECURITY.md` | Access rules or what is public changes |
| `docs/OPERATIONS.md` | Deploy, backup, or troubleshooting steps change |

## Reporting problems

Open an issue on GitHub with the browser, the steps to reproduce, and any console errors. Do not include the Firebase tokens, local data, or account emails.
