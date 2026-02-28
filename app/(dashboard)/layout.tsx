"use client"; // Bắt buộc thêm dòng này để dùng hook usePathname

import { ReactNode } from "react";
import { Home, Library, Users, Settings, Search, Plus, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook lấy URL hiện tại
import { cn } from "@/lib/utils"; // Hàm nối class của shadcn

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Danh sách menu để quản lý tập trung
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
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">Q</div>
                    <h2 className="text-xl font-bold text-purple-600 tracking-tight">Quizizz Clone</h2>
                </div>

                <nav className="space-y-1 flex-1">
                    {menuItems.map((item) => {
                        // Kiểm tra xem item này có đang được chọn hay không
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                                    isActive
                                        ? "bg-purple-50 text-purple-700 shadow-sm border border-purple-100 font-semibold" // Style khi Active
                                        : "text-gray-600 hover:bg-gray-100 font-medium" // Style bình thường
                                )}
                            >
                                <item.icon size={20} className={isActive ? "text-purple-700" : "text-gray-500"} />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto border-t pt-4">
                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                            pathname === "/settings" ? "bg-gray-100 text-slate-900" : "text-gray-500 hover:bg-gray-100"
                        )}
                    >
                        <Settings size={18} /> <span className="text-sm">Cài đặt</span>
                    </Link>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-8 z-10">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm hoạt động trong thư viện..."
                            className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition-all flex items-center gap-2 text-sm font-bold shadow-md active:scale-95">
                            <Plus size={20} /> Thêm tài nguyên
                        </button>
                        <div className="h-8 w-px bg-gray-200 mx-2"></div>
                        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-full pr-3 transition-all">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="avatar"
                                className="w-9 h-9 rounded-full border-2 border-purple-200"
                            />
                            <span className="text-sm font-semibold hidden md:block">Giảng viên</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}