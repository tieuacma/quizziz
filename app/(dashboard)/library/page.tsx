"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { QuizFilters } from "@/components/library/QuizFilters";
import { QuizList } from "@/components/library/QuizList";

const quizzes = [
    { id: 1, title: "Lý giữa kì I", subject: "Vật lý", grade: "Lớp 7", questions: 25, plays: 245, completion: 92, avgScore: 82, status: "Đã tạo", difficulty: "Trung bình", createdAt: "2024-01-15" },
    { id: 2, title: "Sinh giữa kì I", subject: "Sinh học", grade: "Lớp 8", questions: 30, plays: 189, completion: 88, avgScore: 75, status: "Đã tạo", difficulty: "Dễ", createdAt: "2024-01-14" },
    { id: 3, title: "Tin học giữa kì I", subject: "Máy tính", grade: "Lớp 10", questions: 40, plays: 156, completion: 78, avgScore: 85, status: "Đã tạo", difficulty: "Trung bình", createdAt: "2024-01-13" },
    { id: 4, title: "Toán học kì I", subject: "Toán", grade: "Lớp 9", questions: 20, plays: 312, completion: 95, avgScore: 68, status: "Bản nháp", difficulty: "Khó", createdAt: "2024-01-12" },
    { id: 5, title: "Hóa học chương 4", subject: "Hóa học", grade: "Lớp 10", questions: 35, plays: 98, completion: 65, avgScore: 72, status: "Đã tạo", difficulty: "Trung bình", createdAt: "2024-01-11" },
    { id: 6, title: "Tiếng Anh chương 3", subject: "Tiếng Anh", grade: "Lớp 8", questions: 28, plays: 167, completion: 82, avgScore: 79, status: "Đã tạo", difficulty: "Dễ", createdAt: "2024-01-10" },
];

const subjects = ["Tất cả", "Toán", "Vật lý", "Hóa học", "Sinh học", "Tiếng Anh", "Máy tính"];
const grades = ["Tất cả", "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10"];

export default function LibraryPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("Tất cả");
    const [selectedGrade, setSelectedGrade] = useState("Tất cả");

    const filteredQuizzes = quizzes.filter(quiz => {
        const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === "Tất cả" || quiz.subject === selectedSubject;
        const matchesGrade = selectedGrade === "Tất cả" || quiz.grade === selectedGrade;
        return matchesSearch && matchesSubject && matchesGrade;
    });

    const totalQuizzes = quizzes.length;
    const publishedQuizzes = quizzes.filter(q => q.status === "Đã tạo").length;
    const draftQuizzes = quizzes.filter(q => q.status === "Bản nháp").length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Thư viện</h1>
                    <p className="text-slate-500">Quản lý và tổ chức các quiz của bạn</p>
                </div>
                <Link href="/create-quiz" target="_self">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus size={18} className="mr-2" />
                        Tạo Quiz mới
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <span className="font-bold">📚</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{totalQuizzes}</p>
                            <p className="text-sm text-slate-500">Tổng số Quiz</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <span className="font-bold">✓</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{publishedQuizzes}</p>
                            <p className="text-sm text-slate-500">Đã xuất bản</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                            <span className="font-bold">📝</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{draftQuizzes}</p>
                            <p className="text-sm text-slate-500">Bản nháp</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <QuizFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
                subjects={subjects}
                grades={grades}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            <Tabs defaultValue="created">
                <TabsList className="border-b mb-4">
                    <TabsTrigger value="created" className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-purple-600">
                        Đã tạo ({publishedQuizzes})
                    </TabsTrigger>
                    <TabsTrigger value="draft" className="px-4 py-2">Bản nháp ({draftQuizzes})</TabsTrigger>
                    <TabsTrigger value="archived" className="px-4 py-2">Lưu trữ (0)</TabsTrigger>
                </TabsList>

                <TabsContent value="created">
                    <QuizList quizzes={filteredQuizzes.filter(q => q.status === "Đã tạo")} viewMode={viewMode} />
                </TabsContent>

                <TabsContent value="draft">
                    <QuizList quizzes={filteredQuizzes.filter(q => q.status === "Bản nháp")} viewMode={viewMode} />
                </TabsContent>

                <TabsContent value="archived">
                    <Card>
                        <CardContent className="py-12 text-center text-slate-500">
                            <p>Chưa có quiz nào được lưu trữ</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
