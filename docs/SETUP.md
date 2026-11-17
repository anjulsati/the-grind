# Setup

This guide covers two things: running the site on your computer, and creating the Firebase project that enables sharing.

## Prerequisites

- Node.js 18 or later (used only for the development server)
- Git
- A Google account for sign-in and Firebase

## 1. Run the site locally

```bash
git clone https://github.com/anjulsati/the-grind.git
cd the-grind
npm start
```

Open http://localhost:5173. The development server is `server.js`, which has no dependencies. Set `PORT` to use a different port.

Without a Firebase config, the site runs entirely in your browser. Sign-in is hidden and nothing is shared.

## 2. Create the Firebase project

Sharing needs a Firebase project. Create it once.

1. Open the [Firebase console](https://console.firebase.google.com) and create a project. Google Analytics is not needed.
2. **Authentication → Get started → Sign-in method → Google → Enable.** Set the support email, then save.
3. **Authentication → Settings → Authorized domains → Add domain.** Add `anjulsati.github.io`. Localhost is already allowed.
4. **Realtime Database → Create database.** Choose a location, such as `us-central1`.
5. **Project settings → Your apps → Web (`</>`).** Register the app, then copy the config object it shows.

## 3. Connect the site to Firebase

Put the config into `src/js/firebase-config.js`:

```js
window.GRIND_FIREBASE = {
  apiKey: "...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};
```

The config is public by design. Access is controlled by the database rules, not by keeping the config secret.

## 4. Set the allowed accounts

Edit `database.rules.json` and replace the two example addresses with the Google accounts allowed to use the plan:

```json
"plan": {
  ".read": "auth != null && auth.token.email_verified === true && (auth.token.email === 'first@gmail.com' || auth.token.email === 'second@gmail.com')",
  ".write": "..."
}
```

Then publish the rules. See [OPERATIONS.md](OPERATIONS.md#publish-database-rules).

## 5. Link the Firebase project

Set the project id in `.firebaserc`:

```json
{ "projects": { "default": "your-project" } }
```

## Verify

1. Open the site and click **Sign in with Google** in the top bar.
2. Sign in with an allowed account. The top bar shows the account email.
3. Tick a task. Open the site on a second browser, signed in as the other account, and confirm the change appears.
4. Try a third Google account. It should not be able to read the plan.
