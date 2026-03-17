"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuizStore } from "@/stores/quizStore";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { AlertCircle, Loader2, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseQuiz } from "@/lib/hooks/useSupabaseQuiz";
import { useAuth } from "@/hooks/use-auth";

export default function PlayQuizPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id as string;

    const getQuizFromStore = useQuizStore((state) => state.getQuizDetail);
    const setQuizToStore = useQuizStore((state) => state.setQuizDetail);

    const [quiz, setQuiz] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studentName, setStudentName] = useState("");
    const [showQuiz, setShowQuiz] = useState(false);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const { user } = useAuth();
    const { initializeAttempt } = useSupabaseQuiz();

    useEffect(() => {
        const loadQuiz = async () => {
            if (!quizId) return;

            setIsLoading(true);
            setError(null);

            try {
                let quizData = getQuizFromStore(quizId);

                if (!quizData) {
                    console.log(`[PDA] Store trống cho ID: ${quizId}. Đang gọi API...`);

                    const response = await fetch(
                        `/api/quizzes/${quizId}?t=${Date.now()}`,
                        { cache: "no-store" }
                    );

                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error(
                                "Không tìm thấy bài Quiz này. Có thể nó đã bị xóa hoặc đường dẫn sai."
                            );
                        }
                        throw new Error(
                            `Lỗi máy chủ (${response.status}). Vui lòng thử lại sau.`
                        );
                    }

                    const rawText = await response.text();

                    if (!rawText || rawText.trim() === "" || rawText === "undefined") {
                        throw new Error("Dữ liệu từ máy chủ trả về không hợp lệ.");
                    }

                    try {
                        quizData = JSON.parse(rawText);
                    } catch {
                        throw new Error("Dữ liệu Quiz bị lỗi định dạng JSON.");
                    }

                    if (quizData) setQuizToStore(quizId, quizData);
                }

                if (
                    !quizData ||
                    !quizData.questions ||
                    !Array.isArray(quizData.questions)
                ) {
                    throw new Error(
                        "Bài Quiz này không có câu hỏi hoặc dữ liệu không hợp lệ."
                    );
                }

                setQuiz(quizData);
            } catch (err: any) {
                console.error("[PDA-Error]:", err);
                setError(err.message || "Có lỗi không xác định xảy ra");
            } finally {
                setIsLoading(false);
            }
        };

        loadQuiz();
    }, [quizId, getQuizFromStore, setQuizToStore]);

    // 🔄 Loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1a0a2e] flex flex-col items-center justify-center p-4">
                <Loader2 className="w-12 h-12 text-[#00d4ff] animate-spin mb-4" />
                <p className="text-[#e0e0ff]/70 animate-pulse font-medium text-lg">
                    Đang chuẩn bị bài thi...
                </p>
            </div>
        );
    }

    // ❌ Error
    if (error) {
        return (
            <div className="min-h-screen bg-[#1a0a2e] flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-[#2d1b4e]/90 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">
                            Ối! Có lỗi rồi
                        </h2>

                        <p className="text-[#e0e0ff]/70 mb-8">{error}</p>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => window.location.reload()}
                                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10"
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Thử lại
                            </Button>

                            <Button
                                onClick={() => router.push("/dashboard")}
                                className="w-full bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] text-white font-bold"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay về Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 🧑‍🎓 Nhập tên
    if (quiz && !showQuiz) {
        return (
            <div className="min-h-screen bg-[#1a0a2e] flex items-center justify-center p-4">
                <Card className="max-w-md w-full bg-[#2d1b4e]/90 border-[#00ff88]/30 shadow-[0_0_50px_rgba(0,255,136,0.3)]">
                    <CardContent className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Nhập tên học sinh
                        </h2>

                        <Input
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Tên học sinh..."
                            className="mb-4 text-xl h-14 text-center"
                            autoFocus
                        />

                        <Button
                            onClick={async () => {
                                /** * TẠM THỜI BYPASS SUPABASE ĐỂ CHƠI NGAY
                                 * Khi nào rảnh hãy sửa lại logic Database sau
                                 */
                                /*
                                const result = await initializeAttempt(quiz.id, studentName);
                                if (result.success) {
                                    setAttemptId(result.attemptId!);
                                    setShowQuiz(true);
                                } else {
                                    alert('Lỗi khởi tạo: ' + (result.error as Error).message);
                                }
                                */

                                // Tạo ID giả để Component QuizPlayer không bị lỗi prop
                                setAttemptId("temp-id-" + Date.now());
                                setShowQuiz(true);
                            }}
                            disabled={!studentName.trim()}
                            className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d2ad] text-white font-bold"
                        >
                            Bắt đầu làm bài
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 🎯 Play quiz
    return quiz ? (
        <QuizPlayer quiz={quiz} attemptId={attemptId!} />
    ) : null;
}
