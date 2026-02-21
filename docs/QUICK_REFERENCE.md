# Quick Reference

## Development

```bash
pnpm dev                  # Start dev server (frontend + API)
pnpm dev:web              # Frontend only
pnpm dev:server           # API only
pnpm build                # Production build
pnpm check-types          # TypeScript type checking
pnpm format               # Format with Prettier
```

## Database (Development)

```bash
pnpm db:dev:push          # Quick sync schema to local DB (prototyping)
pnpm db:dev:generate      # Generate migration files from schema changes
pnpm db:dev:migrate       # Apply pending migrations
pnpm db:dev:studio        # Open Drizzle Studio
```

## Database (Production)

```bash
pnpm db:prod:generate     # Generate migrations against prod schema
pnpm db:prod:migrate      # Apply pending migrations to Neon
pnpm db:prod:studio       # Open Drizzle Studio for Neon
```

## Typical Workflows

### Schema change (production-ready)

```bash
# 1. Edit schema in packages/api/src/modules/
# 2. Generate + test locally
pnpm db:dev:generate
pnpm db:dev:migrate
# 3. Commit migration files and push
git add packages/api/migrations/
git commit -m "Add migration for ..."
git push origin main
# GitHub Actions applies to Neon automatically
```

### Quick prototyping (dev only)

```bash
# Edit schema, push directly
pnpm db:dev:push
pnpm dev
```

## Environment Variables

### `apps/web/.env.development`

```env
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
```

### `packages/api/.env.development`

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
```
