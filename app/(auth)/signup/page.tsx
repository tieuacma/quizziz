"use client";

import { useActionState } from "react";
import { signup, type AuthFormState } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(signup, undefined);

  return (
    <main className="zenith-mesh min-h-screen flex items-center justify-center p-4">
      <div className="pointer-events-none fixed inset-0 zenith-grid opacity-50" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 shadow-xl shadow-violet-600/40 ring-1 ring-white/20 mb-4">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Zenith EDU
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Tạo tài khoản miễn phí ngay hôm nay
          </p>
        </div>

        {/* Card */}
        <Card className="rounded-3xl zenith-glass border-white/12 shadow-2xl shadow-violet-950/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-white">
              Tạo tài khoản mới ✨
            </CardTitle>
            <CardDescription className="text-slate-400">
              Điền thông tin để bắt đầu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state?.error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span> {state.error}
              </div>
            )}

            <form action={formAction} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-slate-300">
                  Họ và tên
                </Label>
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Nguyễn Văn A"
                  className="bg-white/8 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-violet-500/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@zenith.edu"
                  className="bg-white/8 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-violet-500/50"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-slate-300">
                  Mật khẩu
                </Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Ít nhất 8 ký tự"
                  className="bg-white/8 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-violet-500/50"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="signup-role" className="text-slate-300">
                  Vai trò
                </Label>
                <Select name="role" required>
                  <SelectTrigger
                    id="signup-role"
                    className="bg-[#0d0b1e] border-white/10 text-white focus:ring-violet-500/50"
                  >
                    <SelectValue placeholder="-- Chọn vai trò --" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d0b1e] border-white/10 text-white">
                    <SelectItem value="student">
                      👨‍🎓 Học sinh / Sinh viên
                    </SelectItem>
                    <SelectItem value="teacher">👨‍🏫 Giáo viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                id="signup-submit-btn"
                type="submit"
                disabled={isPending}
                className="zenith-btn-glow w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 text-white font-semibold border-0 transition-all disabled:opacity-60"
              >
                {isPending ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
              </Button>
            </form>

            <div className="relative flex items-center gap-3">
              <Separator className="flex-1 bg-white/10" />
              <span className="text-xs text-slate-500">hoặc</span>
              <Separator className="flex-1 bg-white/10" />
            </div>

            <Button
              id="google-signup-btn"
              type="button"
              variant="outline"
              className="w-full gap-3 bg-white/8 border-white/10 hover:bg-white/12 hover:border-white/20 text-white transition-all"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng ký với Google
            </Button>

            <p className="text-center text-sm text-slate-500">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
