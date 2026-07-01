"use server";

import { promises as fs } from "fs";
import path from "path";
import { QuizData, QuizFormState, generateId } from "@/types/quiz";

const DATA_DIR = path.join(process.cwd(), "data");
const QUIZ_FILE = path.join(DATA_DIR, "quiz.json");

// ── Ensure data directory exists ──
async function ensureDataDir(): Promise<void> {
    try {
        await fs.access(DATA_DIR);
    } catch {
        // Directory doesn't exist, create it
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// ── Read existing quiz data ──
async function readQuizFile(): Promise<QuizData | null> {
    try {
        const content = await fs.readFile(QUIZ_FILE, "utf-8");
        return JSON.parse(content) as QuizData;
    } catch {
        // File doesn't exist or is invalid
        return null;
    }
}

// ── Write quiz data to file ──
async function writeQuizFile(data: QuizData): Promise<void> {
    await fs.writeFile(QUIZ_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ── Save Quiz Action ──
// Accepts new quiz metadata and questions, merges with existing data
export async function saveQuizAction(
    _prev: QuizFormState,
    formData: FormData
): Promise<QuizFormState> {
    try {
        // Ensure data directory exists
        await ensureDataDir();

        // Parse form data
        const title = (formData.get("title") as string)?.trim();
        const description = (formData.get("description") as string)?.trim();
        const timeLimit = formData.get("timeLimit");
        const questionsJson = formData.get("questions") as string;

        // Validate required fields
        if (!title) {
            return {
                success: false,
                error: "Tiêu đề quiz là bắt buộc.",
                field: "title",
            };
        }

        if (!questionsJson) {
            return {
                success: false,
                error: "Danh sách câu hỏi không được để trống.",
                field: "questions",
            };
        }

        // Parse questions array
        let questions;
        try {
            questions = JSON.parse(questionsJson);
            if (!Array.isArray(questions) || questions.length === 0) {
                return {
                    success: false,
                    error: "Cần ít nhất một câu hỏi.",
                    field: "questions",
                };
            }
        } catch {
            return {
                success: false,
                error: "Dữ liệu câu hỏi không hợp lệ.",
                field: "questions",
            };
        }

        // Read existing quiz file
        let existingData: QuizData | null = null;
        try {
            existingData = await readQuizFile();
        } catch {
            // Continue even if read fails (file might not exist)
        }

        // Create quiz metadata
        const now = new Date().toISOString();
        const defaultTime = timeLimit ? parseInt(timeLimit as string, 10) : 30;
        const metadata = {
            id: existingData?.metadata?.id || generateId(),
            title,
            description: description || undefined,
            createdAt: existingData?.metadata?.createdAt || now,
            updatedAt: now,
            authorId: existingData?.metadata?.authorId,
            totalQuestions: questions.length,
            defaultTime,
            timeLimit: timeLimit
                ? parseInt(timeLimit as string, 10)
                : undefined,
        };

        // Merge: append new questions to existing questions
        const mergedQuestions = existingData?.questions
            ? [...existingData.questions, ...questions]
            : questions;

        // Create final quiz data
        const quizData: QuizData = {
            metadata: {
                ...metadata,
                totalQuestions: mergedQuestions.length,
            },
            questions: mergedQuestions,
        };

        // Write to file (overwrite entire file to avoid race conditions)
        await writeQuizFile(quizData);

        return {
            success: true,
            message: `Đã lưu thành công ${questions.length} câu hỏi! Tổng số: ${mergedQuestions.length}`,
        };
    } catch (error) {
        console.error("Error saving quiz:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Lỗi khi lưu dữ liệu. Vui lòng thử lại.",
        };
    }
}

// ── Get existing quiz data (for preview) ──
export async function getQuizData(): Promise<QuizData | null> {
    try {
        return await readQuizFile();
    } catch {
        return null;
    }
}

// ── Clear all quiz data (for testing) ──
export async function clearQuizData(): Promise<void> {
    try {
        await fs.unlink(QUIZ_FILE);
    } catch {
        // File doesn't exist, ignore
    }
}
