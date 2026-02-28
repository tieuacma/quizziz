"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap, TrendingUp } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: string;
    trend: string;
    trendUp: boolean;
    color: string;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    BookOpen,
    Users,
    GraduationCap,
    TrendingUp,
};

function StatCard({ title, value, icon, trend, trendUp, color }: StatCardProps) {
    const Icon = iconMap[icon] || BookOpen;
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${color}`}>
                        <Icon size={24} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        {trend}
                    </div>
                </div>
                <div className="mt-3">
                    <p className="text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-sm text-slate-500">{title}</p>
                </div>
            </CardContent>
        </Card>
    );
}

interface DashboardStatsProps {
    stats: StatCardProps[];
}

export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}
