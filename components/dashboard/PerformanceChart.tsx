"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PerformanceData {
    day: string;
    value: number;
}

interface PerformanceChartProps {
    data: PerformanceData[];
    title?: string;
}

export function PerformanceChart({ data, title = "Hoạt động tuần này" }: PerformanceChartProps) {
    return (
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <select className="text-sm border rounded-lg px-2 py-1 bg-white">
                    <option>Tuần này</option>
                    <option>Tuần trước</option>
                    <option>Tháng này</option>
                </select>
            </CardHeader>
            <CardContent>
                <div className="h-48 flex items-end justify-between gap-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div
                                className="w-full bg-purple-100 rounded-t-lg hover:bg-purple-200 transition-all relative group"
                                style={{ height: `${item.value}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {item.value}%
                                </div>
                            </div>
                            <span className="text-xs text-slate-500">{item.day}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
