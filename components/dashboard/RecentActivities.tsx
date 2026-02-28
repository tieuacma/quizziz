"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Play, Eye, Edit } from "lucide-react";

interface Activity {
    id: number;
    title: string;
    subject: string;
    grade: string;
    questions: number;
    status: string;
    time: string;
    type: string;
}

interface RecentActivitiesProps {
    activities: Activity[];
    onViewAll?: () => void;
}

export function RecentActivities({ activities, onViewAll }: RecentActivitiesProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Hoạt động gần đây</CardTitle>
                <Button variant="outline" size="sm" onClick={onViewAll}>Xem tất cả</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${activity.status === 'Đã tạo' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {activity.status === 'Đã tạo' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{activity.title}</p>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span>{activity.subject}</span>
                                        <span>•</span>
                                        <span>{activity.grade}</span>
                                        <span>•</span>
                                        <span>{activity.questions} câu</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant={activity.status === 'Đã tạo' ? 'default' : 'secondary'}>
                                    {activity.status}
                                </Badge>
                                <span className="text-sm text-slate-400">{activity.time}</span>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Play size={16} />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Eye size={16} />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Edit size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
