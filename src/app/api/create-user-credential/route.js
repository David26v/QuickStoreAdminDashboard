import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import supabase from '@/lib/helper';

export async function POST(request) {
  try {
    const { user_id, access_code } = await request.json();
    
    // Hash the access code with bcrypt
    const saltRounds = 10;
    const hashedCode = await bcrypt.hash(access_code, saltRounds);
    
    const { data, error } = await supabase
      .from('user_credentials')
      .insert({
        user_id: user_id,
        method_type: 'code',
        credential_hash: hashedCode,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating credential:', error);
    return NextResponse.json({ error: 'Failed to create credential' }, { status: 500 });
  }
}