-- 001_add_subname.sql
-- Postgres migration: add nullable 'subname' column to products.

BEGIN;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS subname TEXT;

COMMIT;