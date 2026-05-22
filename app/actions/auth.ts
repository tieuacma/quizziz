'use server'

import { redirect } from 'next/navigation'
import { createSession, deleteSession } from '@/lib/session'
import type { UserRole } from '@/lib/types'

export type AuthFormState = { error?: string } | undefined

// ── Demo users (replace with DB query or supabase.auth.signInWithPassword) ──
const DEMO_USERS = [
  { id: '1', email: 'student@zenith.edu', password: 'password123', name: 'Nguyễn Văn An',   role: 'student' as UserRole },
  { id: '2', email: 'teacher@zenith.edu', password: 'password123', name: 'Trần Thị Bình', role: 'teacher' as UserRole },
]

export async function login(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email    = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Vui lòng điền đầy đủ thông tin.' }

  const user = DEMO_USERS.find((u) => u.email === email && u.password === password)
  if (!user) return { error: 'Email hoặc mật khẩu không chính xác.' }

  await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role })
  redirect('/dashboard')
}

export async function signup(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name     = (formData.get('name') as string)?.trim()
  const email    = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const role     = formData.get('role') as UserRole

  if (!name || !email || !password || !role) return { error: 'Vui lòng điền đầy đủ thông tin.' }
  if (password.length < 8) return { error: 'Mật khẩu phải có ít nhất 8 ký tự.' }

  // Production: call supabase.auth.signUp({ email, password, options: { data: { name, role } } })
  await createSession({ userId: crypto.randomUUID(), email, name, role })
  redirect('/dashboard')
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/login')
}
