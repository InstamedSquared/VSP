---
description: Development Instructions
---

## Do NOT change the formatting of any CSS files.

This includes:
- Do not reformat.
- Do not reorder.
- Do not rename.
- Do not apply any automatic formatting tools.

## CSS Updates
1. **Strict Reusability:** Prioritize reusing existing CSS classes and styles. Do not generate new CSS classes or inline styles unless absolutely necessary.
2. **New Styles:** If new styling rules are unavoidably required, they MUST be placed strictly inside `delete.css`.
3. From the `delete.css`, I am transferring it to the proper CSS file that I am using. If it was transferred or deleted from `delete.css`, do not put it back.

## Modular Architecture
1. **Strict Isolation:** The codebase is module-based (e.g., users, employees, profile). When fixing bugs or updating a specific module, ensure your code changes are strictly scoped to that module's files. Do not modify shared code or other modules in a way that causes unintended side-effects elsewhere.

## Database Tables & Queries
1. **Standard Columns (The `trim` Standard):** Every newly created or used table MUST include the following standard baseline columns (exactly as they are in the `trim` table), followed by any specific new columns needed:
   - `id` (int(11), Primary Key, Auto Increment, Not Null)
   - `name` (varchar(300), Null)
   - `remarks` (varchar(500), Null)
   - `archived` (smallint(1), Default 0, Not Null)
   - `inactive` (smallint(1), Default 0, Null)
   - `created_by` (int(10), Null)
   - `created_at` (timestamp, Default current_timestamp(), Not Null)
   - `deleted_by` (int(12), Null)
   - `deleted_at` (timestamp, Null)
   - `archived_by` (int(10), Null)
   - `archived_at` (timestamp, Null)
   - `changelog` (text, Null)
2. **Querying:** For data retrieved from the DB, always check for `inactive=0`.

## Documentation & Planning
1. **Implementation Plans:** Always create a detailed implementation plan as a `.md` artifact before proceeding with multi-phase code changes or complex feature implementations.

## UI Components
1. **Popups:** For every popup, always use the footer for the button, and the button must always have an appropriate icon.
2. **Toggles:** For data representing Yes/No or True/False (boolean), always use the `.toggle-switch` layout instead of a checkbox or text input.

## Canonical Form Structure
The layout is built using a "Nested Flexbox" approach. Here is how the components work together:

1. **`.form-case` (The Container)**
   The top-level wrapper for any form.
   - **Behavior:** `display: flex; flex-direction: column;`
   - **Purpose:** It ensures all rows and sections of the form stack vertically with a consistent gap (`--form-gap`).

2. **`.form-row` (The Horizontal Row)**
   Used to place multiple inputs on the same line.
   - **Behavior:** `display: flex; gap: var(--form-gap);`
   - **Purpose:** It aligns elements horizontally. On mobile screens (under 900px), it automatically wraps or stacks elements vertically to maintain responsiveness.
   - **Utility:** Often paired with width classes like `.w5` (50%) or `.w3` (30%) to control how much space an input takes within the row.

3. **`.input-case` (The Field Wrapper)**
   The standard wrapper for a single label + input pair.
   - **Behavior:** `display: flex; flex-direction: column; gap: 5px;`
   - **Purpose:** It groups a label (`<p>`) and an input (or `.input-group`) together so they stack vertically. This is where validation states (`.valid`, `.invalid`) are applied, which then changes the color of the border and icons.

4. **`.input-group` (The Input Decorator)**
   Used inside an `.input-case` when an input needs an icon.
   - **Classes:** `.input-group.left` or `.input-group.right`.
   - **Purpose:** It positions the icon absolutely inside the input and adds the necessary padding to the text so it doesn't overlap with the icon.

## VSP-Specific Rules (Additions)

### Database
1. All new tables MUST include the standard audit columns via `addAuditColumns()` helper.
2. All queries MUST include `tenant_id` filtering via middleware.
3. Use Knex query builder exclusively — no raw SQL unless dialect-specific logic is required.
4. Use Knex `.raw()` with dialect-aware operators when raw SQL is unavoidable.

### API
1. All new routes MUST be under `/api/v1/` namespace.
2. Domain-specific routes go in `server/routes/domain/`.
3. Generic CRUD entities use the existing `ResourceModel` + dynamic registration pattern.

### Security
1. All domain controllers handling sensitive data MUST include audit logging.
2. Encrypted fields (e.g., bank details) use Node.js `crypto` module with AES-256.

### Frontend
1. New domain pages go under `client/src/pages/{admin|client|employee}/{domain}/`.
2. Reusable domain components go in `client/src/components/domain/{domain}/`.