-- Cloudflare D1 Schema for Atlangrove Homes

-- Drop tables if they exist to ensure a clean slate
DROP TABLE IF EXISTS property_images;
DROP TABLE IF EXISTS property_features;
DROP TABLE IF EXISTS inquiries;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS users;

-- Users table for admin authentication
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  location TEXT NOT NULL,
  category TEXT CHECK(category IN ('land', 'carcass', 'finished')) NOT NULL,
  image_url TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_meters INTEGER,
  status TEXT CHECK(status IN ('Available', 'Sold', 'Pending')) DEFAULT 'Available',
  listed_date TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blogs table
CREATE TABLE blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    status TEXT CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Additional tables from the original schema
CREATE TABLE property_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE property_features (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  feature TEXT NOT NULL
);

CREATE TABLE inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_properties_location ON properties (location);
CREATE INDEX idx_blogs_author ON blogs (author_id);
