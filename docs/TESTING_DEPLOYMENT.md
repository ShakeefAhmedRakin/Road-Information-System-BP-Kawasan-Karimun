# Testing Deployment

How to verify the full deployment pipeline (GitHub Actions + Vercel) is working.

## Prerequisites

- [ ] `DATABASE_URL` secret set in GitHub repo settings
- [ ] Vercel project connected to GitHub with environment variables configured
- [ ] `production` environment created in GitHub settings
- [ ] Local dev environment working

## Test 1: Schema change (full pipeline)

```bash
# 1. Create a test branch
git checkout -b test/deployment-pipeline

# 2. Add a harmless column to a schema file
# 3. Generate migration
pnpm db:dev:generate

# 4. Test locally
pnpm db:dev:migrate
pnpm dev

# 5. Commit and push
git add packages/api/
git commit -m "test: Deployment pipeline test"
git push origin test/deployment-pipeline

# 6. Create PR — watch GitHub Actions check + Vercel preview
# 7. Merge to main — watch GitHub Actions migrate + Vercel deploy
# 8. Verify: check Neon for new column, check production site
```

## Test 2: Frontend-only change (no migration)

```bash
git checkout -b test/frontend-only
# Make a small UI change
git add .
git commit -m "test: Frontend deployment test"
git push origin test/frontend-only
# Create PR and merge — GitHub Actions finds no migration changes, Vercel deploys
```

## Cleanup

After testing, revert the test schema change:

```bash
# Remove the test column from the schema file
pnpm db:dev:generate       # Generates a DROP COLUMN migration
pnpm db:dev:migrate
git add .
git commit -m "cleanup: Remove test column"
git push origin main
```

## Success Criteria

- [ ] PR checks run automatically
- [ ] Missing migrations are detected and reported
- [ ] Migrations run on Neon when merging to main
- [ ] Vercel deploys automatically
- [ ] Production site updates within 5 minutes
