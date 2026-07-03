import { readFile } from "fs/promises";
import path from "path";
import { getQuizzesCollection } from "@/lib/mongodb";
import {
    buildQuizIdFilter,
    mongoDocToQuizData,
} from "@/lib/normalize-quiz-doc";

// Định nghĩa đường dẫn trỏ thẳng tới file cục bộ data/quiz.json
const QUIZ_FILE = path.join(process.cwd(), "data", "quiz.json");

type QuizJsonShape = {
    id?: string;
    metadata?: { id?: string };
    questions?: unknown[];
};

/**
 * CHỨC NĂNG: Check xem ID/Slug đầu vào có khớp với ID (gốc hoặc trong metadata) của file JSON không.
 */
function jsonMatchesQuizId(raw: QuizJsonShape, id: string): boolean {
    const want = id.trim();
    const rootId = raw.id?.trim();
    const metaId = raw.metadata?.id?.trim();
    return rootId === want || metaId === want;
}

/**
 * CHỨC NĂNG: Đọc file quiz.json cục bộ và trả về data nếu khớp ID.
 */
export async function readQuizJsonById(
    id: string
): Promise<Record<string, unknown> | null> {
    try {
        const raw = JSON.parse(
            await readFile(QUIZ_FILE, "utf-8")
        ) as QuizJsonShape;
        if (!jsonMatchesQuizId(raw, id)) return null; // Không khớp ID -> hủy
        return raw as Record<string, unknown>;
    } catch {
        return null; // Lỗi đọc file hoặc parse JSON -> bọc catch trả về null chống sập
    }
}

/** * CHỨC NĂNG: Hàm cũ (Hạn chế dùng, trỏ ngược về hàm readQuizJsonById mới).
 * @deprecated Use readQuizJsonById
 */
export const readQuizJsonByMetadataId = readQuizJsonById;

/**
 * CHỨC NĂNG: Đồng bộ (Upsert) dữ liệu từ file JSON vào MongoDB collection `quizzes`.
 */
export async function seedQuizJsonToMongo(
    raw: Record<string, unknown>
): Promise<void> {
    const quizId = resolveJsonQuizId(raw);
    if (!quizId) return; // Không tìm thấy ID hợp lệ -> hủy

    const col = await getQuizzesCollection();
    const doc = {
        ...raw,
        id: quizId,
        slug: (raw.slug as string | undefined) ?? quizId,
    };

    // Thực hiện replace bản ghi cũ hoặc insert mới nếu chưa tồn tại (upsert: true)
    await col.replaceOne(buildQuizIdFilter(quizId), doc, { upsert: true });
}

/**
 * CHỨC NĂNG: Tìm ID từ JSON thô (Check gốc trước, metadata sau).
 */
function resolveJsonQuizId(raw: Record<string, unknown>): string | null {
    if (typeof raw.id === "string" && raw.id.trim()) return raw.id.trim();
    const meta = raw.metadata as { id?: string } | undefined;
    if (typeof meta?.id === "string" && meta.id.trim()) return meta.id.trim();
    return null;
}

/**
 * CHỨC NĂNG: Fallback - Đọc đề từ file JSON cục bộ khi DB lỗi hoặc không có data.
 */
export async function loadQuizFromJsonFallback(id: string) {
    const raw = await readQuizJsonById(id); // 1. Đọc file lấy JSON thô
    if (!raw) return null;
    return mongoDocToQuizData(raw); // 2. Chuẩn hóa sang cấu trúc chuẩn của hệ thống
}