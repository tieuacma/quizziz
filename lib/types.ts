export type UserRole = 'student' | 'teacher'

export interface SessionUser {
  userId: string
  email: string
  name: string
  role: UserRole
}
