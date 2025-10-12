# 🛣️ Sistem Informasi Jalan BP Kawasan Karimun

A comprehensive **Road Information System** for BP Kawasan Karimun, designed to manage road inventory, pavement condition assessment, and Traffic Tolerance Index (TTI) calculations based on PKRMS Manual (SE 22/2022).

> **🚧 Status**: Work in Progress  
> **🚀 Live Demo**: [https://sistem-informasi-jalan-bp-kawasan-karimun.vercel.app/](https://sistem-informasi-jalan-bp-kawasan-karimun.vercel.app/)  
> **🔑 Need admin access?** Contact for test credentials.

---

## 📋 Project Overview

**Sistem Informasi Jalan BP Kawasan Karimun** is an internal management system for tracking and analyzing road infrastructure conditions within the BP Kawasan Karimun industrial area.

**Key Features:**

- 📊 **Road Inventory Management** - Comprehensive road and segment data entry (3 forms)
- 🛣️ **Pavement Condition Assessment** - Support for 5 pavement types (Asphalt, Concrete, Block, Gravel, Unpaved)
- 🧮 **TTI Calculation Engine** - Automated Traffic Tolerance Index computation based on PKRMS standards
- 📈 **Reporting & Export** - Excel export capabilities for analysis and reporting
- 👥 **Role-Based Access** - Admin, Operator, and Visitor roles with hierarchical permissions
- 🔐 **Admin-Controlled Access** - No public sign-ups, full admin control over user management

**Built For:**

- 🏭 BP Kawasan Karimun infrastructure management team
- 🛣️ Road maintenance and planning personnel
- 📊 Management reporting and decision-making

**Technical Foundation:**

- ✅ **Modern tech stack** - Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui
- ✅ **Type-safe APIs** - Full-stack type safety with oRPC
- ✅ **Production-ready auth** - Secure authentication with Better Auth
- ✅ **Responsive design** - Mobile and desktop optimized
- ✅ **Database migrations** - Managed with Drizzle ORM
- ✅ **Monorepo setup** - Turborepo for optimized builds

---

## 🛠️ Tech Stack

| Category           | Technology           | Purpose                         |
| ------------------ | -------------------- | ------------------------------- |
| **Frontend**       | Next.js 15           | React framework with App Router |
| **Styling**        | Tailwind CSS v4      | Utility-first CSS framework     |
| **UI Components**  | shadcn/ui            | Pre-built accessible components |
| **Backend**        | oRPC                 | Type-safe API with OpenAPI      |
| **Database**       | PostgreSQL + Drizzle | Type-safe database operations   |
| **Authentication** | Better Auth          | Secure auth with sessions       |
| **Deployment**     | Vercel + Neon        | Serverless hosting              |
| **Monorepo**       | Turborepo            | Optimized build system          |
| **Language**       | TypeScript           | End-to-end type safety          |

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **pnpm** (package manager)
- **PostgreSQL** (local for development)
- **Neon account** (for production database - [sign up free](https://neon.tech))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Road-Information-System-BP-Kawasan-Karimun.git
cd Road-Information-System-BP-Kawasan-Karimun
pnpm install
```

### 2. Environment Setup

#### **Frontend Environment** (`apps/web/.env.local`)

Create `apps/web/.env.development` with the following:

```env
BETTER_AUTH_SECRET="your-secret-key-here-generate-a-random-string"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000"
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
```

> **💡 Tip**: Generate a secure secret with: `openssl rand -base64 32`

#### **API Environment** (`packages/api/.env.development`)

Create `packages/api/.env.development` with your local PostgreSQL connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
```

Replace `username`, `password`, and `your_database` with your local PostgreSQL credentials.

### 3. Database Setup

Push the database schema to your local PostgreSQL:

```bash
pnpm db:dev:generate
pnpm db:dev:push
```

Optional: Open database studio to view/edit data:

```bash
pnpm db:dev:studio
```

### 4. Start Development Server

```bash
pnpm dev
```

This starts:

- **Frontend / API**: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Production Deployment

This template is optimized for deployment on **Vercel** (frontend) and **Neon** (database).

### Step 1: Setup Neon Database

1. **Create a Neon account**: [https://neon.tech](https://neon.tech) (free tier available)
2. **Create a new project** in your Neon dashboard
3. **Copy your connection string**:
   - Format: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`
   - Find it in: Project → Connection Details → Connection string

### Step 2: Configure Production Environment

#### **Frontend Environment** (`apps/web/.env.production`)

Create `apps/web/.env.production`:

```env
BETTER_AUTH_SECRET="your-production-secret-generate-new-one"
BETTER_AUTH_URL="https://your-app.vercel.app"
NEXT_PUBLIC_SERVER_URL="https://your-app.vercel.app"
CORS_ORIGIN="https://your-app.vercel.app"
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

**For Vercel Deployment**, add these same environment variables in your Vercel project settings:

- Go to: Project Settings → Environment Variables
- Add all the variables above

#### **API Environment** (`packages/api/.env.production`)

Create `packages/api/.env.production`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

> **💡 Note**: Since frontend and API are deployed together on Vercel, they share the same URL and environment.

### Step 3: Generate and Push Database Schema to Neon

```bash
pnpm db:prod:generate
pnpm db:prod:push
```

### Step 4: Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):

   ```bash
   pnpm add -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

3. **Configure build settings** in Vercel dashboard:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm install && pnpm build`
   - **Install Command**: `pnpm install`
   - **Output Directory**: `.next` (default)

4. **Add environment variables** in Vercel:
   - Go to: Project Settings → Environment Variables
   - Add all variables from `apps/web/.env.production`
   - Make sure to set them for **Production** environment

That's it! Your app is now live on Vercel with Neon database! 🎉

> **📝 Note**: The Next.js app includes API routes, so everything (frontend + backend) runs on the same Vercel deployment at your custom domain.

---

## 📋 Available Scripts

### Development

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `pnpm dev`         | Start all services           |
| `pnpm dev:web`     | Start frontend only          |
| `pnpm dev:server`  | Start API only               |
| `pnpm build`       | Build for production         |
| `pnpm check-types` | Run TypeScript type checking |

### Database (Development)

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `pnpm db:dev:push`     | Push schema to local PostgreSQL      |
| `pnpm db:dev:studio`   | Open Drizzle Studio (local database) |
| `pnpm db:dev:generate` | Generate migrations (local)          |
| `pnpm db:dev:migrate`  | Run migrations (local)               |

### Database (Production)

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `pnpm db:prod:push`     | Push schema to Neon                 |
| `pnpm db:prod:studio`   | Open Drizzle Studio (Neon database) |
| `pnpm db:prod:generate` | Generate migrations (production)    |
| `pnpm db:prod:migrate`  | Run migrations (production)         |

### Code Quality

| Command             | Description               |
| ------------------- | ------------------------- |
| `pnpm format`       | Format code with Prettier |
| `pnpm format:check` | Check code formatting     |

---

## 📁 Project Structure

```
sistem-informasi-jalan/
├── apps/
│   └── web/                           # Next.js frontend application
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/            # Authentication pages (sign-in)
│       │   │   ├── (dashboard)/       # Protected dashboard pages
│       │   │   └── api/               # API routes (auth, RPC)
│       │   ├── components/
│       │   │   ├── ui/                # shadcn/ui components
│       │   │   └── branding/          # App logo and branding
│       │   ├── config/                # Route configurations & permissions
│       │   ├── hooks/                 # Custom React hooks (auth, admin)
│       │   ├── lib/                   # Utility libraries
│       │   └── schemas/               # Zod validation schemas
│       ├── .env.local                 # Development environment variables
│       └── package.json
│
└── packages/
    └── api/                           # oRPC backend API
        ├── src/
        │   ├── modules/
        │   │   ├── admin/             # Admin management logic
        │   │   ├── auth/              # Authentication & authorization
        │   │   ├── operator/          # Operator-specific features
        │   │   └── routers.ts         # API route definitions
        │   └── lib/
        │       ├── db.ts              # Database schema & connection
        │       ├── orpc.ts            # oRPC configuration
        │       └── context.ts         # Request context
        ├── migrations/                # Database migrations
        ├── .env.development           # Dev database config
        ├── .env.production            # Prod database config
        └── package.json
```

## 🔐 Role-Based Access Control

The system includes three built-in roles with hierarchical permissions:

| Role         | Permissions                                                  |
| ------------ | ------------------------------------------------------------ |
| **Admin**    | Full access: manage users, road data, and system permissions |
| **Operator** | Manage road inventory and pavement data, view all reports    |
| **Visitor**  | View-only access to road data, reports, and account settings |

Routes automatically display based on user role. See `apps/web/src/config/` for route configuration.

---

## 📚 Documentation

For detailed guides and troubleshooting, check out the `docs/` folder:

| Guide                                                      | Description                                      |
| ---------------------------------------------------------- | ------------------------------------------------ |
| [GitHub Actions Setup](./docs/GITHUB_ACTIONS_SETUP.md)     | **START HERE** - Fix Actions permissions & setup |
| [Testing New Migrations](./docs/TESTING_NEW_MIGRATIONS.md) | Step-by-step guide to test migration workflow    |
| [Database Migrations Guide](./docs/DATABASE_MIGRATIONS.md) | Complete migration documentation                 |
| [Quick Reference](./docs/QUICK_REFERENCE.md)               | Command cheat sheet                              |
| [Deployment Flow](./docs/DEPLOYMENT_FLOW.md)               | Complete deployment architecture                 |

### 🚨 Common Issues

**GitHub Actions failing with "Actions not allowed" error?**  
→ See [GitHub Actions Setup Guide](./docs/GITHUB_ACTIONS_SETUP.md)

**New migrations not being applied to production?**  
→ See [Testing New Migrations](./docs/TESTING_NEW_MIGRATIONS.md)

**Database schema out of sync?**  
→ See [Database Migrations Guide](./docs/DATABASE_MIGRATIONS.md)

---

## 🤝 Development Team

This project is developed for BP Kawasan Karimun's internal infrastructure management needs.

**Technical Stack Credits:**

- Built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Authentication by [Better Auth](https://www.better-auth.com/)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📬 Project Info & Access

- **Organization**: BP Kawasan Karimun
- **Live System**: [https://sistem-informasi-jalan-bp-kawasan-karimun.vercel.app/](https://sistem-informasi-jalan-bp-kawasan-karimun.vercel.app/)
- **Deployment**: Hosted on [Vercel](https://vercel.com/) + [Neon](https://neon.tech/)
- **Status**: 🚧 Work in Progress
- **Access Credentials**: Contact system administrator for user credentials

---

**Sistem Informasi Jalan BP Kawasan Karimun** 🛣️  
Road Infrastructure Management System
