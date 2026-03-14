'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { Staff } from '@/types'

export async function createStaffAction(
  salonId: string,
  form: { name: string; role: string; phone: string; email: string; password?: string },
  serviceIds: string[],
): Promise<{ data?: Staff; credentials?: { email: string; password: string }; error?: string }> {
  const supabaseAdmin = createAdminClient()

  const email = form.email?.trim()
  if (!email) {
    return { error: 'Yeni personel için e-posta zorunludur.' }
  }
  if (!form.name) {
    return { error: 'Personel adı zorunludur.' }
  }

  const password = form.password || Math.random().toString(36).slice(-8)

  // 1. Create auth user using the admin client
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Or false if you want to auto-confirm
  })

  if (authError) {
    if (authError.message.includes('User already registered')) {
      return { error: 'Bu e-posta adresi zaten kayıtlı. Lütfen farklı bir e-posta kullanın.' }
    }
    console.error('Auth Error:', authError)
    return { error: authError.message }
  }

  const user = authData.user
  if (!user) {
    return { error: 'Kullanıcı oluşturulamadı.' }
  }

  // 2. Insert into staff table
  const { data: staffData, error: staffError } = await supabaseAdmin
    .from('staff')
    .insert({ salon_id: salonId, name: form.name, role: form.role, phone: form.phone, email, auth_user_id: user.id, is_active: true })
    .select()
    .single()

  if (staffError) {
    await supabaseAdmin.auth.admin.deleteUser(user.id) // Rollback auth user
    console.error('Staff Insert Error:', staffError)
    return { error: staffError.message }
  }

  // 3. Insert staff_services
  if (serviceIds.length > 0) {
    const servicesToInsert = serviceIds.map((service_id) => ({ staff_id: staffData.id, service_id }))
    const { error: ssError } = await supabaseAdmin.from('staff_services').insert(servicesToInsert)

    if (ssError) {
      await supabaseAdmin.auth.admin.deleteUser(user.id) // Rollback
      console.error('Staff Service Error:', ssError)
      return { error: ssError.message }
    }
  }

  revalidatePath('/dashboard/staff')

  return { data: staffData as Staff, credentials: { email, password } }
}
