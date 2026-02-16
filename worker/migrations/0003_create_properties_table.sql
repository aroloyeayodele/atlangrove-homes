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
