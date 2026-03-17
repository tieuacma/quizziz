import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") ?? "/dashboard"; // Cho phép chuyển hướng linh hoạt

    if (!code) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const cookieStore = await cookies();
    // Tạo response trước
    let response = NextResponse.redirect(new URL(next, request.url));

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        // Cập nhật cả cookieStore và response để đồng bộ
                        cookieStore.set(name, value, options);
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        console.error("OAuth exchange error:", error);
        return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }

    const user = data.session?.user;

    if (user) {
        // Kiểm tra xem dữ liệu có bị undefined không trước khi upsert
        const profileData = {
            id: user.id,
            email: user.email || user.user_metadata?.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            role: "student",
            updated_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabase.from("profiles").upsert(profileData);

        if (upsertError) {
            console.error("Profile upsert error:", upsertError);
            // Bạn có thể chọn redirect về trang lỗi nếu không tạo được profile
        }
    }

    return response;
}