"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { signupSchema } from "@/lib/types/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    const { loading: authLoading, user, isAdmin } = useAuth();

    // Redirect nếu đã login
    useEffect(() => {
        if (user) {
            router.push(isAdmin ? "/dashboard" : "/");
        }
    }, [user, isAdmin, router]);

    // Loading khi auth chưa load xong
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("--- Bắt đầu handleSignup ---");
        console.log("Dữ liệu input:", { email, fullName, password, confirmPassword });

        setLoading(true);
        setError("");

        const parsed = signupSchema.safeParse({
            fullName,
            email,
            password,
            confirmPassword
        });

        if (!parsed.success) {
            console.error("Lỗi Validation (Zod):", parsed.error.issues);
            setError(parsed.error.issues[0].message);
            setLoading(false);
            return;
        }

        console.log("Validation thành công, đang gọi Supabase...");
        const { data, error: signupError } = await supabase.auth.signUp({
            email: parsed.data.email,
            password: parsed.data.password,
            options: {
                data: {
                    full_name: parsed.data.fullName,
                }
            }
        });

        if (signupError) {
            console.error("Lỗi từ Supabase Auth:", signupError.message, signupError);
            setError(signupError.message);
            setLoading(false);
            return;
        }

        console.log("Auth Signup thành công:", data);

        // tạo profile mặc định
        if (data.user) {
            // Gọi lệnh insert trực tiếp
            const { error: profileError } = await supabase
                .from("profiles")
                .insert([ // Dùng insert thay vì upsert để dễ bắt lỗi
                    {
                        id: data.user.id,
                        email: data.user.email,
                        full_name: parsed.data.fullName,
                        role: "student"
                    }
                ]);

            if (profileError) {
                console.error("Lỗi tạo profile:", profileError.message);
                // Nếu vẫn lỗi 401/42501, nghĩa là RLS vẫn chặn. 
            } else {
                console.log("Profile đã được tạo thủ công thành công!");
            }
        }

        setLoading(false);
        console.log("Đang chuyển hướng sang /login...");
        router.push("/login?message=signup-success");
    };

    const handleGoogleSignup = async () => {
        console.log("Bắt đầu Google Signup...");
        setLoading(true);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) {
            console.error("Lỗi Google OAuth:", error.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 px-4 py-12">

            <Card className="w-full max-w-md shadow-2xl border-0">

                <CardHeader className="text-center space-y-1">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Tạo tài khoản
                    </h1>

                    <CardDescription>
                        Bắt đầu hành trình của bạn
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Họ tên
                            </label>

                            <Input
                                placeholder="Nguyễn Văn A"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email
                            </label>

                            <Input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Mật khẩu
                            </label>

                            <Input
                                type="password"
                                minLength={8}
                                placeholder="Tối thiểu 8 ký tự"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Xác nhận mật khẩu
                            </label>

                            <Input
                                type="password"
                                minLength={8}
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            className="w-full"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang tạo tài khoản...
                                </>
                            ) : (
                                "Tạo tài khoản"
                            )}
                        </Button>

                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>

                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="px-2 bg-background text-muted-foreground">
                                Hoặc với Google
                            </span>
                        </div>
                    </div>

                    <Button
                        onClick={handleGoogleSignup}
                        variant="outline"
                        className="w-full"
                        disabled={loading}
                    >

                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23.99-3.71.99-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.83l2.66-2.74z"
                            />
                            <path fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>

                        Đăng ký với Google
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Đã có tài khoản?{" "}
                        <Link
                            href="/login"
                            className="font-medium hover:text-foreground"
                        >
                            Đăng nhập ngay
                        </Link>
                    </p>

                </CardContent>

            </Card>

        </div>
    );
}