# 🧪 Testing Auto-Deployment

This guide walks you through testing your GitHub Actions + Vercel deployment pipeline.

---

## 🎯 What We're Testing

1. ✅ GitHub Actions runs migrations on Neon
2. ✅ Vercel auto-deploys frontend
3. ✅ Everything works together in production

---

## 📋 Prerequisites Checklist

Before testing, ensure:

- [ ] GitHub repository secrets configured (`DATABASE_URL`)
- [ ] Vercel project connected to GitHub
- [ ] Vercel environment variables set
- [ ] Production environment created in GitHub
- [ ] Local dev environment working

---

## 🧪 Test 1: Simple Schema Change (Low Risk)

This test adds a harmless column to verify the pipeline works.

### Step 1: Create Test Branch

```bash
# Start from latest main
git checkout main
git pull origin main

# Create test branch
git checkout -b test/deployment-pipeline
```

### Step 2: Add a Test Column

Edit `packages/api/src/modules/auth/auth.schema.ts`:

```typescript
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: text("role", {
    enum: [USER_ROLES.OPERATOR, USER_ROLES.ADMIN, USER_ROLES.VISITOR],
  }).notNull(),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),

  // TEST COLUMN - Add this line
  testColumn: text("test_column"), // ← Test deployment
});
```

### Step 3: Generate Migration Locally

```bash
# Generate migration file
pnpm db:dev:generate

# You should see a new file created:
# packages/api/migrations/XXXX_add_test_column.sql

# View the migration SQL
cat packages/api/migrations/*test_column.sql
```

Expected output:

```sql
ALTER TABLE "user" ADD COLUMN "test_column" text;
```

### Step 4: Test Migration Locally

```bash
# Apply migration to local database
pnpm db:dev:migrate

# Verify it worked
pnpm db:dev:studio
# Check that test_column exists in user table
```

### Step 5: Commit and Push

```bash
# Stage changes
git add packages/api/src/modules/auth/auth.schema.ts
git add packages/api/migrations/

# Commit
git commit -m "test: Add test column for deployment pipeline"

# Push to GitHub
git push origin test/deployment-pipeline
```

### Step 6: Create Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Title: `test: Verify deployment pipeline`
4. Create PR

### Step 7: Watch PR Checks ⏱️

GitHub Actions will run automatically:

```
✅ Check Migration Status
   ├─ Checkout code
   ├─ Setup pnpm
   ├─ Install dependencies
   ├─ Check for pending migrations
   └─ ✅ All schema changes have migrations
```

**Expected:** Green checkmark ✅

**Time:** ~1-2 minutes

### Step 8: Check Vercel Preview

Vercel will also build a preview:

1. Look for Vercel bot comment on PR
2. Click "Visit Preview" link
3. Verify site loads correctly

### Step 9: Merge to Main

1. Click "Merge pull request"
2. Confirm merge
3. Delete branch (optional)

### Step 10: Watch Production Deployment 👀

#### GitHub Actions (Migrations):

1. Go to: `Repository → Actions tab`
2. Click on "Database Migrations" workflow
3. Watch the jobs:

```
Job 1: Check Migration Status
   └─ ✅ Complete (~1 min)

Job 2: Run Neon Database Migrations
   ├─ Checkout code
   ├─ Setup pnpm
   ├─ Install dependencies
   ├─ Run migrations on Neon
   │  └─ 🚀 Running production migrations...
   │  └─ ✅ Migrations completed successfully!
   └─ Migration summary
      └─ ✅ Done!
```

**Time:** ~30 seconds - 1 minute

#### Vercel (Frontend):

1. Go to: `Vercel Dashboard → Your Project`
2. Watch deployment progress:

```
Building...
   ├─ Cloning repository
   ├─ Installing dependencies
   ├─ Building Next.js app
   └─ Deploying...
      └─ ✅ Deployment ready!
```

**Time:** ~2-5 minutes

### Step 11: Verify Production

1. **Check Database:**

   ```bash
   # Connect to production database
   pnpm db:prod:studio

   # Navigate to 'user' table
   # Verify 'test_column' exists
   ```

2. **Check Website:**
   - Visit your production URL
   - Sign in
   - Verify everything works

3. **Check GitHub Actions Logs:**
   - Confirm migration ran successfully
   - No errors in logs

### Step 12: Clean Up Test Column (Optional)

Remove the test column:

```bash
# Create cleanup branch
git checkout -b cleanup/remove-test-column

# Edit schema - remove test_column line
vim packages/api/src/modules/auth/auth.schema.ts

# Generate migration
pnpm db:dev:generate

# Test locally
pnpm db:dev:migrate

# Commit and push
git add .
git commit -m "cleanup: Remove test column"
git push origin cleanup/remove-test-column

# Create PR and merge
```

---

## 🧪 Test 2: Frontend Change (No Migration)

Test Vercel auto-deployment without database changes.

### Step 1: Make UI Change

```bash
git checkout -b test/frontend-only

# Edit a component
vim apps/web/src/app/(dashboard)/dashboard/page.tsx
```

Add a test message:

```typescript
export default function Home() {
  return (
    <>
      <PageHeader
        description="Welcome to your Internal Portal Home"
        showBreadcrumb={false}
        titleFirst={false}
      />
      {/* TEST MESSAGE */}
      <p className="text-sm text-muted-foreground">
        🚀 Deployment test successful!
      </p>
    </>
  );
}
```

### Step 2: Push and Merge

```bash
git add .
git commit -m "test: Add deployment test message"
git push origin test/frontend-only
# Create PR, merge to main
```

### Step 3: Watch Vercel Only

- GitHub Actions will run but find no migration changes ✅
- Vercel will deploy the frontend ✅
- Check production site for test message

---

## 🧪 Test 3: Failed Migration (Safety Check)

Test that bad migrations are caught.

### Step 1: Create Invalid Schema

```bash
git checkout -b test/bad-migration

# Edit schema with syntax error
vim packages/api/src/modules/auth/auth.schema.ts
```

Add an invalid column:

```typescript
// This should cause an error
invalidColumn: "not a real type", // ← Invalid
```

### Step 2: Try to Generate

```bash
pnpm db:dev:generate
# Should show error
```

**Expected:** Error message about invalid schema

### Step 3: Don't Push Bad Code

```bash
# Discard changes
git checkout -- .
git checkout main
git branch -D test/bad-migration
```

**Lesson:** Bad migrations are caught locally first! ✅

---

## 🧪 Test 4: Environment Variables

Test that production uses correct environment variables.

### Step 1: Add Console Log

```typescript
// apps/web/src/app/(dashboard)/dashboard/page.tsx

export default function Home() {
  // This will show in build logs
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Auth URL:', process.env.BETTER_AUTH_URL);

  return (
    <>
      <PageHeader
        description="Welcome to your Internal Portal Home"
        showBreadcrumb={false}
        titleFirst={false}
      />
    </>
  );
}
```

### Step 2: Deploy and Check Logs

1. Commit and push to main
2. In Vercel Dashboard → Deployment → Logs
3. Look for your console.log output
4. Verify values are from production env vars

---

## 📊 Monitoring Deployment Status

### Real-Time Monitoring

**GitHub Actions:**

```bash
# Via GitHub CLI (optional)
gh workflow list
gh run list
gh run watch
```

**Vercel:**

```bash
# Via Vercel CLI
vercel ls
vercel inspect [deployment-url]
```

### Check Status URLs

Add these to your bookmarks:

- GitHub Actions: `https://github.com/[user]/[repo]/actions`
- Vercel Dashboard: `https://vercel.com/[team]/[project]`
- Neon Console: `https://console.neon.tech/projects/[project-id]`

---

## ✅ Success Criteria

Your deployment pipeline is working if:

- [ ] PR checks run automatically
- [ ] Missing migrations are detected
- [ ] Migrations run on Neon when merging to main
- [ ] Vercel deploys frontend automatically
- [ ] Production site updates within 5 minutes
- [ ] No errors in GitHub Actions logs
- [ ] No errors in Vercel deployment logs

---

## 🚨 Troubleshooting

### Issue: GitHub Actions Doesn't Run

**Check:**

```bash
# Verify workflow file exists
ls -la .github/workflows/

# Check for syntax errors
cat .github/workflows/deploy.yml
```

**Solution:**

- Ensure files are in correct location
- Check YAML syntax
- Verify GitHub Actions is enabled in repo settings

### Issue: Migration Fails in GitHub Actions

**Check Logs:**

1. Go to Actions tab
2. Click failed workflow
3. Expand "Run migrations on Neon" step
4. Read error message

**Common Issues:**

- `DATABASE_URL` secret not set
- Invalid SQL in migration
- Database connection timeout

### Issue: Vercel Doesn't Deploy

**Check:**

1. Vercel Dashboard → Settings → Git
2. Verify repository is connected
3. Check "Production Branch" is set to `main`

**Solution:**

```bash
# Reconnect repository
vercel link
vercel --prod
```

### Issue: Preview Deployment Works, Production Doesn't

**Check:**

- Vercel environment variables set for **Production**
- Not just Preview or Development
- All required variables present

---

## 🎯 Quick Test Commands

```bash
# Full test cycle
git checkout -b test/full-pipeline
echo "testColumn: text('test_column')," >> packages/api/src/modules/auth/auth.schema.ts
pnpm db:dev:generate
pnpm db:dev:migrate
git add .
git commit -m "test: Full pipeline test"
git push origin test/full-pipeline
# Create PR, watch checks, merge, watch deployment

# Check migration ran
pnpm db:prod:studio

# Cleanup
git checkout main
git pull
git branch -D test/full-pipeline
```

---

## 📝 Test Results Template

Use this to document your test:

```markdown
## Deployment Test Results

**Date:** [Date]
**Tester:** [Your Name]

### Test: Schema Change Deployment

- [ ] PR created successfully
- [ ] GitHub Actions PR check passed
- [ ] Vercel preview deployed
- [ ] PR merged to main
- [ ] GitHub Actions migration job passed
- [ ] Vercel production deployed
- [ ] Production site verified
- [ ] Database schema updated

**Time to Deploy:** [X minutes]
**Issues Found:** [None / List issues]
**Notes:** [Any observations]
```

---

## 🎉 Next Steps After Testing

Once you've successfully tested:

1. ✅ Document any custom requirements
2. ✅ Share deployment process with team
3. ✅ Set up monitoring alerts (optional)
4. ✅ Create runbook for common issues
5. ✅ Schedule regular deployment tests

---

## 📚 Related Documentation

- [Deployment Flow](./DEPLOYMENT_FLOW.md)
- [Database Migrations](./DATABASE_MIGRATIONS.md)
- [Quick Reference](./QUICK_REFERENCE.md)

---

**Last Updated:** October 2025
