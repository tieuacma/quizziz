"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Puzzle,
  Users,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  LogOut,
  User,
  Menu,
  GraduationCap,
  BookOpen,
  CalendarDays,
  ClipboardList,
  School,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import Breadcrumbs from "./Breadcrumbs";
import { logout } from "@/app/actions/auth";
import ThemeToggle from "@/components/theme-toggle";

import type { UserRole } from "@/lib/types";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    role: UserRole;
  };
}

type MenuItem = {
  label: string;
  vietnamese: string;
  href: string;
  icon: LucideIcon;
};

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: DashboardShellProps["user"];
  roleLabel: string;
  menuItems: MenuItem[];
  isItemActive: (href: string, label: string) => boolean;
  onLogout: () => void;
  isPending: boolean;
}

function DashboardSidebar({
  isCollapsed,
  onToggleCollapse,
  user,
  roleLabel,
  menuItems,
  isItemActive,
  onLogout,
  isPending,
}: DashboardSidebarProps) {
  return (
    <div className="flex flex-col h-full zenith-glass border-r border-white/10 relative">
      <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-600/40 ring-1 ring-white/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-base font-black text-white relative z-10">Z</span>
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display text-white font-extrabold text-lg tracking-tight zenith-gradient-text-static"
            >
              Zenith EDU
            </motion.span>
          )}
        </div>
      </div>

      <div className="px-4 py-4 border-b border-white/8 transition-all duration-300">
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-300`}
        >
          <Avatar className="h-8 w-8 shrink-0 ring-2 ring-indigo-500/20">
            <AvatarFallback
className={
                       user.role === "student"
                         ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-sm font-bold"
                         : user.role === "admin"
                         ? "bg-gradient-to-br from-rose-500 to-red-600 text-white text-sm font-bold"
                         : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold"
                       }
            >
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              className="min-w-0 flex-1 overflow-hidden"
            >
              <p className="text-white text-sm font-semibold truncate leading-4">{user.name}</p>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 mt-0.5 block">
                {roleLabel}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = isItemActive(item.href, item.label);
          return (
            <Link key={item.label} href={item.href} className="block group">
              <div
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? "text-white bg-gradient-to-r from-indigo-600/25 to-purple-600/10 border-l-2 border-indigo-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-white"
                  }`}
                />
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col text-left"
                  >
                    <span className="text-sm font-semibold tracking-wide leading-4">{item.label}</span>
                    <span className="text-[10px] text-slate-500 leading-3">{item.vietnamese}</span>
                  </motion.div>
                )}
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/8">
        <Button
          id="logout-btn"
          onClick={onLogout}
          disabled={isPending}
          variant="ghost"
          className={`w-full ${isCollapsed ? "justify-center" : "justify-start"} gap-3.5 px-3.5 py-3 h-auto text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl text-sm font-normal transition-colors`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>{isPending ? "Đang rời..." : "Đăng xuất"}</span>}
        </Button>
      </div>

      <button
        type="button"
        onClick={onToggleCollapse}
        className="hidden md:flex absolute top-1/2 -right-3.5 transform -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900 border border-white/10 items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 shadow-md shadow-black/50 z-20 cursor-pointer transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const pathname = usePathname() || "";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const roleLabel = user.role === "student" ? "Học sinh" : user.role === "admin" ? "Quản trị" : "Giáo viên";

  const teacherBase = "/dashboard/teacher";
  const studentBase = "/dashboard/student";

  const menuItems =
    user.role === "teacher"
      ? [
          { label: "Overview", vietnamese: "Tổng quan", href: teacherBase, icon: Home },
          {
            label: "Schedule",
            vietnamese: "Thời khoá biểu",
            href: `${teacherBase}/schedule`,
            icon: CalendarDays,
          },
          { label: "Quizzes", vietnamese: "Trắc nghiệm", href: `${teacherBase}/quizzies`, icon: Puzzle },
          { label: "Students", vietnamese: "Học sinh", href: `${teacherBase}/students`, icon: Users },
          { label: "Forum", vietnamese: "Diễn đàn", href: `${teacherBase}/forum`, icon: MessageSquare },
          { label: "Analytics", vietnamese: "Báo cáo", href: `${teacherBase}/analytics`, icon: TrendingUp },
          { label: "Settings", vietnamese: "Cài đặt", href: `${teacherBase}/settings`, icon: Settings },
        ]
      : [
          { label: "Overview", vietnamese: "Tổng quan", href: studentBase, icon: Home },
          {
            label: "My Courses",
            vietnamese: "Môn học",
            href: `${studentBase}/my-courses`,
            icon: BookOpen,
          },
          {
            label: "Assignments",
            vietnamese: "Bài tập",
            href: `${studentBase}/assignments`,
            icon: ClipboardList,
          },
          {
            label: "Results",
            vietnamese: "Kết quả",
            href: `${studentBase}/learning-results`,
            icon: TrendingUp,
          },
          {
            label: "Schedule",
            vietnamese: "Lịch học",
            href: `${studentBase}/schedule`,
            icon: CalendarDays,
          },
          {
            label: "Forum",
            vietnamese: "Diễn đàn",
            href: `${studentBase}/forum`,
            icon: MessageSquare,
          },
        ];

  // Dummy Notifications
  const notifications = [
    {
      id: 1,
      title: "Quiz mới đã nộp",
      desc: "Nguyễn Văn A đã hoàn thành bài thi SQL",
      time: "5 phút trước",
      type: "success"
    },
    {
      id: 2,
      title: "Hệ thống nâng cấp",
      desc: "Zenith EDU cập nhật giao diện v2.0",
      time: "2 giờ trước",
      type: "info"
    }
  ];

  const isItemActive = (href: string, label: string) => {
    const hrefPath = href.split("#")[0];
    if (label === "Overview") {
      return pathname === hrefPath;
    }
    if (label === "Quizzes") {
      return (
        pathname === href ||
        pathname.startsWith(`${href}/`) ||
        pathname.includes("/quizzes/") ||
        pathname.includes("quiz-editor") ||
        pathname.includes("quiz-create")
      );
    }
    return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
  };

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  // Keyboard shortcut listener for Search (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("global-search");
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sidebarProps: DashboardSidebarProps = {
    isCollapsed,
    onToggleCollapse: () => setIsCollapsed((prev) => !prev),
    user,
    roleLabel,
    menuItems,
    isItemActive,
    onLogout: handleLogout,
    isPending,
  };

  return (
    <div className="zenith-mesh min-h-screen flex overflow-x-hidden relative text-slate-100 font-sans antialiased selection:bg-violet-500/35 selection:text-white">
      <div className="absolute inset-0 zenith-grid opacity-40 pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-cyan-500/6 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Desktop Sidebar Layout */}
      <aside
        className={`hidden md:block shrink-0 h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <DashboardSidebar {...sidebarProps} />
      </aside>

      {/* Primary Workspace Shell */}
      <div className="flex-1 flex flex-col min-h-screen z-10 relative overflow-hidden">
        {/* Topbar Header */}
        <header className="h-16 border-b border-white/10 zenith-glass flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 gap-4">
          {/* Left Topbar Content: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-slate-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-[#07060f] border-white/8 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Navigation</SheetTitle>
                </SheetHeader>
                <DashboardSidebar {...sidebarProps} />
              </SheetContent>
            </Sheet>
            
            {/* dynamic breadcrumbs */}
            <Breadcrumbs />
          </div>

          {/* Right Topbar Content: Search, Notifications, Avatar */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Global Search Faux Input */}
            <div className="relative hidden sm:block w-48 lg:w-64">
              <Search className="w-4.5 h-4.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                id="global-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm nhanh..."
                className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-violet-500/30 focus:bg-slate-900/50 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 focus:outline-none text-xs text-white transition-all placeholder:text-slate-500"
              />
              <kbd className="absolute right-2.5 top-1/2 transform -translate-y-1/2 px-1.5 py-0.5 rounded bg-white/[0.06] text-[9px] font-mono text-slate-400 border border-white/[0.05] pointer-events-none select-none">
                Ctrl K
              </kbd>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notification Center */}
            <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileDropdown(false);
                  }}
                  className={`relative w-10 h-10 flex items-center justify-center hover:bg-white/[0.06] text-slate-400 hover:text-white rounded-lg cursor-pointer ${
                    showNotifications ? "bg-white/[0.06] text-white" : ""
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#05040f]" />
                </Button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0d0c1d] border border-white/[0.08] shadow-2xl shadow-black/80 p-4 z-50 focus:outline-none"
                  >
                    <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-white/[0.05]">
                      <span className="font-semibold text-sm text-white">Thông báo</span>
                      <span className="text-[10px] text-indigo-400 font-bold uppercase cursor-pointer hover:underline">
                        Đọc tất cả
                      </span>
                    </div>
                    <div className="space-y-2.5 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] flex items-start gap-2.5 transition-colors cursor-pointer"
                        >
                          {n.type === "success" ? (
                            <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4.5 h-4.5 text-indigo-400 shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white leading-4">{n.title}</p>
                            <p className="text-[11px] text-slate-400 leading-4 mt-0.5 truncate">{n.desc}</p>
                            <span className="text-[9px] text-slate-500 mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 text-left hover:opacity-85 focus:outline-none cursor-pointer group"
              >
                <Avatar className="h-9 w-9 ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all shrink-0">
                  <AvatarFallback
                    className={
                      user.role === "student"
                        ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-bold"
                        : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold"
                    }
                  >
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0d0c1d] border border-white/[0.08] shadow-2xl shadow-black/80 p-2.5 z-50 focus:outline-none"
                  >
                    <div className="px-3 py-2 border-b border-white/[0.05] mb-2">
                      <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                      <Badge
                        variant="secondary"
                        className={`mt-1 text-[9px] uppercase tracking-wider ${
                          user.role === "student"
                            ? "bg-cyan-500/10 text-cyan-400 border-0"
                            : "bg-indigo-500/10 text-indigo-400 border-0"
                        }`}
                      >
                        {user.role === "student" ? (
                          <GraduationCap className="w-2.5 h-2.5 mr-1 inline" />
                        ) : (
                          <School className="w-2.5 h-2.5 mr-1 inline" />
                        )}
                        {roleLabel}
                      </Badge>
                    </div>

                    <Link href={user.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student"}>
                      <button className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4 text-indigo-400" />
                        Tài khoản của tôi
                      </button>
                    </Link>

                    <Link
                      href={
                        user.role === "teacher"
                          ? "/dashboard/teacher/settings"
                          : "/dashboard/student"
                      }
                    >
                      <button className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                        <Settings className="w-4 h-4 text-indigo-400" />
                        Cài đặt hệ thống
                      </button>
                    </Link>

                    <div className="border-t border-white/[0.05] my-2" />

                    <button
                      onClick={handleLogout}
                      disabled={isPending}
                      className="w-full text-left px-3 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>{isPending ? "Đang rời..." : "Đăng xuất"}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Global Page Content Container */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
