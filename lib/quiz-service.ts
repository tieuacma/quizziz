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

/**
 * CHỨC NĂNG: Lấy danh sách metadata (thông tin chung) của tất cả các bài Quiz.
 */
export async function getQuizzes(): Promise<QuizMetadata[]> {
    try {
        const db = await getMongoDb();
        const col = db.collection(COLLECTION);
        const docs = await col.find({}).toArray(); // Lấy tất cả các doc trong collection

        // Chuẩn hóa từng doc và chỉ trích xuất phần metadata trả về Client
        return docs.map(
            (doc) => mongoDocToQuizData(doc as Record<string, unknown>).metadata
        );
    } catch {
        return []; // Lỗi -> Trả về mảng rỗng chống sập app
    }
}

/**
 * CHỨC NĂNG: Lấy toàn bộ dữ liệu chi tiết của 1 bài Quiz theo ID/Slug (gồm cả câu hỏi + đáp án).
 */
export async function getQuizById(id: string): Promise<QuizData | null> {
    try {
        const doc = await findQuizById(id);
        if (!doc) return null;
        return mongoDocToQuizData(doc as Record<string, unknown>); // Chuẩn hóa data trước khi return
    } catch {
        return null;
    }
}

/**
 * CHỨC NĂNG: Tạo mới một bài Quiz với các thông tin cơ bản cấu hình ban đầu.
 */
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

        // Khởi tạo form data cấu trúc phẳng mặc định, mảng câu hỏi rỗng
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

        return { id: res.insertedId.toHexString(), success: true }; // Trả về mã hex ID vừa tạo
    } catch (error) {
        console.error("Error creating quiz:", error);
        return { id: "", success: false };
    }
}

/**
 * CHỨC NĂNG: Cập nhật chi tiết nội dung hoặc cấu hình/danh sách câu hỏi của bài Quiz.
 */
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

        const flat = normalizeRawQuizDoc(doc as Record<string, unknown>); // Làm phẳng data cũ để so sánh
        const now = new Date().toISOString();
        const questions = (params.questions ?? flat.questions) as QuizQuestion[];

        // Merge dữ liệu mới gửi lên, hụt thì giữ nguyên data cũ ở bản phẳng (flat)
        const updateDoc = {
            title: params.title ?? flat.title,
            description: params.description ?? flat.description,
            category: params.category ?? flat.category,
            defaultTime: params.defaultTime ?? flat.defaultTime,
            examTimeLimit: params.examTimeLimit ?? flat.examTimeLimit ?? 1800,
            authorId: flat.authorId ?? null,
            createdAt: flat.createdAt,
            updatedAt: now, // Cập nhật mốc thời gian sửa bài
            questions,
            totalQuestions: questions.length, // Tự động đồng bộ số lượng câu hỏi mới
            slug: flat.slug,
        };

        const db = await getMongoDb();
        const col = db.collection(COLLECTION);

        // Cập nhật trường phẳng mới ($set) và xóa bỏ metadata bọc cũ ($unset) nếu có
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

/**
 * CHỨC NĂNG: Lấy nhanh bài Quiz đầu tiên trong DB phục vụ chế độ xem trước (Preview).
 */
export async function getQuizData(): Promise<QuizData | null> {
    try {
        const db = await getMongoDb();
        const col = db.collection(COLLECTION);
        const doc = await col.findOne({}); // Tìm bản ghi bất kỳ đầu tiên bắt gặp
        if (!doc) return null;
        return mongoDocToQuizData(doc as Record<string, unknown>);
    } catch {
        return null;
    }
}