"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Play, Eye } from "lucide-react";
import Link from "next/link";

interface DisplayQuiz {
    id: string; // Đây sẽ là _id từ MongoDB chuyển thành string
    title: string;
    subject: string;
    classId: string;
    description: string;
    createdAt: Date;
    questionsCount: number;
}

interface QuizListProps {
    quizzes: DisplayQuiz[];
    viewMode?: "grid" | "list";
}

export default function QuizList({ quizzes, viewMode = "grid" }: QuizListProps) {
    if (quizzes.length === 0) return <p className="text-center py-10 text-slate-500">Không có quiz nào.</p>;

    return viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <CardTitle className="text-base font-semibold line-clamp-1">{quiz.title}</CardTitle>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical size={16} /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{quiz.subject}</Badge>
                            <Badge variant="secondary">{quiz.questionsCount} câu</Badge>
                        </div>
                        <div className="text-sm text-slate-500 line-clamp-2">{quiz.description}</div>
                        <div className="flex gap-2 pt-2 border-t">
                            <Link href={`/play-quiz/${quiz.id}`} className="flex-1"><Button variant="outline" size="sm" className="w-full">Chơi</Button></Link>
                            <Link href={`/quiz/${quiz.id}`} className="flex-1"><Button variant="outline" size="sm" className="w-full">Sửa</Button></Link>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    ) : (
        // Render Table tương tự như file gốc của bạn...
        <p>Bảng danh sách (bạn có thể copy logic table cũ của bạn vào đây)</p>
    );
}