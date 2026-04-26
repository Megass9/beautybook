-- CAMPAIGNS
CREATE TABLE IF NOT EXISTS campaigns (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  salon_id        UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  discount_type   TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value  NUMERIC NOT NULL,
  start_date      TIMESTAMPTZ NOT NULL,
  end_date        TIMESTAMPTZ NOT NULL,
  code            TEXT,
  is_active       BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_campaigns_salon ON campaigns(salon_id);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'campaigns' AND policyname = 'Owner manages campaigns'
    ) THEN
        CREATE POLICY "Owner manages campaigns"
          ON campaigns FOR ALL TO authenticated
          USING (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()))
          WITH CHECK (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'campaigns' AND policyname = 'Public can view campaigns'
    ) THEN
        CREATE POLICY "Public can view campaigns"
          ON campaigns FOR SELECT TO anon, authenticated
          USING (is_active = TRUE);
    END IF;
END $$;
