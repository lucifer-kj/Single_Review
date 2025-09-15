-- Single-business refactor: introduce app_settings singleton and remove business scoping

-- Create a singleton settings table to hold business details for the app
CREATE TABLE IF NOT EXISTS app_settings (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE, -- enforce single row by using a constant primary key
  name VARCHAR(100) NOT NULL DEFAULT 'My Business',
  description TEXT,
  logo_url TEXT,
  google_business_url TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  website TEXT,
  brand_color VARCHAR(7) DEFAULT '#000000',
  welcome_message TEXT DEFAULT 'Welcome! Please share your experience with us.',
  thank_you_message TEXT DEFAULT 'Thank you for your feedback!',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure there is exactly one row
INSERT INTO app_settings (id)
SELECT TRUE
WHERE NOT EXISTS (SELECT 1 FROM app_settings);

-- Trigger to update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_app_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Reviews are now global (single business), drop business_id if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'business_id'
  ) THEN
    ALTER TABLE reviews DROP COLUMN business_id;
  END IF;
END $$;

-- Analytics is global; drop business_id if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'analytics' AND column_name = 'business_id'
  ) THEN
    ALTER TABLE analytics DROP COLUMN business_id;
  END IF;
END $$;

-- Link tracking no longer scoped by business; drop foreign key if exists
DO $$
BEGIN
  IF to_regclass('public.link_tracking') IS NOT NULL THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'link_tracking' AND column_name = 'business_id'
    ) THEN
      ALTER TABLE link_tracking DROP COLUMN business_id;
    END IF;
  END IF;
END $$;

-- Optionally keep the old businesses table for historical reference, but it is no longer used.
-- You can drop it if desired:
-- DROP TABLE IF EXISTS businesses CASCADE;

