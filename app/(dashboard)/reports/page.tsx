"use client";

import { useState } from "react";
import {
    BarChart3,
    TrendingUp,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    Download,
    Filter,
    Eye,
    Play,
    MoreVertical,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    BookOpen,
    Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Mock data for reports
const reportStats = [
    {
        title: "Tổng lượt chơi",
        value: "12,450",
        icon: Play,
        trend: "+18%",
        trendUp: true,
        color: "bg-purple-100 text-purple-600"
    },
    {
        title: "Hoàn thành",
        value: "89%",
        icon: CheckCircle,
        trend: "+5%",
        trendUp: true,
        color: "bg-green-100 text-green-600"
    },
    {
        title: "Trung bình điểm",
        value: "78.5",
        icon: Target,
        trend: "+2.3",
        trendUp: true,
        color: "bg-blue-100 text-blue-600"
    },
    {
        title: "Thời gian TB",
        value: "12 ph",
        icon: Clock,
        trend: "-1 ph",
        trendUp: true,
        color: "bg-orange-100 text-orange-600"
    },
];

// Quiz results data
const quizResults = [
    {
        id: 1,
        title: "Lý giữa kì I",
        subject: "Vật lý",
        grade: "Lớp 7",
        plays: 245,
        completion: 92,
        avgScore: 82,
        avgTime: "15 ph",
        difficulty: "Trung bình",
        date: "2024-01-15"
    },
    {
        id: 2,
        title: "Sinh giữa kì I",
        subject: "Sinh học",
        grade: "Lớp 8",
        plays: 189,
        completion: 88,
        avgScore: 75,
        avgTime: "18 ph",
        difficulty: "Dễ",
        date: "2024-01-14"
    },
    {
        id: 3,
        title: "Toán học kì I",
        subject: "Toán",
        grade: "Lớp 9",
        plays: 312,
        completion: 95,
        avgScore: 68,
        avgTime: "20 ph",
        difficulty: "Khó",
        date: "2024-01-13"
    },
    {
        id: 4,
        title: "Tiếng Anh chương 3",
        subject: "Tiếng Anh",
        grade: "Lớp 10",
        plays: 156,
        completion: 78,
        avgScore: 85,
        avgTime: "12 ph",
        difficulty: "Trung bình",
        date: "2024-01-12"
    },
    {
        id: 5,
        title: "Hóa học chương 4",
        subject: "Hóa học",
        grade: "Lớp 10",
        plays: 98,
        completion: 65,
        avgScore: 72,
        avgTime: "14 ph",
        difficulty: "Trung bình",
        date: "2024-01-11"
    },
];

// Performance by subject
const subjectPerformance = [
    { subject: "Toán", score: 68, color: "bg-red-500" },
    { subject: "Vật lý", score: 82, color: "bg-blue-500" },
    { subject: "Hóa học", score: 75, color: "bg-green-500" },
    { subject: "Sinh học", score: 78, color: "bg-purple-500" },
    { subject: "Tiếng Anh", score: 85, color: "bg-orange-500" },
];

// Weekly performance
const weeklyPerformance = [
    { day: "T2", score: 72 },
    { day: "T3", score: 78 },
    { day: "T4", score: 75 },
    { day: "T5", score: 82 },
    { day: "T6", score: 88 },
    { day: "T7", score: 85 },
    { day: "CN", score: 90 },
];

export default function ReportsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("overview");

    const filteredQuizzes = quizResults.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Báo cáo</h1>
                    <p className="text-slate-500">Theo dõi và phân tích kết quả học tập</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">
                        <Filter size={18} className="mr-2" />
                        Lọc
                    </Button>
                    <Button variant="outline">
                        <Download size={18} className="mr-2" />
                        Xuất Excel
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportStats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-xl ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {stat.trend}
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-sm text-slate-500">{stat.title}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-white border-b w-full justify-start h-auto p-0 mb-4">
                    <TabsTrigger
                        value="overview"
                        className="px-4 py-2.5 rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:bg-purple-50"
                    >
                        Tổng quan
                    </TabsTrigger>
                    <TabsTrigger
                        value="quizzes"
                        className="px-4 py-2.5 rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:bg-purple-50"
                    >
                        Chi tiết Quiz
                    </TabsTrigger>
                    <TabsTrigger
                        value="students"
                        className="px-4 py-2.5 rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:bg-purple-50"
                    >
                        Theo học sinh
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Weekly Performance */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <BarChart3 size={20} className="text-purple-600" />
                                    Hoạt động tuần này
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-48 flex items-end justify-between gap-2">
                                    {weeklyPerformance.map((item, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className="w-full bg-purple-100 rounded-t-lg hover:bg-purple-200 transition-all relative group"
                                                style={{ height: `${item.score}%` }}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {item.score} điểm
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-500">{item.day}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Performance by Subject */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <BookOpen size={20} className="text-purple-600" />
                                    Điểm trung bình theo môn
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {subjectPerformance.map((item, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-slate-700">{item.subject}</span>
                                                <span className="text-slate-500">{item.score} điểm</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${item.color} rounded-full`}
                                                    style={{ width: `${item.score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Quiz Results */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-semibold">Kết quả Quiz gần đây</CardTitle>
                            <Button variant="outline" size="sm">Xem tất cả</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-semibold text-slate-600">Tên Quiz</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-600">Môn</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-600">Lớp</th>
                                            <th className="text-center py-3 px-4 font-semibold text-slate-600">Lượt chơi</th>
                                            <th className="text-center py-3 px-4 font-semibold text-slate-600">Hoàn thành</th>
                                            <th className="text-center py-3 px-4 font-semibold text-slate-600">Điểm TB</th>
                                            <th className="text-center py-3 px-4 font-semibold text-slate-600">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quizResults.slice(0, 5).map((quiz) => (
                                            <tr key={quiz.id} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-4">
                                                    <p className="font-medium text-slate-900">{quiz.title}</p>
                                                    <p className="text-xs text-slate-400">{quiz.date}</p>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600">{quiz.subject}</td>
                                                <td className="py-3 px-4 text-slate-600">{quiz.grade}</td>
                                                <td className="py-3 px-4 text-center font-medium">{quiz.plays}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs ${quiz.completion >= 90 ? 'bg-green-100 text-green-700' : quiz.completion >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                        {quiz.completion}%
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`font-semibold ${quiz.avgScore >= 80 ? 'text-green-600' : quiz.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                        {quiz.avgScore}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Eye size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Quizzes Tab */}
                <TabsContent value="quizzes">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-semibold">Chi tiết tất cả Quiz</CardTitle>
                            <div className="flex gap-3">
                                <Input
                                    placeholder="Tìm kiếm quiz..."
                                    className="w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-slate-50">
                                            <th className="text-left py-3 px-4 font-semibold text-slate-600">Tên Quiz</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-600">Môn học</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-600">Lớp</th>
                                            <th className="text-center py-3 px-4 font-semibold text-slate-600">Lượt chơi</th>
                                            <th className="text-center py-3 px-4 font-semibold text-slate-600">Hoàn thành</th>
                                            <th className="text-center py-3 px-4 font-semibold text-slate-600">Điểm TB</th>
                                            <th className="text-center py-3 px-4 font-semibold text-slate-600">Thời gian TB</th>
                                            <th className="text-center py-3 px-4 font-semibold text-slate-600">Độ khó</th>
                                            <th className="text-center py-3 px-4 font-semibold text-slate-600">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredQuizzes.map((quiz) => (
                                            <tr key={quiz.id} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-4">
                                                    <p className="font-medium text-slate-900">{quiz.title}</p>
                                                    <p className="text-xs text-slate-400">{quiz.date}</p>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600">{quiz.subject}</td>
                                                <td className="py-3 px-4 text-slate-600">{quiz.grade}</td>
                                                <td className="py-3 px-4 text-center font-medium">{quiz.plays}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-green-500 rounded-full"
                                                                style={{ width: `${quiz.completion}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-slate-500">{quiz.completion}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className={`font-semibold ${quiz.avgScore >= 80 ? 'text-green-600' : quiz.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                        {quiz.avgScore}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center text-slate-600">{quiz.avgTime}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <Badge variant={
                                                        quiz.difficulty === 'Dễ' ? 'default' :
                                                            quiz.difficulty === 'Khó' ? 'destructive' : 'secondary'
                                                    }>
                                                        {quiz.difficulty}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Eye size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Students Tab */}
                <TabsContent value="students">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Theo dõi theo học sinh</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-slate-500">
                                <Users size={48} className="mx-auto mb-4 text-slate-300" />
                                <p>Tính năng đang được phát triển</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
