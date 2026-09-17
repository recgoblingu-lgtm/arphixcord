# ArphixCord

ArphixCord is a private, Discord-inspired community chat app. It currently includes:

- Sign in with Manus OAuth
- Servers and text channels
- Database-backed messages
- Seven-day invite links
- Server owner and moderator roles
- Message reactions
- Moderation audit records and moderator deletion
- A dark, responsive chat workspace
- Direct messages, browser attachments, image previews, drag-and-drop, and upload progress
- In-app notifications and optional browser push notifications
- WebRTC voice/video rooms with database signaling and optional Cloudflare TURN
- Mobile-friendly workspace, DM, profile, and voice screens
- Automatic testing and builds through GitHub Actions
- A manual database update workflow, so you do not need to use a terminal

## The simple version

You own a private copy of this app at:

<https://github.com/recgoblingu-lgtm/arphixcord>

When code is changed, GitHub automatically runs the **Check ArphixCord** workflow. Green means the app still type-checks, passes tests, and builds successfully.

## One-time database setup

The app needs a database to remember users, servers, channels, and messages. GitHub stores the connection privately as a secret.

1. Open the repository on GitHub.
2. Select **Settings**.
3. Select **Secrets and variables → Actions**.
4. Select **New repository secret**.
5. Set the name to `DATABASE_URL`.
6. Paste the private connection string provided by your database host.
7. Select **Add secret**.
8. Open the repository's **Actions** tab.
9. Select **Update ArphixCord database**.
10. Select **Run workflow**, then select the green **Run workflow** button.

You only need to run this database workflow again after a future database change. The connection string is never printed in the workflow logs.

## What you do not need to understand

You do not need to understand Node.js, SQL, GitHub Actions, Cloudflare, or command-line tools to use the basic setup. GitHub is the place where the code and automatic buttons live.

## Important note about hosting

GitHub stores the source code and runs the workflows. It does not keep the live website running by itself. The ArphixCord project still needs a web host for the app and a database host for the data. Cloudflare can host the frontend and domain, but the current full-stack app also needs a backend host that supports Node.js unless the backend is later converted to Cloudflare Workers.

## Roadmap

The current release is intentionally focused. Future additions can include direct messages, file uploads, notifications, realtime sockets, voice chat, video chat, and richer moderation tools.

## GitHub Pages frontend deployment

This repository is public, so all source code and history are visible. The Pages workflow publishes the frontend at `https://recgoblingu-lgtm.github.io/arphixcord/`. In GitHub, open **Settings → Pages**, set **Source** to **GitHub Actions**, and save. Then open **Settings → Secrets and variables → Actions → New repository secret**, create `VITE_API_BASE_URL`, and set it to the public HTTPS URL of the existing ArphixCord backend without a trailing slash. Pushes to `main` automatically run **Deploy ArphixCord to GitHub Pages**. If Pages shows a source or permission error, choose **GitHub Actions** manually in **Settings → Pages**; the repository workflow is already present.

The Pages build uses `VITE_BASE_PATH=/arphixcord/`, creates a `404.html` SPA fallback, and supports the `/profile`, `/dm/...`, `/voice/...`, and `/invite/...` routes under the repository URL. The backend is still required for login, messages, uploads, notifications, and database access.

## Cloudflare frontend deployment

The Cloudflare Worker in this repository publishes only the Vite frontend. The existing Express/tRPC server and database remain the backend. In Cloudflare’s connected-repository build screen, set **Deploy command** to `pnpm deploy:cloudflare`; this command builds the frontend first and then runs Wrangler. You may leave **Build command** empty. The output directory in `wrangler.jsonc` is `dist/public`. The repeated error happened because `npx wrangler deploy` ran before Vite created that directory. In GitHub Actions secrets, add `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `VITE_API_BASE_URL` (the public HTTPS URL of the running ArphixCord backend, without a trailing slash). Alternatively, open **Actions → Deploy ArphixCord frontend to Cloudflare Workers → Run workflow**.

For reliable WebRTC calls, create a Cloudflare Realtime TURN key at [Cloudflare Calls](https://dash.cloudflare.com/?to=/:account/calls), then configure its key ID as `TURN_KEY_ID` and the Cloudflare API token that can use it as `TURN_API_TOKEN` on the backend. ArphixCord generates short-lived TURN credentials per browser session through Cloudflare’s `generate-ice-servers` API; the long-lived TURN key never goes to the browser. The older `TURN_URL`, `TURN_USERNAME`, and `TURN_CREDENTIAL` variables remain supported as a fallback. Browser push also requires backend VAPID secrets: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_EMAIL`.

Generate a VAPID key pair on the backend host with `pnpm exec web-push generate-vapid-keys`, then store the returned public key, private key, and a contact email as backend secrets. Do not commit any of these values to GitHub.
