"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, Users, GraduationCap, BarChart3 } from "lucide-react";

interface QuickAction {
    href: string;
    title: string;
    description: string;
    icon: string;
    colorClass: string;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    BookOpen,
    Users,
    GraduationCap,
    BarChart3,
};

interface QuickActionsProps {
    actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actions.map((action, index) => {
                const Icon = iconMap[action.icon] || BookOpen;
                return (
                    <Link key={index} href={action.href} className="block">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`p-3 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors ${action.colorClass}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{action.title}</p>
                                    <p className="text-sm text-slate-500">{action.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                );
            })}
        </div>
    );
}
