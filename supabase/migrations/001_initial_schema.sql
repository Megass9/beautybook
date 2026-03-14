-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- SALONS
-- =====================
CREATE TABLE IF NOT EXISTS salons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  phone TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- WORKING HOURS
-- =====================
CREATE TABLE IF NOT EXISTS working_hours (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  open_time TIME DEFAULT '09:00',
  close_time TIME DEFAULT '19:00',
  is_closed BOOLEAN DEFAULT false,
  UNIQUE(salon_id, day_of_week)
);

-- =====================
-- STAFF
-- =====================
CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- SERVICES
-- =====================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- STAFF SERVICES
-- =====================
CREATE TABLE IF NOT EXISTS staff_services (
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (staff_id, service_id)
);

-- =====================
-- CUSTOMERS
-- =====================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- APPOINTMENTS
-- =====================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_salons_owner ON salons(owner_id);
CREATE INDEX IF NOT EXISTS idx_salons_slug ON salons(slug);
CREATE INDEX IF NOT EXISTS idx_appointments_salon_date ON appointments(salon_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_staff_date ON appointments(staff_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_customers_salon ON customers(salon_id);
CREATE INDEX IF NOT EXISTS idx_staff_salon ON staff(salon_id);

-- =====================
-- UPDATED_AT TRIGGER
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS salons_updated_at ON salons;
CREATE TRIGGER salons_updated_at
  BEFORE UPDATE ON salons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================
-- ROW LEVEL SECURITY
-- =====================

-- Salons: owners can manage their own
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Salon owners manage own salon" ON salons;
CREATE POLICY "Salon owners manage own salon" ON salons
  FOR ALL USING (owner_id = auth.uid());
DROP POLICY IF EXISTS "Public can view salons by slug" ON salons;
CREATE POLICY "Public can view salons by slug" ON salons
  FOR SELECT USING (true);

-- Working Hours
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners manage working hours" ON working_hours;
CREATE POLICY "Owners manage working hours" ON working_hours
  FOR ALL USING (
    salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "Public can view working hours" ON working_hours;
CREATE POLICY "Public can view working hours" ON working_hours
  FOR SELECT USING (true);

-- Staff
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners manage staff" ON staff;
CREATE POLICY "Owners manage staff" ON staff
  FOR ALL USING (
    salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid())
  ) WITH CHECK (
    salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "Public can view staff" ON staff;
CREATE POLICY "Public can view staff" ON staff
  FOR SELECT USING (true);

-- Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners manage services" ON services;
CREATE POLICY "Owners manage services" ON services
  FOR ALL USING (
    salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "Public can view active services" ON services;
CREATE POLICY "Public can view active services" ON services
  FOR SELECT USING (true);

-- Staff Services
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners manage staff_services" ON staff_services;
CREATE POLICY "Owners manage staff_services" ON staff_services
  FOR ALL USING (
    staff_id IN (SELECT id FROM staff WHERE salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()))
  );
DROP POLICY IF EXISTS "Public can view staff_services" ON staff_services;
CREATE POLICY "Public can view staff_services" ON staff_services
  FOR SELECT USING (true);

-- Customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners view own customers" ON customers;
CREATE POLICY "Owners view own customers" ON customers
  FOR ALL USING (
    salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "Anonymous can insert customers" ON customers;
CREATE POLICY "Anonymous can insert customers" ON customers
  FOR INSERT WITH CHECK (true);

-- Appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners manage appointments" ON appointments;
CREATE POLICY "Owners manage appointments" ON appointments
  FOR ALL USING (
    salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid())
  );
DROP POLICY IF EXISTS "Anonymous can create appointment" ON appointments;
CREATE POLICY "Anonymous can create appointment" ON appointments
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anonymous can view for conflict check" ON appointments;
CREATE POLICY "Anonymous can view for conflict check" ON appointments
  FOR SELECT USING (true);
