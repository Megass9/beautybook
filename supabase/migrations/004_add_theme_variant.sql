-- Add theme fields for mini site appearance
ALTER TABLE salons
  ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#e11d48',
  ADD COLUMN IF NOT EXISTS theme_variant TEXT DEFAULT 'elegantDark';

-- Backfill for existing rows
UPDATE salons
SET
  theme_color = COALESCE(theme_color, '#e11d48'),
  theme_variant = COALESCE(theme_variant, 'elegantDark');
