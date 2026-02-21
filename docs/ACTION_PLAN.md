# Action Plan: GitHub Actions & Auto-Migrations Setup

Checklist to get GitHub Actions running and auto-applying migrations to Neon.

## 1. Fix GitHub Actions permissions

Allow the required third-party actions in your repo settings. See [GitHub Actions Setup](./GITHUB_ACTIONS_SETUP.md).

## 2. Add `DATABASE_URL` secret

Go to **Settings > Secrets and variables > Actions** and add your Neon connection string as `DATABASE_URL`.

## 3. Sync migration history

In the [Neon SQL Editor](https://console.neon.tech/), verify `__drizzle_migrations` has entries matching every migration file in `packages/api/migrations/` that has already been applied to the database. See [Database Migrations > Migration history out of sync](./DATABASE_MIGRATIONS.md#migration-history-out-of-sync) if they don't match.

## 4. Push to main and verify

Push a commit to `main` and check the **Actions** tab. Both jobs should pass:
- **Check Migration Status** — no pending schema changes
- **Run Neon Database Migrations** — applies any new migrations

## 5. Test with a real migration

Make a schema change, generate a migration, commit, and push. Verify it's applied in Neon. See [Testing New Migrations](./TESTING_NEW_MIGRATIONS.md) for the full walkthrough.

## Ongoing workflow

```bash
# 1. Edit schema in packages/api/src/modules/
# 2. Generate migration
pnpm db:dev:generate
# 3. Commit and push
git add packages/api/
git commit -m "Add migration for ..."
git push origin main
# GitHub Actions applies migrations to Neon automatically
# Vercel deploys the frontend automatically
```
