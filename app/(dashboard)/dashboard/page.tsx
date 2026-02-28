"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { DashboardStats } from "@/components/dashboard/StatsCards";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { QuickActions } from "@/components/dashboard/QuickActions";

const stats = [
    { title: "Tổng Quiz", value: "156", icon: "BookOpen", trend: "+12%", trendUp: true, color: "bg-purple-100 text-purple-600" },
    { title: "Học sinh", value: "2,480", icon: "Users", trend: "+8%", trendUp: true, color: "bg-blue-100 text-blue-600" },
    { title: "Lớp học", value: "45", icon: "GraduationCap", trend: "+3%", trendUp: true, color: "bg-green-100 text-green-600" },
    { title: "Hoàn thành", value: "89%", icon: "TrendingUp", trend: "+5%", trendUp: true, color: "bg-orange-100 text-orange-600" },
];

const recentActivities = [
    { id: 1, title: "Lý giữa kì I", subject: "Vật lý", grade: "Lớp 7", questions: 25, status: "Đã tạo", time: "2 giờ trước", type: "quiz" },
    { id: 2, title: "Sinh giữa kì I", subject: "Sinh học", grade: "Lớp 8", questions: 30, status: "Đã tạo", time: "5 giờ trước", type: "quiz" },
    { id: 3, title: "Toán học kì I", subject: "Toán", grade: "Lớp 9", questions: 20, status: "Bản nháp", time: "1 ngày trước", type: "quiz" },
    { id: 4, title: "Tiếng Anh chương 3", subject: "Tiếng Anh", grade: "Lớp 10", questions: 40, status: "Đã tạo", time: "2 ngày trước", type: "quiz" },
];

const performanceData = [
    { day: "T2", value: 65 }, { day: "T3", value: 78 }, { day: "T4", value: 82 }, { day: "T5", value: 70 },
    { day: "T6", value: 90 }, { day: "T7", value: 85 }, { day: "CN", value: 92 },
];

const quickActions = [
    { href: "/create-quiz", title: "Tạo Quiz mới", description: "Tạo bài kiểm tra mới", icon: "BookOpen", colorClass: "bg-purple-100 text-purple-600" },
    { href: "/dashboard/classes", title: "Quản lý lớp học", description: "Thêm học sinh vào lớp", icon: "Users", colorClass: "bg-blue-100 text-blue-600" },
    { href: "/dashboard/reports", title: "Xem báo cáo", description: "Phân tích kết quả học tập", icon: "GraduationCap", colorClass: "bg-green-100 text-green-600" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Trang chủ</h1>
                    <p className="text-slate-500">Chào mừng quay lại! Đây là tổng quan về hoạt động của bạn.</p>
                </div>
                <Link href="/create-quiz" target="_self">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus size={18} className="mr-2" />
                        Tạo Quiz mới
                    </Button>
                </Link>
            </div>

            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PerformanceChart data={performanceData} />
                <QuickStats createdQuizzes={120} totalQuizzes={156} playedQuizzes={1890} totalStudents={2480} activeClasses={42} totalClasses={45} />
            </div>

            <RecentActivities activities={recentActivities} />

            <QuickActions actions={quickActions} />
        </div>
    );
}
