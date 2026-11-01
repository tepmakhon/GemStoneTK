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
- [ ] Implement authentication, authorization, and admin access controls.
- [ ] Implement catalog, media, inventory ledger, reservations, and physical-shop sale flow.
- [ ] Implement cart, checkout, orders, payment review, inquiries, and quotations.
- [ ] Implement admin screens and spreadsheet import/reporting/settings.
- [ ] Implement bilingual SEO-ready storefront matching desktop/mobile Figma screens.
- [ ] Add the unit, API, concurrency, import, and workflow tests listed in traceability; run them during implementation.
- [ ] Write setup, API, admin, security, and deployment documentation.
- [ ] Review production readiness and verify no sample Figma values are presented as real business facts.

## Foundation blockers

- [ ] Start the local Docker daemon, create the PostgreSQL migration, and verify clean migrate/seed setup.
- [ ] Resolve the three high and eighteen moderate npm audit findings without broad major-version upgrades; remove redundant direct Multer if possible and ensure the Nest upload adapter uses a patched release.
- [ ] Add database constraints for session ownership (exactly one of customer/admin), nonnegative stock/reservation quantities, and integrity between a product and its primary media.
- [ ] Keep the API health route as the only implemented API feature until real business modules are added; do not treat the current web shell as production UI.
