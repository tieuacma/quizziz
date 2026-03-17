import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    // 1. Cập nhật session và lấy thông tin user/response
    // Hàm này rất quan trọng để đồng bộ cookie giữa Server và Client
    const { user, response } = await updateSession(request);

    const pathname = request.nextUrl.pathname;

    // 2. Kiểm tra nếu truy cập vào các trang trong /dashboard
    if (pathname.startsWith("/dashboard")) {
        // Nếu chưa đăng nhập, đá về login ngay
        if (!user) {
            const url = new URL("/login", request.url);
            url.searchParams.set("next", pathname); // Lưu lại trang đang định vào
            return NextResponse.redirect(url);
        }

        // 3. Kiểm tra Role (Chỉ chạy khi đã có user)
        // Tạo supabase client để query profile
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return request.cookies.getAll(); },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { data: profile, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        // NẾU LỖI HOẶC KHÔNG CÓ PROFILE:
        // Có thể do lỗi cột "created-at" dẫn đến không tạo được profile
        if (error || !profile) {
            console.error("Middleware Auth Error:", error?.message);
            // Thay vì đá về login (gây loop), đá về trang chủ hoặc trang báo lỗi setup
            return NextResponse.redirect(new URL("/?error=profile-not-found", request.url));
        }

        // Kiểm tra quyền Admin cho các route đặc biệt trong dashboard (nếu cần)
        if (pathname.startsWith("/dashboard/admin") && profile.role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return response;
}

// CẤU HÌNH MATCHER: Rất quan trọng để OAuth Google hoạt động
export const config = {
    matcher: [
        /*
         * Khớp tất cả các đường dẫn trừ:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Các file ảnh (svg, png, jpg,...)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};