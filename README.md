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
│   │   ├── services/             # API services (products, orders, auth, aiChat, AI preview, 360)
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
├── ai-service/                   # Python FastAPI AI Microservice
│   ├── main.py                   # FastAPI Application Entrypoint
│   ├── models.py                 # Pydantic Schemas for validation
│   ├── provider.py               # AI Provider Abstraction Interface
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Env configuration (API Keys, etc.)
│
├── .gitignore
├── README.md
└── package.json                  # Root workspace orchestration
```

---

## 🤖 AI Architecture (React → Node → FastAPI)

Handloom Connect utilizes a specialized architecture for AI capabilities to ensure security and decoupling:
1. **React Frontend**: The UI (e.g. `AIAssistantPage`) sends a chat request to the Node.js API Gateway. No AI API keys are exposed to the browser.
2. **Node.js Express API**: The main backend authenticates the user, constructs contextual data (e.g., user preferences), and securely forwards the payload to the Python AI service.
3. **Python FastAPI Service**: A dedicated microservice handling AI workloads. It parses the context, interfaces with the chosen AI Provider (OpenAI, Gemini, Anthropic, or Mock) using an abstraction pattern, and returns a structured response to Express.

---

## 🚀 Quick Start

### 1. Python AI Service Setup (New)
Ensure you have Python 3.9+ installed.
```bash
cd ai-service
# Create a virtual environment (optional but recommended)
python -m venv venv
# Activate the virtual environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment configuration
cp .env.example .env

# Start the FastAPI server (runs on http://localhost:8000)
uvicorn main:app --reload
```
You can verify it's running by visiting `http://localhost:8000/health`.

### 2. Backend Setup
```bash
cd backend
npm install
# Copy environment configuration
cp .env.example .env
# Make sure to update .env with FASTAPI_SERVICE_URL=http://localhost:8000
# Start the backend server (runs on http://localhost:5000)
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

### 4. Root Workspace Commands
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
