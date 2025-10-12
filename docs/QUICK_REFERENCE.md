# 🚀 Quick Reference - Database Migrations

## Commands Cheat Sheet

### Development

```bash
# Generate migration from schema changes
pnpm db:dev:generate

# Apply migrations to local database
pnpm db:dev:migrate

# Quick push (prototyping only)
pnpm db:dev:push

# Open database studio
pnpm db:dev:studio
```

### Production

```bash
# Generate migration (same as dev)
pnpm db:prod:generate

# Apply migrations to production
pnpm db:prod:migrate

# Open production database studio
pnpm db:prod:studio
```

---

## Quick Comparison

| Command    | Creates Files? | Safe for Prod? | Use Case               |
| ---------- | -------------- | -------------- | ---------------------- |
| `generate` | ✅ Yes         | ✅ Yes         | Create migration files |
| `migrate`  | ❌ No          | ✅ Yes         | Run migration files    |
| `push`     | ❌ No          | ⚠️ No          | Quick prototyping only |
| `studio`   | ❌ No          | ✅ Yes         | View/edit database     |

---

## Typical Workflows

### 🔧 Development (Prototyping)

```bash
# 1. Edit schema
vim packages/api/src/modules/auth/auth.schema.ts

# 2. Push directly
pnpm db:dev:push

# 3. Test
pnpm dev
```

### 🚀 Development (Team/Production Ready)

```bash
# 1. Edit schema
vim packages/api/src/modules/auth/auth.schema.ts

# 2. Generate migration
pnpm db:dev:generate

# 3. Review SQL
cat packages/api/migrations/0003_*.sql

# 4. Apply locally
pnpm db:dev:migrate

# 5. Commit
git add packages/api/migrations/
git commit -m "Add migration"
```

### 🌐 Production Deployment

```bash
# Automated via GitHub Actions:
git push origin main

# Manual (if needed):
pnpm db:prod:migrate
```

---

## Common Scenarios

### Adding a Column

```typescript
// 1. Edit schema
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  bio: text("bio"), // ← New
});

// 2. Generate
pnpm db:dev:generate

// 3. Migrate
pnpm db:dev:migrate
```

### Changing Column Type

```typescript
// 1. Edit schema
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  age: integer("age"), // Changed from text
});

// 2. Generate
pnpm db:dev:generate

// 3. Review SQL (check for data conversion)
cat packages/api/migrations/0003_*.sql

// 4. Migrate
pnpm db:dev:migrate
```

### Creating New Table

```typescript
// 1. Create new schema file
export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  userId: text("user_id").references(() => user.id),
});

// 2. Export in index
export * from "./post.schema";

// 3. Generate
pnpm db:dev:generate

// 4. Migrate
pnpm db:dev:migrate
```

---

## Environment Variables

### Development (`.env.development`)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
```

### Production (`.env.production` or Vercel)

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require"
```

---

## GitHub Actions

### On Pull Request

- ✅ Checks migrations exist
- ✅ Comments if missing

### On Merge to Main

- ✅ Runs migrations on Neon
- 🔄 Vercel auto-deploys frontend separately

---

## Troubleshooting Quick Fixes

### "Migrations out of sync"

```bash
pnpm db:dev:migrate
pnpm db:dev:generate
```

### "Schema changes not detected"

```bash
# Verify schema is exported
grep -r "export const" packages/api/src/modules/auth/auth.schema.ts

# Regenerate
pnpm db:dev:generate
```

### "Migration failed"

```bash
# Check logs
cat packages/api/migrations/meta/_journal.json

# Manual rollback (if needed)
# Edit database directly via studio
pnpm db:dev:studio
```

---

## See Full Documentation

📖 [Complete Migration Guide](./DATABASE_MIGRATIONS.md)
