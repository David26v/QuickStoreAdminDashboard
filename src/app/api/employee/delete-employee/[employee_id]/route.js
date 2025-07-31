import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function DELETE(request, { params }) {
  const { employee_id } = params;

  try {
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('user_id')
      .eq('id', employee_id)
      .single();

    if (fetchError || !employee) {
      return Response.json({ error: 'Employee not found' }, { status: 404 });
    }

    const userId = employee.user_id;

    // 2. Delete from employees table
    const { error: empError } = await supabase
      .from('employees')
      .delete()
      .eq('id', employee_id);

    if (empError) {
      return Response.json({ error: empError.message }, { status: 400 });
    }

    // 3. Delete from profiles table
    await supabase.from('profiles').delete().eq('id', userId);

    // 4. (Optional) Delete from Supabase Auth
    await supabase.auth.admin.deleteUser(userId);

    return Response.json({ message: 'Employee deleted successfully' }, { status: 200 });
  } 
  catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
