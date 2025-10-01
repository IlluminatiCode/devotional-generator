import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/devotional/[id]
 * Retrieve a devotional by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid devotional ID format' },
        { status: 400 }
      );
    }

    // Fetch from Supabase
    const { data, error } = await supabase
      .from('devotionals')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Devotional not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ devotional: data });
  } catch (error) {
    console.error('Error fetching devotional:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
