# 🗄️ Database Migrations Guide

This guide explains how to manage database migrations using Drizzle ORM and GitHub Actions.

---

## 📋 Table of Contents

- [Understanding Drizzle Commands](#understanding-drizzle-commands)
- [Development Workflow](#development-workflow)
- [Production Workflow](#production-workflow)
- [GitHub Actions Setup](#github-actions-setup)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Understanding Drizzle Commands

### `pnpm db:dev:generate` / `pnpm db:prod:generate`

**Purpose:** Generate migration files from schema changes

**What it does:**

- Compares your current schema with the database state
- Creates SQL migration files in `packages/api/migrations/`
- Creates a snapshot of the changes

**When to use:**

```bash
# After modifying schema files
pnpm db:dev:generate
```

**Example:**

```typescript
// You add a new column to packages/api/src/modules/auth/auth.schema.ts
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"), // ← New field added
});

// Run: pnpm db:dev:generate
// Creates: packages/api/migrations/0003_add_user_bio.sql
```

---

### `pnpm db:dev:push` / `pnpm db:prod:push`

**Purpose:** Directly sync schema to database (no migration files)

**What it does:**

- Pushes your schema directly to the database
- **Does NOT create migration files**
- Overwrites database to match your code

**When to use:**

```bash
# ✅ Good for: Quick prototyping in development
pnpm db:dev:push

# ❌ Bad for: Production deployments
# ❌ Bad for: Team collaboration
```

**Warning:** ⚠️ Can cause data loss! Use only in development.

---

### `pnpm db:dev:migrate` / `pnpm db:prod:migrate`

**Purpose:** Run pending migration files

**What it does:**

- Executes SQL migration files in order
- Tracks which migrations have been applied
- Safe, version-controlled updates

**When to use:**

```bash
# ✅ Production deployments
pnpm db:prod:migrate

# ✅ Team environments
pnpm db:dev:migrate

# ✅ CI/CD pipelines
```

---

## 🛠️ Development Workflow

### Option 1: Quick Iteration (push)

**Use during rapid prototyping:**

```bash
# 1. Modify schema
# Edit: packages/api/src/modules/auth/auth.schema.ts

# 2. Push directly to dev database
pnpm db:dev:push

# 3. Test your changes
# 4. Repeat as needed
```

### Option 2: Migration-Based (generate + migrate)

**Use when ready to commit changes:**

```bash
# 1. Modify schema
# Edit: packages/api/src/modules/auth/auth.schema.ts

# 2. Generate migration file
pnpm db:dev:generate

# 3. Review the generated SQL
# Check: packages/api/migrations/XXXX_migration_name.sql

# 4. Apply migration
pnpm db:dev:migrate

# 5. Commit migration to Git
git add packages/api/migrations/
git commit -m "Add user bio field migration"
```

---

## 🚀 Production Workflow

**Always use migrations in production!**

```bash
# 1. Make schema changes in a feature branch
git checkout -b feature/add-user-bio

# 2. Generate migration
pnpm db:dev:generate

# 3. Test migration locally
pnpm db:dev:migrate

# 4. Commit and push
git add packages/api/migrations/
git commit -m "Add migration for user bio field"
git push origin feature/add-user-bio

# 5. Create PR
# GitHub Actions will verify migrations

# 6. After PR approval and merge
# GitHub Actions automatically runs: pnpm db:prod:migrate
```

---

## ⚙️ GitHub Actions Setup

### Step 1: Add GitHub Secrets

Go to: **Repository Settings → Secrets and variables → Actions**

Add this secret:

| Secret Name    | Value              | Description                  |
| -------------- | ------------------ | ---------------------------- |
| `DATABASE_URL` | `postgresql://...` | Production Neon database URL |

> **Note:** Vercel handles frontend deployment automatically via Git integration. You don't need Vercel tokens for GitHub Actions.

---

### Step 2: Enable GitHub Actions

The workflows are already set up in:

- `.github/workflows/deploy.yml` - Database migrations to Neon
- `.github/workflows/check-migrations.yml` - PR checks

**What they do:**

#### On Pull Request:

1. ✅ Verify schema changes have corresponding migrations
2. ✅ Comment on PR if migrations are missing
3. ✅ Prevent merge if migrations are incomplete

#### On Push to Main:

1. ✅ Run pending migrations on Neon production database
2. ✅ Vercel automatically deploys frontend (separate process)

> **Deployment Flow:**
>
> - GitHub Actions → Applies database migrations to Neon
> - Vercel Git Integration → Automatically deploys frontend

---

### Step 3: Create Production Environment

Go to: **Repository Settings → Environments**

1. Create environment named `production`
2. Add protection rules:
   - ✅ Required reviewers
   - ✅ Wait timer (optional)
3. Add environment secret: `DATABASE_URL` (production)

---

## ✅ Best Practices

### 1. Always Generate Migrations for Schema Changes

```bash
# ❌ DON'T: Push directly to production
pnpm db:prod:push

# ✅ DO: Generate and run migrations
pnpm db:dev:generate
pnpm db:prod:migrate
```

---

### 2. Review Migration SQL Before Committing

```bash
# After generating
pnpm db:dev:generate

# Check the SQL file
cat packages/api/migrations/0003_*.sql
```

Look for:

- Data loss operations (`DROP COLUMN`, `DROP TABLE`)
- Performance issues (adding indexes on large tables)
- Breaking changes

---

### 3. Test Migrations Locally First

```bash
# 1. Generate migration
pnpm db:dev:generate

# 2. Apply to local dev database
pnpm db:dev:migrate

# 3. Test your application
pnpm dev

# 4. If issues, rollback and fix
# (Drizzle doesn't support automatic rollback)
# Manually revert or create a new migration
```

---

### 4. Never Edit Existing Migration Files

```bash
# ❌ DON'T: Edit 0003_add_user_bio.sql after committing

# ✅ DO: Create a new migration
pnpm db:dev:generate
# Creates: 0004_fix_user_bio.sql
```

---

### 5. Keep Migrations Small and Atomic

```typescript
// ❌ BAD: One huge migration with many changes
export const user = pgTable("user", {
  id: text("id"),
  bio: text("bio"), // Change 1
  avatar: text("avatar"), // Change 2
  status: text("status"), // Change 3
});

// ✅ GOOD: Separate migrations for each feature
// Migration 1: Add bio
// Migration 2: Add avatar
// Migration 3: Add status
```

---

## 🔍 Troubleshooting

### Issue: "Migration files are missing"

**Symptom:** PR check fails with migration error

**Solution:**

```bash
pnpm db:dev:generate
git add packages/api/migrations/
git commit -m "Add missing migrations"
git push
```

---

### Issue: "Migration failed in production"

**Symptom:** GitHub Actions deployment fails

**Solution:**

1. Check GitHub Actions logs for SQL error
2. Fix the schema issue locally
3. Generate a new migration
4. Push fix and redeploy

**Emergency rollback:**

```bash
# Connect to production database
# Manually revert the migration SQL
# Or create a rollback migration
```

---

### Issue: "Schema out of sync"

**Symptom:** `drizzle-kit generate` shows unexpected changes

**Solution:**

```bash
# 1. Check current migrations
ls packages/api/migrations/

# 2. Ensure all migrations are applied
pnpm db:dev:migrate

# 3. Generate fresh migrations
pnpm db:dev:generate
```

---

### Issue: "Database connection failed in CI"

**Symptom:** GitHub Actions can't connect to database

**Solution:**

1. Verify `DATABASE_URL` secret is set correctly
2. Check Neon database is accessible
3. Ensure IP allowlist includes GitHub Actions
4. Verify connection string format:
   ```
   postgresql://user:pass@host/db?sslmode=require
   ```

---

## 📚 Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle Kit Commands](https://orm.drizzle.team/kit-docs/overview)
- [Neon Documentation](https://neon.tech/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 🆘 Need Help?

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review GitHub Actions logs
3. Check Drizzle Studio: `pnpm db:dev:studio`
4. Open an issue with:
   - Error message
   - Migration file content
   - Schema changes made

---

**Last Updated:** October 2025
