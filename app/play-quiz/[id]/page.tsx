// app/play-quiz/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuizStore } from "@/lib/stores/quizStore"; // Dùng Store mới
import { QuizPlayer } from "@/components/quiz/QuizPlayer";

export default function PlayQuizPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id as string;

    // Lấy hàm lấy dữ liệu từ Zustand
    const getQuizFromStore = useQuizStore((state) => state.getQuizDetail);
    const setQuizToStore = useQuizStore((state) => state.setQuizDetail);

    const [quiz, setQuiz] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadQuiz = async () => {
            if (!quizId) return;
            setIsLoading(true);

            try {
                // 1. Thử lấy từ Zustand Store trước (cực nhanh và chính xác nếu vừa lưu xong)
                let quizData = getQuizFromStore(quizId);

                // 2. Nếu Store chưa có (ví dụ copy link gửi người khác), mới gọi API
                if (!quizData) {
                    console.log("Store trống, đang gọi API...");
                    const response = await fetch(`/api/quizzes/${quizId}?t=${Date.now()}`, {
                        cache: 'no-store' // Chống cache của trình duyệt
                    });

                    if (!response.ok) throw new Error("Quiz không tồn tại trên máy chủ");

                    quizData = await response.json();

                    // Lưu ngược lại vào Store để lần sau vào lại là có ngay
                    if (quizData) setQuizToStore(quizId, quizData);
                }

                if (!quizData || !quizData.questions || quizData.questions.length === 0) {
                    throw new Error("Dữ liệu Quiz bị trống hoặc không hợp lệ");
                }

                setQuiz(quizData);
            } catch (err: any) {
                setError(err.message || "Có lỗi xảy ra");
            } finally {
                setIsLoading(false);
            }
        };

        loadQuiz();
    }, [quizId, getQuizFromStore, setQuizToStore]);

    // Các đoạn render Loading và Error giữ nguyên như của bạn...
    if (isLoading) return <div className="...">Đang tải...</div>;
    if (error) return <div className="...">Lỗi: {error}</div>;

    return quiz ? <QuizPlayer quiz={quiz} /> : null;
}