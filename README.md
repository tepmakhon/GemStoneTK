# Takeo Natural Gemstones platform

The repository contains an incremental foundation for the bilingual gemstone storefront and business operations platform. It is not yet a production-ready commerce system: product editing, checkout, online reservations, order/payment workflows, file storage, and most admin modules remain outstanding.

## Stack

- Next.js 15 App Router, React, TypeScript, Tailwind CSS
- NestJS REST API
- PostgreSQL and Prisma ORM
- npm workspaces and Docker Compose

See [architecture](./ARCHITECTURE.md), [data model](./docs/data-model.md), and [project progress](./PROJECT_PROGRESS.md).

## Local development

Requirements: Node.js 20.19 or later and Docker Compose.

1. Copy `.env.example` to `.env` and review the local-only database credentials.
2. Start PostgreSQL: `docker compose up -d postgres`.
3. Install dependencies: `npm install`.
4. Generate Prisma Client: `npm run db:generate`.
5. Apply the local development migration: `npm run db:migrate`.
6. Start the API: `npm run dev:api`.
7. Start the web app in another terminal: `npm run dev:web`.

The database maps to host port `5433` because port `5432` is already in use on the development machine. The Compose password is for local development only. Never use it outside a developer machine.

## Administrator access

Create an initial owner account from an interactive terminal after configuring `.env` and applying migrations:

```sh
npm run admin:create
```

The command prompts for an email, display name, and a password of at least 12 characters (password input is hidden). It hashes the password with bcrypt and records an audit event. There is no default administrator account or password.

The protected admin slice is at `/admin`: sign-in, overview metrics, a searchable, paginated product list, inventory adjustments, physical-shop sales, and movement history. Product details remain read-only. Supported API routes:

- `POST /api/v1/admin/auth/login`
- `GET /api/v1/admin/auth/me`
- `POST /api/v1/admin/auth/logout`
- `GET /api/v1/admin/overview`
- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products/:id/inventory-adjustments`
- `POST /api/v1/admin/products/:id/shop-sales`
- `GET /api/v1/admin/inventory/movements`
- `GET /api/v1/admin/products/:id/inventory-movements`

Admin sessions are opaque random tokens stored as SHA-256 hashes in the database and sent in an HttpOnly, SameSite=Strict cookie. Passwords use bcrypt. The overview and product list enforce role allowlists. Rate limiting and broader security review remain outstanding before any public deployment.

Inventory operations lock the product row, prevent adjustments or shop sales from consuming reserved units, and write the stock update, movement entry, and audit event in one serializable transaction.

## Catalog API

- `GET /api/v1/health`
- `GET /api/v1/products`
- `GET /api/v1/products/:sku`
- `GET /api/v1/categories`

The customer catalog is read-only and uses PostgreSQL. No product seed data has been added; an empty catalog displays an empty state instead of invented gemstone facts.

## Database

The Prisma schema is `packages/database/prisma/schema.prisma`; the initial migration is in `packages/database/prisma/migrations/20261101160218_init`. Apply committed migrations with `npm run db:deploy` in deployment environments. Do not add real catalog records until they have been reviewed against business source data.

## Quality and status

Run `npm run build` to compile the API and web app. No workflow test suite has been added yet. See [requirements traceability](./REQUIREMENTS_TRACEABILITY.md) and [TODO](./TODO.md) for incomplete requirements, security work, tests, and owner inputs. Business contact details, bank instructions, currency rate, and shipping policies must be verified by the owner before use.
