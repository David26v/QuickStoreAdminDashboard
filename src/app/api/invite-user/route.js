import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, tempPassword, metadata, employeeData } = body;

    // 1. Create user in auth
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      user_metadata: metadata,
    });

    if (authError) {
      return Response.json({ error: authError.message }, { status: 400 });
    }

    const userId = user?.user?.id;

    // 2. Insert into profiles
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      first_name: metadata.first_name,
      last_name: metadata.last_name,
      username: `${metadata.first_name}${metadata.last_name}`.toLowerCase(),
      email,
      avatar: metadata.avatar || null,
      role: 'employee',
      department_id: employeeData.department_id,
      role_id: employeeData.role_id,
      shift_id: employeeData.shift_id || null,
      active: true,
    });

    if (profileError) {
      return Response.json({ error: profileError.message }, { status: 400 });
    }

    // 3. Insert into employees
    const { error: empError } = await supabase.from('employees').insert({
      ...employeeData,
      email,
      user_id: userId,
    });

    if (empError) {
      return Response.json({ error: empError.message }, { status: 400 });
    }

    return Response.json({ message: 'Employee created successfully' });
  } catch (err) {
    console.error('API Error:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
