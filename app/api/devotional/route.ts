import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

// Validation schema for devotional creation
const devotionalSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1),
  scripture: z.string().min(1),
  reflection: z.string().min(1),
  prayer: z.string().min(1),
  challenge: z.string().min(1),
  theme: z.string().min(1),
  audience: z.string().optional().nullable(),
  mood: z.string().optional().nullable(),
});

/**
 * POST /api/devotional
 * Save a new devotional to the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = devotionalSchema.parse(body);

    // Insert into Supabase
    const { data, error } = await supabase
      .from('devotionals')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save devotional', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      devotional: data,
      id: data.id
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid devotional data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error saving devotional:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
