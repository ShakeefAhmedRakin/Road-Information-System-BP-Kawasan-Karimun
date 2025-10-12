# Testing New Database Migrations

This guide shows you how to **test that new migrations are automatically applied** to your Neon production database via GitHub Actions.

---

## 🚨 Prerequisites: Fix GitHub Actions Permissions

Your repository currently blocks third-party GitHub Actions. **You must fix this first**.

### Fix the Restriction

1. **Go to your GitHub repository**
2. Navigate to: **Settings** → **Actions** → **General**
3. Scroll to **"Actions permissions"**
4. Select: **"Allow [your org], and select non-[your org], actions and reusable workflows"**
5. In the **"Allow specified actions and reusable workflows"** text box, add:
   ```
   actions/checkout@*,
   actions/setup-node@*,
   pnpm/action-setup@*
   ```
6. Click **Save**

**Why?** Our workflow needs these official GitHub Actions to:

- `actions/checkout@v4` - Check out your code
- `actions/setup-node@v4` - Set up Node.js
- `pnpm/action-setup@v2` - Set up pnpm package manager

---

## ✅ Step-by-Step: Test Migration Workflow

### Step 1: Make Sure Migration History is Synced

**In Neon Console SQL Editor**, verify the migration table:

```sql
SELECT * FROM __drizzle_migrations ORDER BY id;
```

You should see **exactly 3 rows**:

- `0000_nostalgic_hellcat`
- `0001_public_maverick`
- `0002_amusing_caretaker`

If not, run:

```sql
TRUNCATE __drizzle_migrations;

INSERT INTO __drizzle_migrations (hash, created_at)
VALUES
  ('0000_nostalgic_hellcat', 1759608128041),
  ('0001_public_maverick', 1759608655915),
  ('0002_amusing_caretaker', 1759629764942)
ON CONFLICT (hash) DO NOTHING;
```

---

### Step 2: Create a Test Migration

#### 2.1 Update Your Schema

Edit `packages/api/src/modules/auth/auth.schema.ts`:

```typescript
// Add a new field to the user table
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  role: text("role").notNull(),
  banned: boolean("banned").default(false),
  banReason: text("banReason"),
  banExpiresAt: timestamp("banExpiresAt"),

  // NEW TEST FIELD - Add this line
  phoneNumber: text("phoneNumber"),
});
```

#### 2.2 Generate Migration

```bash
cd packages/api
pnpm db:dev:generate
```

This creates a new migration file like `0003_xyz_name.sql`.

#### 2.3 Review the Migration

```bash
# Check what migration was created
cat migrations/0003_*.sql
```

Should show:

```sql
ALTER TABLE "user" ADD COLUMN "phoneNumber" text;
```

---

### Step 3: Commit and Push

```bash
# Stage the changes
git add packages/api/

# Commit with descriptive message
git commit -m "Add phoneNumber field to user table"

# Push to main branch (triggers GitHub Actions)
git push origin main
```

---

### Step 4: Watch GitHub Actions

1. **Go to GitHub** → **Actions** tab
2. You should see a new workflow run: **"Database Migrations"**
3. It should have **2 jobs**:
   - ✅ **Check Migration Status** - Verifies all schema changes have migration files
   - ✅ **Run Neon Database Migrations** - Applies the new migration to Neon

**Expected output:**

```bash
🚀 Running production migrations on Neon...
Applying migration: 0003_xyz_name.sql
✅ Migrations completed successfully!
```

---

### Step 5: Verify in Neon

#### 5.1 Check Migration Table

In **Neon Console SQL Editor**:

```sql
-- Should now show 4 rows (including the new migration)
SELECT * FROM __drizzle_migrations ORDER BY id;
```

#### 5.2 Check User Table

```sql
-- Should show the new phoneNumber column
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user'
ORDER BY ordinal_position;
```

You should see `phonenumber` (lowercase) in the list.

---

## 🔄 The Complete Workflow Going Forward

### Development Workflow

```bash
# 1. Make schema changes
vim packages/api/src/modules/auth/auth.schema.ts

# 2. Generate migration
pnpm db:dev:generate

# 3. Review migration file
cat packages/api/migrations/0003_*.sql

# 4. Test locally (optional)
pnpm db:dev:migrate

# 5. Commit and push
git add packages/api/
git commit -m "feat: add new field to user table"
git push origin main
```

### What Happens Automatically

1. **GitHub Actions triggers** on push to `main`
2. **Check Migration Status** job:
   - Verifies schema matches migration files
   - Fails if you forgot to generate migrations
3. **Run Neon Database Migrations** job:
   - Applies new migrations to Neon
   - Tracks applied migrations in `__drizzle_migrations` table
   - Skips already-applied migrations
4. **Vercel deploys** the frontend automatically
5. ✅ **Your app is updated** with new database schema!

---

## 📊 Monitoring

### View Applied Migrations

```sql
SELECT
  id,
  hash,
  to_timestamp(created_at / 1000) as applied_at
FROM __drizzle_migrations
ORDER BY id;
```

### Check for Pending Migrations

```bash
# Locally, check if schema matches migrations
cd packages/api
pnpm db:prod:generate

# If this creates new files, you have pending migrations
git status migrations/
```

---

## 🚨 Troubleshooting

### Error: "relation already exists"

**Cause:** Migration table out of sync with actual database state.

**Fix:** Manually mark migrations as applied (see Step 1 above).

---

### Error: "Actions not allowed"

**Cause:** GitHub Actions policy blocking third-party actions.

**Fix:** Update repository settings to allow the required actions (see Prerequisites above).

---

### Migration Failed in GitHub Actions

**Steps to debug:**

1. **Check the error** in GitHub Actions logs
2. **Test locally:**
   ```bash
   # Use your production DATABASE_URL
   export DATABASE_URL="your-neon-connection-string"
   cd packages/api
   pnpm db:prod:migrate
   ```
3. **Common issues:**
   - Syntax error in migration SQL
   - Column/table already exists
   - Foreign key constraint violation

---

### Rollback a Migration

Drizzle doesn't support automatic rollbacks. To rollback:

1. **Create a new migration** that reverses the changes:

   ```bash
   # Manually create SQL file
   touch packages/api/migrations/0004_rollback_xyz.sql
   ```

2. **Write reverse SQL:**

   ```sql
   -- Example: Remove the phoneNumber column
   ALTER TABLE "user" DROP COLUMN "phoneNumber";
   ```

3. **Update migration journal** (`migrations/meta/_journal.json`)

4. **Commit and push** - GitHub Actions will apply the rollback

---

## ✅ Success Checklist

After pushing a new migration, verify:

- [ ] GitHub Actions workflow completed successfully
- [ ] Migration appears in `__drizzle_migrations` table in Neon
- [ ] Database schema updated correctly
- [ ] Vercel deployed the frontend
- [ ] Application works correctly with new schema

---

## 📚 Related Documentation

- [Database Migrations Guide](./DATABASE_MIGRATIONS.md) - Complete migration documentation
- [Quick Reference](./QUICK_REFERENCE.md) - Command cheat sheet
- [Deployment Flow](./DEPLOYMENT_FLOW.md) - Complete deployment architecture
