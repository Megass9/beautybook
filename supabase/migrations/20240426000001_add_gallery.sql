-- GALLERY ITEMS
CREATE TABLE IF NOT EXISTS gallery_items (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  salon_id    UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  image_url   TEXT NOT NULL,
  title       TEXT,
  category    TEXT
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_salon ON gallery_items(salon_id);

-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'gallery_items' AND policyname = 'Owner manages gallery items'
    ) THEN
        CREATE POLICY "Owner manages gallery items"
          ON gallery_items FOR ALL TO authenticated
          USING (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()))
          WITH CHECK (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'gallery_items' AND policyname = 'Public can view gallery items'
    ) THEN
        CREATE POLICY "Public can view gallery items"
          ON gallery_items FOR SELECT TO anon, authenticated
          USING (true);
    END IF;
END $$;
