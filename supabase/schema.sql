-- ============================================================
-- BeautyBook Database Schema
-- Run in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Salons (one per owner for MVP)
CREATE TABLE salons (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  owner_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  address       TEXT NOT NULL,
  city          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  description   TEXT,
  logo_url      TEXT,
  is_active     BOOLEAN DEFAULT TRUE
);

-- Staff members
CREATE TABLE staff (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  salon_id   UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  title      TEXT,
  avatar_url TEXT,
  is_active  BOOLEAN DEFAULT TRUE
);

-- Services offered
CREATE TABLE services (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  salon_id         UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  name             TEXT NOT NULL,
  description      TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price            NUMERIC(10,2) NOT NULL DEFAULT 0,
  category         TEXT,
  is_active        BOOLEAN DEFAULT TRUE
);

-- Staff <-> Services mapping
CREATE TABLE staff_services (
  staff_id   UUID REFERENCES staff(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (staff_id, service_id)
);

-- Customers
CREATE TABLE customers (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  salon_id   UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT,
  notes      TEXT
);

-- Appointments
CREATE TABLE appointments (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  salon_id    UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  staff_id    UUID REFERENCES staff(id) ON DELETE RESTRICT NOT NULL,
  service_id  UUID REFERENCES services(id) ON DELETE RESTRICT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT NOT NULL,
  start_time  TIMESTAMPTZ NOT NULL,
  end_time    TIMESTAMPTZ NOT NULL,
  status      TEXT NOT NULL DEFAULT 'confirmed'
              CHECK (status IN ('pending','confirmed','cancelled','completed')),
  notes       TEXT,
  CONSTRAINT no_overlap EXCLUDE USING gist (
    staff_id WITH =,
    tstzrange(start_time, end_time) WITH &&
  ) WHERE (status <> 'cancelled')
);

-- Working hours (salon-level or staff-level)
CREATE TABLE working_hours (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id    UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  staff_id    UUID REFERENCES staff(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time   TIME NOT NULL,
  close_time  TIME NOT NULL,
  is_closed   BOOLEAN DEFAULT FALSE
);

-- Reviews
CREATE TABLE reviews (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  salon_id      UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  is_verified   BOOLEAN DEFAULT FALSE
);

-- Notifications for admin announcements to salon owners
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_salons_owner    ON salons(owner_id);
CREATE INDEX idx_salons_slug     ON salons(slug);
CREATE INDEX idx_staff_salon     ON staff(salon_id);
CREATE INDEX idx_services_salon  ON services(salon_id);
CREATE INDEX idx_customers_salon ON customers(salon_id);
CREATE INDEX idx_customers_phone ON customers(salon_id, phone);
CREATE INDEX idx_appointments_salon ON appointments(salon_id);
CREATE INDEX idx_appointments_staff ON appointments(staff_id, start_time);
CREATE INDEX idx_appointments_time  ON appointments(start_time);
CREATE INDEX idx_wh_salon       ON working_hours(salon_id);
CREATE INDEX idx_notifications_salon ON notifications(salon_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE salons       ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff        ENABLE ROW LEVEL SECURITY;
ALTER TABLE services     ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: returns salon_id for authenticated user
CREATE OR REPLACE FUNCTION auth_user_salon_id()
RETURNS UUID LANGUAGE sql SECURITY DEFINER AS $$
  SELECT id FROM salons WHERE owner_id = auth.uid() LIMIT 1;
$$;

-- SALONS
CREATE POLICY "Owner can manage own salon"
  ON salons FOR ALL TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Public can view active salons by slug"
  ON salons FOR SELECT TO anon, authenticated
  USING (is_active = TRUE);

-- STAFF
CREATE POLICY "Owner manages staff"
  ON staff FOR ALL TO authenticated
  USING (salon_id = auth_user_salon_id())
  WITH CHECK (salon_id = auth_user_salon_id());

CREATE POLICY "Public can view staff"
  ON staff FOR SELECT TO anon
  USING (is_active = TRUE);

-- SERVICES
CREATE POLICY "Owner manages services"
  ON services FOR ALL TO authenticated
  USING (salon_id = auth_user_salon_id())
  WITH CHECK (salon_id = auth_user_salon_id());

CREATE POLICY "Owner can read own salon notifications"
  ON notifications FOR SELECT TO authenticated
  USING (salon_id = auth_user_salon_id());

CREATE POLICY "Public can view services"
  ON services FOR SELECT TO anon
  USING (is_active = TRUE);

-- STAFF_SERVICES
CREATE POLICY "Owner manages staff_services"
  ON staff_services FOR ALL TO authenticated
  USING (
    staff_id IN (SELECT id FROM staff WHERE salon_id = auth_user_salon_id())
  );

CREATE POLICY "Public can view staff_services"
  ON staff_services FOR SELECT TO anon USING (TRUE);

-- CUSTOMERS
CREATE POLICY "Owner manages customers"
  ON customers FOR ALL TO authenticated
  USING (salon_id = auth_user_salon_id())
  WITH CHECK (salon_id = auth_user_salon_id());

CREATE POLICY "Anon can insert customers"
  ON customers FOR INSERT TO anon WITH CHECK (TRUE);

CREATE POLICY "Anon can read own customer by phone"
  ON customers FOR SELECT TO anon USING (TRUE);

-- APPOINTMENTS
CREATE POLICY "Owner manages appointments"
  ON appointments FOR ALL TO authenticated
  USING (salon_id = auth_user_salon_id())
  WITH CHECK (salon_id = auth_user_salon_id());

CREATE POLICY "Anon can insert appointments"
  ON appointments FOR INSERT TO anon WITH CHECK (TRUE);

CREATE POLICY "Anon can read appointments (for conflict check)"
  ON appointments FOR SELECT TO anon USING (TRUE);

-- WORKING HOURS
CREATE POLICY "Owner manages working hours"
  ON working_hours FOR ALL TO authenticated
  USING (salon_id = auth_user_salon_id())
  WITH CHECK (salon_id = auth_user_salon_id());

CREATE POLICY "Public can view working hours"
  ON working_hours FOR SELECT TO anon USING (TRUE);

-- ============================================================
-- STORAGE BUCKET (run separately in Supabase dashboard)
-- ============================================================
-- 1. Go to Storage → Create bucket "salon-assets" (public)
-- 2. Add policy: Allow authenticated uploads
-- INSERT INTO storage.buckets (id, name, public) VALUES ('salon-assets', 'salon-assets', true);
