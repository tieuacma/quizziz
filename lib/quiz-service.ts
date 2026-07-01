"use server";

import { QuizData, QuizMetadata, QuizQuestion } from "@/types/quiz";
import { getMongoDb } from "@/lib/mongodb";
import {
    buildQuizIdFilter,
    mongoDocToQuizData,
    normalizeRawQuizDoc,
} from "@/lib/normalize-quiz-doc";
import { findQuizById } from "@/lib/quiz-repository";

const COLLECTION = "quizzes";

// ── Public: Get all quizzes ──
export async function getQuizzes(): Promise<QuizMetadata[]> {
    try {
        const db = await getMongoDb();
        const col = db.collection(COLLECTION);
        const docs = await col.find({}).toArray();
        return docs.map(
            (doc) => mongoDocToQuizData(doc as Record<string, unknown>).metadata
        );
    } catch {
        return [];
    }
}

// ── Public: Get quiz by ID ──
export async function getQuizById(id: string): Promise<QuizData | null> {
    try {
        const doc = await findQuizById(id);
        if (!doc) return null;
        return mongoDocToQuizData(doc as Record<string, unknown>);
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
    examTimeLimit?: number;
}): Promise<{ id: string; success: boolean }> {
    try {
        const now = new Date().toISOString();
        const defaultTime = params.defaultTime || 30;
        const examTimeLimit = params.examTimeLimit || 1800;

        const quizDoc = {
            title: params.title,
            description: params.description || null,
            category: params.category || null,
            authorId: null,
            createdAt: now,
            updatedAt: now,
            defaultTime,
            examTimeLimit,
            questions: [] as QuizQuestion[],
            totalQuestions: 0,
        };

        const db = await getMongoDb();
        const col = db.collection(COLLECTION);
        const res = await col.insertOne(quizDoc);

        return { id: res.insertedId.toHexString(), success: true };
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
        examTimeLimit?: number;
    }
): Promise<{ success: boolean; error?: string }> {
    try {
        const doc = await findQuizById(id);
        if (!doc) {
            return { success: false, error: "Quiz not found" };
        }

        const flat = normalizeRawQuizDoc(doc as Record<string, unknown>);
        const now = new Date().toISOString();
        const questions = (params.questions ??
            flat.questions) as QuizQuestion[];

        const updateDoc = {
            title: params.title ?? flat.title,
            description: params.description ?? flat.description,
            category: params.category ?? flat.category,
            defaultTime: params.defaultTime ?? flat.defaultTime,
            examTimeLimit: params.examTimeLimit ?? flat.examTimeLimit ?? 1800,
            authorId: flat.authorId ?? null,
            createdAt: flat.createdAt,
            updatedAt: now,
            questions,
            totalQuestions: questions.length,
            slug: flat.slug,
        };

        const db = await getMongoDb();
        const col = db.collection(COLLECTION);
        await col.updateOne(buildQuizIdFilter(id), {
            $set: updateDoc,
            $unset: { metadata: "" },
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating quiz:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

// ── Get quiz data (for preview) ──
export async function getQuizData(): Promise<QuizData | null> {
    try {
        const db = await getMongoDb();
        const col = db.collection(COLLECTION);
        const doc = await col.findOne({});
        if (!doc) return null;
        return mongoDocToQuizData(doc as Record<string, unknown>);
    } catch {
        return null;
    }
}
