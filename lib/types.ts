export type UserRole = "student" | "teacher" | "admin";

export interface SessionUser {
    userId: string;
    email: string;
    name: string;
    role: UserRole;
}
