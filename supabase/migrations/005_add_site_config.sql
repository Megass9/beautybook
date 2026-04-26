-- Add site_config JSONB column for builder
ALTER TABLE salons
  ADD COLUMN IF NOT EXISTS site_config JSONB DEFAULT '{"sections": [], "globalConfig": {}}'::jsonb;

-- Backfill for existing rows
UPDATE salons
SET site_config = '{"sections": [], "globalConfig": {}}'::jsonb
WHERE site_config IS NULL;