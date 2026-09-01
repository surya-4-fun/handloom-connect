# Handloom Connect — Backend REST API & MySQL Layer

The official Node.js + Express.js + MySQL backend service for the **Handloom Connect / Handloom Market** full-stack platform.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MySQL 8.0+ / MariaDB (`mysql2/promise` with Connection Pool)
- **Security & Headers**: Helmet, CORS, parameterized queries (Zero SQL injection risk)
- **Authentication**: JWT (JSON Web Tokens) with 7-day expiration
- **Password Hashing**: `bcryptjs` (salt rounds: 10)
- **Validation**: `express-validator`
- **Logging**: Morgan

---

## 📁 Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MySQL2 connection pool
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Me, Logout
│   │   ├── userController.js     # User profile, addresses, preferences
│   │   ├── categoryController.js # Categories with counts
│   │   ├── productController.js  # Products, search, facets, detail, passport
│   │   ├── artisanController.js  # Artisans, stories, follows, support
│   │   ├── rawMaterialController.js # B2B Raw materials, bulk quotes
│   │   ├── cartController.js     # Persistent cart CRUD & sync
│   │   ├── wishlistController.js # Wishlist management
│   │   ├── orderController.js    # Transactional order placement & tracking
│   │   └── contactController.js  # Contact form inquiries
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization
│   │   ├── errorHandler.js       # Centralized error handler
│   │   └── validator.js          # express-validator handler
│   ├── models/
│   │   ├── userModel.js
│   │   ├── categoryModel.js
│   │   ├── artisanModel.js
│   │   ├── productModel.js
│   │   ├── rawMaterialModel.js
│   │   ├── cartModel.js
│   │   ├── wishlistModel.js
│   │   ├── orderModel.js
│   │   └── contactModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   ├── artisanRoutes.js
│   │   ├── rawMaterialRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── orderRoutes.js
│   │   └── contactRoutes.js
│   ├── utils/
│   │   └── response.js           # Standardized API responses
│   ├── app.js                    # Express app configuration
│   └── server.js                 # HTTP server entry point
├── database/
│   ├── schema.sql                # Complete MySQL DDL tables & indexes
│   ├── seed.sql                  # Complete initial database seed records
│   └── initDb.js                 # Automated database creation & seed runner
├── .env.example
├── .gitignore
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- MySQL Server (v8.0 or MariaDB v10.5+) running locally or on a cloud host (e.g. AWS RDS, PlanetScale, Railway, Aiven).

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your MySQL credentials:
```bash
cp .env.example .env
```

Example `.env`:
```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=handloom_connect
DB_CONNECTION_LIMIT=10

# Security / JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d

# Allowed Frontend Origins (comma-separated)
FRONTEND_URL=http://localhost:5173,https://handloom-market.vercel.app
```

### 4. Initialize the MySQL Database
Run the automated initialization script to create the database schema and populate it with initial categories, artisans, products, authenticity passports, raw materials, and demo orders:
```bash
npm run db:init
```

*Alternatively*, execute the SQL scripts directly in MySQL CLI or MySQL Workbench:
```sql
SOURCE backend/database/schema.sql;
SOURCE backend/database/seed.sql;
```

### 5. Start the Development Server
```bash
npm run dev
```

The API will start at: `http://localhost:5000`
Health check endpoint: `http://localhost:5000/api/health`

---

## 🔑 Demo Credentials

| Role | Email | Password | Details |
|---|---|---|---|
| Customer | `collector@handloomconnect.com` | `password123` | Pre-seeded with 2 demo orders & addresses |
| Master Artisan | `rajeshwar@banarasiartisan.org` | `password123` | Rajeshwar Ansari atelier profile |
| Admin | `admin@handloomconnect.in` | `password123` | Curator platform administrator |

---

## 📡 API Reference

### Standard Response Format
**Success:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Product not found",
  "code": "PRODUCT_NOT_FOUND"
}
```

---

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Login with email & password | No |
| `GET` | `/api/auth/me` | Get current user profile | Yes (Bearer) |
| `POST` | `/api/auth/logout` | Invalidate session | No |

### User Profile & Addresses (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users/profile` | Get full user profile, addresses & preferences | Yes (Bearer) |
| `PUT` | `/api/users/profile` | Update profile information (`fullName`, `avatarUrl`)| Yes (Bearer) |
| `GET` | `/api/users/addresses` | Get saved shipping/billing addresses | Yes (Bearer) |
| `POST` | `/api/users/addresses` | Add new saved address | Yes (Bearer) |
| `PUT` | `/api/users/addresses/:id` | Update saved address | Yes (Bearer) |
| `DELETE`| `/api/users/addresses/:id` | Delete saved address | Yes (Bearer) |
| `GET` | `/api/users/preferences` | Get account preferences | Yes (Bearer) |
| `PUT` | `/api/users/preferences` | Update newsletter, currency, theme | Yes (Bearer) |

### Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Query products (supports `category`, `search`, `minPrice`, `maxPrice`, `materials`, `regions`, `techniques`, `artisanIds`, `inStockOnly`, `sort`, `page`, `limit`) | No |
| `GET` | `/api/products/meta/facets`| Get distinct available filter facets | No |
| `GET` | `/api/products/:idOrSlug`| Get product detail, artisan info, passport & related products | No |

### Categories (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/categories` | Get category list with live product counts | No |

### Artisans (`/api/artisans`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/artisans` | List artisans (supports `search`, `region`, `tab`) | No |
| `GET` | `/api/artisans/user/followed` | Get list of followed artisan IDs | Yes (Bearer) |
| `GET` | `/api/artisans/:id` | Get artisan detail & direct woven products | No |
| `POST` | `/api/artisans/:id/follow` | Toggle following an artisan | Yes (Bearer) |
| `POST` | `/api/artisans/:id/support` | Record support / gratitude connection | No |

### B2B Raw Materials Marketplace (`/api/raw-materials`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/raw-materials` | Query raw materials (supports `category`, `origin`, `quality`, `search`, `sort`) | No |
| `GET` | `/api/raw-materials/:id` | Get raw material specifications & supplier info | No |
| `POST` | `/api/raw-materials/bulk-quote` | Submit bulk B2B procurement inquiry | No |

### Cart (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/cart` | Get current user's cart | Yes (Bearer) |
| `POST` | `/api/cart/items` | Add item to cart (`productId`, `quantity`) | Yes (Bearer) |
| `PUT` | `/api/cart/items/:productId` | Update item quantity | Yes (Bearer) |
| `DELETE`| `/api/cart/items/:productId` | Remove item from cart | Yes (Bearer) |
| `DELETE`| `/api/cart` | Clear entire cart | Yes (Bearer) |
| `POST` | `/api/cart/sync` | Sync local cart to server upon login | Yes (Bearer) |

### Wishlist (`/api/wishlist`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/wishlist` | Get user's saved wishlist IDs and products | Yes (Bearer) |
| `POST` | `/api/wishlist/toggle` | Toggle product in wishlist | Yes (Bearer) |

### Orders & Tracking (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/orders` | Place order (Atomic MySQL Transaction: price verification, inventory deduction, cart clearing) | Optional / Yes |
| `GET` | `/api/orders` | Get user order history | Yes (Bearer) |
| `GET` | `/api/orders/:id` | Get order confirmation details by ID | No |
| `GET` | `/api/orders/:id/tracking` | Get live 6-stage loom creation tracking | No |

### Contact (`/api/contact`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/contact` | Submit contact inquiry (`name`, `email`, `message`) | No |
