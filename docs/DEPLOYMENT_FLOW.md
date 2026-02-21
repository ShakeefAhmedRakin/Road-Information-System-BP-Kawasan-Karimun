# Deployment Flow

## Architecture

Two systems deploy independently on push to `main`:

```
Push to main
    |
    ├── GitHub Actions ──> Runs migrations on Neon (PostgreSQL)
    |
    └── Vercel ──> Builds and deploys Next.js app
```

Both run in parallel. The frontend and API are deployed together as a single Next.js app on Vercel.

## Configuration

### GitHub Secrets

**Settings > Secrets and variables > Actions:**

| Secret | Value |
|--------|-------|
| `DATABASE_URL` | Neon production connection string |

### Vercel Environment Variables

**Vercel Dashboard > Project > Settings > Environment Variables:**

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Neon connection string | Production |
| `BETTER_AUTH_SECRET` | Auth secret key | Production |
| `BETTER_AUTH_URL` | `https://your-app.vercel.app` | Production |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-app.vercel.app` | Production |
| `CORS_ORIGIN` | `https://your-app.vercel.app` | Production |

### Vercel Git Integration

- Auto-deploy enabled for `main` branch
- Framework: Next.js
- Root directory: `apps/web`

## What Happens When

### On Pull Request

| What | Who | Result |
|------|-----|--------|
| Check migrations exist | GitHub Actions (`check-migrations.yml`) | Pass/fail + PR comment on failure |
| Check schema matches | GitHub Actions (`deploy.yml`) | Pass/fail |
| Preview deployment | Vercel | Preview URL |

### On Push to Main

| What | Who | Duration |
|------|-----|----------|
| Run migrations on Neon | GitHub Actions | ~30s |
| Build & deploy app | Vercel | ~2-5 min |

## Rollback

### Database

Create a new migration that reverses the changes, commit, and push.

```bash
pnpm db:dev:generate   # After reverting schema changes
git add packages/api/migrations/
git commit -m "Revert migration"
git push origin main
```

### Frontend

In Vercel Dashboard > Deployments, find a previous working deployment and click **Promote to Production**. Or: `vercel rollback`.
