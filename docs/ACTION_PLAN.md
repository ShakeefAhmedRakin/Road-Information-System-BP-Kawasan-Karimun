# 🎯 Action Plan: Fix GitHub Actions & Enable Auto-Migrations

Quick checklist to get your GitHub Actions working and auto-apply new migrations to Neon.

---

## ✅ Step 1: Fix GitHub Actions Permissions (5 minutes)

### The Problem

Your GitHub repository blocks third-party actions, causing this error:

```
The actions actions/checkout@v4, pnpm/action-setup@v2, and actions/setup-node@v4
are not allowed
```

### The Fix

1. **Go to your repository**: https://github.com/ShakeefAhmedRakin/internal-portal-template
2. **Settings** → **Actions** → **General**
3. Scroll to **"Actions permissions"**
4. Select: **"Allow [your org], and select non-[your org], actions and reusable workflows"**
5. In the text box, paste:
   ```
   actions/checkout@*,
   actions/setup-node@*,
   pnpm/action-setup@*
   ```
6. Click **Save**

📖 **Detailed guide**: [docs/GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)

---

## ✅ Step 2: Verify DATABASE_URL Secret (2 minutes)

### Check if Secret Exists

1. **Go to**: Settings → Secrets and variables → Actions
2. **Verify** `DATABASE_URL` exists
3. **If missing**, add it:
   - Name: `DATABASE_URL`
   - Value: Your Neon connection string from [Neon Console](https://console.neon.tech/)
   ```
   postgresql://username:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

---

## ✅ Step 3: Sync Migration History (5 minutes)

Your Neon database has tables but no migration history. This causes the "relation already exists" error.

### Run in Neon Console SQL Editor

1. **Go to**: [Neon Console](https://console.neon.tech/) → Your Project → SQL Editor
2. **Run this SQL**:

```sql
-- Check current state
SELECT * FROM __drizzle_migrations ORDER BY id;

-- If empty or wrong data, clear it
TRUNCATE __drizzle_migrations;

-- Mark existing migrations as applied (0-2 only, not 0003 test migration)
INSERT INTO __drizzle_migrations (hash, created_at)
VALUES
  ('0000_nostalgic_hellcat', 1759608128041),
  ('0001_public_maverick', 1759608655915),
  ('0002_amusing_caretaker', 1759629764942)
ON CONFLICT (hash) DO NOTHING;

-- Verify - should show exactly 3 rows
SELECT * FROM __drizzle_migrations ORDER BY id;
```

You should see:

```
id | hash                     | created_at
---+--------------------------+-------------
1  | 0000_nostalgic_hellcat  | ...
2  | 0001_public_maverick    | ...
3  | 0002_amusing_caretaker  | ...
```

---

## ✅ Step 4: Commit Local Changes (2 minutes)

I've deleted the test migration (0003). Commit this cleanup:

```bash
# Check what changed
git status

# Stage the changes
git add packages/api/migrations

# Commit
git commit -m "Remove test migration, clean up migration history"

# Push to main (this will trigger GitHub Actions)
git push origin main
```

---

## ✅ Step 5: Verify GitHub Actions (3 minutes)

After pushing, check if GitHub Actions works:

1. **Go to**: Actions tab in your repository
2. **Watch** the "Database Migrations" workflow
3. **Expected result**:
   - ✅ Check Migration Status (passes)
   - ✅ Run Neon Database Migrations (passes, no migrations to apply)

If it fails, check the error in the workflow logs and refer to:

- [GitHub Actions Setup Guide](./GITHUB_ACTIONS_SETUP.md) for permission errors
- [Testing New Migrations](./TESTING_NEW_MIGRATIONS.md) for migration errors

---

## ✅ Step 6: Test with a Real Migration (10 minutes)

Now test that new migrations actually work:

### 6.1 Add a Test Field

Edit `packages/api/src/modules/auth/auth.schema.ts`:

```typescript
export const user = pgTable("user", {
  // ... existing fields ...

  // Add this line at the end
  phoneNumber: text("phoneNumber"),
});
```

### 6.2 Generate Migration

```bash
cd packages/api
pnpm db:dev:generate
```

This creates a new migration file like `0003_xyz_name.sql`.

### 6.3 Commit and Push

```bash
git add packages/api/
git commit -m "feat: add phoneNumber field to user table"
git push origin main
```

### 6.4 Watch GitHub Actions

1. Go to **Actions** tab
2. The workflow should:
   - ✅ Check migrations (passes)
   - ✅ Apply new migration to Neon
   - Show output: `Applying migration: 0003_xyz_name.sql`

### 6.5 Verify in Neon

Run in **Neon Console SQL Editor**:

```sql
-- Should now show 4 rows
SELECT * FROM __drizzle_migrations ORDER BY id;

-- Verify new column exists
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'user'
ORDER BY ordinal_position;
```

You should see `phonenumber` in the list! 🎉

---

## 🎉 Success Checklist

- [ ] GitHub Actions permissions fixed
- [ ] `DATABASE_URL` secret configured
- [ ] Migration history synced in Neon (3 rows in `__drizzle_migrations`)
- [ ] Local test migration deleted and committed
- [ ] GitHub Actions workflow runs successfully
- [ ] Test migration applied and verified in Neon

---

## 🔄 Going Forward: Your Workflow

From now on, whenever you make schema changes:

```bash
# 1. Make schema changes
vim packages/api/src/modules/auth/auth.schema.ts

# 2. Generate migration
cd packages/api
pnpm db:dev:generate

# 3. Review the generated SQL
cat migrations/0003_*.sql

# 4. Commit and push
git add packages/api/
git commit -m "feat: add new field"
git push origin main
```

**GitHub Actions will automatically**:

- ✅ Verify migrations are generated
- ✅ Apply migrations to Neon
- ✅ Track migration history

**Vercel will automatically**:

- ✅ Deploy your frontend

**Result**: Your database and app are always in sync! 🚀

---

## 🚨 Need Help?

### Common Issues

| Issue                              | Solution                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------- |
| "Actions not allowed"              | [GitHub Actions Setup](./GITHUB_ACTIONS_SETUP.md)                          |
| "relation already exists"          | [Testing New Migrations](./TESTING_NEW_MIGRATIONS.md)                      |
| "No such secret: DATABASE_URL"     | [GitHub Actions Setup](./GITHUB_ACTIONS_SETUP.md#-required-github-secrets) |
| Migrations not being applied       | [Testing New Migrations](./TESTING_NEW_MIGRATIONS.md)                      |
| Want to understand migrations more | [Database Migrations Guide](./DATABASE_MIGRATIONS.md)                      |

### Documentation

- 📘 [GitHub Actions Setup](./GITHUB_ACTIONS_SETUP.md) - Setup & troubleshooting
- 📗 [Testing New Migrations](./TESTING_NEW_MIGRATIONS.md) - Step-by-step testing
- 📕 [Database Migrations Guide](./DATABASE_MIGRATIONS.md) - Complete guide
- 📙 [Quick Reference](./QUICK_REFERENCE.md) - Command cheat sheet
- 📔 [Deployment Flow](./DEPLOYMENT_FLOW.md) - Architecture overview

---

## 💬 Still Stuck?

Open a GitHub issue with:

- The error message
- The workflow logs (from Actions tab)
- What step you're on in this guide

I'll help you debug! 🤝
