-- supabase-create-blogs-fixed.sql
-- Run this in the Supabase SQL editor (this editor runs statements inside a transaction block,
-- so DO NOT use CREATE INDEX CONCURRENTLY here).
-- This SQL is plain PostgreSQL and safe to run in Supabase.

-- 1) Create table (if it already exists this will do nothing)
CREATE TABLE IF NOT EXISTS blogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  date DATE,
  read_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Create index on slug (non-concurrent so it works inside the Supabase SQL editor)
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs (slug);

-- 3) Seed existing posts. Use ON CONFLICT DO NOTHING so re-running the script is safe.
INSERT INTO blogs (id, title, description, image, slug, date, read_time, content)
VALUES
(1,
 'The Art of Perfect Tea Brewing: A Master''s Guide',
 'Discover the ancient secrets and modern techniques that transform simple tea leaves into an extraordinary sensory experience. Learn temperature control, timing, and the subtle art of steeping.',
 '/blog-post-1.png',
 'art-of-perfect-tea-brewing',
 '2024-12-15',
 '5 min read',
 ''),
(2,
 'Understanding Tea Aromas: From Garden to Cup',
 'Explore the fascinating journey of tea aromas, from the terroir of Darjeeling gardens to the complex bouquet in your cup. Learn to identify and appreciate the subtle notes that make each tea unique.',
 '/blog-post-2.png',
 'understanding-tea-aromas',
 '2024-12-10',
 '7 min read',
 '')
ON CONFLICT (id) DO NOTHING;

-- 4) Ensure sequence value is correct after inserting explicit IDs
SELECT setval(pg_get_serial_sequence('blogs','id'), COALESCE((SELECT MAX(id) FROM blogs), 1), true);

-- 5) Example insert for a new blog (replace values as needed)
INSERT INTO blogs (title, description, image, slug, date, read_time, content)
VALUES (
 'Why Water Temperature Matters',
 'The right water temperature unlocks the best aroma and flavor from tea leaves.',
 '/Products/1756813439952-01_Darjeeling_Black_Tea.png',
 'why-water-temperature-matters',
 '2025-09-02',
 '5 min read',
 '<figure><img src="/blog-post-1.png" alt="Steeping tea" /></figure><h2>Why Water Temperature Matters</h2><p>The right water temperature unlocks the best aroma and flavor from tea leaves.</p>'
);