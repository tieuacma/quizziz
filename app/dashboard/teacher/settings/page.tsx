import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Shield, User } from "lucide-react";

export default async function TeacherSettingsPage() {
    const session = await getSession();
    if (!session || session.role !== "teacher") redirect("/dashboard");

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Settings className="w-7 h-7 text-primary" />
                    Cài đặt
                </h1>
                <p className="text-slate-400 mt-1">
                    Tùy chỉnh tài khoản và tùy chọn hệ thống.
                </p>
            </div>

            <Card className="bg-white/[0.03] border-white/8">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 text-base">
                        <User className="w-5 h-5 text-indigo-400" />
                        Thông tin tài khoản
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1.5">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            defaultValue={session.name}
                            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-indigo-500 focus:outline-none"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            defaultValue={`${session.name.toLowerCase().replace(/\s+/g, ".")}@zenith.edu`}
                            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-indigo-500 focus:outline-none"
                            readOnly
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="border-white/10 hover:bg-white/8 text-white cursor-pointer"
                    >
                        Cập nhật hồ sơ
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-white/[0.03] border-white/8">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 text-base">
                        <Shield className="w-5 h-5 text-indigo-400" />
                        Bảo mật
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1.5">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1.5">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="border-white/10 hover:bg-white/8 text-white cursor-pointer"
                    >
                        Đổi mật khẩu
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-white/[0.03] border-white/8">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 text-base">
                        <Bell className="w-5 h-5 text-indigo-400" />
                        Thông báo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {[
                        { label: "Email khi có bài nộp mới", checked: true },
                        { label: "Nhắc hạn quiz sắp đóng", checked: true },
                        {
                            label: "Bản tin hệ thống Zenith EDU",
                            checked: false,
                        },
                    ].map((item) => (
                        <label
                            key={item.label}
                            className="flex items-center justify-between gap-4 py-2 cursor-pointer group"
                        >
                            <span className="text-slate-300 text-sm group-hover:text-white transition-colors">
                                {item.label}
                            </span>
                            <input
                                type="checkbox"
                                defaultChecked={item.checked}
                                className="w-4 h-4 rounded border-white/20 bg-white/[0.04] text-indigo-500 focus:ring-indigo-500/30"
                            />
                        </label>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
