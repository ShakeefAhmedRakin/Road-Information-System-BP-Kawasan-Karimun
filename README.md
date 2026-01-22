# 🛣️ Sistem Informasi Jalan BP Kawasan Karimun

A comprehensive **Road Information System** for BP Kawasan Karimun, designed to manage road inventory, pavement condition assessment, and Traffic Tolerance Index (TTI) calculations based on PKRMS Manual (SE 22/2022).

> **🚧 Status**: Work in Progress  
> **🚀 Live Demo**: [https://sistem-informasi-jalan-bp-kawasan-karimun.vercel.app/](https://sistem-informasi-jalan-bp-kawasan-karimun.vercel.app/)  
> **🔑 Need admin access?** Contact for test credentials.

---

## 📋 Project Overview

**Sistem Informasi Jalan BP Kawasan Karimun** is an internal management system for tracking and analyzing road infrastructure conditions within the BP Kawasan Karimun industrial area.

**Key Features:**

- 📊 **Road Inventory Management** - Comprehensive road and segment data entry with auto-segment generation
- 🛣️ **Pavement Condition Assessment** - Support for 5 pavement types (Asphalt, Concrete, Block, Gravel, Unpaved) with detailed damage schemas
- 🧮 **TTI Calculation Engine** - Automated Traffic Tolerance Index computation based on PKRMS Manual (SE 22/2022)
- 📈 **PDF Report Generation** - Client-side PDF export with comprehensive road condition reports
- 📊 **Data Analytics** - Segment-based analysis with condition statistics and pavement type percentages
- 👥 **Role-Based Access Control** - Admin, Operator, and Visitor roles with hierarchical permissions
- 🔐 **Admin-Controlled Access** - No public sign-ups, full admin control over user management
- 🌐 **Internationalization** - Multi-language support (English & Indonesian)
- 🎨 **Theme Support** - Dark/light mode with system preference detection
- 📱 **Responsive Design** - Mobile-first design optimized for all screen sizes
- ✅ **Form Validation** - Real-time validation with React Hook Form + Zod schemas
- 🔄 **Auto-Segment Generation** - Automatic road segmentation based on interval and generation mode
- 👁️ **Visitor Visibility Controls** - Granular control over which roads visitors can access

**Built For:**

- 🏭 BP Kawasan Karimun infrastructure management team
- 🛣️ Road maintenance and planning personnel
- 📊 Management reporting and decision-making

**Technical Foundation:**

- ✅ **Modern tech stack** - Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui
- ✅ **Type-safe APIs** - Full-stack type safety with oRPC (end-to-end TypeScript)
- ✅ **Production-ready auth** - Secure authentication with Better Auth (session-based)
- ✅ **Responsive design** - Mobile-first, optimized for all devices
- ✅ **Database migrations** - Automated migrations with Drizzle ORM & GitHub Actions
- ✅ **Monorepo setup** - Turborepo for optimized builds and task orchestration
- ✅ **Form management** - Type-safe forms with React Hook Form + Zod validation
- ✅ **State management** - TanStack Query for server state & caching
- ✅ **Internationalization** - Built-in i18n support (English & Indonesian)
- ✅ **Theme system** - Dark/light mode with persistent user preferences
- ✅ **PDF reports** - Client-side PDF generation with html2canvas & jsPDF
- ✅ **CI/CD pipeline** - Automated testing, migrations, and deployment

---

## 🛠️ Tech Stack

### Frontend Technologies

| Category           | Technology                    | Purpose                                      |
| ------------------ | ----------------------------- | -------------------------------------------- |
| **Framework**      | Next.js 15                    | React framework with App Router & Turbopack  |
| **UI Library**     | React 19                      | Latest React with concurrent features        |
| **Styling**        | Tailwind CSS v4               | Utility-first CSS framework                  |
| **UI Components**  | shadcn/ui (Radix UI)          | Accessible, customizable component library   |
| **Forms**          | React Hook Form + Zod         | Type-safe form validation & management       |
| **Data Fetching**  | TanStack Query (React Query)  | Server state management & caching            |
| **Animations**     | Motion (Framer Motion)        | Smooth UI animations & transitions          |
| **Icons**          | Lucide React                  | Modern icon library                           |
| **Notifications**  | Sonner                        | Toast notification system                     |
| **Theming**        | next-themes                   | Dark/light mode support                      |
| **PDF Generation** | jsPDF + html2canvas-pro       | Client-side PDF report generation            |
| **i18n**           | Custom i18n system            | English & Indonesian language support       |

### Backend Technologies

| Category           | Technology                    | Purpose                                      |
| ------------------ | ----------------------------- | -------------------------------------------- |
| **API Framework**  | oRPC                          | Type-safe RPC with full-stack TypeScript     |
| **Database ORM**   | Drizzle ORM                   | Type-safe database queries & migrations     |
| **Database**       | PostgreSQL                    | Relational database                          |
| **Production DB**  | Neon Serverless               | Serverless PostgreSQL for production        |
| **Auth**           | Better Auth                   | Secure authentication & session management  |
| **Validation**     | Zod                           | Runtime type validation & schemas           |

### DevOps & Infrastructure

| Category           | Technology                    | Purpose                                      |
| ------------------ | ----------------------------- | -------------------------------------------- |
| **Monorepo**       | Turborepo                    | Optimized build system & task orchestration |
| **Package Manager**| pnpm                         | Fast, disk-efficient package management     |
| **CI/CD**          | GitHub Actions               | Automated testing & deployment               |
| **Hosting**        | Vercel                       | Serverless hosting for Next.js              |
| **Database Host**  | Neon                         | Serverless PostgreSQL hosting               |
| **Code Quality**   | Prettier                     | Automated code formatting                    |
| **Type Checking**  | TypeScript 5                  | Static type checking                         |

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
    ├── api/                           # oRPC backend API
    │   ├── src/
    │   │   ├── modules/
    │   │   │   ├── admin/             # Admin management (user CRUD, ban/unban)
    │   │   │   ├── auth/              # Authentication & authorization
    │   │   │   ├── road/              # Road management (CRUD operations)
    │   │   │   ├── segment/           # Segment management & generation
    │   │   │   ├── results/            # TTI calculation & report generation
    │   │   │   ├── shared/            # Shared schemas & enums
    │   │   │   └── routers.ts         # API route definitions
    │   │   └── lib/
    │   │       ├── db.ts              # Database schema & connection
    │   │       ├── orpc.ts            # oRPC configuration
    │   │       └── context.ts        # Request context
    │   ├── migrations/                # Database migrations (Drizzle)
    │   ├── .env.development           # Dev database config
    │   ├── .env.production            # Prod database config
    │   └── package.json
    └── shared/                        # Shared types & schemas
        └── src/
            ├── damage-assessment.ts   # Damage assessment schemas (Zod)
            ├── enums.ts               # Shared enums (pavement types, etc.)
            ├── road-schema.ts         # Road-related types
            └── index.ts
```

## 🔐 Role-Based Access Control

The system includes three built-in roles with hierarchical permissions:

| Role         | Permissions                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| **Admin**    | Full system access: manage users (create, update, ban/unban, role assignment), manage all road data, view all reports, system configuration |
| **Operator** | Manage road inventory (create, update, delete roads), manage segments and pavement data, generate TTI reports, view all reports |
| **Visitor**  | View-only access to visible roads (controlled by `isVisibleByVisitors` flag), view reports for accessible roads, manage own account settings |

**Additional Security Features:**
- 🔒 **User Banning System** - Admins can ban users temporarily or permanently with expiration dates
- 🔄 **Session Management** - Admins can revoke user sessions for security
- 👁️ **Visibility Controls** - Per-road visibility settings for visitor access
- 🛡️ **Route Protection** - Middleware-based route protection with role verification
- 🔐 **Password Management** - Admin-controlled password setting for new users

Routes automatically display based on user role. See `apps/web/src/config/` for route configuration.

---

## 🎯 Technical Features

### Backend Features

#### API Architecture
- **oRPC Framework** - Type-safe RPC calls with automatic TypeScript inference
- **Modular Router System** - Organized by domain (admin, auth, road, segment, results)
- **Procedure Types** - `adminProcedure`, `operatorProcedure`, `visitorProcedure` for role-based endpoints
- **Context Management** - Request context with user session and role information

#### Road Management
- **Road CRUD Operations** - Create, read, update, delete roads
- **Auto-Segment Generation** - Automatic segment creation based on:
  - Total road length (km)
  - Segment interval (meters)
  - Generation mode (full segments only, or include remainder)
- **Segment Management** - Individual segment updates with pavement inventory
- **Visibility Controls** - Per-road visitor visibility settings

#### Damage Assessment System
- **5 Pavement Types Supported:**
  - **Asphalt** - 12 damage parameters (bleeding, disintegration, cracks, potholes, rutting, edge damage)
  - **Concrete** - 6 damage parameters (cracking, spalling, structural cracking, faulting, pumping, corner break)
  - **Block** - 6 damage parameters (reflective cracking, disintegration, edge damage, potholes, rutting)
  - **Gravel/Unpaved** - 10 damage parameters (crossfall, settlement, erosion, particle size, gravel properties, corrugation, potholes, rutting)
- **Type-Safe Schemas** - Zod discriminated unions for pavement-specific validation
- **Damage Percentage Ranges** - Standardized ranges (0-5%, 5-10%, 10-20%, etc.)

#### TTI Calculation Engine
- **Automated Calculation** - Based on PKRMS Manual (SE 22/2022)
- **Weighted Distress Calculation** - Component-based distress area computation
- **Condition Mapping** - TTI to condition mapping (Good, Fair, Poor, Bad)
- **Segment-Level Analysis** - Individual segment TTI and condition assessment
- **Road-Level Statistics** - Aggregated statistics:
  - Pavement type percentages
  - Condition length statistics
  - Overall road condition summary
- **Special Handling** - Unpaved roads have fixed TTI of 150

#### Results & Reporting
- **Report Generation** - Comprehensive road condition reports
- **Report Summaries** - Quick status checks without full report generation
- **Historical Results** - Multiple result versions per road
- **Visitor-Specific Endpoints** - Filtered reports based on visibility settings

#### User Management (Admin)
- **User CRUD** - Create, read, update, delete users
- **Role Management** - Assign/update user roles
- **Ban System** - Temporary or permanent user bans with expiration dates
- **Session Management** - Revoke user sessions
- **Password Management** - Admin-set passwords for new users
- **Advanced Filtering** - Search, filter by role, ban status, sorting

#### Database
- **Drizzle ORM** - Type-safe database queries
- **Migration System** - Version-controlled migrations
- **Environment-Based Config** - Separate dev/prod database connections
- **Neon Serverless** - Production database with serverless PostgreSQL
- **Connection Pooling** - Optimized for both development and production

### Frontend Features

#### UI/UX
- **Responsive Design** - Mobile-first approach with breakpoint optimization
- **Dark/Light Theme** - System preference detection with manual toggle
- **Accessible Components** - shadcn/ui components built on Radix UI primitives
- **Loading States** - Skeleton loaders and loading indicators
- **Error Handling** - User-friendly error messages with toast notifications
- **Form Validation** - Real-time validation with error messages
- **Internationalization** - English & Indonesian language support

#### Forms & Validation
- **React Hook Form** - Performant form management
- **Zod Integration** - Type-safe validation schemas
- **Multi-Step Forms** - Complex road creation with 3 main sections:
  1. Road & Segment Identification
  2. Segment Attributes (pavement inventory, shoulders, drainage, land use)
  3. Damage Assessment (pavement-type specific)
- **Dynamic Forms** - Forms that adapt based on pavement type selection
- **Form State Management** - Dirty state tracking, validation states

#### Data Management
- **TanStack Query** - Server state management with:
  - Automatic caching
  - Background refetching
  - Optimistic updates
  - Query invalidation
- **Type-Safe API Calls** - Full TypeScript inference from oRPC
- **Optimistic Updates** - Immediate UI updates with rollback on error

#### Report Generation
- **PDF Export** - Client-side PDF generation using:
  - `html2canvas-pro` - HTML to canvas conversion
  - `jsPDF` - PDF document creation
- **High-Quality Rendering** - 2x scale for crisp PDF output
- **Responsive PDF Layout** - Fixed-width desktop layout for consistent rendering
- **Comprehensive Reports** - Includes:
  - Road information
  - Segment-by-segment analysis
  - TTI calculations
  - Condition statistics
  - Pavement type breakdown

#### Navigation & Routing
- **Role-Based Navigation** - Dynamic menu based on user role
- **Protected Routes** - Middleware-based route protection
- **Breadcrumbs** - Contextual navigation breadcrumbs
- **Mobile Navigation** - Responsive mobile menu
- **Desktop Sidebar** - Persistent sidebar navigation

#### State Management
- **Server Components** - Next.js 15 server components for data fetching
- **Client Components** - Interactive UI with React hooks
- **Context API** - Language context for i18n
- **Local State** - React hooks for component-level state

### DevOps & Infrastructure

#### CI/CD Pipeline
- **GitHub Actions Workflows:**
  - **Migration Checks** - Validates schema changes are committed
  - **Production Migrations** - Automated migration execution on main branch
  - **Deployment** - Vercel auto-deployment on push to main
- **Environment Management** - Separate dev/prod configurations
- **Secret Management** - GitHub Secrets for sensitive data

#### Build System
- **Turborepo** - Monorepo build orchestration
- **Task Caching** - Intelligent build caching
- **Parallel Execution** - Concurrent task execution
- **Dependency Graph** - Automatic dependency resolution

#### Code Quality
- **TypeScript** - End-to-end type safety
- **Prettier** - Automated code formatting
- **ESLint** - Code linting (via Next.js)
- **Type Checking** - Separate type check script

#### Deployment
- **Vercel** - Serverless Next.js hosting
- **Neon** - Serverless PostgreSQL database
- **Environment Variables** - Secure environment configuration
- **Build Optimization** - Turbopack for fast development builds

### Damage Assessment Details

#### Asphalt Pavement Assessment
- **Surface Condition** - Good/Rough evaluation
- **Bleeding** - Percentage range assessment
- **Disintegration** - Surface breakdown percentage
- **Crack Analysis** - Type (none, interconnected wide/narrow), width (<1mm, 1-5mm, >5mm), area coverage
- **Pothole Assessment** - Count, size (small/large, shallow/deep), area percentage
- **Rutting** - Percentage and depth (<1cm, 1-3cm, >3cm)
- **Edge Damage** - Left and right edge condition (none, light 0-30%, severe >30%)

#### Concrete Pavement Assessment
- **Cracking** - Percentage range
- **Spalling** - Surface deterioration percentage
- **Structural Cracking** - Load-bearing crack assessment
- **Faulting** - Slab elevation differences
- **Pumping** - Yes/No assessment
- **Corner Break** - Yes/No assessment

#### Block Pavement Assessment
- **Reflective Cracking** - Percentage range
- **Disintegration** - Block breakdown percentage
- **Edge Damage** - Left and right edge condition
- **Pothole Area** - Percentage range
- **Rutting** - Percentage range

#### Gravel/Unpaved Assessment
- **Crossfall** - Condition (>5%, 3-5%, flat, concave) and area percentage
- **Settlement** - Percentage range
- **Erosion** - Percentage range
- **Particle Size** - Largest particle size (<1cm, 1-5cm, >5cm, not uniform)
- **Gravel Properties** - Thickness (<5cm, 5-10cm, 10-20cm, >20cm), area, distribution (even, uneven, longitudinal windrow)
- **Corrugation** - Percentage range
- **Pothole Assessment** - Count, size, area percentage
- **Rutting** - Percentage and depth (<5cm, 5-15cm, >15cm)

### TTI Calculation Methodology

The Traffic Tolerance Index (TTI) is calculated based on the PKRMS Manual (SE 22/2022):

1. **Distress Area Calculation** - Each damage component is weighted and its area calculated
2. **Weighted Distress** - Sum of all weighted distress components for the segment
3. **TTI Formula** - `TTI = (Weighted Distress / Section Area) × 100`
4. **Condition Mapping:**
   - **Good**: TTI < 25
   - **Fair**: 25 ≤ TTI < 50
   - **Poor**: 50 ≤ TTI < 75
   - **Bad**: TTI ≥ 75
5. **Special Cases:**
   - Unpaved roads: Fixed TTI of 150
   - Zero area segments: TTI = 0

The calculation engine supports detailed breakdowns including:
- Individual distress component areas
- Weighted component values
- Section area calculations
- Segment-level and road-level aggregations

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
