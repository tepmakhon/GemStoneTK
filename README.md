# Takeo Natural Gemstones platform

This repository is the foundation for the bilingual gemstone storefront and business operations platform. The current source is scaffolding: the only implemented API route is a health check, and the web homepage is an initial Figma-inspired shell. Commerce, accounts, admin, upload, payment review, inventory transactions, and production authentication are **not implemented yet**.

## Stack

- Next.js 15 App Router, React, TypeScript, Tailwind CSS
- NestJS REST API
- PostgreSQL and Prisma ORM
- npm workspaces

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [the architecture decision](./docs/adr/0001-modular-monolith.md).

## Local development

Requirements: Node.js 20.19 or later and Docker Compose.

1. Copy `.env.example` to `.env` and review the local-only database credentials.
2. Start local PostgreSQL: `docker compose up -d postgres`.
3. Install dependencies: `npm install`.
4. Generate the Prisma client: `npm run db:generate`.
5. Create the development database migration: `npm run db:migrate`.
6. Start the API: `npm run dev:api`.
7. In another terminal, start the web app: `npm run dev:web`.

The local PostgreSQL password in Compose is for local development only. It maps to host port `5433` so it can run alongside another local PostgreSQL service on port 5432. Never use it outside a developer machine. There is no seed dataset yet; production credentials, business contact details, bank information, and exchange rate must not be copied from Figma sample values.

## Database

The Prisma schema lives at `packages/database/prisma/schema.prisma`. The initial migration is `packages/database/prisma/migrations/20261101160218_init`. Migrations are generated and reviewed through Prisma. `npm run db:deploy` applies committed migrations in a deployment environment.

## API

The API listens on port 4000 by default. Current read-only endpoints are `GET /api/v1/health`, `/api/v1/products`, `/api/v1/products/:sku`, and `/api/v1/categories`. DTO validation, CORS origin, and URI versioning are configured in the Nest bootstrap. Swagger/OpenAPI is not wired yet.

## Status and requirements

- [Project progress and decisions](./PROJECT_PROGRESS.md)
- [Requirement traceability](./REQUIREMENTS_TRACEABILITY.md)
- [Outstanding work](./TODO.md)

No automated workflow tests have been added or run in this foundation phase. Inventory concurrency, payment review, import validation, authentication/authorization, and workflow tests are required before the corresponding functionality is considered complete. `npm audit` currently reports unresolved advisories; review `TODO.md` before exposing the app beyond local development.
