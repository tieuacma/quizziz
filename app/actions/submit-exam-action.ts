"use server";

import { findQuizById } from "@/lib/quiz-repository";
import { mongoDocToQuizData } from "@/lib/normalize-quiz-doc";
import { getSession } from "@/lib/session";
import {
    isQuestionCorrect,
    type SubmitAnswerPayload,
} from "@/lib/exam-grading";

export type SubmitExamResult = {
    success: boolean;
    error?: string;
    score?: number;
    correctCount?: number;
    totalQuestions?: number;
    durationSeconds?: number;
    items?: {
        questionId: string;
        correct: boolean;
        explanation?: string;
    }[];
};

export async function submitExamAction(params: {
    quizId: string;
    answers: SubmitAnswerPayload[];
    startedAt: number;
    finishedAt: number;
}): Promise<SubmitExamResult> {
    const session = await getSession();
    if (!session) {
        return { success: false, error: "Unauthorized" };
    }
    if (session.role !== "student" && session.role !== "teacher") {
        return { success: false, error: "Forbidden" };
    }

    const doc = await findQuizById(params.quizId);
    if (!doc) return { success: false, error: "Không tìm thấy đề thi." };

    const quiz = mongoDocToQuizData(doc as Record<string, unknown>);
    const answerMap = new Map(
        params.answers.map((item) => [item.questionId, item])
    );
    let correctCount = 0;

    const items = quiz.questions.map((question) => {
        const submitted = answerMap.get(question.id);
        const correct = isQuestionCorrect(question, submitted);
        if (correct) correctCount += 1;
        return {
            questionId: question.id,
            correct,
            explanation:
                "explanation" in question &&
                typeof question.explanation === "string"
                    ? question.explanation
                    : undefined,
        };
    });

    const totalQuestions = quiz.questions.length;
    const score =
        totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const durationSeconds = Math.max(
        0,
        Math.floor((params.finishedAt - params.startedAt) / 1000)
    );

    return {
        success: true,
        score,
        correctCount,
        totalQuestions,
        durationSeconds,
        items,
    };
}
