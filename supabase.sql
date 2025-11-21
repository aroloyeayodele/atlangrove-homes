-- Exclusive Estates - initial schema (Supabase/Postgres)
-- Safe to run multiple times; uses IF NOT EXISTS where possible.

-- Extensions
create extension if not exists pgcrypto; -- for gen_random_uuid() and crypt()
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

-- View providing camelCase fields for frontend
create or replace view public.properties_view as
  select 
    id,
    title,
    description,
    price,
    location,
    category,
    image_url as "imageUrl",
    bedrooms,
    bathrooms,
    square_meters as "squareMeters",
    status,
    listed_date as "listedDate",
    property_size as "propertySize",
    contact_phone as "contactPhone",
    created_at,
    updated_at
  from public.properties;

-- Optional grants (views don't enforce RLS; underlying tables do)
grant select on public.properties_view to anon, authenticated;
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  aud TEXT,
  role TEXT DEFAULT 'user',
  app_metadata JSONB,
  user_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Grant minimal rights (adjust as needed)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;

-- Function: handle auth user created
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, aud, app_metadata, user_metadata, created_at)
  VALUES (NEW.id, NEW.email, NEW.aud, NEW.raw_app_meta_data::jsonb, NEW.raw_user_meta_data::jsonb, NEW.created_at)
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        aud = EXCLUDED.aud,
        app_metadata = EXCLUDED.app_metadata,
        user_metadata = EXCLUDED.user_metadata;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: handle auth user updated
CREATE OR REPLACE FUNCTION public.handle_auth_user_updated()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET email = NEW.email,
      aud = NEW.aud,
      app_metadata = NEW.raw_app_meta_data::jsonb,
      user_metadata = NEW.raw_user_meta_data::jsonb
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: handle auth user deleted
CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if any, then create triggers on auth.users
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    DROP TRIGGER on_auth_user_created ON auth.users;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_updated') THEN
    DROP TRIGGER on_auth_user_updated ON auth.users;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_deleted') THEN
    DROP TRIGGER on_auth_user_deleted ON auth.users;
  END IF;
END$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_created();

CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_updated();

CREATE TRIGGER on_auth_user_deleted
AFTER DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_deleted();

-- Notes:
-- - Supabase's `auth.users` has fields like `raw_app_meta_data` and `raw_user_meta_data` (names may differ by project; check your auth.users columns and adjust accordingly).
-- - SECURITY DEFINER gives the function the privileges of the function owner; ensure you run this as the project SQL admin so the owner has sufficient rights to modify `public.users`.
-- - If you still see issues, check Database > Logs in Supabase for trigger execution errors.
