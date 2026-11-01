# Project progress

## Phase 1 — project and design inspection

**Status: complete (inspection and planning only).** No application code has been changed.

### Repository

- The workspace contains only its `.git` directory; there are no commits, source files, package manifests, database schema, documentation, or existing tests.
- No `AGENTS.md` or additional project requirements documents were found. The user-provided brief is the only requirements source.
- There is no existing architecture to preserve. The requested stack (Next.js/React/TypeScript/Tailwind, NestJS REST API, PostgreSQL/Prisma) is a reasonable starting point, subject to a short architecture decision record before implementation.

### Figma

- Inspected the `Takeo Gemstones · UX UI v1` page and all 57 named product/admin/mobile/support screens, plus the `START HERE · Prototype guide`. The Figma page is a single canvas with 58 top-level frames.
- Screen inventory: 20 desktop storefront screens, 16 admin screens, 10 mobile storefront screens, 11 supporting states, and the guide frame.
- Fetched design context for representative home, collection, all three pricing modes, dashboard, products, inventory, mobile home, registration, and guide frames. The reference includes shared Code Connect button components. The UI uses Cormorant Garamond, DM Sans, and Noto Sans Khmer, with ivory/white surfaces, deep green, muted text, and gold accents.
- The Figma guide explicitly calls the prototype and data illustrative. Bank details, contact information, reservation deadlines, refund policy, and the remaining Khmer translations require owner review. The prototype's sample interactions do not implement backend behavior.
- Figma design reads succeeded after resolving the file's actual selected screen IDs; the document root itself is not a screen node.

### Initial architecture and delivery plan

1. **Foundation:** agree on repository layout and architecture; document environment/secrets; establish Next.js storefront/admin and NestJS modular API; create Prisma/PostgreSQL schema and migrations; add local Docker Compose and seed only clearly labeled non-production data.
2. **Core commerce:** authentication/roles, bilingual catalog and media, transactional inventory reservations and shop sales, cart/checkout, order/payment states, inquiry/quotation workflow, currency settings, and API docs.
3. **Operations and launch readiness:** admin workflows, audited spreadsheet import, reports/settings, SEO/accessibility, security hardening, automated tests, operations docs, and deployment configuration. Gate production enablement on owner-provided business facts and credentials.

Suggested first implementation slice: foundation plus read-only catalog pages against a real API/database; then build vertical workflows in order of inventory correctness and business value. Keep the modular monolith; avoid microservices at this scale.

### Risks and decisions to resolve before production

- Confirm who may access/administer the system and the account recovery process.
- Supply verified business contact/address/hours and payment account details; specify payment proof retention and reviewer roles.
- Decide local delivery coverage/fees, pickup address/hours, reservation and expiry policy, returns/refunds, and customer-facing order states.
- Set the source, update process, and effective date for the configurable USD/KHR rate.
- Confirm image/document storage provider and retention limits; international shipping stays inquiry-only until destinations, couriers, pricing, customs, and restrictions are verified.
- Confirm product-import source columns and how to handle existing inventory/SKU data. Never infer gemstone origin, treatment, natural status, or certification.
- Confirm Khmer translation ownership; the Figma guide says the Khmer home is a specimen, not a complete translation.

## Verification

No tests or builds were run: there is no application yet, and this phase was repository/design inspection and planning. The Figma document was inspected directly; the representative design contexts provided the visual and typography reference. No application behavior is claimed as implemented.

See [REQUIREMENTS_TRACEABILITY.md](./REQUIREMENTS_TRACEABILITY.md) for the requirement-to-module/test plan and [TODO.md](./TODO.md) for outstanding work.

## Phase 2 — architecture and foundation

**Status: foundation scaffolded; first database migration is blocked on the local Docker daemon.**

- Added a modular-monolith architecture decision, system architecture, initial ERD, README, npm workspaces, a Next.js storefront shell, NestJS API shell, Prisma/PostgreSQL schema, local Compose database definition, and environment template.
- The web home uses Figma-derived typography/color direction and no fabricated catalog inventory. The API implements only `GET /api/v1/health`; no business endpoint or feature is claimed as complete.
- Prisma Client generation completed successfully. The production build completed successfully for both the Nest API and Next.js 15.5.28 web app (Next also checked TypeScript and generated static pages).
- A local migration was not generated: Docker is installed, but its daemon was not running. Start Docker Desktop/daemon and run `docker compose up -d postgres`, then `npm run db:migrate`.
- Dependency audit on 2026-11-01 reports **3 high and 18 moderate** findings (including transitive Multer/PostCSS advisories). These remain open and must be resolved before production. Direct Multer is pinned to 2.5.0, but a transitive Nest adapter still resolves 2.4.0; Next 15 has a vulnerable nested PostCSS. Several remaining findings are development tooling. See `TODO.md`.
- No workflow tests have been added or run. Build success validates compilation only, not business correctness, security, or production readiness.

See [README.md](./README.md), [ARCHITECTURE.md](./ARCHITECTURE.md), and [docs/data-model.md](./docs/data-model.md).
