"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, CheckCircle, BarChart3 } from "lucide-react";

interface StatsCardsProps {
    totalClasses: number;
    totalStudents: number;
    activeStudents: number;
    avgClassScore: number;
}

export function StatsCards({ totalClasses, totalStudents, activeStudents, avgClassScore }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <GraduationCap size={24} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-2xl font-bold text-slate-900">{totalClasses}</p>
                        <p className="text-sm text-slate-500">Tổng số lớp</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
                        <p className="text-sm text-slate-500">Tổng số học sinh</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-2xl font-bold text-slate-900">{activeStudents}</p>
                        <p className="text-sm text-slate-500">Học sinh hoạt động</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                            <BarChart3 size={24} />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-2xl font-bold text-slate-900">{avgClassScore}%</p>
                        <p className="text-sm text-slate-500">Điểm trung bình</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
