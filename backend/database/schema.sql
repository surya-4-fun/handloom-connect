-- ====================================================================
-- Handloom Connect - Relational MySQL Database Schema
-- Matches the Handloom Connect Frontend Domain Specifications
-- ====================================================================

CREATE DATABASE IF NOT EXISTS handloom_connect 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE handloom_connect;

-- Explicit UTF-8 character encoding configuration
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;
SET character_set_client = utf8mb4;

-- Disable foreign key checks during initialization
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------------------
-- 1. Users Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  avatar_url TEXT NULL,
  role ENUM('customer', 'artisan', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. User Addresses Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS user_addresses;
CREATE TABLE user_addresses (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  type ENUM('billing', 'shipping') NOT NULL DEFAULT 'shipping',
  full_name VARCHAR(150) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255) NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. User Preferences Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS user_preferences;
CREATE TABLE user_preferences (
  user_id VARCHAR(50) PRIMARY KEY,
  newsletter BOOLEAN NOT NULL DEFAULT TRUE,
  currency ENUM('INR', 'USD', 'EUR', 'GBP') NOT NULL DEFAULT 'INR',
  theme ENUM('system', 'light', 'dark') NOT NULL DEFAULT 'dark',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. Categories Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  image TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. Artisans Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS artisans;
CREATE TABLE artisans (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  title VARCHAR(200) NULL,
  region VARCHAR(150) NOT NULL,
  craft VARCHAR(150) NOT NULL,
  specialty VARCHAR(255) NULL,
  experience VARCHAR(100) NOT NULL,
  bio TEXT NOT NULL,
  story TEXT NULL,
  techniques JSON NULL,
  cultural_background TEXT NULL,
  community_impact JSON NULL,
  image TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_collective BOOLEAN NOT NULL DEFAULT FALSE,
  follower_count INT NOT NULL DEFAULT 0,
  support_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_artisans_region (region),
  INDEX idx_artisans_featured (is_featured),
  INDEX idx_artisans_collective (is_collective)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. Products Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category_id VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  display_price VARCHAR(50) NOT NULL,
  images JSON NOT NULL,
  alt VARCHAR(255) NOT NULL,
  material VARCHAR(150) NOT NULL,
  region VARCHAR(150) NOT NULL,
  technique VARCHAR(150) NOT NULL,
  artisan_id VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  dimensions VARCHAR(150) NULL,
  care VARCHAR(255) NULL,
  provenance VARCHAR(255) NULL,
  badge VARCHAR(50) NULL,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  stock_quantity INT NOT NULL DEFAULT 10,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (artisan_id) REFERENCES artisans(id) ON DELETE RESTRICT,
  INDEX idx_products_category (category_id),
  INDEX idx_products_artisan (artisan_id),
  INDEX idx_products_price (price),
  INDEX idx_products_region (region),
  INDEX idx_products_stock (in_stock)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. Authenticity Passports Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS authenticity_passports;
CREATE TABLE authenticity_passports (
  id VARCHAR(100) PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL UNIQUE,
  verification_status VARCHAR(100) NOT NULL DEFAULT 'GI Associated Craft',
  handwoven_verified BOOLEAN NOT NULL DEFAULT TRUE,
  origin_verified BOOLEAN NOT NULL DEFAULT TRUE,
  gi_registry_no VARCHAR(100) NOT NULL,
  silk_mark_no VARCHAR(100) NOT NULL,
  loom_type VARCHAR(150) NOT NULL,
  warp_thread_count VARCHAR(150) NOT NULL,
  weave_density VARCHAR(150) NOT NULL,
  cultural_story TEXT NOT NULL,
  craft_journey JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_passport_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7b. Product 360° Rotating Angle Images Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS product_360_images;
CREATE TABLE product_360_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  sequence_number INT NOT NULL,
  angle_label VARCHAR(50) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uk_product_sequence (product_id, sequence_number),
  INDEX idx_360_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. Material Suppliers Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS material_suppliers;
CREATE TABLE material_suppliers (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(150) NOT NULL,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 4.90,
  certified BOOLEAN NOT NULL DEFAULT TRUE,
  verified_gi BOOLEAN NOT NULL DEFAULT TRUE,
  specialty VARCHAR(255) NOT NULL,
  contact_email VARCHAR(191) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 9. Raw Materials Table (B2B Marketplace)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS raw_materials;
CREATE TABLE raw_materials (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  material_type VARCHAR(150) NOT NULL,
  origin VARCHAR(150) NOT NULL,
  supplier_id VARCHAR(100) NOT NULL,
  quality VARCHAR(100) NOT NULL,
  quantity_unit VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  display_price VARCHAR(50) NOT NULL,
  min_order_qty INT NOT NULL DEFAULT 1,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  sustainability_info TEXT NOT NULL,
  description TEXT NOT NULL,
  images JSON NOT NULL,
  badge VARCHAR(50) NULL,
  denier_or_count VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES material_suppliers(id) ON DELETE RESTRICT,
  INDEX idx_raw_materials_cat (category),
  INDEX idx_raw_materials_origin (origin),
  INDEX idx_raw_materials_supplier (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 10. Cart Items Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uk_cart_user_product (user_id, product_id),
  INDEX idx_cart_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 11. Wishlist Items Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS wishlist_items;
CREATE TABLE wishlist_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uk_wishlist_user_product (user_id, product_id),
  INDEX idx_wishlist_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 12. Artisan Follows Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS artisan_follows;
CREATE TABLE artisan_follows (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  artisan_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (artisan_id) REFERENCES artisans(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_artisan_follow (user_id, artisan_id),
  INDEX idx_follows_user (user_id),
  INDEX idx_follows_artisan (artisan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 13. Orders Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NULL,
  shipping_address JSON NOT NULL,
  delivery_method JSON NOT NULL,
  payment_details JSON NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  gift_box_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  tax_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM(
    'commissioned',
    'yarn_washing',
    'organic_dyeing',
    'warp_prep',
    'weaving_in_progress',
    'quality_audit',
    'dispatched',
    'delivered'
  ) NOT NULL DEFAULT 'commissioned',
  current_stage INT NOT NULL DEFAULT 0,
  total_hours INT NOT NULL DEFAULT 120,
  completed_hours INT NOT NULL DEFAULT 12,
  estimated_delivery VARCHAR(100) NOT NULL,
  silk_mark_no VARCHAR(100) NOT NULL,
  gi_tag_no VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 14. Order Items Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  display_price VARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  image TEXT NOT NULL,
  craft VARCHAR(150) NOT NULL,
  artisan_name VARCHAR(150) NOT NULL,
  cluster VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 15. Bulk B2B Requests Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS bulk_requests;
CREATE TABLE bulk_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reference_no VARCHAR(50) NOT NULL UNIQUE,
  material_id VARCHAR(100) NOT NULL,
  material_name VARCHAR(200) NOT NULL,
  requested_qty INT NOT NULL,
  unit VARCHAR(50) NOT NULL,
  artisan_name VARCHAR(150) NOT NULL,
  organization_name VARCHAR(150) NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  notes TEXT NULL,
  color_shade_ref VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_bulk_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 16. Contact Inquiries Table
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS contact_inquiries;
CREATE TABLE contact_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
