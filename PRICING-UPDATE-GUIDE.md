# Supabase Products Pricing Update - Implementation Guide

## Overview
This update implements comprehensive pricing with pack options, brewing instructions, ingredients, and FAQs for all Gorkha Leaf tea products.

## Files Created/Modified

### 1. **supabase-update-products-pricing.sql** ✨ NEW
Complete SQL script to update your Supabase products table with:
- New columns: `pack_size`, `mrp`, `discount_percent`, `pack_options`, `brewing_instructions`, `ingredients`, `faqs`
- All 6 products updated with correct pricing and combo discounts
- Full product descriptions, brewing steps, and FAQs

### 2. **lib/products.ts** ✅ UPDATED
Added new TypeScript interfaces:
- `PackOption` - For multi-pack pricing with discounts
- `BrewingStep` & `BrewingInstructions` - Structured brewing data
- `FAQ` - Question/answer pairs
- Updated `Product` interface with new fields

### 3. **components/ProductHeader.tsx** ✅ UPDATED
Complete redesign of pricing and pack selection:
- **Pack Selection UI**: Grid layout showing all pack options
- **Dynamic Pricing**: Shows price, MRP, discount % and savings amount
- **Visual Indicators**: Selected pack highlighted, savings badge
- **Responsive Design**: 2-column grid for pack options

## Pricing Structure (All Products)

| Product | Single Pack | 2 Packs | 3 Packs | 4 Packs |
|---------|-------------|---------|---------|---------|
| **Butterfly Pea** | ₹349 (10% OFF) | ₹660 (5% OFF, Save ₹38) | ₹960 (8% OFF, Save ₹87) | ₹1,230 (12% OFF, Save ₹166) |
| **Hibiscus Rose** | ₹329 (9% OFF) | ₹625 (5% OFF, Save ₹33) | ₹905 (8% OFF, Save ₹82) | ₹1,155 (12% OFF, Save ₹161) |
| **Ashwagandha** | ₹349 (10% OFF) | ₹660 (5% OFF, Save ₹38) | ₹960 (8% OFF, Save ₹87) | ₹1,230 (12% OFF, Save ₹166) |
| **Muscatel Gold** | ₹299 (9% OFF) | ₹570 (5% OFF, Save ₹28) | ₹825 (8% OFF, Save ₹72) | ₹1,050 (12% OFF, Save ₹146) |
| **Masala Chai CTC** | ₹149 (7% OFF) | ₹285 (5% OFF, Save ₹13) | ₹410 (8% OFF, Save ₹37) | ₹525 (12% OFF, Save ₹71) |
| **Spring Green** | ₹299 (9% OFF) | ₹570 (5% OFF, Save ₹28) | ₹825 (8% OFF, Save ₹72) | ₹1,050 (12% OFF, Save ₹146) |

## How to Apply Updates

### Step 1: Run SQL Script in Supabase
```bash
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase-update-products-pricing.sql`
3. Click "Run" to execute
4. Verify with the SELECT query at the end of the script
```

### Step 2: Deploy Frontend Changes
The TypeScript and component changes are already done. Just commit and push:

```bash
git add .
git commit -m "Add pack pricing with combo discounts and detailed product info"
git push origin main
```

## Product Features Included

### 1. **Butterfly Pea Flower Blue Tea**
- Caffeine-Free herbal tea
- Color-changing magic with lemon
- 5 FAQs about caffeine, color change, taste
- Ingredients: Butterfly Pea Flower

### 2. **Hibiscus Rose Green Tea**
- Low caffeine wellness blend
- 8 ingredients: Green tea, hibiscus, rose, chamomile, fennel, cardamom, star anise
- 4 FAQs about taste, caffeine, benefits

### 3. **Ashwagandha Vitality White Tea**
- Very low caffeine Ayurvedic blend
- 6 ingredients: White tea, turmeric, ashwagandha, black pepper, ginger, lemongrass
- 4 FAQs about uniqueness, caffeine, re-steeping

### 4. **Muscatel Gold Darjeeling Black Tea**
- Medium caffeine, single-origin AV2
- Honey-muscatel flavor notes
- 5 FAQs about muscatel meaning, milk pairing, benefits

### 5. **Ayurvedic Masala Chai Premium CTC**
- High caffeine, bold masala chai
- 6 ingredients: CTC tea, ashwagandha, tulsi, mulethi, ginger, cardamom
- 4 FAQs about traditional chai, milk brewing

### 6. **Premium Spring Darjeeling Green Tea**
- Medium caffeine, FTGFOP1 grade
- Smooth grassy flavor with vegetal notes
- 5 FAQs about bitterness, lemon/honey, metabolism benefits

## New UI Features

### Pack Selection Cards
```
┌─────────────────────┬─────────────────────┐
│  1 Pack             │  2 Packs   [Save!]  │
│  ₹349  ₹390        │  ₹660  ₹698        │
│  10% OFF            │  5% OFF             │
│  [✓ Selected]       │                     │
└─────────────────────┴─────────────────────┘
┌─────────────────────┬─────────────────────┐
│  3 Packs  [Save ₹87]│  4 Packs [Save ₹166]│
│  ₹960  ₹1047       │  ₹1230  ₹1396      │
│  8% OFF             │  12% OFF            │
└─────────────────────┴─────────────────────┘
```

### Pricing Display
- **Large Price**: Current selected pack price
- **Strikethrough MRP**: Original price
- **Red Badge**: Discount percentage
- **Green Text**: "You save ₹XX!" (for multi-packs)

## Database Schema Changes

```sql
-- New columns added to products table:
ALTER TABLE products ADD COLUMN:
- pack_size VARCHAR(50)           -- e.g., "100g"
- mrp DECIMAL(10,2)               -- Maximum Retail Price
- discount_percent INTEGER         -- e.g., 10 for 10% OFF
- pack_options JSONB              -- Array of pack pricing
- brewing_instructions JSONB      -- Structured brewing steps
- ingredients JSONB               -- Array of ingredients
- faqs JSONB                      -- Array of Q&A pairs
```

## Testing Checklist

- [ ] Run SQL script in Supabase
- [ ] Verify all 6 products updated correctly
- [ ] Test product page with pack selection
- [ ] Verify pricing calculations
- [ ] Check discount badges display
- [ ] Test "Add to Cart" with different packs
- [ ] Verify "Buy Now" modal shows correct price
- [ ] Test on mobile responsiveness
- [ ] Check description displays properly
- [ ] Verify brewing instructions (if you implement the component)

## Next Steps (Optional Enhancements)

1. **Brewing Instructions Component**: Create a visual step-by-step brewing guide using `brewing_instructions` data
2. **FAQ Accordion**: Display FAQs in an expandable accordion below product details
3. **Ingredients Gallery**: Show ingredient icons/images with descriptions
4. **Pack Comparison Table**: Side-by-side comparison of all pack options
5. **Savings Calculator**: Interactive calculator showing bulk savings

## Support

If you encounter any issues:
1. Check Supabase logs for SQL errors
2. Verify product slugs match in database
3. Check browser console for TypeScript errors
4. Ensure pack_options JSON structure is correct

---

**Created**: October 13, 2025
**Status**: Ready for deployment
**Impact**: All product pages, pricing display, cart functionality
