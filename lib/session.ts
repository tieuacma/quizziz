import "server-only";
import { cookies } from "next/headers";
import type { SessionUser } from "./types";

/**
 * BẢN DEMO: Lưu trữ session dưới dạng cookie JSON mã hóa base64.
 *
 * Khi chạy Production (Dùng Supabase Auth):
 * import { createServerClient } from '@supabase/ssr'
 * const supabase = createServerClient(url, anonKey, { cookies: { ... } })
 * const { data: { user } } = await supabase.auth.getUser()
 */

/**
 * CHỨC NĂNG: Lấy và giải mã thông tin User từ Cookie session hiện tại.
 */
export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const raw = cookieStore.get("session")?.value;
    if (!raw) return null; // Không có cookie -> chưa login
    try {
        // Giải mã chuỗi Base64 ngược về chuỗi UTF-8 rồi parse thành Object JSON
        return JSON.parse(
            Buffer.from(raw, "base64").toString("utf-8")
        ) as SessionUser;
    } catch {
        return null; // Cookie lỗi hoặc bị sửa đổi trái phép -> bọc catch trả về null
    }
}

/**
 * CHỨC NĂNG: Khởi tạo và lưu mã hóa Cookie session khi User đăng nhập thành công.
 */
export async function createSession(user: SessionUser): Promise<void> {
    const cookieStore = await cookies();
    // Ngăn chặn script phía Client (XSS) truy cập cookie
    const encoded = Buffer.from(JSON.stringify(user)).toString("base64");

    // Thiết lập cấu hình bảo mật cho Cookie hệ thống
    cookieStore.set("session", encoded, {
        httpOnly: true, // Ngăn chặn script phía Client (XSS) truy cập cookie
        secure: process.env.NODE_ENV === "production", // Chỉ truyền qua HTTPS khi chạy production
        sameSite: "lax", // Giới hạn gửi cookie trên các request từ trang trung gian (chống CSRF)
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // Hạn dùng cookie trong 7 ngày
    });
}

/**
 * CHỨC NĂNG: Xóa bỏ Cookie session (Thực hiện khi User Đăng xuất).
 */
export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("session"); // Đánh dấu xóa cookie trên trình duyệt
}