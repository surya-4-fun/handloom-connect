# Handloom Connect — Full-Stack Luxury Handloom Marketplace

An authentic Indian luxury handloom marketplace connecting master artisans directly with global connoisseurs. Built with a **React + Vite + TypeScript** frontend, a **Node.js + Express.js** REST API backend, and a **MySQL** relational database.

---

## 🏛️ Project Architecture

```text
D:\handloom-connect
│
├── frontend/                     # React + TypeScript + Vite Application
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── assets/               # Images and visual branding
│   │   ├── components/           # Reusable UI (motion, navigation, primitives, sections, shop)
│   │   ├── context/              # React Auth Context & Global State
│   │   ├── hooks/                # Custom React hooks (useCart, useShopState, etc.)
│   │   ├── layouts/              # AppLayout shell
│   │   ├── pages/                # Route pages (Marketplace, PDP, Artisans, etc.)
│   │   ├── services/             # API services (products, orders, auth, AI preview, 360)
│   │   ├── styles/               # CSS Design System & animation tokens
│   │   ├── types/                # TypeScript domain models & interfaces
│   │   ├── utils/                # WebGL helpers & offline mock datasets
│   │   ├── App.tsx               # App router & provider tree
│   │   └── main.tsx              # React entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env.example
│
├── backend/                      # Node.js + Express.js REST API
│   ├── src/
│   │   ├── config/               # MySQL pool & database connections
│   │   ├── controllers/          # Business logic handlers
│   │   ├── middleware/           # Auth, validation & security middleware
│   │   ├── models/               # MySQL parameterized queries & data models
│   │   ├── routes/               # Express API endpoints
│   │   ├── services/             # AI Wear Preview & image generation service
│   │   ├── utils/                # Response formatting helpers
│   │   ├── app.js                # Express app setup & CORS configuration
│   │   └── server.js             # HTTP server entry point
│   ├── database/
│   │   ├── schema.sql            # Complete relational MySQL schema
│   │   └── seed.sql              # Seed dataset with GI passports & 360 images
│   ├── test/                     # Integration & security test suite
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── .gitignore
├── README.md
└── package.json                  # Root workspace orchestration
```

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
# Copy environment configuration
cp .env.example .env
# Start the backend server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

### 3. Root Workspace Commands
From the project root:
```bash
# Run frontend dev server
npm run dev:frontend

# Run backend dev server
npm run dev:backend

# Build frontend production bundle
npm run build

# Run backend integration & security audit suite
npm run test:backend
```

---

## 🧪 Testing & Validation

- **Frontend Typecheck & Build**:
  ```bash
  npm run build --prefix frontend
  ```
- **Backend Audit Test Suite**:
  ```bash
  npm run test:audit --prefix backend
  ```
