-- Database Schema for Trade Deals UK
-- Run this SQL in Neon console to create the table

CREATE TABLE IF NOT EXISTS product_deals (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(100) NOT NULL,
  product_name TEXT NOT NULL,
  retailer_name VARCHAR(50) NOT NULL,
  retail_price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  savings_amount DECIMAL(10,2),
  savings_percent INTEGER,
  image_url TEXT,
  category VARCHAR(100),
  promo_start TIMESTAMP,
  promo_end TIMESTAMP,
  affiliate_link TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_sku_retailer UNIQUE (sku, retailer_name)
);

-- Indexes for fast searches
CREATE INDEX IF NOT EXISTS idx_product_name ON product_deals (product_name);
CREATE INDEX IF NOT EXISTS idx_category ON product_deals (category);
CREATE INDEX IF NOT EXISTS idx_retailer ON product_deals (retailer_name);
CREATE INDEX IF NOT EXISTS idx_savings_percent ON product_deals (savings_percent DESC);

-- Categories table for filtering
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50)
);

-- Insert default categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Power Tools', 'power_tools', '🔧'),
  ('Hand Tools', 'hand_tools', '🛠️'),
  ('Building Materials', 'building_materials', '🧱'),
  ('Plumbing', 'plumbing', '🚿'),
  ('Electrical', 'electrical', '💡'),
  ('Paint & Decorating', 'paint_decorating', '🎨'),
  ('Garden & Outdoor', 'garden_outdoor', '🌿'),
  ('Hardware', 'hardware', '🔩')
ON CONFLICT (slug) DO NOTHING;

-- Retailers table
CREATE TABLE IF NOT EXISTS retailers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  logo_url TEXT,
  affiliate_network VARCHAR(20),
  feed_url TEXT,
  feed_format VARCHAR(10),
  active BOOLEAN DEFAULT true
);
