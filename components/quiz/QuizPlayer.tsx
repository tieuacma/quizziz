// app/components/quiz/QuizPlayer.tsx
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useQuizEngine, FlattenedQuestion } from "@/lib/hooks/useQuizEngine";
import { QuizDetail } from "@/lib/types/quiz";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import { QuizPlayerScreens } from "./QuizPlayer.screens";
import { QuizPlayerHeader } from "./QuizPlayer.header";
import { QuizPlayerQuestion } from "./QuizPlayer.question";
import { QuizPlayerFeedback } from "./QuizPlayer.feedback";
import { QuizPlayerFooter } from "./QuizPlayer.footer";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";

import { calculatePointsOptimistic, normalizeAnswer } from "./QuizPlayer.helpers";
import { DEFAULT_TIME_PER_QUESTION } from "./QuizPlayer.constants";

interface QuizPlayerProps {
    quiz: QuizDetail;
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
    const {
        state,
        currentQuestion,
        progress,
        accuracy,
        isOnFire,
        startQuiz,
        answerQuestion,
        nextQuestion,
        finishQuiz,
        restartQuiz,
    } = useQuizEngine(quiz);

    // Sound state
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Answer state
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");

    // Feedback state (optimistic)
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackResult, setFeedbackResult] = useState<{
        isCorrect: boolean;
        pointsEarned: number;
        correctAnswer: string;
    } | null>(null);

    // Score animation state
    const [displayScore, setDisplayScore] = useState(0);
    const [showFloatingScore, setShowFloatingScore] = useState(false);
    const [floatingPoints, setFloatingPoints] = useState(0);

    // Refs for performance
    const prevScoreRef = useRef(0);
    const isSubmittingRef = useRef(false);
    const questionKeyRef = useRef(0);

    // Memoize colors to prevent recreation
    const answerColors = useMemo(() =>
        ["bg-[#aecb05]", "bg-[#a352ff]", "bg-[#ff8c11]", "bg-[#00d2ad]"],
        []);

    // Optimized score counting animation
    useEffect(() => {
        if (state.score !== prevScoreRef.current) {
            const startScore = prevScoreRef.current;
            const endScore = state.score;
            const duration = 400;
            const startTime = performance.now();

            const animateScore = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Easing function (ease-out cubic)
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentScore = Math.round(startScore + (endScore - startScore) * eased);
                setDisplayScore(currentScore);

                if (progress < 1) {
                    requestAnimationFrame(animateScore);
                } else {
                    prevScoreRef.current = endScore;
                }
            };

            requestAnimationFrame(animateScore);
        }
    }, [state.score]);

    // Reset state when question changes
    // Reset state when question changes
    useEffect(() => {
        if (state.status === "ready") {
            // Reset score animation
            prevScoreRef.current = 0;
            setDisplayScore(0);

            // Reset answer UI
            setSelectedAnswer("");
            setShowFeedback(false);
            setFeedbackResult(null);
            setShowFloatingScore(false);
            setFloatingPoints(0);

            // Reset submit flag
            isSubmittingRef.current = false;

            // Reset question key (force re-render question component)
            questionKeyRef.current = 0;
        }
    }, [state.status]);

    // Track previous question index to detect question changes
    const prevQuestionIndexRef = useRef(state.currentFlattenedIndex);

    // Reset UI state when moving to next question (while playing)
    useEffect(() => {
        // Only reset when question actually changes and quiz is playing
        if (
            state.status === "playing" &&
            state.currentFlattenedIndex !== prevQuestionIndexRef.current
        ) {
            // Reset answer UI for new question
            setSelectedAnswer("");
            setShowFeedback(false);
            setFeedbackResult(null);
            setShowFloatingScore(false);
            setFloatingPoints(0);

            // Reset submit flag
            isSubmittingRef.current = false;

            // Increment question key to force re-render of question component
            questionKeyRef.current += 1;
        }

        // Update the previous question index
        prevQuestionIndexRef.current = state.currentFlattenedIndex;
    }, [state.currentFlattenedIndex, state.status]);

    const triggerConfetti = useCallback(() => {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.65 },
            colors: ['#00d4ff', '#ff00ff', '#00ff88', '#ffcc00', '#ff3366'],
            disableForReducedMotion: true,
            zIndex: 9999,
        });
    }, []);

    const handleSubmitAnswer = useCallback((overrideAnswer?: string) => {
        const answerToUse = overrideAnswer || selectedAnswer;

        // 1. Kiểm tra điều kiện đầu vào
        if (!currentQuestion || !answerToUse || isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        // 2. Xác định logic kiểm tra dựa trên loại câu hỏi
        const isMultipleChoice = currentQuestion.type === "multiple_choice";

        let isCorrect = false;
        let displayCorrectAnswer = "";

        if (isMultipleChoice) {
            // LỖI CŨ CỦA BẠN: So sánh ID với correctAnswer (vốn là text hoặc null)
            // SỬA THÀNH: So sánh ID người dùng chọn với correctOptionId từ JSON
            const correctId = currentQuestion.correctOptionId;
            isCorrect = answerToUse === correctId;

            // Lấy Text của đáp án đúng để hiển thị lên UI Feedback
            const correctOption = currentQuestion.options?.find(o => o.id === correctId);
            displayCorrectAnswer = correctOption ? correctOption.text : "Chưa xác định";
        } else {
            // Đối với câu hỏi điền từ (fill_blank)
            isCorrect = normalizeAnswer(answerToUse) === normalizeAnswer(currentQuestion.correctAnswer || "");
            displayCorrectAnswer = currentQuestion.correctAnswer || "";
        }

        // 3. Tính điểm (Optimistic)
        const pointsEarned = isCorrect
            ? calculatePointsOptimistic(state.timeRemaining, DEFAULT_TIME_PER_QUESTION, state.streak)
            : 0;

        // 4. Cập nhật UI Feedback ngay lập tức
        setFeedbackResult({
            isCorrect,
            pointsEarned,
            correctAnswer: displayCorrectAnswer // Truyền text (Anh) thay vì ID
        });
        setShowFeedback(true);

        // 5. Hiệu ứng nếu đúng
        if (isCorrect) {
            triggerConfetti();
            setFloatingPoints(pointsEarned);
            setShowFloatingScore(true);
        }

        // 6. Gửi kết quả về Engine để cập nhật State tổng (Score, Streak...)
        requestAnimationFrame(() => {
            answerQuestion(currentQuestion.id, answerToUse);
        });

        // 7. Tự động chuyển câu sau 1.2s
        setTimeout(() => {
            setShowFloatingScore(false);
            nextQuestion();
        }, 1200);
    }, [
        currentQuestion,
        selectedAnswer,
        state.timeRemaining,
        state.streak,
        state.currentFlattenedIndex,
        state.flattenedQuestions.length,
        answerQuestion,
        nextQuestion,
        finishQuiz,
        triggerConfetti
    ]);
    // 2. Sửa hàm handleSelectAnswer: Gọi trực tiếp không delay
    const handleSelectAnswer = useCallback((answer: string) => {
        if (showFeedback) return;
        setSelectedAnswer(answer);
        // Gọi submit ngay lập tức, truyền thẳng đáp án vào để tránh chờ state cập nhật
        handleSubmitAnswer(answer);
    }, [showFeedback, handleSubmitAnswer]);

    // Handle non-playing states
    if (state.status === "loading" || state.status === "ready" || state.status === "finished") {
        return (
            <QuizPlayerScreens
                status={state.status}
                quiz={quiz}
                totalQuestions={state.flattenedQuestions.length}
                onStart={startQuiz}
                onRestart={restartQuiz}
                score={state.score}
                correctAnswers={state.correctAnswers}
                maxStreak={state.maxStreak}
                accuracy={accuracy}
            />
        );
    }

    // Playing state - Dark purple theme with neon accents
    return (
        <div className="min-h-screen bg-[#1a0a2e] flex items-center justify-center p-2 sm:p-4 lg:p-6">
            <div className="w-full h-full min-h-[90vh] bg-[#2d1b4e]/90 backdrop-blur-xl border border-[#00d4ff]/20 rounded-3xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,212,255,0.1)]">


                {/* HEADER - Sticky */}
                <div className="sticky top-0 z-30">
                    <QuizPlayerHeader
                        quizTitle={quiz.title}
                        currentIndex={state.currentFlattenedIndex}
                        totalQuestions={state.flattenedQuestions.length}
                        progress={progress}
                        accuracy={accuracy}
                        displayScore={displayScore}
                        streak={state.streak}
                        isOnFire={isOnFire}
                        soundEnabled={soundEnabled}
                        onToggleSound={() => setSoundEnabled(!soundEnabled)}
                    />
                </div>

                {/* QUESTION AREA - Card Based */}
                <div className="flex-1 p-3 sm:p-6 lg:p-10">
                    <QuizPlayerQuestion
                        currentQuestion={currentQuestion}
                        currentReadingPassage={state.currentReadingPassage}
                        currentIndex={state.currentFlattenedIndex}
                        timeRemaining={state.timeRemaining}
                        questionKey={questionKeyRef.current}
                    />
                </div>

                {/* ANSWER AREA - Card Based */}
                <div className="p-3 sm:p-6 lg:p-10 bg-[#1a0a2e]/50 relative border-t border-[#00d4ff]/10">


                    {/* FEEDBACK OVERLAY */}
                    {feedbackResult && (
                        <QuizPlayerFeedback
                            showFeedback={showFeedback}
                            isCorrect={feedbackResult.isCorrect}
                            pointsEarned={feedbackResult.pointsEarned}
                            correctAnswer={feedbackResult.correctAnswer}
                            showFloatingScore={showFloatingScore}
                            floatingPoints={floatingPoints}
                        />
                    )}

                    {/* ANSWER BUTTONS */}
                    <div className="w-full">
                        {currentQuestion?.type === "multiple_choice" && currentQuestion.options ? (
                            <MultipleChoiceOptions
                                options={currentQuestion.options}
                                selectedAnswerID={selectedAnswer}
                                correctAnswerID={currentQuestion.correctOptionId ?? null}
                                showFeedback={showFeedback}
                                onSelect={handleSelectAnswer}
                                disabled={isSubmittingRef.current}
                            />
                        ) : (
                            /* Fill-in-the-blank interface - Updated UX */
                            <div className="flex flex-col items-center justify-center gap-6 bg-[#1a0a2e]/50 rounded-2xl p-6 sm:p-8 border border-[#00d4ff]/20">
                                <input
                                    autoFocus
                                    type="text"
                                    value={selectedAnswer}
                                    onChange={(e) => setSelectedAnswer(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !showFeedback && selectedAnswer.trim()) {
                                            handleSubmitAnswer();
                                        }
                                    }}
                                    placeholder="Gõ câu trả lời của bạn..."
                                    disabled={showFeedback}
                                    aria-label="Câu trả lời"
                                    role="textbox"
                                    className={`w-full h-20 sm:h-24 bg-[#2d1b4e]/80 border-4 rounded-2xl text-center text-3xl sm:text-5xl font-black transition-all placeholder:text-[#00d4ff]/30 uppercase disabled:opacity-50 focus:ring-4 focus:ring-[#00d4ff]/50 text-[#00d4ff] ${showFeedback && feedbackResult

                                        ? feedbackResult.isCorrect
                                            ? "border-[#00ff88] bg-[#00ff88]/10 focus:outline-none shadow-[0_0_30px_rgba(0,255,136,0.3)]"
                                            : "border-[#ff3366] bg-[#ff3366]/10 focus:outline-none shadow-[0_0_30px_rgba(255,51,102,0.3)]"
                                        : "border-[#00d4ff]/50 focus:border-[#00d4ff] focus:outline-none"
                                        }`}
                                />

                                {/* Show correct answer with fade-in when wrong */}
                                <AnimatePresence>
                                    {showFeedback && feedbackResult && !feedbackResult.isCorrect && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-[#00ff88] text-2xl font-bold"
                                        >
                                            Đáp án đúng: <span className="underline">{feedbackResult.correctAnswer}</span>
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="border-t border-[#00d4ff]/10">
                    <QuizPlayerFooter
                        correctAnswers={state.correctAnswers}
                        wrongAnswers={state.totalAnswered - state.correctAnswers}
                        streak={state.streak}
                        isOnFire={isOnFire}
                    />
                </div>
            </div>
        </div>
    );

}
