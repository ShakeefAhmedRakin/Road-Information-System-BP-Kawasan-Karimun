# Sistem Informasi Jalan BP Kawasan Karimun

A road infrastructure management system for BP Kawasan Karimun. Manages road inventory, pavement condition assessment, and Traffic Tolerance Index (TTI) calculations based on the PKRMS Manual (SE 22/2022).

**Live**: [sistem-informasi-jalan-bp-kawasan-karimun.vercel.app](https://sistem-informasi-jalan-bp-kawasan-karimun.vercel.app/)

---

## Features

- **Road & Segment Management** — Create roads with auto-generated segments (configurable interval and generation mode). Track pavement inventory, shoulders, drainage, and land use per segment.
- **Pavement Damage Assessment** — Detailed damage forms for 5 pavement types (asphalt, concrete, block, gravel, unpaved) with type-specific parameters.
- **TTI Calculation** — Automated Traffic Tolerance Index computation with condition ratings (Good/Fair/Poor/Bad) at segment and road level.
- **PDF Reports** — Client-side report generation with road condition summaries, segment analysis, and pavement statistics.
- **Role-Based Access** — Three roles: Admin (user management), Operator (road data entry & reporting), Visitor (view published reports). No public sign-ups.
- **User Management** — Ban/unban users, revoke sessions, manage passwords, assign roles.
- **Internationalization** — English and Indonesian language support.
- **Dark/Light Theme** — System preference detection with manual toggle.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS v4, shadcn/ui, React Hook Form, TanStack Query |
| **API** | oRPC (type-safe RPC), Better Auth (session-based), Zod validation |
| **Database** | PostgreSQL (Neon serverless in production), Drizzle ORM |
| **Infrastructure** | Turborepo, pnpm, Vercel, GitHub Actions (CI/CD) |
| **Other** | jsPDF + html2canvas (PDF export), Motion (animations), Lucide icons |

## Project Structure

```
├── apps/web/                  # Next.js frontend
│   └── src/
│       ├── app/(auth)/        # Sign-in page
│       ├── app/(dashboard)/   # Dashboard, roads, users, account
│       ├── components/        # UI components (shadcn/ui + custom)
│       ├── hooks/             # Auth & admin hooks
│       ├── i18n/              # Translations (EN/ID)
│       └── middleware.ts      # Route protection
├── packages/api/              # Backend API
│   └── src/modules/
│       ├── admin/             # User management
│       ├── auth/              # Authentication (Better Auth)
│       ├── road/              # Road CRUD + segment generation
│       ├── segment/           # Segment updates & pavement data
│       └── results/           # TTI calculation & reporting
└── packages/shared/           # Shared enums, schemas, types
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL (local for development)

### Setup

```bash
git clone https://github.com/ShakeefAhmedRakin/Road-Information-System-BP-Kawasan-Karimun.git
cd Road-Information-System-BP-Kawasan-Karimun
pnpm install
```

Create `apps/web/.env.development`:

```env
BETTER_AUTH_SECRET="generate-with-openssl-rand-base64-32"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"
DATABASE_URL="postgresql://user:password@localhost:5432/your_db"
```

Create `packages/api/.env.development`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/your_db"
```

Push the schema and start the dev server:

```bash
pnpm db:dev:generate
pnpm db:dev:push
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm check-types` | TypeScript type checking |
| `pnpm db:dev:push` | Push schema to local DB |
| `pnpm db:dev:studio` | Open Drizzle Studio |
| `pnpm db:dev:generate` | Generate migrations |
| `pnpm db:dev:migrate` | Run migrations |
| `pnpm db:prod:push` | Push schema to Neon |
| `pnpm db:prod:migrate` | Run production migrations |
| `pnpm format` | Format code with Prettier |

## Production Deployment

Deployed on **Vercel** (frontend + API) with **Neon** (serverless PostgreSQL).

1. Set up a [Neon](https://neon.tech) database
2. Configure environment variables in Vercel project settings
3. Push schema: `pnpm db:prod:generate && pnpm db:prod:push`
4. Deploy via Vercel (auto-deploys on push to `main`)

GitHub Actions handles migration checks on PRs and auto-runs migrations on merge to `main`.

## Documentation

| Guide | Description |
|-------|-------------|
| [GitHub Actions Setup](./docs/GITHUB_ACTIONS_SETUP.md) | Actions permissions & CI setup |
| [Database Migrations](./docs/DATABASE_MIGRATIONS.md) | Migration workflow |
| [Testing Migrations](./docs/TESTING_NEW_MIGRATIONS.md) | Testing migration changes |
| [Deployment Flow](./docs/DEPLOYMENT_FLOW.md) | Deployment architecture |
| [Quick Reference](./docs/QUICK_REFERENCE.md) | Command cheat sheet |

## License

[MIT](LICENSE)

---

Built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) | UI by [shadcn/ui](https://ui.shadcn.com/) | Auth by [Better Auth](https://www.better-auth.com/)
