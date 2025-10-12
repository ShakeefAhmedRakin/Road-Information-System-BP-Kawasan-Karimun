# GitHub Actions Setup & Troubleshooting

Quick guide to set up and troubleshoot GitHub Actions for database migrations.

---

## 🚨 Current Issue: Actions Not Allowed

### Error Message

```
The actions actions/checkout@v4, pnpm/action-setup@v2, and actions/setup-node@v4
are not allowed in ShakeefAhmedRakin/internal-portal-template because all actions
must be from a repository owned by ShakeefAhmedRakin.
```

### What This Means

Your repository has a **security policy** that blocks third-party GitHub Actions. This is a GitHub organization or repository setting.

---

## ✅ Fix #1: Allow Specific Actions (Recommended)

This approach is **secure** - you only allow the specific actions you need.

### Steps:

1. **Go to your GitHub repository**

   ```
   https://github.com/ShakeefAhmedRakin/internal-portal-template
   ```

2. **Navigate to Settings**
   - Click **Settings** (top right)
   - Click **Actions** (left sidebar)
   - Click **General**

3. **Update Actions Permissions**
   - Scroll to **"Actions permissions"**
   - Select: **"Allow [your org], and select non-[your org], actions and reusable workflows"**
   - In the text box that appears, paste:
     ```
     actions/checkout@*,
     actions/setup-node@*,
     pnpm/action-setup@*
     ```
4. **Save Changes**
   - Click **Save** at the bottom

5. **Re-run Failed Workflow**
   - Go to **Actions** tab
   - Click the failed workflow
   - Click **"Re-run all jobs"**

---

## ✅ Fix #2: Allow All Actions (Easier, Less Secure)

If you trust all GitHub Actions, you can allow everything:

### Steps:

1. **Go to Settings** → **Actions** → **General**
2. Under **"Actions permissions"**, select:
   - ✅ **"Allow all actions and reusable workflows"**
3. Click **Save**

⚠️ **Note:** This is less secure but simpler. Good for personal projects.

---

## 🔐 Required GitHub Secrets

Your workflow needs access to your **Neon database**. Make sure these secrets are set:

### 1. Add DATABASE_URL Secret

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `DATABASE_URL`
4. Value: Your Neon connection string
   ```
   postgresql://username:password@ep-xyz-123.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. Click **Add secret**

### Where to Get Your Neon Connection String

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Click **Connection Details**
4. Copy the **Connection string**
5. Make sure you use the **production database** connection string

---

## 🧪 Test the Workflow

After fixing permissions and adding secrets, test it:

### Option 1: Push a Change

```bash
# Make any small change
echo "# Test" >> README.md

# Commit and push
git add README.md
git commit -m "Test GitHub Actions"
git push origin main
```

### Option 2: Manually Trigger

1. Go to **Actions** tab
2. Select **"Database Migrations"** workflow
3. Click **"Run workflow"**
4. Select **main** branch
5. Click **"Run workflow"** button

---

## 📊 Expected Workflow Behavior

### On Pull Request

✅ **Check Migration Status** job runs

- Verifies schema matches migration files
- Fails if migrations are missing
- Adds PR comment if check fails

🚫 **Migrations NOT applied** to Neon (only checking)

### On Push to Main

✅ **Check Migration Status** job runs
✅ **Run Neon Database Migrations** job runs

- Applies new migrations to Neon production database
- Skips already-applied migrations
- Updates migration tracking table

---

## 🐛 Troubleshooting

### Issue: "No such secret: DATABASE_URL"

**Fix:** Add the `DATABASE_URL` secret (see above)

---

### Issue: "Cannot find module 'drizzle-kit'"

**Fix:** Workflow dependencies not installed. Check the workflow has:

```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

---

### Issue: "relation 'account' already exists"

**Fix:** Migration history out of sync. See [TESTING_NEW_MIGRATIONS.md](./TESTING_NEW_MIGRATIONS.md) Step 1.

**Quick fix SQL:**

```sql
-- In Neon Console SQL Editor
TRUNCATE __drizzle_migrations;

INSERT INTO __drizzle_migrations (hash, created_at)
VALUES
  ('0000_nostalgic_hellcat', 1759608128041),
  ('0001_public_maverick', 1759608655915),
  ('0002_amusing_caretaker', 1759629764942);
```

---

### Issue: Workflow Runs but Migrations Not Applied

**Debug steps:**

1. **Check workflow logs:**
   - Go to Actions tab
   - Click the workflow run
   - Expand **"Run migrations on Neon"** step
   - Look for error messages

2. **Verify DATABASE_URL secret:**

   ```bash
   # In workflow logs, you should see:
   🚀 Running production migrations on Neon...
   # NOT an error about missing DATABASE_URL
   ```

3. **Test locally:**
   ```bash
   # Use your production DATABASE_URL
   cd packages/api
   export DATABASE_URL="your-neon-connection-string"
   pnpm db:prod:migrate
   ```

---

## 🎯 Workflow Files Reference

Your repository has these workflow files:

### `.github/workflows/deploy.yml`

- **Purpose:** Run migrations on production (Neon)
- **Triggers:** Push to `main` or PR to `main`
- **Jobs:**
  - `check-migrations` - Verify migrations are generated
  - `migrate-production` - Apply migrations to Neon (only on push to main)

### `.github/workflows/check-migrations.yml`

- **Purpose:** PR validation - ensure migrations are generated
- **Triggers:** PR to `main` or `develop` with schema changes
- **Jobs:**
  - `check-migrations` - Fail PR if migrations missing
  - Comments on PR with instructions to fix

---

## 🔄 Complete GitHub Actions Flow

```
Developer makes schema change
         ↓
    Runs locally: pnpm db:dev:generate
         ↓
   Commits migration files
         ↓
    Creates Pull Request
         ↓
 ✅ check-migrations.yml runs
    - Verifies migrations are generated
    - Fails if missing
         ↓
    Merge to main branch
         ↓
 ✅ deploy.yml runs
    - Check migrations (again)
    - Apply migrations to Neon
    - Mark migrations as applied
         ↓
 ✅ Vercel auto-deploys frontend
         ↓
    🎉 Deployment complete!
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] GitHub Actions permissions allow required actions
- [ ] `DATABASE_URL` secret is set
- [ ] Workflow runs successfully on push to main
- [ ] Migrations are applied to Neon
- [ ] `__drizzle_migrations` table is updated
- [ ] No errors in workflow logs

---

## 📚 Related Documentation

- [Testing New Migrations](./TESTING_NEW_MIGRATIONS.md) - Step-by-step testing guide
- [Database Migrations Guide](./DATABASE_MIGRATIONS.md) - Complete migration docs
- [Quick Reference](./QUICK_REFERENCE.md) - Command cheat sheet
