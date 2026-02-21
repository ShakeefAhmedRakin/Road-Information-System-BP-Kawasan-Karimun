# Testing New Migrations

How to verify that new migrations are automatically applied to Neon via GitHub Actions.

## Prerequisites

- GitHub Actions permissions configured ([setup guide](./GITHUB_ACTIONS_SETUP.md))
- `DATABASE_URL` secret set in GitHub repo settings
- Local dev environment working

## Steps

### 1. Verify migration history is synced

In the [Neon SQL Editor](https://console.neon.tech/), check the migration table:

```sql
SELECT * FROM __drizzle_migrations ORDER BY id;
```

The rows should match the migration files in `packages/api/migrations/`. If out of sync, see [Database Migrations > Migration history out of sync](./DATABASE_MIGRATIONS.md#migration-history-out-of-sync).

### 2. Make a schema change

Edit a schema file in `packages/api/src/modules/` (e.g., add a column).

### 3. Generate and test locally

```bash
pnpm db:dev:generate       # Creates a new migration file
pnpm db:dev:migrate        # Apply to local DB
pnpm dev                   # Verify the app works
```

### 4. Commit and push

```bash
git add packages/api/
git commit -m "Add migration for ..."
git push origin main
```

### 5. Watch GitHub Actions

Go to your repo's **Actions** tab. The "Database Migrations" workflow should:

1. **Check Migration Status** — verifies schema matches migration files
2. **Run Neon Database Migrations** — applies the new migration to production

### 6. Verify in Neon

```sql
-- Should include your new migration
SELECT * FROM __drizzle_migrations ORDER BY id;
```

## Troubleshooting

**"relation already exists"** — Migration history is out of sync. See [Database Migrations](./DATABASE_MIGRATIONS.md#migration-history-out-of-sync).

**"Actions not allowed"** — Fix GitHub Actions permissions. See [GitHub Actions Setup](./GITHUB_ACTIONS_SETUP.md).

**Migration fails in CI** — Check the workflow logs, then test locally with `pnpm db:prod:migrate` using your production `DATABASE_URL`.
