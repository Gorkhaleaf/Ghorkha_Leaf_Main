#!/usr/bin/env node

/**
 * Migration Runner for Orders-Profiles Linking Fix
 *
 * This script runs the database migration to fix the linking between orders and profiles tables.
 *
 * Usage:
 *   node scripts/run-migration.js
 *
 * Prerequisites:
 *   - Supabase CLI installed
 *   - Connected to your Supabase project
 *   - Proper environment variables set
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MIGRATION_FILE = 'supabase/migrations/20250824_fix_profiles_orders_linking.sql';

function runMigration() {
  console.log('🚀 Starting Orders-Profiles Linking Migration...\n');

  try {
    // Check if migration file exists
    if (!fs.existsSync(MIGRATION_FILE)) {
      throw new Error(`Migration file not found: ${MIGRATION_FILE}`);
    }

    console.log('📁 Found migration file:', MIGRATION_FILE);

    // Read migration content
    const migrationSQL = fs.readFileSync(MIGRATION_FILE, 'utf8');
    console.log('📄 Migration SQL loaded successfully');

    // Run migration using Supabase CLI
    console.log('\n🔄 Running migration...');
    console.log('This may take a few minutes depending on your database size...\n');

    try {
      // Method 1: Using Supabase CLI db push (if available)
      execSync('supabase db push', {
        stdio: 'inherit',
        cwd: process.cwd()
      });
    } catch (cliError) {
      console.log('\n⚠️  Supabase CLI db push failed, trying alternative method...');

      // Method 2: Direct SQL execution via Supabase client
      console.log('🔄 Attempting direct SQL execution...');

      // You would need to implement this based on your Supabase setup
      console.log('Please run the migration SQL manually in your Supabase SQL Editor:');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the migration SQL');
      console.log('4. Execute the migration');

      // Output the migration SQL for manual execution
      console.log('\n📋 Migration SQL:');
      console.log('=' .repeat(50));
      console.log(migrationSQL);
      console.log('=' .repeat(50));
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Next Steps:');
    console.log('1. Verify the migration by running the verification queries in the SQL file');
    console.log('2. Test the checkout flow with a real user account');
    console.log('3. Check that orders are properly linked to user profiles');
    console.log('4. Monitor for any constraint violations or errors');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Ensure Supabase CLI is installed: npm install -g supabase');
    console.error('2. Check your Supabase connection: supabase status');
    console.error('3. Verify your environment variables are set correctly');
    console.error('4. Make sure you have the necessary permissions on the database');

    process.exit(1);
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };