# 🚀 Deployment Flow

## Overview

Your project uses **two separate deployment systems**:

1. **GitHub Actions** → Database migrations to Neon
2. **Vercel Git Integration** → Frontend auto-deployment

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Git Push to Main                      │
└────────────┬────────────────────────────────────────────┘
             │
             ├──────────────────┬──────────────────────────┐
             │                  │                          │
             ▼                  ▼                          ▼
    ┌────────────────┐  ┌──────────────┐      ┌──────────────────┐
    │ GitHub Actions │  │    Vercel    │      │   Build & Test   │
    │                │  │              │      │                  │
    │ Run Migrations │  │ Auto-Deploy  │      │  Type Checking   │
    │   to Neon      │  │   Frontend   │      │                  │
    └───────┬────────┘  └──────┬───────┘      └─────────┬────────┘
            │                  │                        │
            ▼                  ▼                        │
    ┌────────────────┐  ┌──────────────┐              │
    │  Neon Database │  │ apps/web on  │              │
    │   (PostgreSQL) │  │    Vercel    │              │
    └────────────────┘  └──────────────┘              │
                                                       │
                                                       ▼
                                             ┌──────────────────┐
                                             │   All Checks     │
                                             │     Passed       │
                                             └──────────────────┘
```

---

## 🔄 Typical Deployment Workflow

### Step 1: Develop Locally

```bash
# 1. Create feature branch
git checkout -b feature/add-new-field

# 2. Modify database schema
vim packages/api/src/modules/auth/auth.schema.ts

# 3. Generate migration
pnpm db:dev:generate

# 4. Test locally
pnpm db:dev:migrate
pnpm dev

# 5. Commit changes
git add .
git commit -m "feat: Add new field to user table"
git push origin feature/add-new-field
```

### Step 2: Create Pull Request

```
GitHub PR is created
    ↓
GitHub Actions runs:
    ✅ Check if migrations exist
    ✅ Verify schema matches migrations
    ✅ Run type checks
    ↓
PR is reviewed and approved
```

### Step 3: Merge to Main

```
Merge to main branch
    ↓
┌──────────────────────────┐
│   GitHub Actions Runs    │
│                          │
│ 1. Check migrations ✅   │
│ 2. Run migrations to     │
│    Neon database ✅      │
└──────────────────────────┘
    ↓
┌──────────────────────────┐
│  Vercel Automatically    │
│      Deploys             │
│                          │
│ 1. Pull latest code ✅   │
│ 2. Install deps ✅       │
│ 3. Build project ✅      │
│ 4. Deploy to prod ✅     │
└──────────────────────────┘
    ↓
🎉 Deployment Complete!
```

---

## ⚙️ Configuration Required

### GitHub Repository Secrets

Go to: **Repository Settings → Secrets and variables → Actions**

| Secret Name    | Value              | Purpose                             |
| -------------- | ------------------ | ----------------------------------- |
| `DATABASE_URL` | `postgresql://...` | Neon production database connection |

### Vercel Project Settings

Go to: **Vercel Dashboard → Your Project → Settings**

#### Environment Variables

| Variable                 | Value              | Environment |
| ------------------------ | ------------------ | ----------- |
| `DATABASE_URL`           | `postgresql://...` | Production  |
| `BETTER_AUTH_SECRET`     | `xxx`              | Production  |
| `BETTER_AUTH_URL`        | `https://...`      | Production  |
| `NEXT_PUBLIC_SERVER_URL` | `https://...`      | Production  |
| `CORS_ORIGIN`            | `https://...`      | Production  |

#### Git Integration

- ✅ **Auto-deploy:** Enabled for `main` branch
- ✅ **Framework:** Next.js
- ✅ **Root Directory:** `apps/web`
- ✅ **Build Command:** `pnpm build` (auto-detected)
- ✅ **Install Command:** `pnpm install`

---

## 🎯 What Happens When

### On Pull Request

| Action                        | Tool           | Result                   |
| ----------------------------- | -------------- | ------------------------ |
| Check migrations exist        | GitHub Actions | ✅ Pass or ❌ Fail       |
| Verify schema matches         | GitHub Actions | ✅ Pass or ❌ Fail       |
| Comment if migrations missing | GitHub Actions | 💬 Auto-comment on PR    |
| Preview deployment            | Vercel         | 🔗 Preview URL generated |

### On Push to Main

| Action                    | Tool           | Duration | Result                      |
| ------------------------- | -------------- | -------- | --------------------------- |
| Run migrations to Neon    | GitHub Actions | ~30s     | ✅ Database updated         |
| Build & deploy frontend   | Vercel         | ~2-5min  | ✅ Production deployed      |
| Notify deployment success | Vercel         | instant  | 📧 Email/Slack notification |

---

## 🚨 Rollback Strategy

### Database Rollback

**If migration fails:**

```bash
# Option 1: Create a rollback migration
pnpm db:dev:generate  # Create new migration to revert
git add packages/api/migrations/
git commit -m "fix: Rollback migration"
git push origin main

# Option 2: Manual database fix
pnpm db:prod:studio  # Connect to database
# Manually revert changes
```

### Frontend Rollback

**If deployment fails:**

1. Go to Vercel Dashboard
2. Navigate to: **Deployments** tab
3. Find previous working deployment
4. Click **⋯** menu → **Promote to Production**

Or via CLI:

```bash
vercel rollback
```

---

## 🔍 Monitoring

### GitHub Actions

- **Status:** Repository → Actions tab
- **Logs:** Click on workflow run → View logs
- **Notifications:** GitHub sends emails on failures

### Vercel Deployments

- **Status:** Vercel Dashboard → Deployments
- **Logs:** Click deployment → View logs
- **Metrics:** Project → Analytics tab
- **Notifications:** Vercel sends emails/Slack

### Database

- **Neon Console:** https://console.neon.tech
- **Monitoring:** Neon Dashboard → Monitoring tab
- **Logs:** Neon Dashboard → Logs tab

---

## 🎯 Best Practices

### 1. Always Test Migrations Locally

```bash
# Test the full flow locally before pushing
pnpm db:dev:generate
pnpm db:dev:migrate
pnpm dev
```

### 2. Keep Deployments Small

- One feature per PR
- Small, atomic migrations
- Easy to rollback if needed

### 3. Monitor After Deployment

- Check Vercel deployment logs
- Verify database migration in Neon
- Test production site

### 4. Use Feature Flags

For large changes:

```typescript
// Use environment variables
const NEW_FEATURE_ENABLED = process.env.ENABLE_NEW_FEATURE === "true";

if (NEW_FEATURE_ENABLED) {
  // New feature code
}
```

---

## 📝 Checklist Before Deploying

- [ ] Local tests pass
- [ ] Migration generated and tested locally
- [ ] PR approved and checks passing
- [ ] Database backup created (if major change)
- [ ] Monitoring tools ready
- [ ] Team notified about deployment

---

## 🆘 Common Issues

### Issue: "Migration failed in GitHub Actions"

**Solution:**

1. Check GitHub Actions logs
2. Fix schema locally
3. Generate new migration
4. Push fix

### Issue: "Vercel deployment failed"

**Solution:**

1. Check Vercel deployment logs
2. Verify environment variables
3. Check build errors
4. Redeploy or rollback

### Issue: "Database connection timeout"

**Solution:**

1. Verify `DATABASE_URL` is correct
2. Check Neon database is running
3. Verify IP allowlist (if configured)

---

## 📚 Related Documentation

- [Database Migrations Guide](./DATABASE_MIGRATIONS.md)
- [Quick Reference](./QUICK_REFERENCE.md)
- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)

---

**Last Updated:** October 2025
