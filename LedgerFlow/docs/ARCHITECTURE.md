# CA-MANAGE — Complete Platform Architecture

## 1. MONOREPO STRUCTURE

```
ca-manage/
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── config/
│   │   │   │   ├── database.module.ts
│   │   │   │   └── prisma.service.ts
│   │   │   ├── common/
│   │   │   │   ├── decorators/       # @CurrentUser, @TenantId, @Public, @Roles
│   │   │   │   ├── filters/          # HttpExceptionFilter
│   │   │   │   ├── guards/           # JwtAuthGuard, RolesGuard
│   │   │   │   ├── interceptors/     # TransformInterceptor, LoggingInterceptor
│   │   │   │   ├── middlewares/      # TenantMiddleware
│   │   │   │   └── pipes/            # ValidationPipe
│   │   │   └── modules/
│   │   │       ├── auth/             # JWT, OTP, Sessions
│   │   │       ├── firm/             # Firm & Branch management
│   │   │       ├── user/             # Staff CRUD, Invite
│   │   │       ├── client/           # Client CRUD, Timeline
│   │   │       ├── document/         # Upload, Download, Versions
│   │   │       ├── folder/           # Document folder tree
│   │   │       ├── task/             # Task CRUD, Comments
│   │   │       ├── compliance/       # Compliance tracker
│   │   │       ├── reminder/         # Reminder system
│   │   │       ├── physical-file/    # Physical file tracking
│   │   │       ├── notification/     # In-app notifications
│   │   │       ├── dashboard/        # Analytics
│   │   │       ├── search/           # Global search
│   │   │       ├── audit/            # Audit logs
│   │   │       └── storage/          # S3/Local storage
│   │   └── Dockerfile
│   │
│   └── web/                          # Next.js 14 Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/           # Login, Register, OTP
│       │   │   ├── (dashboard)/      # All protected pages
│       │   │   │   ├── dashboard/
│       │   │   │   ├── clients/
│       │   │   │   │   ├── page.tsx  # Client list
│       │   │   │   │   ├── new/      # Create client
│       │   │   │   │   └── [id]/     # Client detail
│       │   │   │   │       ├── documents/
│       │   │   │   │       ├── tasks/
│       │   │   │   │       ├── compliance/
│       │   │   │   │       ├── notes/
│       │   │   │   │       ├── physical-files/
│       │   │   │   │       └── timeline/
│       │   │   │   ├── tasks/
│       │   │   │   ├── compliance/
│       │   │   │   ├── physical-files/
│       │   │   │   ├── staff/
│       │   │   │   ├── settings/
│       │   │   │   ├── reports/
│       │   │   │   ├── audit-logs/
│       │   │   │   ├── profile/
│       │   │   │   └── notifications/
│       │   │   └── (client-portal)/  # Client self-service
│       │   ├── components/
│       │   │   ├── layout/           # Sidebar, Topbar
│       │   │   ├── ui/               # Reusable ShadCN components
│       │   │   └── features/         # Feature-specific components
│       │   └── lib/
│       │       ├── api/              # Axios client with interceptors
│       │       ├── hooks/            # useAuth, useDebounce, etc.
│       │       ├── store/            # Zustand auth store
│       │       └── utils/            # cn(), formatters
│       └── Dockerfile
│
├── packages/
│   ├── database/                     # Prisma schema + client
│   ├── types/                        # Shared TypeScript types
│   ├── validators/                   # Shared Zod schemas
│   ├── ui/                           # Shared ShadCN component library
│   ├── config/                       # Shared ESLint/TS configs
│   ├── utils/                        # Shared utilities
│   ├── storage/                      # Storage abstraction
│   └── notifications/                # Email/SMS templates
│
├── infrastructure/
│   ├── docker/                       # Dockerfile helpers
│   └── nginx/                        # Nginx config
│
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 2. DATABASE ENTITY RELATIONSHIPS

```
TENANT (1) ─────────────────────────────────────────────── (N) FIRM
   │                                                              │
   │                                                          (N) BRANCH
   │                                                              │
   └── (N) USER ──────────────────────────────────┐          (N) USER
                                                   │
TENANT (1) ── (N) CLIENT ──────────────────────────┤
                   │                               │
                   ├── (N) ClientAddress           │
                   ├── (N) ClientContact           │
                   ├── (N) ClientTimeline          │
                   ├── (1) ClientPortalAccess      │
                   │                               │
                   ├── (N) DocumentFolder          │
                   │       └── (N) Document ───────┤
                   │               ├── (N) DocumentVersion
                   │               └── (N) FileShare
                   │                               │
                   ├── (N) Task ───────────────────┤
                   │       ├── (N) TaskComment     │
                   │       └── (N) TaskAttachment  │
                   │                               │
                   ├── (N) Compliance ─────────────┤
                   │       └── (N) Reminder        │
                   │                               │
                   ├── (N) PhysicalFile            │
                   │       └── (N) PhysicalFileMovement
                   │                               │
                   ├── (N) Note                    │
                   └── (N) Activity                │
                                                   │
TENANT (1) ── (N) AuditLog ────────────────────────┘
TENANT (1) ── (N) Notification
TENANT (1) ── (N) StorageUsage
TENANT (1) ── (N) Invite
```

---

## 3. API ENDPOINT REFERENCE

### Authentication — `/api/v1/auth`
| Method | Endpoint               | Description                    | Auth |
|--------|------------------------|--------------------------------|------|
| POST   | /register              | Register new firm + owner      | No   |
| POST   | /login                 | Login with email/password      | No   |
| POST   | /refresh               | Refresh access token           | No   |
| POST   | /logout                | Logout (invalidate session)    | Yes  |
| POST   | /verify-otp            | Verify OTP code                | No   |
| POST   | /forgot-password       | Send password reset OTP        | No   |
| POST   | /reset-password        | Reset password with OTP        | No   |
| GET    | /me                    | Get current user profile       | Yes  |

### Clients — `/api/v1/clients`
| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | /                           | Create client                  |
| GET    | /                           | List clients (paginated)       |
| GET    | /stats                      | Client statistics              |
| GET    | /:id                        | Get client details             |
| PATCH  | /:id                        | Update client                  |
| DELETE | /:id                        | Close client account           |
| GET    | /:id/timeline               | Get activity timeline          |

### Documents — `/api/v1/clients/:clientId/documents`
| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | /upload                     | Upload single document         |
| POST   | /bulk-upload                | Bulk upload (max 20)           |
| GET    | /                           | List documents                 |
| GET    | /:id/download               | Get signed download URL        |
| GET    | /:id/versions               | Get version history            |
| POST   | /:id/share                  | Create shareable link          |
| DELETE | /:id                        | Delete document                |

### Document Folders — `/api/v1/clients/:clientId/folders`
| Method | Endpoint     | Description              |
|--------|--------------|--------------------------|
| GET    | /            | Get folder tree          |
| POST   | /            | Create folder            |
| PATCH  | /:id         | Rename folder            |
| DELETE | /:id         | Delete folder            |

### Tasks — `/api/v1/tasks`
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | /                | Create task              |
| GET    | /                | List tasks (filtered)    |
| GET    | /my-tasks        | Tasks assigned to me     |
| GET    | /:id             | Get task details         |
| PATCH  | /:id             | Update task              |
| DELETE | /:id             | Delete task              |
| POST   | /:id/comments    | Add comment              |
| GET    | /:id/comments    | Get comments             |

### Compliance — `/api/v1/compliance`
| Method | Endpoint     | Description                |
|--------|--------------|----------------------------|
| POST   | /            | Create compliance entry    |
| GET    | /            | List all compliances       |
| GET    | /due-soon    | Due in next 7 days         |
| GET    | /overdue     | Overdue compliances        |
| GET    | /:id         | Get compliance details     |
| PATCH  | /:id         | Update compliance          |
| DELETE | /:id         | Delete compliance          |

### Reminders — `/api/v1/reminders`
| Method | Endpoint     | Description             |
|--------|--------------|-------------------------|
| POST   | /            | Create reminder         |
| GET    | /            | List reminders          |
| PATCH  | /:id         | Update reminder         |
| DELETE | /:id         | Delete reminder         |
| POST   | /:id/dismiss | Dismiss reminder        |

### Physical Files — `/api/v1/physical-files`
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | /                     | Register physical file   |
| GET    | /                     | List physical files      |
| GET    | /:id                  | Get file details         |
| PATCH  | /:id                  | Update file info         |
| POST   | /:id/issue            | Issue file to staff      |
| POST   | /:id/return           | Mark as returned         |
| GET    | /:id/movements        | Movement history         |

### Staff/Users — `/api/v1/users`
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | /                 | List staff               |
| POST   | /invite           | Invite staff member      |
| GET    | /:id              | Get staff details        |
| PATCH  | /:id              | Update staff             |
| PATCH  | /:id/role         | Change staff role        |
| DELETE | /:id              | Remove staff             |

### Dashboard — `/api/v1/dashboard`
| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| GET    | /stats                   | Dashboard overview       |
| GET    | /compliance-overview     | Compliance summary       |

### Search — `/api/v1/search`
| Method | Endpoint | Description           |
|--------|----------|-----------------------|
| GET    | /?q=...  | Global search         |

### Audit Logs — `/api/v1/audit`
| Method | Endpoint  | Description           |
|--------|-----------|----------------------|
| GET    | /         | List audit logs       |
| GET    | /:id      | Get audit log detail  |
| GET    | /export   | Export audit logs     |

### Notifications — `/api/v1/notifications`
| Method | Endpoint       | Description              |
|--------|----------------|--------------------------|
| GET    | /              | List notifications       |
| GET    | /unread-count  | Unread count             |
| PATCH  | /:id/read      | Mark as read             |
| PATCH  | /read-all      | Mark all as read         |

### Firm — `/api/v1/firm`
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | /                | Get firm details         |
| PATCH  | /                | Update firm              |
| GET    | /branches        | List branches            |
| POST   | /branches        | Create branch            |
| PATCH  | /branches/:id    | Update branch            |

---

## 4. PERMISSION MATRIX

| Module          | FIRM_OWNER | PARTNER | MANAGER | ACCOUNTANT | EXECUTIVE | INTERN | CLIENT |
|-----------------|------------|---------|---------|------------|-----------|--------|--------|
| client:create   | ✅         | ✅      | ✅      | ❌         | ❌        | ❌     | ❌     |
| client:read     | ✅         | ✅      | ✅      | ✅         | ✅        | ✅     | ❌     |
| client:update   | ✅         | ✅      | ✅      | ❌         | ❌        | ❌     | ❌     |
| client:delete   | ✅         | ✅      | ❌      | ❌         | ❌        | ❌     | ❌     |
| client:export   | ✅         | ✅      | ✅      | ❌         | ❌        | ❌     | ❌     |
| document:upload | ✅         | ✅      | ✅      | ✅         | ✅        | ❌     | ✅     |
| document:read   | ✅         | ✅      | ✅      | ✅         | ✅        | ✅     | ✅*    |
| document:delete | ✅         | ✅      | ✅      | ❌         | ❌        | ❌     | ❌     |
| document:share  | ✅         | ✅      | ✅      | ✅         | ❌        | ❌     | ❌     |
| task:create     | ✅         | ✅      | ✅      | ✅         | ✅        | ❌     | ❌     |
| task:assign     | ✅         | ✅      | ✅      | ❌         | ❌        | ❌     | ❌     |
| compliance:*    | ✅         | ✅      | ✅      | ✅         | ❌        | ❌     | ❌     |
| staff:invite    | ✅         | ✅      | ❌      | ❌         | ❌        | ❌     | ❌     |
| staff:manage    | ✅         | ✅      | ❌      | ❌         | ❌        | ❌     | ❌     |
| firm:update     | ✅         | ❌      | ❌      | ❌         | ❌        | ❌     | ❌     |
| reports:read    | ✅         | ✅      | ✅      | ❌         | ❌        | ❌     | ❌     |
| audit:read      | ✅         | ✅      | ❌      | ❌         | ❌        | ❌     | ❌     |
| physical_file:* | ✅         | ✅      | ✅      | ✅         | ❌        | ❌     | ❌     |

*CLIENT can only see documents explicitly shared with them

---

## 5. UI PAGE BREAKDOWN

| Page                          | Route                            | Auth | Role         |
|-------------------------------|----------------------------------|------|--------------|
| Login                         | /login                           | No   | All          |
| Register Firm                 | /register                        | No   | All          |
| Forgot Password               | /forgot-password                 | No   | All          |
| Verify OTP                    | /verify-otp                      | No   | All          |
| Dashboard                     | /dashboard                       | Yes  | All Staff    |
| Client List                   | /clients                         | Yes  | All Staff    |
| Create Client                 | /clients/new                     | Yes  | Manager+     |
| Client Detail                 | /clients/[id]                    | Yes  | All Staff    |
| Client Documents              | /clients/[id]/documents          | Yes  | All Staff    |
| Client Tasks                  | /clients/[id]/tasks              | Yes  | All Staff    |
| Client Compliance             | /clients/[id]/compliance         | Yes  | All Staff    |
| Client Notes                  | /clients/[id]/notes              | Yes  | All Staff    |
| Client Physical Files         | /clients/[id]/physical-files     | Yes  | All Staff    |
| Client Timeline               | /clients/[id]/timeline           | Yes  | All Staff    |
| Task Board                    | /tasks                           | Yes  | All Staff    |
| Compliance Tracker            | /compliance                      | Yes  | All Staff    |
| Physical Files                | /physical-files                  | Yes  | All Staff    |
| Staff Management              | /staff                           | Yes  | Partner+     |
| Reports                       | /reports                         | Yes  | Manager+     |
| Audit Logs                    | /audit-logs                      | Yes  | Partner+     |
| Profile                       | /profile                         | Yes  | All          |
| Notifications                 | /notifications                   | Yes  | All          |
| Settings — General            | /settings/general                | Yes  | All          |
| Settings — Firm               | /settings/firm                   | Yes  | Owner        |
| Settings — Security           | /settings/security               | Yes  | All          |
| Settings — Billing            | /settings/billing                | Yes  | Owner        |
| Settings — Roles              | /settings/roles                  | Yes  | Owner        |
| Client Portal Login           | /portal/login                    | No   | Client       |
| Client Portal Dashboard       | /portal/dashboard                | Yes  | Client       |
| Client Portal Documents       | /portal/documents                | Yes  | Client       |

---

## 6. DEVELOPMENT PHASES

### Phase 1 — Foundation (Weeks 1–3)
- [x] Monorepo setup (pnpm + Turborepo)
- [x] Database schema (Prisma + PostgreSQL)
- [x] NestJS API skeleton with all modules
- [x] Authentication (JWT + OTP + Sessions)
- [x] Docker Compose for local dev
- [ ] CI/CD pipeline (GitHub Actions)

### Phase 2 — Core Features (Weeks 4–7)
- [ ] Firm & Branch management
- [ ] Client CRUD + search
- [ ] Document locker (upload/download/preview)
- [ ] Document versioning
- [ ] Task management (List + Kanban)
- [ ] Next.js frontend — all core pages

### Phase 3 — Advanced Features (Weeks 8–11)
- [ ] Compliance tracker
- [ ] Reminder system (in-app + email)
- [ ] Physical file management
- [ ] Notes system
- [ ] Client portal
- [ ] Staff invite system

### Phase 4 — Intelligence & Reports (Weeks 12–14)
- [ ] Dashboard analytics
- [ ] Reports (client, compliance, staff)
- [ ] Global search
- [ ] Audit logs
- [ ] Email notifications (BullMQ queues)

### Phase 5 — Production Hardening (Weeks 15–16)
- [ ] Rate limiting + security audit
- [ ] Storage optimization
- [ ] Performance testing (k6)
- [ ] Production deployment (Docker + Nginx)
- [ ] Monitoring (Sentry + Prometheus)

---

## 7. SAAS SCALING STRATEGY

### Database Scaling
- Row-level tenant isolation via `tenantId` on all tables
- Read replicas for heavy read workloads
- PgBouncer for connection pooling
- Partitioning on `audit_logs` and `activities` by month
- Redis for query result caching (5 min TTL)

### Storage Scaling
- AWS S3 with CDN (CloudFront) for document delivery
- Signed URLs (1 hour expiry) — no direct public access
- Document chunked upload for files > 10MB
- Storage quota enforcement per tenant

### Application Scaling
- Stateless API — horizontal scaling behind Nginx
- BullMQ queues for async jobs (emails, reminders, reports)
- Redis cluster for cache and session store
- Container orchestration (ECS/Kubernetes) for prod

### Security
- Tenant isolation enforced at service layer
- All document URLs signed — never exposed directly
- RBAC enforced on every endpoint
- Rate limiting per IP and per user
- Audit log everything (user actions, IP, device)
- Input validation (class-validator + Zod)
- SQL injection protection (Prisma parameterized queries)
- XSS protection (Helmet headers)
- CSRF protection (SameSite cookies + CSRF tokens)

---

## 8. PRODUCTION DEPLOYMENT

```
                          ┌──────────────────────────────────┐
                          │         AWS / Cloud Provider       │
                          │                                    │
   Users ──── HTTPS ───── │  CloudFront CDN ─── S3 Bucket     │
                          │       │                            │
                          │  Load Balancer (ALB)               │
                          │       │                            │
                          │  ┌────┴─────┐  ┌──────────────┐   │
                          │  │ Next.js  │  │  NestJS API  │   │
                          │  │ (ECS x2) │  │  (ECS x3)    │   │
                          │  └──────────┘  └──────┬───────┘   │
                          │                       │            │
                          │  ┌────────────────────┼──────┐    │
                          │  │                    │      │    │
                          │  │  RDS PostgreSQL  Redis  BullMQ │
                          │  │  (Multi-AZ)     Cluster  Queue │
                          │  └──────────────────────────┘    │
                          └──────────────────────────────────┘
```

### Monitoring
- **Sentry** — error tracking (frontend + backend)
- **Prometheus + Grafana** — metrics & dashboards
- **Datadog** or **New Relic** — APM
- **PagerDuty** — on-call alerting
- **CloudWatch** (AWS) — logs aggregation
