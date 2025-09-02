-- supabase-create-blogs.sql
-- Run this in the Supabase SQL editor (or via psql). DO NOT use CREATE INDEX CONCURRENTLY in Supabase SQL editor.

-- 1) Create table
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

-- 2) Create index (non-concurrent so it works inside the Supabase SQL editor)
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs (slug);

-- 3) Seed existing posts (adjust content/date as needed)
INSERT INTO blogs (id, title, description, image, slug, date, read_time, content) VALUES
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
 '');

-- 4) Fix sequence so BIGSERIAL continues from max(id)
SELECT setval(pg_get_serial_sequence('blogs','id'), COALESCE((SELECT MAX(id) FROM blogs), 1));

-- 5) Example insert for a new blog (replace values)
INSERT INTO blogs (title, description, image, slug, date, read_time, content)
VALUES (
 'Why Water Temperature Matters',
 'The right water temperature unlocks the best aroma and flavor from tea leaves.',
 '/Products/1756813439952-01_Darjeeling_Black_Tea.png',
 'why-water-temperature-matters',
 '2025-09-02',
 '5 min read',
 '<figure><img src="/blog-post-1.png" alt="Steeping tea" /></figure><h2>Why Water Temperature Matters</h2><p>The right water temperature...</p>'
);