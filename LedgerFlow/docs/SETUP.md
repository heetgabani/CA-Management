# CA-MANAGE — Development Setup Guide

## Prerequisites
- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis 7 (or use Docker)

## Quick Start

### 1. Clone and install
```bash
git clone <repo>
cd ca-manage
pnpm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start infrastructure (Docker)
```bash
docker compose up postgres redis -d
```

### 4. Initialize database
```bash
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed demo data
```

### 5. Start development servers
```bash
pnpm dev              # Starts all apps via Turborepo
```

This starts:
- API → http://localhost:4000
- Web → http://localhost:3000
- Swagger → http://localhost:4000/api/docs

## Default Credentials

### Super Admin
- Email: admin@camanage.in
- Password: SuperAdmin@123

### Demo Firm Owner
- Email: owner@sharmaassociates.in
- Password: FirmOwner@123

## Docker Full Stack
```bash
docker compose up -d              # Start all services
docker compose logs -f api        # View API logs
docker compose down               # Stop all
```

## Database Commands
```bash
pnpm db:studio                    # Prisma Studio GUI
pnpm db:migrate                   # Run new migrations
pnpm db:reset                     # Reset and re-seed (dev only)
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| REDIS_URL | Yes | Redis connection string |
| JWT_SECRET | Yes | Min 32 chars JWT signing secret |
| STORAGE_PROVIDER | No | `local` or `aws_s3` (default: local) |
| AWS_ACCESS_KEY_ID | S3 only | AWS credentials |
| AWS_SECRET_ACCESS_KEY | S3 only | AWS credentials |
| AWS_S3_BUCKET | S3 only | S3 bucket name |
| SMTP_HOST | No | Email server host |
| SMTP_USER | No | Email username |
| SMTP_PASS | No | Email password |
| FRONTEND_URL | No | Frontend URL for CORS |

## API Testing with Swagger
Visit `http://localhost:4000/api/docs`

1. Use `POST /api/v1/auth/login` with demo credentials
2. Copy the `accessToken` from response
3. Click "Authorize" in Swagger UI
4. Paste: `Bearer <your-token>`
5. All protected endpoints now work
