"use server";

import { promises as fs } from "fs";
import path from "path";
import { QuizData, QuizMetadata, QuizQuestion, generateId } from "@/types/quiz";

// ── Constants ──
const DATA_DIR = path.join(process.cwd(), "data");
const QUIZ_FILE = path.join(DATA_DIR, "quiz.json");

// ── Ensure data directory and file exist ──
async function ensureDataFile(): Promise<void> {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }

    const fileExists = await fs
        .access(QUIZ_FILE)
        .then(() => true)
        .catch(() => false);
    if (!fileExists) {
        await fs.writeFile(
            QUIZ_FILE,
            JSON.stringify({ metadata: {}, questions: [] }, null, 2),
            "utf-8"
        );
    }
}

// ── Read all quiz data ──
async function readQuizFile(): Promise<QuizData> {
    await ensureDataFile();
    const content = await fs.readFile(QUIZ_FILE, "utf-8");
    return JSON.parse(content) as QuizData;
}

// ── Write quiz data ──
async function writeQuizFile(data: QuizData): Promise<void> {
    await fs.writeFile(QUIZ_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ── Public: Get all quizzes ──
// Returns array of quiz metadata for listing
export async function getQuizzes(): Promise<QuizMetadata[]> {
    try {
        const data = await readQuizFile();
        if (!data.metadata?.id) return [];
        return [
            {
                ...data.metadata,
                totalQuestions: data.questions?.length || 0,
            },
        ];
    } catch {
        return [];
    }
}

// ── Public: Get quiz by ID ──
export async function getQuizById(id: string): Promise<QuizData | null> {
    try {
        const data = await readQuizFile();
        if (data.metadata?.id !== id) return null;
        return data;
    } catch {
        return null;
    }
}

// ── Public: Create new quiz ──
export async function createQuiz(params: {
    title: string;
    description?: string;
    category?: string;
    defaultTime?: number;
}): Promise<{ id: string; success: boolean }> {
    try {
        const now = new Date().toISOString();
        const id = generateId();
        const defaultTime = params.defaultTime || 30;

        const metadata: QuizMetadata = {
            id,
            title: params.title,
            description: params.description,
            category: params.category,
            createdAt: now,
            updatedAt: now,
            totalQuestions: 0,
            defaultTime,
        };

        const quizData: QuizData = {
            metadata,
            questions: [],
        };

        await writeQuizFile(quizData);

        return { id, success: true };
    } catch (error) {
        console.error("Error creating quiz:", error);
        return { id: "", success: false };
    }
}

// ── Public: Update quiz ──
export async function updateQuiz(
    id: string,
    params: {
        title?: string;
        description?: string;
        category?: string;
        questions?: QuizQuestion[];
        defaultTime?: number;
    }
): Promise<{ success: boolean; error?: string }> {
    try {
        const data = await readQuizFile();

        if (data.metadata?.id !== id) {
            return { success: false, error: "Quiz not found" };
        }

        const now = new Date().toISOString();
        const updatedMetadata: QuizMetadata = {
            ...data.metadata,
            title: params.title ?? data.metadata.title,
            description: params.description ?? data.metadata.description,
            category: params.category ?? data.metadata.category,
            defaultTime: params.defaultTime ?? data.metadata.defaultTime,
            updatedAt: now,
            totalQuestions: params.questions?.length ?? data.questions.length,
        };

        const quizData: QuizData = {
            metadata: updatedMetadata,
            questions: params.questions ?? data.questions,
        };

        await writeQuizFile(quizData);

        return { success: true };
    } catch (error) {
        console.error("Error updating quiz:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

// ── Public: Update a single question inside quiz file ──
export async function updateQuestionInQuizFile(
    quizId: string,
    questionId: string,
    updatedQuestion: QuizQuestion
): Promise<{ success: boolean; error?: string }> {
    try {
        const data = await readQuizFile();

        if (data.metadata?.id !== quizId) {
            return { success: false, error: "Quiz not found" };
        }

        const idx = data.questions.findIndex((q) => q.id === questionId);
        if (idx === -1) {
            return { success: false, error: "Question not found" };
        }

        const questions = [...data.questions];
        questions[idx] = updatedQuestion;

        const now = new Date().toISOString();
        const quizData: QuizData = {
            metadata: {
                ...data.metadata,
                updatedAt: now,
                totalQuestions: questions.length,
            },
            questions,
        };

        await writeQuizFile(quizData);
        return { success: true };
    } catch (error) {
        console.error("Error updating question:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

// ── Get quiz data (for preview) ──
export async function getQuizData(): Promise<QuizData | null> {
    try {
        return await readQuizFile();
    } catch {
        return null;
    }
}

// ── Clear quiz data (for testing) ──
export async function clearQuizData(): Promise<void> {
    try {
        await fs.unlink(QUIZ_FILE);
    } catch {
        // ignore
    }
}
