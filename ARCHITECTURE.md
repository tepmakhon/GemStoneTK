# Architecture

## Decision 001 — modular monolith, TypeScript workspaces

**Status:** accepted as the initial implementation baseline (2026-11-01).

One deployable Next.js web app serves the customer storefront and protected admin UI. One NestJS REST API owns business rules and persistence. PostgreSQL is the source of truth. Prisma provides schema and migrations. The API is split by business domain inside one process; no distributed services, queue, cache, or payment gateway are introduced until a measured need exists.

```text
Browser
  └─ Next.js (public storefront, customer account, admin UI, SEO)
       └─ HTTPS /api/v1 → NestJS modular REST API
                              ├─ Auth & access
                              ├─ Catalog & media metadata
                              ├─ Inventory & reservations
                              ├─ Customers, carts & orders
                              ├─ Payments, inquiries & quotations
                              └─ Admin, imports, settings & audit
                                   └─ Prisma → PostgreSQL
                                   └─ object-storage adapter (later)
```

### Trust and transaction boundaries

- The API calculates every price and total; the browser never supplies an authoritative amount.
- Checkout and shop-sale commands use database transactions and conditional row updates/locking so a unique stone can have at most one active reservation or sale. Inventory movements provide the audit trail.
- Payment proof is a claim. Only an authorized human verification action changes payment state; payment state is distinct from order state.
- Public product data is read from the same database the admin updates. Unsupported international shipping stays an inquiry, not a checkout option.
- Secrets and credentials are injected at runtime. Product media binaries will use private object storage with validated, signed access; the database stores metadata and keys.

### Workspace boundaries

- `apps/web`: Next.js App Router UI. No direct database access or business-rule duplication.
- `apps/api`: NestJS controllers, DTOs, authentication and domain services. Swagger/OpenAPI is generated from this contract.
- `packages/database`: Prisma schema, config, migrations, generated client boundary, and explicitly non-production seed tooling.
- `docs`: architecture, API/data decisions, and operations guides.

### Data modeling rules

- Money uses fixed-precision PostgreSQL `DECIMAL`, never binary floating point. Currency and the applied exchange-rate snapshot travel with priced records.
- Orders retain immutable item, SKU, description, quantity, unit price, and currency snapshots. Product records referenced by history are archived, not deleted.
- Product facts that are unknown stay null/unknown. Neither seed data nor imports infer origin, treatment, natural status, or certification.
- FKs and unique constraints enforce identity and relationships. Inventory changes are append-only movements; current available quantity is derived/maintained transactionally.
- Locale-specific names/descriptions are translation rows keyed by product and locale. Base display currency and rate are settings with audit history.

### Deployment shape

Start with a single-region web process, API process, managed PostgreSQL, and object storage. Keep separate development/staging/production environment values, use TLS and managed secrets, run migrations as a controlled release step, and back up PostgreSQL. Docker Compose is for local PostgreSQL only. Actual cloud provider, backup retention, monitoring, and launch details remain deployment decisions.

### Open decisions

See `PROJECT_PROGRESS.md` and `TODO.md` for owner inputs. Specifically, authentication/session strategy, media vendor, exchange-rate source, local fulfillment rules, payment instructions, retention, and production hosting must be decided before launch.
