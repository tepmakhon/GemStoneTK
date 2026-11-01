# Initial data model

The concrete schema is `packages/database/prisma/schema.prisma`. This ERD shows the main relationships; audit, settings, media, and import support tables are omitted from the diagram to keep it readable.

```mermaid
erDiagram
  PRODUCT_TYPE ||--o{ PRODUCT : classifies
  PRODUCT ||--o{ PRODUCT_TRANSLATION : translated_as
  PRODUCT ||--o{ PRODUCT_MEDIA : has
  PRODUCT ||--o{ PRODUCT_CATEGORY : categorized
  CATEGORY ||--o{ PRODUCT_CATEGORY : contains
  CATEGORY o|--o{ CATEGORY : parent_of
  PRODUCT ||--o{ INVENTORY_RESERVATION : reserved
  PRODUCT ||--o{ INVENTORY_MOVEMENT : moved
  CUSTOMER ||--o{ CUSTOMER_ADDRESS : saves
  CUSTOMER ||--o{ USER_SESSION : authenticates
  ADMIN_USER ||--o{ USER_SESSION : authenticates
  CUSTOMER o|--o{ ORDER : places
  ORDER ||--|{ ORDER_ITEM : snapshots
  ORDER ||--o{ PAYMENT : paid_by
  ORDER ||--o{ INVENTORY_RESERVATION : holds
  ORDER ||--o{ ORDER_STATUS_HISTORY : records
  ORDER o|--o| SHIPMENT : fulfills
  CUSTOMER o|--o{ INQUIRY : submits
  INQUIRY ||--o{ INQUIRY_PRODUCT : references
  PRODUCT ||--o{ INQUIRY_PRODUCT : asked_about
  INQUIRY o|--o{ QUOTATION : receives
  CUSTOMER o|--o{ QUOTATION : receives
  QUOTATION ||--|{ QUOTATION_ITEM : snapshots
  PRODUCT o|--o{ QUOTATION_ITEM : offered
  ADMIN_USER ||--o{ INVENTORY_MOVEMENT : records
  ADMIN_USER ||--o{ PAYMENT : reviews
  ADMIN_USER ||--o{ AUDIT_LOG : performs
  ADMIN_USER ||--o{ IMPORT_JOB : starts
```

Inventory is modeled as an auditable movement ledger plus expiring reservations. The API must create/consume/release reservations and write movement rows in the same database transaction as the order or shop sale. `onHandDelta` and `reservedDelta` separately record physical-stock and reservation changes. Availability is derived from these quantities and active reservations, not trusted from a browser field. A physical unit is uniquely identified by SKU; quantity greater than one represents identical stock under that SKU. The API must prevent unsupported quantities for one-of-a-kind product records.

`OrderItem` and `QuotationItem` retain historical descriptive and pricing snapshots so later catalog edits do not rewrite customer history. `SiteSetting` stores configurable currency/business configuration as JSON, with access and audit policy enforced by the API.

The initial migration has been applied to the local PostgreSQL database. This is still a first schema baseline, not a production-validated data model. Constraint and transaction refinements belong with the inventory/order service implementation.
