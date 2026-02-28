"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, GraduationCap, FileText, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import classesData from "@/data/admin/classes.json";

// Subject options
const subjects = [
    "Toán",
    "Vật lý",
    "Hóa học",
    "Sinh học",
    "Tiếng Anh",
    "Ngữ văn",
    "Lịch sử",
    "Địa lý",
    "Tin học",
    "Giáo dục công dân",
];

interface ClassInfo {
    id: string;
    name: string;
    grade: string;
}

export default function CreateQuizPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        subject: "",
        classId: "",
        description: "",
    });

    const classes = classesData as ClassInfo[];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.subject || !formData.classId) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
            // Create quiz via API (which writes to JSON file)
            const response = await fetch("/api/quizzes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    subject: formData.subject,
                    classId: formData.classId,
                    description: formData.description,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create quiz");
            }

            const newQuiz = await response.json();
            const quizId = newQuiz.id;

            // Also save to localStorage as fallback
            const quizDetail = {
                ...newQuiz,
                questions: [],
            };

            const existingQuizzes = JSON.parse(localStorage.getItem("quizziz") || "[]");
            localStorage.setItem("quizziz", JSON.stringify([...existingQuizzes, newQuiz]));
            localStorage.setItem(`quizziz_${quizId}`, JSON.stringify(quizDetail));

            setIsLoading(false);
            router.push(`/quiz/${quizId}`);
        } catch (error) {
            console.error("Error creating quiz:", error);
            alert("Có lỗi xảy ra khi tạo quiz. Vui lòng thử lại.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b px-8 py-4">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-slate-500 hover:text-slate-700 mb-4"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Quay lại Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Tạo Quiz mới</h1>
                    <p className="text-slate-500">Thiết lập thông tin cơ bản cho bài Quiz của bạn</p>
                </div>
            </header>

            {/* Form */}
            <main className="max-w-3xl mx-auto py-8 px-4">
                <form onSubmit={handleSubmit}>
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText size={20} className="text-purple-600" />
                                Thông tin bài Quiz
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Quiz Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Tên bài Quiz <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="VD: Kiểm tra giữa kì I - Toán học"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Môn học <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                >
                                    <option value="">Chọn môn học</option>
                                    {subjects.map((subject) => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Class */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Lớp học <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                                    value={formData.classId}
                                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                    required
                                >
                                    <option value="">Chọn lớp học</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.name} - {cls.grade}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Mô tả (không bắt buộc)
                                </label>
                                <textarea
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-transparent min-h-[100px] resize-none"
                                    placeholder="Mô tả ngắn về nội dung bài Quiz..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview Card */}
                    {formData.title && (
                        <Card className="mb-6 border-purple-200 bg-purple-50">
                            <CardHeader>
                                <CardTitle className="text-lg text-purple-700">Xem trước</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    <h3 className="font-semibold text-slate-900">{formData.title}</h3>
                                    <div className="flex gap-2">
                                        {formData.subject && (
                                            <Badge variant="outline" className="bg-white">
                                                <BookOpen size={12} className="mr-1" />
                                                {formData.subject}
                                            </Badge>
                                        )}
                                        {classes.find((c) => c.id === formData.classId) && (
                                            <Badge variant="outline" className="bg-white">
                                                <GraduationCap size={12} className="mr-1" />
                                                {classes.find((c) => c.id === formData.classId)?.name}
                                            </Badge>
                                        )}
                                    </div>
                                    {formData.description && (
                                        <p className="text-sm text-slate-500 mt-2">{formData.description}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <Link href="/dashboard">
                            <Button variant="outline" type="button">
                                Hủy
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                "Đang tạo..."
                            ) : (
                                <>
                                    <Save size={18} className="mr-2" />
                                    Tạo và soạn câu hỏi
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
