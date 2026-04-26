-- BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  salon_id    UUID REFERENCES salons(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  image_url   TEXT,
  slug        TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  UNIQUE(salon_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_salon ON blog_posts(salon_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(salon_id, slug);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' AND policyname = 'Owner manages blog posts'
    ) THEN
        CREATE POLICY "Owner manages blog posts"
          ON blog_posts FOR ALL TO authenticated
          USING (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()))
          WITH CHECK (salon_id IN (SELECT id FROM salons WHERE owner_id = auth.uid()));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' AND policyname = 'Public can view published blog posts'
    ) THEN
        CREATE POLICY "Public can view published blog posts"
          ON blog_posts FOR SELECT TO anon, authenticated
          USING (is_published = TRUE);
    END IF;
END $$;
