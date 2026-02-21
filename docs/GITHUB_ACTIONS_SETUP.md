# GitHub Actions Setup

## Required Actions Permissions

If workflows fail with "actions not allowed", update your repo permissions:

1. Go to **Settings > Actions > General**
2. Under **Actions permissions**, select **"Allow select actions and reusable workflows"**
3. Add these to the allowlist:
   ```
   actions/checkout@*,
   actions/setup-node@*,
   pnpm/action-setup@*,
   actions/github-script@*
   ```
4. Click **Save**

## Required Secrets

Go to **Settings > Secrets and variables > Actions** and add:

| Secret | Value |
|--------|-------|
| `DATABASE_URL` | Neon production connection string (`postgresql://...?sslmode=require`) |

Get the connection string from [Neon Console](https://console.neon.tech/) > your project > Connection Details.

## Required Environments

Go to **Settings > Environments** and create an environment named `production`. Optionally add protection rules (required reviewers, wait timers).

## Workflows

### `check-migrations.yml`

- **Triggers**: PRs to `main` or `develop` that touch `packages/api/src/**/*.ts` or `packages/api/migrations/**`
- **What it does**: Runs `drizzle-kit generate` and fails if uncommitted migration files are detected
- **On failure**: Comments on the PR with fix instructions

### `deploy.yml`

- **Triggers**: Push to `main`, PRs to `main`
- **Jobs**:
  1. **Check Migration Status** — same schema-vs-migration check
  2. **Run Neon Database Migrations** — applies pending migrations to production (push to `main` only)

## Troubleshooting

**"No such secret: DATABASE_URL"** — Add the secret as described above.

**"Cannot find module 'drizzle-kit'"** — Ensure the workflow has `pnpm install --frozen-lockfile` before the migration step.

**"relation already exists"** — Migration history is out of sync. See [Database Migrations](./DATABASE_MIGRATIONS.md#migration-history-out-of-sync).

**Workflow runs but no migrations applied** — Check the Actions logs. Verify `DATABASE_URL` is set and points to the correct Neon database. Test locally with `pnpm db:prod:migrate`.
