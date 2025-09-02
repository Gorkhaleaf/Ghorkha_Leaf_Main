-- supabase-seed-products.sql
BEGIN;

INSERT INTO products (id, name, slug, subname, description, price, image, main_image, created_at)
VALUES
(1, 'Heritage Bloom', 'heritage-bloom', 'SFT4FOP – Premium Darjeeling Whole Leaf', 'A delicately handpicked tea from the misty slopes of Darjeeling, featuring golden tips and full-bodied aroma.', 749, '/Products/1756812906455-02_Heritage_Bloom.png', '/Products/1756812906455-02_Heritage_Bloom.png', now()),
(2, 'Kurseong Gold ++', 'kurseong-gold', 'SF-KD – Second Flush Darjeeling', 'Harvested during Darjeeling''s famed second flush, offering a smooth, amber liquor with hints of stone fruit.', 749, '/Products/03 Kurseong Gold.png', '/Products/03 Kurseong Gold.png', now()),
(3, 'Hearth Roasted', 'hearth-roasted-reserve', 'SF Roasted', 'A bold, toasty twist on traditional Darjeeling with smoky, earthy notes.', 749, '/Products/04 Hearth Roasted.png', '/Products/04 Hearth Roasted.png', now()),
(4, 'Whispering Peaks', 'whispering-peaks', 'SFT4FOP – KBD Batch', 'From a rare micro-lot; limited edition high-altitude Darjeeling.', 749, '/Products/05 Whispering Peaks.png', '/Products/05 Whispering Peaks.png', now()),
(5, 'Mother''s Garden', 'mothers-garden', 'First Flush Classic', 'The first tender leaves of spring, plucked with care from Darjeeling''s lush slopes.', 749, '/Products/06 Mother_s Garden.png', '/Products/06 Mother_s Garden.png', now()),
(6, 'The Warrior''s Wakeup', 'the-warriors-wakeup', 'Muscatel Wonder', 'Bold second flush rich in muscatel character with ripe fruit and honeyed warmth.', 749, '/Products/07 Warrior_s Wakeup.png', '/Products/07 Warrior_s Wakeup.png', now()),
(7, 'Dawn of the Hills', 'dawn-of-the-hills', 'Green Gold', 'Harvested from young green leaves at dawn; crisp and refreshing.', 749, '/Products/08 Dawn of The Hills.png', '/Products/08 Dawn of The Hills.png', now()),
(8, 'Heritage Harvest', 'heritage-harvest', 'AV2 Honey Muscatel', 'Crafted from the prized AV2 clone, offering honey and floral notes.', 749, '/Products/09 Heritage Harvest.png', '/Products/09 Heritage Harvest.png', now()),
(9, 'Whispering Jasmine', 'whispering-jasmine', 'Jasmine Green', 'A calming blend of green tea and jasmine blossoms.', 749, '/Products/10 Whispering Jasmine.png', '/Products/10 Whispering Jasmine.png', now()),
(10, 'Himalayan Zest', 'himalayan-zest', 'Lemongrass Green', 'A spirited fusion of green tea and Himalayan lemongrass.', 749, '/Products/11 Himalayan Zest.png', '/Products/11 Himalayan Zest.png', now())
;

-- set sequence to max id
SELECT setval(pg_get_serial_sequence('products','id'), (SELECT COALESCE(MAX(id), 1) FROM products));

COMMIT;