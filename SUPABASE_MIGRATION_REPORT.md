# Supabase Migration Report

## Current Architecture
The current architecture consists of:
1. **Frontend**: React + Vite + TypeScript.
2. **Backend**: Node.js + Express.js REST API running on Railway.
3. **Database**: MySQL relational database.
4. **AI Service**: Separate Python FastAPI microservice that communicates with the Node.js backend.

## Database Tables/Models Currently Used
1. `users`
2. `user_addresses`
3. `user_preferences`
4. `categories`
5. `artisans`
6. `products`
7. `authenticity_passports`
8. `product_360_images`
9. `material_suppliers`
10. `raw_materials`
11. `cart_items`
12. `wishlist_items`
13. `artisan_follows`
14. `orders`
15. `order_items`
16. `bulk_requests`
17. `contact_inquiries`

## Backend Endpoints Currently Used
**Auth**: `/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`
**Users**: `/users/profile`, `/users/addresses`, `/users/preferences`
**Products**: `/products`, `/products/:idOrSlug`, `/categories`, `/products/facets`, `/products/:idOrSlug/360`, `/products/:idOrSlug/passport`
**Raw Materials**: `/raw-materials`, `/raw-materials/:id`, `/raw-materials/bulk-quote`
**Artisans**: `/artisans`, `/artisans/:id`
**Cart**: `/cart`, `/cart/items`, `/cart/items/:productId`, `/cart/sync`
**Wishlist**: `/wishlist`, `/wishlist/toggle`
**Orders**: `/orders`, `/orders/:id`, `/orders/:id/tracking`
**Contact**: `/contact`
**AI**: `/ai/chat`, `/ai/product-preview`

## Frontend -> Backend Dependencies
The frontend uses `VITE_API_BASE_URL` or `VITE_API_URL` to connect to the Node.js backend (`http://localhost:5000/api` locally).
It handles authentication using a JWT token stored in `localStorage` under the key `hc_auth_token`.
It uses standard HTTP methods (GET, POST, PUT, DELETE) via the custom `api` wrapper around `fetch`.

## AI Dependencies
The frontend calls the Node.js backend at `/ai/chat` and `/ai/product-preview`.
The Node.js backend proxies these requests to a Python FastAPI microservice (configured via `FASTAPI_SERVICE_URL`).
The FastAPI service connects to an AI provider (mock, OpenAI, Anthropic, Gemini, etc.).

## Proposed Supabase Replacement
* **Backend Framework**: Vercel Serverless (using Supabase JS Client directly on the frontend, no Express backend needed).
* **Database**: Supabase PostgreSQL.
* **Authentication**: Supabase Auth (replaces custom JWT implementation).
* **AI Service**: Supabase Edge Functions for secure API communication with AI providers (replaces Python FastAPI and Node.js wrapper).
* **Environment Variables**: Only the Supabase URL and Anon Key are required in the frontend (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## Functionality that can be preserved exactly
* Frontend components, layouts, pages, styles, hooks, and Context.
* The overall domain logic, schema structure, and relationships (with slight adaptations to Postgres syntax).
* The routing configuration.

## Functionality that needs modification
* All API service files (`frontend/src/services/*`) must be rewritten to use the `supabase-js` client instead of `fetch` or to call Supabase Edge Functions.
* Auth context must integrate with Supabase Auth instead of manually managing JWT tokens.
* The MySQL schema needs to be adapted for PostgreSQL (e.g., using UUIDs correctly, removing `AUTO_INCREMENT` in favor of sequences or `identity`, modifying enums, using Supabase RLS).
* AI endpoints will need to be wrapped into a Supabase Edge Function to avoid exposing secret API keys in the frontend.

## Anything that cannot safely be migrated automatically
* Migrating *existing* user passwords from custom bcrypt hashes to Supabase Auth requires a custom import script if we wanted to preserve them. Since this looks like a new setup, we might simply create new users.
* AI integrations depend on external API keys. We must move the provider logic to Edge Functions and provide a mock/fallback on the Edge Function or Frontend if keys are missing.
* Any complex transactional logic (e.g. checkout, inventory decrement) might require a PostgreSQL function (RPC) or an Edge Function, as it shouldn't be fully trusted to the frontend client.
