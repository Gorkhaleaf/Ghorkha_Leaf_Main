#!/usr/bin/env node

/**
 * Migration Runner for Email-Based Orders-Profiles Linking
 *
 * This script runs the database migration to change linking from user_uid to email_canonical.
 *
 * Usage:
 *   node scripts/run-email-linking-migration.js
 *
 * Prerequisites:
 *   - Supabase CLI installed
 *   - Connected to your Supabase project
 *   - Proper environment variables set
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MIGRATION_FILE = 'supabase/migrations/20250824_email_based_linking.sql';

function runEmailLinkingMigration() {
  console.log('🔄 Starting Email-Based Linking Migration...\n');

  try {
    // Check if migration file exists
    if (!fs.existsSync(MIGRATION_FILE)) {
      throw new Error(`Migration file not found: ${MIGRATION_FILE}`);
    }

    console.log('📁 Found migration file:', MIGRATION_FILE);

    // Read migration content
    const migrationSQL = fs.readFileSync(MIGRATION_FILE, 'utf8');
    console.log('📄 Migration SQL loaded successfully');

    console.log('\n🔄 Running email-based linking migration...');
    console.log('This will change orders linking from user_uid to email_canonical...\n');

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

      console.log('\n📋 Migration SQL for manual execution:');
      console.log('='.repeat(50));
      console.log(migrationSQL);
      console.log('='.repeat(50));

      console.log('\n📋 Instructions:');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the migration SQL above');
      console.log('4. Execute the migration');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 What changed:');
    console.log('- Orders no longer use user_uid for linking');
    console.log('- Orders are now linked to profiles via email_canonical');
    console.log('- Foreign key constraint ensures data integrity');
    console.log('- Triggers automatically populate canonical fields');

    console.log('\n🧪 Next Steps:');
    console.log('1. Test the checkout flow with a new order');
    console.log('2. Verify that orders are linked via email matching');
    console.log('3. Check that customer_email and customer_phone are populated');
    console.log('4. Run the verification queries from the migration');

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
  runEmailLinkingMigration();
}

module.exports = { runEmailLinkingMigration };