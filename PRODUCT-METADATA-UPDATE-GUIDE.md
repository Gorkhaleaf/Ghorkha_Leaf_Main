# Product Metadata Update Guide

## Overview
This document explains the SQL script and frontend changes made to update product collections, flavors, and qualities.

## Database Changes

### SQL Script: `update-products-metadata.sql`

The script updates the following fields for each product:

### Product Updates:

1. **Butterfly Pea Flower Blue Tea** (ID: 1)
   - Collections: `Herbal Teas`
   - Flavors: `Floral`, `Smooth`
   - Qualities: `Detox`, `Relax`, `Stress Relief`

2. **Hibiscus Rose Green Tea** (ID: 2)
   - Collections: `Green Teas`
   - Flavors: `Sweet`, `Fruity`, `Floral`, `Citrus`
   - Qualities: `Relax`, `Digestion`

3. **Ashwagandha Vitality White Tea** (ID: 3)
   - Collections: `White Teas`
   - Flavors: `Spicy`, `Smooth`, `Citrus`, `Floral`
   - Qualities: `Relax`, `Digestion`, `Immunity`, `Stress Relief`

4. **Muscatel Golden Darjeeling Black Tea** (ID: 4)
   - Collections: `Black Teas`
   - Flavors: `Sweet`, `Floral`, `Smooth`
   - Qualities: `Energy`, `Immunity`

5. **Ayurvedic Masala Chai Premium CTC** (ID: 5)
   - Collections: `Black Teas`
   - Flavors: `Spicy`, `Sweet`, `Bold`
   - Qualities: `Energy`, `Digestion`, `Immunity`

6. **Premium Spring Green Tea** (ID: 6)
   - Collections: `Green Teas`
   - Flavors: `Grassy`, `Smooth`, `Citrus`
   - Qualities: `Detox`, `Energy`

## Frontend Changes

### Updated Filter Options in `app/products/page.tsx`

**Before:**
```typescript
collections: ["Black teas", "Green teas", "Herbal teas"]
flavor: ["Spicy", "Sweet", "Citrus", "Smooth", "Fruity", "Floral", "Grassy", "Minty", "Creamy"]
qualities: ["Detox", "Energy", "Relax", "Digestion"]
```

**After:**
```typescript
collections: ["Black Teas", "Green Teas", "Herbal Teas", "White Teas"]
flavor: ["Spicy", "Sweet", "Citrus", "Smooth", "Fruity", "Floral", "Grassy", "Bold"]
qualities: ["Detox", "Energy", "Relax", "Digestion", "Immunity", "Stress Relief"]
```

### Key Changes:
1. ✅ Added "White Teas" to collections
2. ✅ Standardized capitalization (e.g., "Black teas" → "Black Teas")
3. ✅ Added "Bold" flavor option
4. ✅ Removed unused options: "Minty", "Creamy"
5. ✅ Added "Immunity" and "Stress Relief" to qualities

## How to Apply the Changes

### Step 1: Run the SQL Script

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `update-products-metadata.sql`
4. Paste and click **Run**

#### Option B: Using psql Command Line
```bash
psql -h your-db-host -U your-username -d your-database -f update-products-metadata.sql
```

#### Option C: Using Supabase CLI
```bash
supabase db push update-products-metadata.sql
```

### Step 2: Verify Database Changes

Run this query to verify the updates:
```sql
SELECT 
  id,
  name,
  collections,
  flavors,
  qualities
FROM products
ORDER BY id;
```

### Step 3: Frontend Changes (Already Applied)

The filter options in `app/products/page.tsx` have been updated to match the new database structure. The changes include:
- Updated collection names
- Added new flavor and quality options
- Removed unused filter options

## Filter Functionality

The products page now supports filtering by:

### Collections Dropdown
- Black Teas
- Green Teas
- Herbal Teas
- White Teas

### Flavors Dropdown
- Spicy
- Sweet
- Citrus
- Smooth
- Fruity
- Floral
- Grassy
- Bold

### Qualities Dropdown
- Detox
- Energy
- Relax
- Digestion
- Immunity
- Stress Relief

### Additional Filters
- Organic toggle switch

## Testing Checklist

After applying the changes, test the following:

- [ ] All 6 products display correctly on the products page
- [ ] Filter by "Herbal Teas" shows Butterfly Pea Flower Blue Tea
- [ ] Filter by "White Teas" shows Ashwagandha Vitality White Tea
- [ ] Filter by "Black Teas" shows Muscatel and Masala Chai
- [ ] Filter by "Green Teas" shows Hibiscus Rose and Premium Spring
- [ ] Flavor filters work correctly (e.g., "Bold" shows Masala Chai)
- [ ] Quality filters work correctly (e.g., "Immunity" shows relevant teas)
- [ ] Multiple filters can be applied simultaneously
- [ ] Organic filter works correctly
- [ ] Mobile filter drawer displays all options
- [ ] Desktop sidebar displays all options

## Notes

- The SQL script uses PostgreSQL array syntax (`ARRAY[]::text[]`)
- VS Code's SQL linter may show syntax errors, but these are false positives for PostgreSQL
- The script is safe to run multiple times (it will update the same records)
- All filter changes are backwards compatible with the existing API

## Rollback (If Needed)

If you need to revert the changes, you can restore the previous values using:

```sql
-- Revert to previous collections (example)
UPDATE products SET collections = ARRAY['Herbal Tea','Wellness Tea']::text[] WHERE id = 1;
-- ... repeat for other products
```

## Support

If you encounter any issues:
1. Check that the product IDs match your database
2. Verify the array syntax is supported by your PostgreSQL version (9.1+)
3. Ensure you have UPDATE permissions on the products table
4. Check the browser console for any frontend filtering errors
