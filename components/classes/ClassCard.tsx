"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye, Edit, Users, BookOpen, CheckCircle, BarChart3 } from "lucide-react";
import { ClassData } from "@/lib/types/quiz";

interface ClassCardProps {
    cls: ClassData & { computedStudentsCount: number };
    onView?: () => void;
    onEdit?: () => void;
}

export function ClassCard({ cls, onView, onEdit }: ClassCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">{cls.name}</CardTitle>
                        <p className="text-sm text-slate-500">{cls.grade}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical size={16} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Users size={16} className="text-blue-500" />
                        <span>{cls.computedStudentsCount} học sinh</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <BookOpen size={16} className="text-purple-500" />
                        <span>{cls.activeQuizzes} quiz</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <CheckCircle size={16} className="text-green-500" />
                        <span>{cls.completedQuizzes} đã làm</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <BarChart3 size={16} className="text-orange-500" />
                        <span>{cls.avgScore} điểm</span>
                    </div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
                        <Eye size={14} className="mr-1" /> Xem
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
                        <Edit size={14} className="mr-1" /> Sửa
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
