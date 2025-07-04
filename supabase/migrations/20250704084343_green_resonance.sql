/*
  # Business Search Database Schema

  1. New Tables
    - `locations`
      - `id` (uuid, primary key)
      - `zip_code` (text, unique)
      - `city` (text)
      - `state` (text)
      - `created_at` (timestamp)
    
    - `businesses`
      - `id` (uuid, primary key)
      - `location_id` (uuid, foreign key)
      - `name` (text)
      - `opens_at` (text)
      - `address` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (since this is a search app)
*/

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zip_code text UNIQUE NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  name text NOT NULL,
  opens_at text NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to locations"
  ON locations
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to businesses"
  ON businesses
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_locations_zip_code ON locations(zip_code);
CREATE INDEX IF NOT EXISTS idx_businesses_location_id ON businesses(location_id);
CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses USING gin(to_tsvector('english', name));

-- Insert sample data
INSERT INTO locations (zip_code, city, state) VALUES
  ('10001', 'New York', 'NY'),
  ('60601', 'Chicago', 'IL'),
  ('73301', 'Austin', 'TX')
ON CONFLICT (zip_code) DO NOTHING;

-- Insert businesses
WITH location_data AS (
  SELECT id, zip_code FROM locations WHERE zip_code IN ('10001', '60601', '73301')
)
INSERT INTO businesses (location_id, name, opens_at, address)
SELECT 
  l.id,
  b.name,
  b.opens_at,
  b.address
FROM location_data l
CROSS JOIN (
  VALUES 
    -- New York businesses
    ('10001', 'Sunrise Café', '7:00 AM', '123 8th Ave, New York, NY 10001'),
    ('10001', 'Broadway Books', '7:30 AM', '200 Broadway, New York, NY 10001'),
    ('10001', 'City Gym', '8:00 AM', '315 W 34th St, New York, NY 10001'),
    ('10001', 'Manhattan Market', '8:30 AM', '456 9th Ave, New York, NY 10001'),
    ('10001', 'TechZone Repair', '9:00 AM', '789 10th Ave, New York, NY 10001'),
    -- Chicago businesses
    ('60601', 'Lakeview Diner', '7:00 AM', '123 Lakeshore Dr, Chicago, IL 60601'),
    ('60601', 'Windy City Salon', '7:30 AM', '456 Wacker Dr, Chicago, IL 60601'),
    ('60601', 'Loop Fitness', '8:00 AM', '789 Michigan Ave, Chicago, IL 60601'),
    ('60601', 'Millennium Books', '8:30 AM', '101 State St, Chicago, IL 60601'),
    ('60601', 'ChiTech Repairs', '9:00 AM', '202 Columbus Dr, Chicago, IL 60601'),
    -- Austin businesses
    ('73301', 'Southside Coffee', '7:00 AM', '101 Barton Springs Rd, Austin, TX 73301'),
    ('73301', 'Capitol Barbershop', '7:30 AM', '202 Congress Ave, Austin, TX 73301'),
    ('73301', 'Zilker Fitness', '8:00 AM', '303 Riverside Dr, Austin, TX 73301'),
    ('73301', 'TechHive Co-Work', '8:30 AM', '404 Lamar Blvd, Austin, TX 73301'),
    ('73301', 'Music City Guitars', '9:00 AM', '505 6th St, Austin, TX 73301')
) AS b(zip_code, name, opens_at, address)
WHERE l.zip_code = b.zip_code
ON CONFLICT DO NOTHING;