-- Users table to manage admin access
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL -- In a real app, this should be a hashed password
);

-- Seed the users table with a default admin user
INSERT INTO users (username, password) VALUES ('admin', 'password');

-- Inquiries table from the contact form
DROP TABLE IF EXISTS inquiries;
CREATE TABLE inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
DROP TABLE IF EXISTS properties;
CREATE TABLE properties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  price REAL NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  property_type TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  features TEXT,
  images TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blogs table
DROP TABLE IF EXISTS blogs;
CREATE TABLE blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    status TEXT CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
