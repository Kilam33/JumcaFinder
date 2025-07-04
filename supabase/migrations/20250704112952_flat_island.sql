/*
  # Update Business Search to Mosque Finder

  1. Schema Changes
    - Rename `businesses` table to `mosques`
    - Update column names to be mosque-specific
    - Add second prayer time for working people
    - Update indexes and policies

  2. Data Migration
    - Convert existing business data to mosque data
    - Add realistic Jummuah prayer times
    - Include both early and late prayer times

  3. Security
    - Update RLS policies for new table structure
    - Maintain public read access
*/

-- Drop existing policies and indexes
DROP POLICY IF EXISTS "Allow public read access to businesses" ON businesses;
DROP INDEX IF EXISTS idx_businesses_location_id;
DROP INDEX IF EXISTS idx_businesses_name;

-- Rename businesses table to mosques
ALTER TABLE businesses RENAME TO mosques;

-- Update column names to be mosque-specific
ALTER TABLE mosques RENAME COLUMN opens_at TO first_prayer_time;
ALTER TABLE mosques ADD COLUMN IF NOT EXISTS second_prayer_time text;

-- Update existing data to mosque data with realistic prayer times
UPDATE mosques SET 
  name = CASE 
    WHEN name = 'Sunrise Café' THEN 'Masjid Al-Noor'
    WHEN name = 'Broadway Books' THEN 'Islamic Center of Manhattan'
    WHEN name = 'City Gym' THEN 'Masjid Al-Taqwa'
    WHEN name = 'Manhattan Market' THEN 'Al-Farooq Masjid'
    WHEN name = 'TechZone Repair' THEN 'Masjid Ar-Rahman'
    WHEN name = 'Lakeview Diner' THEN 'Islamic Foundation of Greater Chicago'
    WHEN name = 'Windy City Salon' THEN 'Masjid Al-Huda'
    WHEN name = 'Loop Fitness' THEN 'Downtown Islamic Center'
    WHEN name = 'Millennium Books' THEN 'Masjid Al-Salam'
    WHEN name = 'ChiTech Repairs' THEN 'Chicago Muslim Community Center'
    WHEN name = 'Southside Coffee' THEN 'Islamic Center of Greater Austin'
    WHEN name = 'Capitol Barbershop' THEN 'Masjid Al-Islah'
    WHEN name = 'Zilker Fitness' THEN 'Austin Area Islamic Center'
    WHEN name = 'TechHive Co-Work' THEN 'Masjid An-Noor'
    WHEN name = 'Music City Guitars' THEN 'Central Texas Islamic Society'
    ELSE name
  END,
  first_prayer_time = CASE 
    WHEN first_prayer_time = '7:00 AM' THEN '12:15 PM'
    WHEN first_prayer_time = '7:30 AM' THEN '12:30 PM'
    WHEN first_prayer_time = '8:00 AM' THEN '12:45 PM'
    WHEN first_prayer_time = '8:30 AM' THEN '1:00 PM'
    WHEN first_prayer_time = '9:00 AM' THEN '1:15 PM'
    ELSE first_prayer_time
  END,
  second_prayer_time = CASE 
    WHEN first_prayer_time = '7:00 AM' THEN '1:30 PM'
    WHEN first_prayer_time = '7:30 AM' THEN '1:45 PM'
    WHEN first_prayer_time = '8:00 AM' THEN '2:00 PM'
    WHEN first_prayer_time = '8:30 AM' THEN '2:15 PM'
    WHEN first_prayer_time = '9:00 AM' THEN '2:30 PM'
    ELSE '2:00 PM'
  END,
  address = CASE 
    WHEN address LIKE '%8th Ave%' THEN '123 8th Ave, New York, NY 10001'
    WHEN address LIKE '%Broadway%' THEN '200 Broadway, New York, NY 10001'
    WHEN address LIKE '%W 34th St%' THEN '315 W 34th St, New York, NY 10001'
    WHEN address LIKE '%9th Ave%' THEN '456 9th Ave, New York, NY 10001'
    WHEN address LIKE '%10th Ave%' THEN '789 10th Ave, New York, NY 10001'
    WHEN address LIKE '%Lakeshore Dr%' THEN '123 Lakeshore Dr, Chicago, IL 60601'
    WHEN address LIKE '%Wacker Dr%' THEN '456 Wacker Dr, Chicago, IL 60601'
    WHEN address LIKE '%Michigan Ave%' THEN '789 Michigan Ave, Chicago, IL 60601'
    WHEN address LIKE '%State St%' THEN '101 State St, Chicago, IL 60601'
    WHEN address LIKE '%Columbus Dr%' THEN '202 Columbus Dr, Chicago, IL 60601'
    WHEN address LIKE '%Barton Springs%' THEN '101 Barton Springs Rd, Austin, TX 73301'
    WHEN address LIKE '%Congress Ave%' THEN '202 Congress Ave, Austin, TX 73301'
    WHEN address LIKE '%Riverside Dr%' THEN '303 Riverside Dr, Austin, TX 73301'
    WHEN address LIKE '%Lamar Blvd%' THEN '404 Lamar Blvd, Austin, TX 73301'
    WHEN address LIKE '%6th St%' THEN '505 6th St, Austin, TX 73301'
    ELSE address
  END;

-- Create new indexes for mosques table
CREATE INDEX IF NOT EXISTS idx_mosques_location_id ON mosques(location_id);
CREATE INDEX IF NOT EXISTS idx_mosques_name ON mosques USING gin(to_tsvector('english', name));

-- Create new RLS policy for mosques
CREATE POLICY "Allow public read access to mosques"
  ON mosques
  FOR SELECT
  TO anon, authenticated
  USING (true);