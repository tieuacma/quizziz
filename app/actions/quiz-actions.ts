"use server";

import { redirect } from "next/navigation";
import { createQuiz, updateQuiz, getQuizById } from "../../lib/quiz-service";
import { QuizFormState, QuizData, QuizQuestion } from "@/types/quiz";

// ── Constants ──
const DEFAULT_TIME = 30; // seconds

// ── Create Quiz Action ──
// Creates new quiz with metadata, redirects to editor
export async function createQuizAction(
    _prev: QuizFormState,
    formData: FormData
): Promise<QuizFormState> {
    try {
        const title = (formData.get("title") as string)?.trim();
        const description = (formData.get("description") as string)?.trim();
        const category = (formData.get("category") as string)?.trim();
        const defaultTimeStr = formData.get("defaultTime") as string;
        const defaultTime = defaultTimeStr
            ? parseInt(defaultTimeStr, 10)
            : DEFAULT_TIME;

        if (!title) {
            return {
                success: false,
                error: "Tiêu đề quiz là bắt buộc.",
                field: "title",
            };
        }

        const result = await createQuiz({
            title,
            description,
            category,
            defaultTime,
        });

        if (!result.success) {
            return {
                success: false,
                error: "Không thể tạo quiz. Vui lòng thử lại.",
            };
        }

        // Redirect to editor page
        redirect(`/quiz-editor/${result.id}`);
    } catch (error) {
        // Handle redirect error (Next.js throws this)
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error;
        }
        console.error("Error creating quiz:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Lỗi khi tạo quiz.",
        };
    }
}

// ── Update Quiz Action ──
// Updates quiz content and questions
export async function updateQuizAction(
    _prev: QuizFormState,
    formData: FormData
): Promise<QuizFormState> {
    try {
        const id = formData.get("id") as string;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const defaultTimeStr = formData.get("defaultTime") as string;
        const questionsJson = formData.get("questions") as string;

        if (!id) {
            return {
                success: false,
                error: "ID quiz không hợp lệ.",
                field: "id",
            };
        }

        // Parse questions if provided
        let questions: QuizQuestion[] | undefined;
        if (questionsJson) {
            try {
                questions = JSON.parse(questionsJson);
            } catch {
                return {
                    success: false,
                    error: "Dữ liệu câu hỏi không hợp lệ.",
                    field: "questions",
                };
            }
        }

        const defaultTime = defaultTimeStr
            ? parseInt(defaultTimeStr, 10)
            : undefined;

        const result = await updateQuiz(id, {
            title: title?.trim(),
            description: description?.trim(),
            category: category?.trim(),
            defaultTime,
            questions,
        });

        if (!result.success) {
            return {
                success: false,
                error: result.error || "Không thể cập nhật quiz.",
            };
        }

        return { success: true, message: "Đã lưu quiz thành công!" };
    } catch (error) {
        console.error("Error updating quiz:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Lỗi khi cập nhật quiz.",
        };
    }
}

// ── Get Quiz Action
// Fetch quiz for editor page (server-side)
export async function updateQuestionAction(
    _prev: QuizFormState,
    formData: FormData
): Promise<QuizFormState> {
    try {
        const quizId = formData.get("quizId") as string;
        const questionId = formData.get("questionId") as string;
        const questionJson = formData.get("question") as string;

        if (!quizId) {
            return {
                success: false,
                error: "ID quiz không hợp lệ.",
                field: "quizId",
            };
        }
        if (!questionId) {
            return {
                success: false,
                error: "ID câu hỏi không hợp lệ.",
                field: "questionId",
            };
        }
        if (!questionJson) {
            return {
                success: false,
                error: "Dữ liệu câu hỏi trống.",
                field: "question",
            };
        }

        const parsed = JSON.parse(questionJson) as QuizQuestion;

        // updateQuestionInQuizFile hiện được export trong src/lib/quiz-service.ts
        // Dùng import tương đối để chắc chắn trỏ đúng tới src/lib/quiz-service.ts
        const { updateQuestionInQuizFile } =
            await import("../../src/lib/quiz-service");
        const result = await updateQuestionInQuizFile(
            quizId,
            questionId,
            parsed
        );

        if (!result.success) {
            return {
                success: false,
                error: result.error || "Không thể cập nhật câu hỏi.",
            };
        }

        return { success: true, message: "Đã lưu câu hỏi thành công!" };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Lỗi khi cập nhật câu hỏi.",
        };
    }
}

// ── Get Quiz Action
// Fetch quiz for editor page (server-side)
export async function getQuizAction(id: string): Promise<{
    success: boolean;
    data?: QuizData;
    error?: string;
}> {
    try {
        const quiz = await getQuizById(id);
        if (!quiz) {
            return { success: false, error: "Quiz not found" };
        }
        return { success: true, data: quiz };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
