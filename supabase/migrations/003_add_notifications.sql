-- Create notifications table for admin messages to salon owners
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create index
CREATE INDEX idx_notifications_salon ON notifications(salon_id);

-- Helper function: returns salon_id for authenticated user
CREATE OR REPLACE FUNCTION auth_user_salon_id()
RETURNS UUID LANGUAGE sql SECURITY DEFINER AS $$
  SELECT id FROM salons WHERE owner_id = auth.uid() LIMIT 1;
$$;

-- Policies
CREATE POLICY "Owner can read own salon notifications"
  ON notifications FOR SELECT TO authenticated
  USING (salon_id = auth_user_salon_id());
