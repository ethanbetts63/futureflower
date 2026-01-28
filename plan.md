# Refactoring Plan: `FlowerPlan` to `OrderBase`

This document outlines the strategy for refactoring the `FlowerPlan` model into a more flexible, inheritance-based system.

## 1. Goal

The primary goal is to replace the monolithic `FlowerPlan` model with a new structure using a concrete `OrderBase` parent model and an `UpfrontPlan` child model. This will create a more scalable architecture for introducing new order types in the future.

## 2. Scope

The scope of this refactor is strictly limited to the following:

-   Refactoring the existing upfront payment flow.
-   The user-facing functionality of the application should remain identical after the refactor.
-   New order types (`OneTimeOrder`, `SubscriptionPlan`) are **out of scope**.
-   Changes to the user dashboard are **out of scope**.

## 3. Technical Strategy

### Inheritance Model

We will use **Multi-Table Inheritance**.

-   A concrete `OrderBase` model will be created. It will have its own database table.
-   An `UpfrontPlan` model will inherit from `OrderBase`. It will also have its own table, with an automatic `OneToOneField` linking it to the `OrderBase` table.
-   This approach allows other models (`Event`, `Payment`) to link directly to `OrderBase` via a single, clean `ForeignKey`.

### Database

-   We will **wipe the database** and recreate it from the new models.
-   No data migration script will be written, as the database contains no critical production data.

### Status Field

-   The `is_active` boolean field on the current `FlowerPlan` model will be replaced.
-   A new `status` field will be added to the `OrderBase` model.
-   It will be a `CharField` with the following choices:
    1.  `pending_payment` (Initial state)
    2.  `active` (After successful payment)
    3.  `completed` (After all events are finished)

### File Structure

-   The frontend pages for the creation flow will be moved from `frontend/src/pages/flow/` to a new directory: `frontend/src/pages/upfront_flow/`.

## 4. Execution Plan

The refactor will proceed in the following order:

1.  **Create `plan.md`:** Document the agreed-upon strategy (this file).
2.  **Move Frontend Files:** Relocate the frontend flow pages to the new `upfront_flow` directory.
3.  **Refactor Backend Models:**
    -   Create the `OrderBase` and `UpfrontPlan` models.
    -   Delete the old `FlowerPlan` model.
    -   Update the `ForeignKey` relationships in the `Event` and `Payment` models to point to `OrderBase`.
4.  **Update Backend Logic:**
    -   Modify all views (e.g., `get_or_create_inactive_plan_view`, `create_payment_intent`, webhook) to use the new `UpfrontPlan` model and `status` field.
    -   Update serializers to work with the new model structure.
5.  **Update Frontend Logic:**
    -   Modify API calls in the `upfront_flow` to match any changes in endpoints.
    -   Update components to work with the new `UpfrontPlan` data structure.
6.  **Database Reset:** Wipe and rebuild the database to apply the new schema.
