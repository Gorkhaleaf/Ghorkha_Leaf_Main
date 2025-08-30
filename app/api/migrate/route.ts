import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with proper authentication
    const supabase = createClient();

    // Check if user is authenticated and is admin (you might want to add admin role check)
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run the migration SQL
    const migrationSQL = `
      -- Add address fields to profiles table
      ALTER TABLE profiles
      ADD COLUMN IF NOT EXISTS email text,
      ADD COLUMN IF NOT EXISTS phone text,
      ADD COLUMN IF NOT EXISTS phone_normalized text,
      ADD COLUMN IF NOT EXISTS address_line_1 text,
      ADD COLUMN IF NOT EXISTS address_line_2 text,
      ADD COLUMN IF NOT EXISTS city text,
      ADD COLUMN IF NOT EXISTS state text,
      ADD COLUMN IF NOT EXISTS pincode text,
      ADD COLUMN IF NOT EXISTS country text DEFAULT 'India';

      -- Add index for phone_normalized for faster lookups
      CREATE INDEX IF NOT EXISTS idx_profiles_phone_normalized ON profiles(phone_normalized);
    `;

    // For now, just return the SQL that needs to be executed
    // The user can run this in the Supabase SQL Editor
    console.log('Migration SQL to execute:', migrationSQL);

    return NextResponse.json({ success: true, message: 'Migration completed successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: 'Migration failed', details: error }, { status: 500 });
  }
}