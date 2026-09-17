# ArphixCord

ArphixCord is a private, Discord-inspired community chat app. It currently includes:

- Sign in with Manus OAuth
- Servers and text channels
- Database-backed messages
- A dark, responsive chat workspace
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

The current MVP is intentionally focused. Future additions can include invite links, roles and permissions, direct messages, reactions, file uploads, notifications, voice chat, video chat, and moderation tools.
