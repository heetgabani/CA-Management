# CA Manage — Digital Firm Management Platform

A production-grade SaaS platform for Chartered Accountants (CA), Company Secretaries (CS), Tax Consultants, and Professional Service Firms.

Replaces Excel sheets, Google Drive, and physical file cabinets with one unified cloud platform.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TanStack Query, Zustand, Tailwind CSS |
| Backend | NestJS, Passport.js, JWT Auth |
| Database | PostgreSQL 17, Prisma ORM |
| Cache / Queue | Redis, BullMQ |
| Monorepo | pnpm workspaces + Turborepo |
| Runtime | Docker (via Colima on macOS) |

---

## Prerequisites

- **Node.js** v18+
- **pnpm** v9+ — `npm install -g pnpm@9`
- **Colima** (Docker runtime for macOS, no Docker Desktop needed)

```bash
brew install docker docker-compose colima
colima start --cpu 2 --memory 4
```

---

## First-Time Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

> The default `.env` is pre-configured for local development. No changes needed to get started.

### 3. Start PostgreSQL and Redis

```bash
export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"
docker compose up postgres redis -d
```

> **Note:** PostgreSQL runs on port **5433** (not 5432) to avoid conflicts with any locally installed PostgreSQL.

### 4. Run database migrations and seed

```bash
pnpm db:migrate
pnpm db:seed
```

---

## Running the Project

> **Important:** Run the `export` command below in **every new terminal session** before using Docker or starting services.

```bash
export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"
```

### Run everything together (frontend + backend)

```bash
pnpm dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

---

### Run backend only

```bash
# Step 1 — point Docker to Colima socket (required every new terminal)
export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"

# Step 2 — make sure Postgres + Redis are running
docker ps   # should show ca_manage_postgres and ca_manage_redis

# If containers are not running:
colima start
docker compose up postgres redis -d

# Step 3 — start the API
pnpm --filter @ca-manage/api dev
```

### Run frontend only

```bash
pnpm --filter @ca-manage/web dev
```

---

## API Reference

| | |
|---|---|
| Base URL | `http://localhost:4000/api/v1` |
| Swagger Docs | http://localhost:4000/api/docs |

### Auth Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new firm |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Get current user |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password |

---

## Demo Credentials

After running `pnpm db:seed`, use these credentials to log in:

| Field | Value |
|---|---|
| Email | `owner@sharmaassociates.in` |
| Password | `FirmOwner@123` |
| Role | Firm Owner |

---

## Project Structure

```
CA-Manage/
├── apps/
│   ├── api/               # NestJS backend (port 4000)
│   └── web/               # Next.js frontend (port 3000)
├── packages/
│   ├── database/          # Prisma schema + migrations + seed
│   ├── types/             # Shared TypeScript types
│   ├── validators/        # Shared Zod schemas
│   └── ui/                # Shared UI components
├── infrastructure/
│   ├── nginx/             # Nginx reverse proxy config
│   ├── docker/            # Docker init scripts
│   └── scripts/           # Dev utility scripts
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed the database with demo data |
| `pnpm db:studio` | Open Prisma Studio (database GUI) |
| `pnpm --filter @ca-manage/api dev` | Start backend only |
| `pnpm --filter @ca-manage/web dev` | Start frontend only |

---

## Troubleshooting

### `zsh: command not found: docker`
Colima's Docker socket is not active. Run:
```bash
colima start
export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"
```

### `DOCKER_HOST` must be set every terminal session
Add this line to your `~/.zshrc` to make it permanent:
```bash
echo 'export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"' >> ~/.zshrc
source ~/.zshrc
```

### Port 5432 conflict
This project maps PostgreSQL to port **5433** to avoid conflicts with locally installed PostgreSQL (EDB or Homebrew). The `DATABASE_URL` in `.env` already points to port 5433.

### Prisma: `Environment variable not found: DATABASE_URL`
Make sure `packages/database/.env` exists:
```bash
echo 'DATABASE_URL="postgresql://camanage:camanage_secret@localhost:5433/camanage_db"' > packages/database/.env
```

---

## Modules

| Module | Description |
|---|---|
| Auth | JWT authentication, OTP verification, password reset |
| Firm | Firm profile and settings management |
| Users | Staff/user management with RBAC (7 roles) |
| Clients | Client file management with auto-generated client codes |
| Documents | Digital document storage with versioning (local / AWS S3) |
| Tasks | Task assignment and tracking |
| Compliance | Compliance calendar and deadline tracking |
| Reminders | Automated reminders via email/SMS |
| Physical Files | Physical file register with movement tracking |
| Notifications | In-app notification system |
| Dashboard | Stats, compliance overview, recent activity |
| Search | Global search across clients, documents, tasks |
| Audit | Full audit log of all firm actions |
