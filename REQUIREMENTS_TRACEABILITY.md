# Requirements traceability

This is the initial planning baseline for the user-provided gemstone platform brief. `Planned` means not implemented. Tests named here are acceptance coverage to add when the corresponding module is built; no tests exist yet.

| Requirement area | Planned implementation | Planned verification | State |
|---|---|---|---|
| Architecture and project foundation | npm workspaces with Next.js web, NestJS API, PostgreSQL/Prisma, Docker Compose, environment template, architecture and ERD docs | Production build completed for API/web; Prisma client generated; migration pending on Docker daemon | Foundation implemented |
| Figma fidelity and responsive UI | Next.js storefront/admin following all 57 design screens and shared components; desktop and mobile layouts; preserve the Figma design system | Visual review at representative desktop/mobile breakpoints; verify every implemented screen and static asset against Figma | Planned |
| Khmer and English | Locale-aware routes/content and translated product fields; complete reviewed Khmer UI copy | Locale routing, translation fallback, and key Khmer/English page checks | Planned; Khmer copy needs owner review |
| Catalog, categories, detail pages, SEO | Product/category/translation API, read-only collection and detail pages with search/category/sort/page controls; SEO enhancements remain planned | Build passed; health/list/categories exercised against local PostgreSQL; concurrency and full API tests remain planned | Initial slice implemented |
| Product attributes and pricing modes | SKU, bilingual names/descriptions, category, media, gem attributes, provenance/treatment/certificate as optional recorded facts, price method and status | DTO validation and product CRUD tests; verify unknown facts stay unknown | Planned |
| Inventory and physical sales | Inventory movement ledger, reserved/on-hand quantities, transactional reservation and sale services, unique-piece constraints | Concurrency test for two buyers of one unique stone; shop-sale test immediately updates online availability; adjustment/history tests | Planned; highest consistency risk |
| Cart, checkout, orders | Server-authoritative pricing and availability; guest/account checkout; local delivery/pickup; order snapshots and status history | API integration tests for totals, unavailable/contact-priced products, and checkout state transitions | Planned |
| Manual payments | Payment records separate from order state; proof upload and explicit admin verification/rejection; cash/ABA/ACLEDA as configured methods | Tests ensure upload never marks paid; authorized verification/rejection and audit history tests | Planned; credentials/details need owner verification |
| Inquiries and quotations | Contact/inquiry channels and product linkage; quote numbering, lines, expiry, status, acceptance-to-order workflow | Inquiry/quote workflow tests, expiry and stock recheck tests | Planned |
| International requests | Inquiry workflow only until shipping coverage is confirmed | Assert unsupported destinations cannot enter shipping checkout | Planned |
| Customer accounts | Secure registration/login/recovery, addresses, profile and order history | Authentication, password reset, authorization and account-data tests | Planned |
| Admin and permissions | Dashboard, products/categories, inventory/shop sales, orders/payments, customers, inquiries/quotes, fulfillment, media, reports, settings, users/roles, audit | Role matrix and CRUD/workflow integration tests for each module | Planned |
| Spreadsheet import | CSV/XLSX template, validation preview, duplicate detection, row errors, commit, history and summary | Tests for valid/invalid files, duplicate SKUs, partial row errors, and no silent skips | Planned |
| Currency | Configurable USD base and KHR display conversion with persisted configuration and rounding rules | Tests for rate update, conversion and display; no hard-coded exchange rate | Planned; source/update policy needs owner decision |
| Database integrity | PostgreSQL/Prisma normalized schema, indexes, decimal money, FKs, historical snapshots, and migration | Initial migration applied to local PostgreSQL; migration/constraint tests and further constraints remain planned | Initial schema applied |
| Security | Password hashing, roles, DTO validation, rate limits, secure sessions/tokens, upload restrictions, CORS/CSRF protections as appropriate, safe errors, secrets and audit | Auth/authorization, input/upload, rate-limit and audit tests; security review | Planned |
| Performance and accessibility | Optimized responsive pages, lazy images, pagination/caching where appropriate, semantic accessible UI | Accessibility review and representative performance checks | Planned |
| Documentation and deployment | README, env example, architecture/API, migrations/seeding, testing, admin/deployment guides, Docker configuration | Follow documented clean setup/migrate/seed/launch procedure | Planned |

## Core data modules (proposed)

Products and translations; categories; media; customers and addresses; admin users and roles; carts; orders and immutable order-item snapshots; payments; shipments; status history; inventory movements/reservations; inquiries; quotations/items; site/currency/business settings; audit logs; import jobs. Exact Prisma models and constraints belong in the schema design phase, before application workflows depend on them.
