"use client";

import { useEffect } from "react";
import { ReactNode } from "react";
import { Home, Library, Users, Settings, Search, Plus, GraduationCap, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {

    const pathname = usePathname();
    const router = useRouter();

    const auth = useAuth();
    const { loading: authLoading, profile } = auth;

    const handleLogout = async () => {
        await auth.signOut();
        router.push("/login");
    };

    // ✅ Redirect nếu không có profile hợp lệ
    useEffect(() => {
        if (!authLoading && (!profile || (profile.role !== "admin" && profile.role !== "student"))) {
            router.replace("/");
        }
    }, [authLoading, profile, router]);

    // ✅ Loading hoặc user không đủ quyền
    if (authLoading || !profile || (profile.role !== "admin" && profile.role !== "student")) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    const menuItems = [
        { icon: Home, label: "Trang chủ", href: "/dashboard" },
        { icon: Library, label: "Thư viện", href: "/library" },
        { icon: Users, label: "Lớp học", href: "/classes" },
        { icon: GraduationCap, label: "Báo cáo", href: "/reports" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col p-4 shadow-sm">

                <div className="flex items-center gap-2 px-2 mb-8">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                        Q
                    </div>
                    <h2 className="text-xl font-bold text-purple-600 tracking-tight">
                        Quizizz Admin
                    </h2>
                </div>

                <nav className="space-y-1 flex-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                                    isActive
                                        ? "bg-purple-50 text-purple-700 shadow-sm border border-purple-100 font-semibold"
                                        : "text-gray-600 hover:bg-gray-100 font-medium"
                                )}
                            >
                                <item.icon size={20} className={isActive ? "text-purple-700" : "text-gray-500"} />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto border-t pt-4 space-y-2">
                    <Link
                        href="/profile"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                            pathname === "/profile"
                                ? "bg-gray-100 text-slate-900"
                                : "text-gray-500 hover:bg-gray-100"
                        )}
                    >
                        <Settings size={18} />
                        <span className="text-sm">Cài đặt</span>
                    </Link>

                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start"
                    >
                        <LogOut size={18} className="mr-2" />
                        Đăng xuất
                    </Button>
                </div>

            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden">

                <header className="h-16 bg-white border-b flex items-center justify-between px-8 z-10">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm quizzes, lớp học..."
                            className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        />
                    </div>

                    <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Tạo mới
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}