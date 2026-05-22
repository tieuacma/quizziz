import 'server-only'
import { cookies } from 'next/headers'
import type { SessionUser } from './types'

/**
 * DEMO: Stores session as a base64-encoded JSON cookie.
 *
 * Production (Supabase Auth):
 *   import { createServerClient } from '@supabase/ssr'
 *   const supabase = createServerClient(url, anonKey, { cookies: { ... } })
 *   const { data: { user } } = await supabase.auth.getUser()
 */

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get('session')?.value
  if (!raw) return null
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as SessionUser
  } catch {
    return null
  }
}

export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies()
  const encoded = Buffer.from(JSON.stringify(user)).toString('base64')
  cookieStore.set('session', encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
