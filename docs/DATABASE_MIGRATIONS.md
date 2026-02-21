# Database Migrations

Migrations are managed with [Drizzle ORM](https://orm.drizzle.team/) and stored in `packages/api/migrations/`.

## Commands

| Command | What it does | Safe for production? |
|---------|-------------|---------------------|
| `pnpm db:dev:generate` | Generates SQL migration files from schema changes | Yes (creates files only) |
| `pnpm db:dev:migrate` | Runs pending migrations against local DB | N/A (local) |
| `pnpm db:dev:push` | Syncs schema directly to DB (no migration files) | No — dev only |
| `pnpm db:dev:studio` | Opens Drizzle Studio GUI | Yes (read/write UI) |
| `pnpm db:prod:migrate` | Runs pending migrations against Neon | Yes |
| `pnpm db:prod:studio` | Opens Drizzle Studio for production | Yes |

## Development Workflow

### Quick prototyping (no migration files)

```bash
# Edit schema, then push directly
pnpm db:dev:push
```

### Production-ready changes

```bash
# 1. Edit schema files in packages/api/src/modules/
# 2. Generate migration
pnpm db:dev:generate
# 3. Review the generated SQL in packages/api/migrations/
# 4. Apply locally
pnpm db:dev:migrate
# 5. Commit the migration files
git add packages/api/migrations/
git commit -m "Add migration for ..."
```

## Production Workflow

On push to `main`, GitHub Actions automatically:
1. Checks that all schema changes have corresponding migration files
2. Runs `pnpm db:prod:migrate` against Neon

To run manually: `pnpm db:prod:migrate`

## Best Practices

- **Never** use `db:push` in production — always use migrations
- **Never** edit existing migration files after committing — create a new migration instead
- Review generated SQL before committing (watch for `DROP COLUMN`/`DROP TABLE`)
- Test migrations locally before pushing
- Keep migrations small and atomic (one feature per migration)

## Troubleshooting

### Missing migrations on PR

PR check fails because schema changes don't have migration files.

```bash
pnpm db:dev:generate
git add packages/api/migrations/
git commit -m "Add missing migrations"
git push
```

### Migration history out of sync

If you get "relation already exists" errors, the `__drizzle_migrations` table is out of sync with the actual database state.

In the [Neon SQL Editor](https://console.neon.tech/), verify the migration history:

```sql
SELECT * FROM __drizzle_migrations ORDER BY id;
```

If entries are missing, manually insert them to match the migration files that have already been applied to the database.

### Schema out of sync

```bash
pnpm db:dev:migrate        # Apply any pending migrations
pnpm db:dev:generate       # Regenerate if needed
```

### Database connection failed in CI

- Verify `DATABASE_URL` secret is set in GitHub repo settings
- Check Neon database is accessible
- Verify connection string format: `postgresql://user:pass@host/db?sslmode=require`

## Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Drizzle Kit Commands](https://orm.drizzle.team/kit-docs/overview)
- [Neon Docs](https://neon.tech/docs)
