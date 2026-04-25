-- Seed service categories for HomeLink
-- Run this file to populate the service_categories table with initial data

INSERT INTO service_categories (name, description, icon_url, is_active) VALUES
('Electrical', 'Electrical repairs, wiring, lighting installation and electrical maintenance', '/icons/electrical.svg', TRUE),
('Painting', 'Interior and exterior painting, wallpaper installation and removal', '/icons/painting.svg', TRUE),
('Landscaping', 'Lawn care, gardening, tree trimming and outdoor maintenance', '/icons/landscaping.svg', TRUE),
('Cleaning', 'House cleaning, deep cleaning, move-in/out cleaning services', '/icons/cleaning.svg', TRUE),
('Carpentry', 'Woodwork, furniture repair, custom builds and carpentry services', '/icons/carpentry.svg', TRUE),
('HVAC', 'Heating, ventilation, air conditioning repair and installation', '/icons/hvac.svg', TRUE),
('Roofing', 'Roof repair, installation, maintenance and gutter cleaning', '/icons/roofing.svg', TRUE),
('Handyman', 'General repairs, assembly, minor fixes and home maintenance', '/icons/handyman.svg', TRUE),
('Masonry', 'Brickwork, stonework, concrete work and masonry services', '/icons/masonry.svg', TRUE);

-- To run this file:
-- 1. Open MySQL Workbench or command line
-- 2. Connect to database
-- 3. Run: source database/seed-categories.sql
-- Or in MySQL Workbench, use File > Run SQL Script