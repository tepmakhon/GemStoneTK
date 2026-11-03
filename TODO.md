# TODO

## Phase 1 follow-ups / owner inputs

- [ ] Verify address, business hours, phone/email, Telegram/Facebook URLs.
- [ ] Verify ABA/ACLEDA payment instructions and who can review proofs.
- [ ] Decide local delivery zones/fees, pickup details, reservation duration, returns/refunds, and order lifecycle.
- [ ] Choose exchange-rate source and update cadence for configurable USD/KHR display.
- [ ] Choose media storage/retention approach and supply production credentials through environment configuration.
- [ ] Confirm supported-product import template/source data and initial SKU/inventory reconciliation.
- [ ] Complete/review Khmer translations and all customer-facing policy copy.
- [ ] Confirm international shipping remains inquiry-only until logistics are operational.

## Remaining engineering work

- [ ] Record architecture decisions and repository/folder structure.
- [x] Establish application workspaces and local development configuration.
- [x] Draft PostgreSQL/Prisma schema, relationships, and initial indexes; create/review migration and constraints still pending.
- [x] Implement the first admin authentication/role-control slice (login/logout, persisted sessions, guarded overview and product-list endpoints).
- [ ] Add authentication and authorization integration tests, rate limiting, recovery, and session management UI.
- [x] Implement the first read-only catalog endpoints and collection/detail pages.
- [ ] Implement product media delivery, online transactional reservations/checkout, returns, and inventory tests. Admin physical-shop sale, stock adjustment, ledger and audit writes are implemented.
- [ ] Implement cart, checkout, orders, payment review, inquiries, and quotations.
- [ ] Add product create/edit/archive, categories, orders, payments, customers, inquiries/quotes, fulfillment, media, reports, settings, and spreadsheet import to the admin. Product stock adjustment and physical-shop sale are implemented.
- [ ] Implement bilingual SEO-ready storefront matching desktop/mobile Figma screens.
- [ ] Add the unit, API, concurrency, import, and workflow tests listed in traceability; run them during implementation.
- [ ] Write setup, API, admin, security, and deployment documentation.
- [ ] Review production readiness and verify no sample Figma values are presented as real business facts.

## Foundation blockers

- [x] Start local PostgreSQL on host port 5433 and apply the initial migration.
- [ ] Verify clean database setup on a fresh volume and add only owner-verified seed/catalog data.
- [ ] Resolve the two high, four moderate, and one low npm audit findings reported by the latest dependency installation, without broad major-version upgrades; confirm Multer's production path is patched.
- [ ] Add database constraints for session ownership (exactly one of customer/admin), nonnegative stock/reservation quantities, and integrity between a product and its primary media.
- [ ] Keep the API health route as the only implemented API feature until real business modules are added; do not treat the current web shell as production UI.
