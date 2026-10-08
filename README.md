# Handloom Connect — Full-Stack Luxury Handloom Marketplace

An authentic Indian luxury handloom marketplace connecting master artisans directly with global connoisseurs. Built with a **React + Vite + TypeScript** frontend, **Supabase** (Database, Auth, and Edge Functions), and the **Google Gemini API** through the server-side `ai-chat` Edge Function.

---

## 🏛️ Project Architecture

```text
handloom-connect/
│
├── frontend/                     # React + TypeScript + Vite Application
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── assets/               # Images and visual branding
│   │   ├── components/           # Reusable UI (motion, navigation, primitives, sections, shop)
│   │   ├── context/              # React Auth Context & Global State
│   │   ├── hooks/                # Custom React hooks (useCart, useShopState, etc.)
│   │   ├── layouts/              # AppLayout shell
│   │   ├── lib/                  # Supabase client initialization
│   │   ├── pages/                # Route pages (Marketplace, PDP, Artisans, RawMaterials, etc.)
│   │   ├── services/             # Supabase data services (products, orders, auth, aiChat, 360)
│   │   ├── styles/               # CSS Design System & animation tokens
│   │   ├── types/                # TypeScript domain models & interfaces
│   │   ├── utils/                # Utility helpers (uuid, image normalization)
│   │   ├── App.tsx               # App router & provider tree
│   │   └── main.tsx              # React entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env.example
│
├── supabase/                     # Supabase Backend Infrastructure
│   ├── functions/                # Deno Edge Functions
│   │   ├── _shared/              # Shared CORS headers & utilities
│   │   ├── ai-chat/              # Gemini AI Curator Chatbot Edge Function
│   │   └── ai-product-preview/   # AI Product Preview Edge Function
│   ├── migrations/               # PostgreSQL Schemas & RLS policies
│   │   ├── 20231010000000_initial_schema.sql
│   │   ├── 20231010000001_seed_catalog.sql
│   │   └── 20231010000002_seed_raw_materials.sql
│   ├── seed.sql                  # Database seed dataset
│   └── README.md
│
├── .gitignore
├── README.md
└── package.json                  # Root workspace orchestration
```

---

## 🤖 AI Architecture (React → Supabase Edge Functions → Gemini API)

Handloom Connect utilizes a serverless architecture for AI capabilities to ensure security and decoupling:
1. **React Frontend**: The UI (`FloatingChatbot` & `aiChatService`) invokes the Supabase Edge Function via `supabase.functions.invoke('ai-chat')`. No AI API keys are exposed to the browser.
2. **Supabase Edge Function (`ai-chat`)**: A secure server-side Deno runtime handles CORS preflights, parses conversational history & user context, and queries the **Google Gemini API** (`gemini-1.5-flash`) using the server-side `GEMINI_API_KEY` secret.
3. **Domain-Aware Resilient Fallback**: If AI provider secrets are unconfigured or unavailable, the function falls back to curated textile domain recommendations.

---

## 🚀 Quick Start

### 1. Environment Configuration
Copy the template and configure your Supabase project credentials in `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```

### 2. Install Dependencies
```bash
npm install --prefix frontend
```

### 3. Start Development Server
```bash
npm run dev
# or from frontend directory:
npm run dev --prefix frontend
```
The Vite development server will start at `http://localhost:5173`.

---

## 🧪 Testing & Validation

- **Frontend Typecheck**:
  ```bash
  npm run typecheck
  ```
- **Frontend Lint**:
  ```bash
  npm run lint
  ```
- **Production Build**:
  ```bash
  npm run build
  ```

