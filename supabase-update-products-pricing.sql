-- =====================================================
-- SUPABASE PRODUCTS TABLE UPDATE SCRIPT
-- Update products with correct pricing, packs, and details
-- =====================================================

-- First, let's add missing columns if they don't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS pack_size VARCHAR(50) DEFAULT '100g',
ADD COLUMN IF NOT EXISTS mrp DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS discount_percent INTEGER,
ADD COLUMN IF NOT EXISTS pack_options JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS brewing_instructions JSONB,
ADD COLUMN IF NOT EXISTS ingredients JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;

-- =====================================================
-- 1. BUTTERFLY PEA FLOWER BLUE TEA
-- =====================================================
UPDATE products
SET 
  pack_size = '100g',
  price = 349,
  mrp = 390,
  discount_percent = 10,
  pack_options = '[
    {"packs": 1, "price": 349, "mrp": 390, "discount": "10% OFF"},
    {"packs": 2, "price": 660, "mrp": 698, "discount": "5% OFF", "savings": 38},
    {"packs": 3, "price": 960, "mrp": 1047, "discount": "8% OFF", "savings": 87},
    {"packs": 4, "price": 1230, "mrp": 1396, "discount": "12% OFF", "savings": 166}
  ]'::jsonb,
  description = 'Discover the magic of our Butterfly Pea Flower Blue Tea, a caffeine-free herbal infusion known for its vivid sapphire hue and antioxidant benefits. Add a squeeze of lemon and watch it turn a royal purple. Perfect for mindful moments, relaxation, and Instagram-worthy brews—served hot or iced.',
  brewing_instructions = '{
    "temperature": "90°C",
    "leaf_amount": "1 tsp (2-3g) per 200ml cup",
    "steep_time": "4-6 minutes",
    "steps": [
      {"step": 1, "title": "Boil Water", "description": "Use fresh, filtered water at 90°C"},
      {"step": 2, "title": "Add Tea", "description": "1 tsp (2-3g) per 200ml cup"},
      {"step": 3, "title": "Steep Time", "description": "4-6 minutes (For iced tea, brew double-strength and pour over ice)"},
      {"step": 4, "title": "Enjoy", "description": "Sip plain, or add lemon to turn the tea purple. Honey optional."}
    ],
    "notes": [
      "Always use fresh, filtered water (not repeatedly boiled)",
      "Adjust leaf quantity to taste: stronger brew = more leaves, not longer steep",
      "Store tea in a cool, dry place away from light and moisture"
    ]
  }'::jsonb,
  ingredients = '[
    {"name": "Butterfly Pea Flower", "description": "Natural caffeine-free petals, rich in antioxidants", "icon": "flower"}
  ]'::jsonb,
  faqs = '[
    {"question": "Does this tea contain caffeine?", "answer": "No, it is 100% caffeine-free."},
    {"question": "Why does the tea change color?", "answer": "The natural anthocyanins in butterfly pea flower turn purple when you add lemon."},
    {"question": "Can I drink it daily?", "answer": "Yes, it is safe and soothing for everyday use."},
    {"question": "How does it taste?", "answer": "Earthy and mild; best enjoyed with lemon and honey."},
    {"question": "What are the health benefits?", "answer": "Rich in antioxidants that may support skin, hair, and eye health, and promote relaxation."}
  ]'::jsonb,
  caffeine_level = 'Caffeine-Free',
  collections = ARRAY['Herbal Tea', 'Wellness Tea']::text[]
WHERE slug = 'butterfly-pea-flower-blue-tea' OR name ILIKE '%butterfly%pea%';

-- =====================================================
-- 2. HIBISCUS ROSE GREEN TEA
-- =====================================================
UPDATE products
SET 
  pack_size = '100g',
  price = 329,
  mrp = 360,
  discount_percent = 9,
  pack_options = '[
    {"packs": 1, "price": 329, "mrp": 360, "discount": "9% OFF"},
    {"packs": 2, "price": 625, "mrp": 658, "discount": "5% OFF", "savings": 33},
    {"packs": 3, "price": 905, "mrp": 987, "discount": "8% OFF", "savings": 82},
    {"packs": 4, "price": 1155, "mrp": 1316, "discount": "12% OFF", "savings": 161}
  ]'::jsonb,
  description = 'Our Hibiscus Rose Green Tea blends with hibiscus, rose, chamomile, and gentle spices. The result is a fragrant, floral brew with a crisp green finish that is as refreshing as it is soothing. A wellness cup perfect for daily balance, hydration, and digestion.',
  brewing_instructions = '{
    "temperature": "75-80°C (not boiling)",
    "leaf_amount": "1 tsp (2g) per 200ml cup",
    "steep_time": "2-3 minutes",
    "steps": [
      {"step": 1, "title": "Boil Water", "description": "Use fresh, filtered water at 75-80°C (not boiling)"},
      {"step": 2, "title": "Add Tea", "description": "1 tsp (2g) per 200ml cup"},
      {"step": 3, "title": "Steep Time", "description": "2-3 minutes (Do not over-steep to avoid bitterness)"},
      {"step": 4, "title": "Enjoy", "description": "Sip neat for floral freshness, or sweeten lightly if desired."}
    ],
    "notes": [
      "Always use fresh, filtered water (not repeatedly boiled)",
      "Adjust leaf quantity to taste: stronger brew = more leaves, not longer steep",
      "Store tea in a cool, dry place away from light and moisture"
    ]
  }'::jsonb,
  ingredients = '[
    {"name": "Green Tea", "description": "Whole-leaf Darjeeling green tea, fresh and crisp", "icon": "leaf"},
    {"name": "Hibiscus", "description": "Tart floral petals for a vibrant flavor", "icon": "flower"},
    {"name": "Rose", "description": "Fragrant rose petals for floral sweetness", "icon": "flower"},
    {"name": "Chamomile", "description": "Calming blossoms with gentle apple-like notes", "icon": "flower"},
    {"name": "Blue Cornflower", "description": "Adds light floral elegance", "icon": "flower"},
    {"name": "Fennel Seed", "description": "Sweet-spicy seeds aiding digestion", "icon": "seed"},
    {"name": "Cardamom", "description": "Aromatic pods with warming spice", "icon": "spice"},
    {"name": "Star Anise", "description": "Licorice-like spice for depth", "icon": "spice"}
  ]'::jsonb,
  faqs = '[
    {"question": "Does this tea taste floral or strong?", "answer": "It is a light, floral tea with a crisp green finish."},
    {"question": "Can I add sugar or honey?", "answer": "Yes, but best enjoyed lightly sweetened."},
    {"question": "Does it contain caffeine?", "answer": "Yes, it has mild caffeine from green tea."},
    {"question": "What are the wellness benefits?", "answer": "Hibiscus and fennel support digestion, while chamomile helps relaxation."}
  ]'::jsonb,
  caffeine_level = 'Low',
  collections = ARRAY['Green Tea', 'Floral Tea', 'Wellness Tea']::text[],
  flavors = ARRAY['Floral', 'Crisp', 'Refreshing']::text[]
WHERE slug = 'hibiscus-rose-green-tea' OR name ILIKE '%hibiscus%rose%';

-- =====================================================
-- 3. ASHWAGANDHA VITALITY WHITE TEA
-- =====================================================
UPDATE products
SET 
  pack_size = '100g',
  price = 349,
  mrp = 390,
  discount_percent = 10,
  pack_options = '[
    {"packs": 1, "price": 349, "mrp": 390, "discount": "10% OFF"},
    {"packs": 2, "price": 660, "mrp": 698, "discount": "5% OFF", "savings": 38},
    {"packs": 3, "price": 960, "mrp": 1047, "discount": "8% OFF", "savings": 87},
    {"packs": 4, "price": 1230, "mrp": 1396, "discount": "12% OFF", "savings": 166}
  ]'::jsonb,
  description = 'Our Ashwagandha Vitality White Tea combines with Ayurvedic superfoods like turmeric, ashwagandha, ginger, and lemongrass. Low in caffeine yet rich in antioxidants, this golden cup supports immunity, reduces stress, and brings balance to your day.',
  brewing_instructions = '{
    "temperature": "85-90°C",
    "leaf_amount": "1 tsp (2-2.5g) per 200ml cup",
    "steep_time": "4-5 minutes",
    "steps": [
      {"step": 1, "title": "Boil Water", "description": "Use fresh, filtered water at 85-90°C"},
      {"step": 2, "title": "Add Tea", "description": "1 tsp (2-2.5g) per 200ml cup"},
      {"step": 3, "title": "Steep Time", "description": "4-5 minutes"},
      {"step": 4, "title": "Enjoy", "description": "Sip plain to enjoy the golden flavor of white tea with herbs. Optionally, add honey."}
    ],
    "notes": [
      "Always use fresh, filtered water (not repeatedly boiled)",
      "Adjust leaf quantity to taste: stronger brew = more leaves, not longer steep",
      "Store tea in a cool, dry place away from light and moisture"
    ]
  }'::jsonb,
  ingredients = '[
    {"name": "White Tea", "description": "Delicate low-caffeine leaves, smooth and light", "icon": "leaf"},
    {"name": "Turmeric", "description": "Golden spice with anti-inflammatory properties", "icon": "spice"},
    {"name": "Ashwagandha", "description": "Ancient adaptogen supporting stress relief", "icon": "herb"},
    {"name": "Black Pepper", "description": "Enhances absorption of turmeric", "icon": "spice"},
    {"name": "Ginger", "description": "Warming root aiding digestion", "icon": "root"},
    {"name": "Lemongrass", "description": "Citrusy herb for a refreshing finish", "icon": "herb"}
  ]'::jsonb,
  faqs = '[
    {"question": "What makes this tea special?", "answer": "It blends delicate white tea with Ayurvedic herbs like turmeric and ashwagandha."},
    {"question": "Does it have caffeine?", "answer": "Yes, but very low compared to green or black tea."},
    {"question": "Can I re-steep the leaves?", "answer": "Yes, you can steep the leaves 1-2 times for a lighter flavor."},
    {"question": "What are the health benefits?", "answer": "Turmeric and ginger aid immunity, while ashwagandha supports stress relief."}
  ]'::jsonb,
  caffeine_level = 'Very Low',
  collections = ARRAY['White Tea', 'Ayurvedic Tea', 'Wellness Tea']::text[],
  flavors = ARRAY['Golden', 'Herbal', 'Warming']::text[]
WHERE slug = 'ashwagandha-vitality-white-tea' OR name ILIKE '%ashwagandha%';

-- =====================================================
-- 4. MUSCATEL GOLD DARJEELING BLACK TEA
-- =====================================================
UPDATE products
SET 
  pack_size = '100g',
  price = 299,
  mrp = 330,
  discount_percent = 9,
  pack_options = '[
    {"packs": 1, "price": 299, "mrp": 330, "discount": "9% OFF"},
    {"packs": 2, "price": 570, "mrp": 598, "discount": "5% OFF", "savings": 28},
    {"packs": 3, "price": 825, "mrp": 897, "discount": "8% OFF", "savings": 72},
    {"packs": 4, "price": 1050, "mrp": 1196, "discount": "12% OFF", "savings": 146}
  ]'::jsonb,
  description = 'Savor the rare Muscatel Golden Darjeeling Black Tea, handpicked from prized AV2 bushes in Rohini. Known for its honey-muscatel notes, this single-origin Darjeeling delivers a bright, nuanced cup with a sweet lingering finish. A true connoisseur''s choice and a classic from the Himalayas.',
  brewing_instructions = '{
    "temperature": "85-90°C",
    "leaf_amount": "1 tsp (2g) per 200ml cup",
    "steep_time": "4-5 minutes",
    "steps": [
      {"step": 1, "title": "Boil Water", "description": "Use fresh, filtered water at 85-90°C"},
      {"step": 2, "title": "Add Tea", "description": "1 tsp (2g) per 200ml cup"},
      {"step": 3, "title": "Steep Time", "description": "4-5 minutes"},
      {"step": 4, "title": "Enjoy", "description": "Best served plain to preserve the muscatel notes. Optional: add a hint of honey."}
    ],
    "notes": [
      "Always use fresh, filtered water (not repeatedly boiled)",
      "Adjust leaf quantity to taste: stronger brew = more leaves, not longer steep",
      "Store tea in a cool, dry place away from light and moisture"
    ]
  }'::jsonb,
  ingredients = '[
    {"name": "Darjeeling Black Tea (AV2)", "description": "Premium AV2 bushes, honey-muscatel flavor", "icon": "leaf"}
  ]'::jsonb,
  faqs = '[
    {"question": "What does muscatel mean?", "answer": "It refers to the natural honey-muscatel flavor unique to Darjeeling AV2 bushes."},
    {"question": "Can I add milk to this tea?", "answer": "Not recommended, as it masks the delicate muscatel notes."},
    {"question": "How is it different from normal black tea?", "answer": "It has a bright, nuanced cup with a sweet lingering finish."},
    {"question": "Does it contain caffeine?", "answer": "Yes, moderate caffeine similar to most black teas."},
    {"question": "What are the health benefits?", "answer": "Darjeeling black tea is rich in antioxidants that support heart health, digestion, and focus."}
  ]'::jsonb,
  caffeine_level = 'Medium',
  collections = ARRAY['Black Tea', 'Darjeeling Tea', 'Premium Tea']::text[],
  flavors = ARRAY['Muscatel', 'Honey', 'Sweet']::text[],
  origin_country = 'India'
WHERE slug = 'muscatel-gold-darjeeling-black-tea' OR name ILIKE '%muscatel%';

-- =====================================================
-- 5. AYURVEDIC MASALA CHAI WITH PREMIUM CTC
-- =====================================================
UPDATE products
SET 
  pack_size = '100g',
  price = 149,
  mrp = 160,
  discount_percent = 7,
  pack_options = '[
    {"packs": 1, "price": 149, "mrp": 160, "discount": "7% OFF"},
    {"packs": 2, "price": 285, "mrp": 298, "discount": "5% OFF", "savings": 13},
    {"packs": 3, "price": 410, "mrp": 447, "discount": "8% OFF", "savings": 37},
    {"packs": 4, "price": 525, "mrp": 596, "discount": "12% OFF", "savings": 71}
  ]'::jsonb,
  description = 'Experience the bold comfort of Ayurvedic Masala Chai Premium CTC, crafted with robust Dooars CTC black tea and enriched with ashwagandha, tulsi, mulethi, ginger, and cardamom. A daily Ayurveda-inspired cup that is bold, aromatic, and perfect for mornings or cozy evenings.',
  brewing_instructions = '{
    "temperature": "95-100°C (bring to boil)",
    "leaf_amount": "2 tsp (4-5g) per 200ml water. With Milk: Add equal parts milk & water (1:1 ratio)",
    "steep_time": "Simmer 2-3 min, then cover for 1 min",
    "steps": [
      {"step": 1, "title": "Boil Water", "description": "Use fresh water and bring to boil (95-100°C)"},
      {"step": 2, "title": "Add Tea", "description": "2 tsp (4-5g) per 200ml water. With Milk: Add equal parts milk & water (1:1 ratio)"},
      {"step": 3, "title": "Steep Time", "description": "Simmer 2-3 min, then cover for 1 min"},
      {"step": 4, "title": "Enjoy", "description": "Strain and serve hot. Sweeten to taste. Bold and aromatic — perfect with milk."}
    ],
    "notes": [
      "Always use fresh, filtered water (not repeatedly boiled)",
      "Adjust leaf quantity to taste: stronger brew = more leaves, not longer steep",
      "Store tea in a cool, dry place away from light and moisture"
    ]
  }'::jsonb,
  ingredients = '[
    {"name": "CTC Black Tea", "description": "Strong Assam/Dooars CTC base for a bold cup", "icon": "leaf"},
    {"name": "Ashwagandha", "description": "Ayurvedic root that supports vitality", "icon": "herb"},
    {"name": "Tulsi (Holy Basil)", "description": "Sacred herb known for immunity", "icon": "herb"},
    {"name": "Mulethi (Licorice Root)", "description": "Natural sweetness, soothes the throat", "icon": "root"},
    {"name": "Ginger", "description": "Warm, spicy root boosting digestion", "icon": "root"},
    {"name": "Cardamom", "description": "Aromatic pods with sweet-spicy notes", "icon": "spice"}
  ]'::jsonb,
  faqs = '[
    {"question": "Is this a traditional masala chai?", "answer": "Yes, enriched with Ayurvedic herbs like tulsi, mulethi, and ashwagandha."},
    {"question": "Can it be brewed without milk?", "answer": "Yes, but it is richer and bolder when brewed with milk."},
    {"question": "How strong is the flavor?", "answer": "It is robust, aromatic, and perfect for mornings."},
    {"question": "What are the health benefits?", "answer": "Tulsi and mulethi boost immunity, while ginger soothes digestion."}
  ]'::jsonb,
  caffeine_level = 'High',
  collections = ARRAY['Masala Chai', 'Ayurvedic Tea', 'Black Tea']::text[],
  flavors = ARRAY['Bold', 'Spicy', 'Aromatic']::text[]
WHERE slug = 'ayurvedic-masala-chai-with-premium-ctc' OR name ILIKE '%masala%chai%' OR name ILIKE '%premium%ctc%';

-- =====================================================
-- 6. PREMIUM SPRING DARJEELING GREEN TEA
-- =====================================================
UPDATE products
SET 
  pack_size = '100g',
  price = 299,
  mrp = 330,
  discount_percent = 9,
  pack_options = '[
    {"packs": 1, "price": 299, "mrp": 330, "discount": "9% OFF"},
    {"packs": 2, "price": 570, "mrp": 598, "discount": "5% OFF", "savings": 28},
    {"packs": 3, "price": 825, "mrp": 897, "discount": "8% OFF", "savings": 72},
    {"packs": 4, "price": 1050, "mrp": 1196, "discount": "12% OFF", "savings": 146}
  ]'::jsonb,
  description = 'Refresh your senses with Premium Spring Green Tea, harvested from Darjeeling''s early spring flush. This FTGFOP1 grade green tea offers a smooth, grassy cup with sweet vegetal notes, capturing the pure Himalayan terroir in every sip. Ideal for boosting energy and metabolism naturally.',
  brewing_instructions = '{
    "temperature": "75-80°C (not boiling)",
    "leaf_amount": "1 tsp (2g) per 200ml cup",
    "steep_time": "2-3 minutes",
    "steps": [
      {"step": 1, "title": "Boil Water", "description": "Use fresh, filtered water at 75-80°C (not boiling)"},
      {"step": 2, "title": "Add Tea", "description": "1 tsp (2g) per 200ml cup"},
      {"step": 3, "title": "Steep Time", "description": "2-3 minutes"},
      {"step": 4, "title": "Enjoy", "description": "Sip plain for a smooth, grassy taste. Optionally, add honey or lemon."}
    ],
    "notes": [
      "Always use fresh, filtered water (not repeatedly boiled)",
      "Adjust leaf quantity to taste: stronger brew = more leaves, not longer steep",
      "Store tea in a cool, dry place away from light and moisture"
    ]
  }'::jsonb,
  ingredients = '[
    {"name": "Darjeeling Green Tea (FTGFOP1)", "description": "Early spring flush leaves, smooth and grassy", "icon": "leaf"}
  ]'::jsonb,
  faqs = '[
    {"question": "Is this tea bitter?", "answer": "Not if brewed at 75-80°C for 2-3 minutes."},
    {"question": "Can I add lemon or honey?", "answer": "Yes, both enhance the flavor beautifully."},
    {"question": "Does it have caffeine?", "answer": "Yes, mild to medium caffeine, perfect for a refreshing lift."},
    {"question": "What makes this tea unique?", "answer": "It is harvested from Darjeeling''s spring flush, giving a smooth grassy flavor with sweet vegetal notes."},
    {"question": "What are the health benefits?", "answer": "Green tea is known to boost metabolism, aid weight management, and provide antioxidants for overall wellness."}
  ]'::jsonb,
  caffeine_level = 'Medium',
  collections = ARRAY['Green Tea', 'Darjeeling Tea', 'Premium Tea']::text[],
  flavors = ARRAY['Grassy', 'Smooth', 'Vegetal']::text[],
  origin_country = 'India'
WHERE slug = 'premium-spring-darjeeling-green-tea' OR name ILIKE '%spring%green%';

-- =====================================================
-- VERIFY THE UPDATES
-- =====================================================
-- Run this to check the updated products
SELECT 
  id,
  name,
  slug,
  price,
  mrp,
  discount_percent,
  pack_size,
  caffeine_level,
  SUBSTRING(description, 1, 50) as description_preview
FROM products
WHERE slug IN (
  'butterfly-pea-flower-blue-tea',
  'hibiscus-rose-green-tea',
  'ashwagandha-vitality-white-tea',
  'muscatel-gold-darjeeling-black-tea',
  'ayurvedic-masala-chai-with-premium-ctc',
  'premium-spring-darjeeling-green-tea'
)
ORDER BY price DESC;
