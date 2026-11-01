# ADR 0001: Start as a modular monolith

- **Status:** accepted
- **Date:** 2026-11-01

## Context

The business needs a customer storefront and operational admin platform with strongly coupled catalog, inventory, reservation, checkout, and payment-review workflows. The current workspace is empty and the business scale is a growing catalog of over 1,000 products.

## Decision

Use a TypeScript npm-workspaces repository with a Next.js web application, a NestJS REST API, PostgreSQL, and Prisma. Keep domain modules inside one API deployment. Put all business writes and inventory transactions behind the API. Run local PostgreSQL in Docker Compose.

## Consequences

- A single relational database transaction can protect checkout and physical-sale inventory changes.
- The codebase remains straightforward to operate while preserving boundaries for future extraction if scale or team ownership requires it.
- The web app can be deployed separately, but the API remains the only business-data authority.
- Hosting, media provider, and payment gateway are not selected or implied by this decision.
