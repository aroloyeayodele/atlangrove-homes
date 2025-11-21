-- Exclusive Estates - initial schema (Supabase/Postgres)
-- Safe to run multiple times; uses IF NOT EXISTS where possible.

-- Extensions
create extension if not exists pgcrypto; -- for gen_random_uuid()
create extension if not exists pg_trgm;  -- for search on text fields

-- Enumerations
do $$ begin
  if not exists (select 1 from pg_type where typname = 'property_category') then
    create type property_category as enum ('land','carcass','finished');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'property_status') then
    create type property_status as enum ('Available','Sold','Pending');
  end if;
end $$;

-- Tables
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric(15,2) not null check (price >= 0),
  location text not null,
  category property_category not null,
  image_url text, -- primary image for cards
  bedrooms integer,
  bathrooms integer,
  square_meters integer,
  status property_status default 'Available',
  listed_date date,
  property_size text,
  contact_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.property_images (
  id bigserial primary key,
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.property_features (
  id bigserial primary key,
  property_id uuid not null references public.properties(id) on delete cascade,
  feature text not null,
  sort_order integer not null default 0
);

create table if not exists public.inquiries (
  id bigserial primary key,
  property_id uuid references public.properties(id) on delete set null,
  name text not null,
  email text,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Updated-at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

do $$ begin
  if not exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    where c.relname = 'properties' and t.tgname = 'set_properties_updated_at'
  ) then
    create trigger set_properties_updated_at
    before update on public.properties
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- Indexes
create index if not exists idx_properties_created_at on public.properties(created_at desc);
create index if not exists idx_properties_category on public.properties(category);
create index if not exists idx_properties_price on public.properties(price);
create index if not exists idx_properties_location_trgm on public.properties using gin (location gin_trgm_ops);
create index if not exists idx_property_images_property_sort on public.property_images(property_id, sort_order);
create index if not exists idx_property_features_property_sort on public.property_features(property_id, sort_order);
create index if not exists idx_inquiries_property_created on public.inquiries(property_id, created_at desc);

-- Row Level Security (RLS)
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.property_features enable row level security;
alter table public.inquiries enable row level security;

-- Policies: Public read-only browsing of properties and related assets
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='properties' and policyname='Public can read properties'
  ) then
    create policy "Public can read properties" on public.properties
      for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='property_images' and policyname='Public can read property_images'
  ) then
    create policy "Public can read property_images" on public.property_images
      for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='property_features' and policyname='Public can read property_features'
  ) then
    create policy "Public can read property_features" on public.property_features
      for select using (true);
  end if;
end $$;

-- Policies: Inquiries - allow anyone to submit, keep data private
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inquiries' and policyname='Anyone can create inquiry'
  ) then
    create policy "Anyone can create inquiry" on public.inquiries
      for insert with check (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inquiries' and policyname='Authenticated can read inquiries'
  ) then
    create policy "Authenticated can read inquiries" on public.inquiries
      for select using (auth.role() = 'authenticated');
  end if;
end $$;

-- Admin helper and write policies (role-based)
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or (auth.jwt() ->> 'role') = 'admin'
  , false);
$$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='properties' and policyname='Admin can write properties'
  ) then
    create policy "Admin can write properties" on public.properties
      for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='property_images' and policyname='Admin can write property_images'
  ) then
    create policy "Admin can write property_images" on public.property_images
      for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='property_features' and policyname='Admin can write property_features'
  ) then
    create policy "Admin can write property_features" on public.property_features
      for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='inquiries' and policyname='Admin can write inquiries'
  ) then
    create policy "Admin can write inquiries" on public.inquiries
      for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- Storage: create property-images bucket and policies
-- Create bucket if missing (works across Supabase versions)
insert into storage.buckets (id, name, public)
select 'property-images', 'property-images', true
where not exists (select 1 from storage.buckets where id = 'property-images');

-- Public read access to files in this bucket
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='Public read property-images'
  ) then
    create policy "Public read property-images" on storage.objects
      for select using (bucket_id = 'property-images');
  end if;
end $$;

-- Admin write access to this bucket (role-based)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='Admin write property-images'
  ) then
    create policy "Admin write property-images" on storage.objects
      for all using (
        bucket_id = 'property-images' and public.is_admin()
      ) with check (
        bucket_id = 'property-images' and public.is_admin()
      );
  end if;
end $$;

-- Comprehensive SQL script for the Exclusive Estates project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table to store users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store admin activity logs
CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id UUID NOT NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table to store properties
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(15, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner_id UUID,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table to store property images
CREATE TABLE IF NOT EXISTS property_images (
    id SERIAL PRIMARY KEY,
    property_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Trigger function to sync auth.users with users table
CREATE OR REPLACE FUNCTION sync_auth_users()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, created_at)
    VALUES (NEW.id, NEW.email, NEW.created_at)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION sync_auth_users();

-- Insert default admin user
INSERT INTO users (email, password_hash, role) VALUES
('admin@example.com', '$2b$10$examplehashvalue', 'admin')
ON CONFLICT (email) DO NOTHING;