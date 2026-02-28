"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface QuickStatsProps {
    createdQuizzes: number;
    totalQuizzes: number;
    playedQuizzes: number;
    totalStudents: number;
    activeClasses: number;
    totalClasses: number;
}

export function QuickStats({
    createdQuizzes,
    totalQuizzes,
    playedQuizzes,
    totalStudents,
    activeClasses,
    totalClasses
}: QuickStatsProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Tỷ lệ hoàn thành</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Quiz đã tạo</span>
                            <span className="font-semibold">{createdQuizzes}/{totalQuizzes}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600 rounded-full" style={{ width: `${(createdQuizzes / totalQuizzes) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Bài đã chơi</span>
                            <span className="font-semibold">{playedQuizzes}/{totalStudents}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(playedQuizzes / totalStudents) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Lớp đang hoạt động</span>
                            <span className="font-semibold">{activeClasses}/{totalClasses}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-600 rounded-full" style={{ width: `${(activeClasses / totalClasses) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={16} />
                            <span>12 bài mới hôm nay</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
