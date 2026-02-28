"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Play, Eye } from "lucide-react";
import Link from "next/link";

interface Quiz {
    id: number;
    title: string;
    subject: string;
    grade: string;
    questions: number;
    plays: number;
    completion: number;
    avgScore: number;
    status: string;
    difficulty: string;
    createdAt: string;
}

interface QuizListProps {
    quizzes: Quiz[];
    viewMode: "grid" | "list";
}

export function QuizListGrid({ quizzes }: { quizzes: Quiz[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <CardTitle className="text-base font-semibold line-clamp-1">{quiz.title}</CardTitle>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical size={16} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">{quiz.subject}</Badge>
                            <Badge variant="outline" className="text-xs">{quiz.grade}</Badge>
                            <Badge variant={
                                quiz.difficulty === 'Dễ' ? 'default' :
                                    quiz.difficulty === 'Khó' ? 'destructive' : 'secondary'
                            } className="text-xs">
                                {quiz.difficulty}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1 text-slate-500">
                                <span>{quiz.questions} câu</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500">
                                <span>{quiz.plays} lượt</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500">
                                <span>{quiz.avgScore} điểm</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500">
                                <span>{quiz.completion}%</span>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t">
                            <Link href={`/play-quiz/quiz-${quiz.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                    <Play size={14} className="mr-1" /> Chơi
                                </Button>
                            </Link>
                            <Link href={`/quiz/quiz-${quiz.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                    <Eye size={14} className="mr-1" /> Xem
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function QuizListTable({ quizzes }: { quizzes: Quiz[] }) {
    return (
        <table className="w-full">
            <thead>
                <tr className="bg-slate-100">
                    <th className="text-left p-3">Tên hoạt động</th>
                    <th className="text-left p-3">Môn học</th>
                    <th className="text-left p-3">Lớp</th>
                    <th className="text-left p-3">Số câu hỏi</th>
                    <th className="text-left p-3">Lượt chơi</th>
                    <th className="text-left p-3">Trạng thái</th>
                    <th className="text-left p-3">Hành động</th>
                </tr>
            </thead>
            <tbody>
                {quizzes.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 border-b">
                        <td className="p-3">
                            <div>
                                <p className="font-medium text-slate-900">{item.title}</p>
                                <p className="text-xs text-slate-400">{item.createdAt}</p>
                            </div>
                        </td>
                        <td className="p-3">{item.subject}</td>
                        <td className="p-3">{item.grade}</td>
                        <td className="p-3">{item.questions}</td>
                        <td className="p-3 font-medium">{item.plays}</td>
                        <td className="p-3">
                            <span className={`px-2 py-1 rounded text-sm ${item.status === "Đã tạo" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {item.status}
                            </span>
                        </td>
                        <td className="p-3 flex gap-2">
                            <Link href={`/play-quiz/quiz-${item.id}`}>
                                <Button variant="outline" size="sm">Chơi</Button>
                            </Link>
                            <Link href={`/quiz/quiz-${item.id}`}>
                                <Button variant="outline" size="sm">Chỉnh sửa</Button>
                            </Link>
                            <Button variant="outline" size="sm">Chia sẻ</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export function QuizList({ quizzes, viewMode }: QuizListProps) {
    if (viewMode === "grid") {
        return <QuizListGrid quizzes={quizzes} />;
    }
    return <QuizListTable quizzes={quizzes} />;
}
