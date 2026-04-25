-- Add estimated price range columns to service_categories table
-- This allows us to show price expectations on the browse services page

ALTER TABLE service_categories 
ADD COLUMN estimated_price_min DECIMAL(10,2) DEFAULT 0,
ADD COLUMN estimated_price_max DECIMAL(10,2) DEFAULT 0;

-- Seed estimated price data for each service category
-- These are typical price ranges for common home services

UPDATE service_categories SET estimated_price_min = 75, estimated_price_max = 200 WHERE name = 'Plumbing';
UPDATE service_categories SET estimated_price_min = 80, estimated_price_max = 250 WHERE name = 'Electrical';
UPDATE service_categories SET estimated_price_min = 100, estimated_price_max = 300 WHERE name = 'Painting';
UPDATE service_categories SET estimated_price_min = 50, estimated_price_max = 150 WHERE name = 'Landscaping';
UPDATE service_categories SET estimated_price_min = 60, estimated_price_max = 180 WHERE name = 'Cleaning';
UPDATE service_categories SET estimated_price_min = 90, estimated_price_max = 250 WHERE name = 'Carpentry';
UPDATE service_categories SET estimated_price_min = 100, estimated_price_max = 350 WHERE name = 'HVAC';
UPDATE service_categories SET estimated_price_min = 150, estimated_price_max = 500 WHERE name = 'Roofing';
UPDATE service_categories SET estimated_price_min = 40, estimated_price_max = 120 WHERE name = 'Handyman';
UPDATE service_categories SET estimated_price_min = 200, estimated_price_max = 600 WHERE name = 'Masonry';

-- To run this file:
-- 1. Open MySQL Workbench
-- 2. Connect to your homelink_db database
-- 3. File > Run SQL Script > Select this file
-- Or run: mysql -u root -p homelink_db < database/add-price-ranges.sql