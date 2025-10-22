-- SQL Script to Update Product Collections, Flavors, and Qualities
-- This script updates the metadata for all products in the database

-- Product 1: Butterfly Pea Flower Blue Tea
UPDATE products
SET 
  collections = ARRAY['Herbal Teas']::text[],
  flavors = ARRAY['Floral', 'Smooth']::text[],
  qualities = ARRAY['Detox', 'Relax', 'Stress Relief']::text[]
WHERE id = 1;

-- Product 2: Hibiscus Rose Green Tea
UPDATE products
SET 
  collections = ARRAY['Green Teas']::text[],
  flavors = ARRAY['Sweet', 'Fruity', 'Floral', 'Citrus']::text[],
  qualities = ARRAY['Relax', 'Digestion']::text[]
WHERE id = 2;

-- Product 3: Ashwagandha Vitality White Tea
UPDATE products
SET 
  collections = ARRAY['White Teas']::text[],
  flavors = ARRAY['Spicy', 'Smooth', 'Citrus', 'Floral']::text[],
  qualities = ARRAY['Relax', 'Digestion', 'Immunity', 'Stress Relief']::text[]
WHERE id = 3;

-- Product 4: Muscatel Golden Darjeeling Black Tea
UPDATE products
SET 
  collections = ARRAY['Black Teas']::text[],
  flavors = ARRAY['Sweet', 'Floral', 'Smooth']::text[],
  qualities = ARRAY['Energy', 'Immunity']::text[]
WHERE id = 4;

-- Product 5: Ayurvedic Masala Chai Premium CTC
UPDATE products
SET 
  collections = ARRAY['Black Teas']::text[],
  flavors = ARRAY['Spicy', 'Sweet', 'Bold']::text[],
  qualities = ARRAY['Energy', 'Digestion', 'Immunity']::text[]
WHERE id = 5;

-- Product 6: Premium Spring Green Tea
UPDATE products
SET 
  collections = ARRAY['Green Teas']::text[],
  flavors = ARRAY['Grassy', 'Smooth', 'Citrus']::text[],
  qualities = ARRAY['Detox', 'Energy']::text[]
WHERE id = 6;

-- Verify the updates
SELECT 
  id,
  name,
  collections,
  flavors,
  qualities
FROM products
ORDER BY id;
