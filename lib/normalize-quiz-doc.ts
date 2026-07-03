import { ObjectId, type Filter } from "mongodb";
import type { QuizData, QuizMetadata, QuizQuestion } from "@/types/quiz";
import { serializeMongoDoc } from "@/lib/serializeMongo";

/**
 * CHỨC NĂNG: Check string có là mã id hợp lệ của MongoDB (ObjectId Hex).
 */
export function isObjectIdHex(id: string): boolean {
    return ObjectId.isValid(id) && new ObjectId(id).toHexString() === id;
}

/** 
 * CHỨC NĂNG: Tạo Filter truy vấn Quiz dựa theo ID/Slug nhận từ Route.
 */
export function buildQuizIdFilter(id: string): Filter<Record<string, unknown>> {
    // ObjectId hợp lệ -> Search _id của MongoDB
    if (isObjectIdHex(id)) {
        return { _id: new ObjectId(id) };
    }
    // String -> Search linh hoạt trên nhiều trường (sp cả data cũ/mới)
    return {
        $or: [{ id }, { slug: id }, { "metadata.id": id }, { _id: id }],
    } as Filter<Record<string, unknown>>;
}

type LegacyMetadata = {
    id?: string;
    title?: string;
    description?: string | null;
    category?: string | null;
    authorId?: string | null;
    createdAt?: string;
    updatedAt?: string;
    totalQuestions?: number;
    defaultTime?: number;
    examTimeLimit?: number;
};

const DEFAULT_EXAM_TIME_LIMIT = 1800;

/** 
 * CHỨC NĂNG: Search và trích xuất ID của Quiz theo thứ tự (ưu tiên giảm dần)
 */
export function resolveQuizId(
    raw: Record<string, unknown>,
    flat?: Record<string, unknown>
): string {
    // Ưt1: id trực tiếp ở gốc object raw
    if (typeof raw.id === "string" && raw.id.trim()) {
        return raw.id.trim();
    }

    // Ưt 2: id nằm trong object metadata cũ
    const meta = raw.metadata as LegacyMetadata | undefined;
    if (typeof meta?.id === "string" && meta.id.trim()) {
        return meta.id.trim();
    }

    // Ưt 3: Lấy id/slug từ data đã qua flatten/normalized
    const normalized = flat ?? normalizeRawQuizDoc(raw);
    if (typeof normalized.id === "string" && normalized.id.trim()) {
        return normalized.id.trim();
    }
    if (typeof normalized.slug === "string" && normalized.slug.trim()) {
        return normalized.slug.trim();
    }

    // Ưt cuối: Ép kiểu ID -> chuỗi trong dữ liệu MongoDB được serialize
    const serialized = serializeMongoDoc(normalized);
    return typeof serialized.id === "string"
        ? serialized.id
        : String(serialized.id ?? "");
}

/** 
 * CHỨC NĂNG: Chuẩn hoá dữ liệu JSON cấu trúc metadata cũ về cấu trúc mới.
 */
export function normalizeRawQuizDoc(
    doc: Record<string, unknown>
): Record<string, unknown> {
    const meta = doc.metadata as LegacyMetadata | undefined;
    // Đảm bảo questions luôn là một mảng
    const questions = Array.isArray(doc.questions)
        ? (doc.questions as QuizQuestion[])
        : [];

    // Không có object metadata -> cấu trúc mới -> return
    if (!meta) {
        return { ...doc, questions };
    }

    const now = new Date().toISOString();
    const legacyId = meta.id?.trim();

    // Build cấu trúc phẳng: Ưu tiên lấy dữ liệu lớp ngoài (mới), hụt thì nhặt từ metadata (cũ)
    return {
        ...doc,
        id: (typeof doc.id === "string" && doc.id) || legacyId,
        slug: doc.slug ?? legacyId,
        title: doc.title ?? meta.title ?? "",
        description: doc.description ?? meta.description ?? null,
        category: doc.category ?? meta.category ?? null,
        authorId: doc.authorId ?? meta.authorId ?? null,
        createdAt: doc.createdAt ?? meta.createdAt ?? now,
        updatedAt: doc.updatedAt ?? meta.updatedAt ?? now,
        defaultTime: doc.defaultTime ?? meta.defaultTime ?? 30,
        examTimeLimit:
            doc.examTimeLimit ?? meta.examTimeLimit ?? DEFAULT_EXAM_TIME_LIMIT,
        totalQuestions:
            doc.totalQuestions ?? meta.totalQuestions ?? questions.length,
        questions,
    };
}

/**
 * CHỨC NĂNG: Chuyển đổi Doc thô từ MongoDB thành Object dữ liệu Quiz hoàn chỉnh
 */
export function mongoDocToQuizData(
    raw: Record<string, unknown>
): QuizData & { id: string } {
    const flat = normalizeRawQuizDoc(raw); // 1. Làm phẳng cấu trúc dữ liệu
    const quizId = resolveQuizId(raw, flat); // 2. Lấy ID chuẩn string
    const serialized = serializeMongoDoc(flat); // 3. Chuyển đổi các kiểu dữ liệu đặc thù của DB sang JS

    const title =
        typeof serialized.title === "string"
            ? serialized.title
            : String(serialized.title ?? "");

    const questions = Array.isArray(
        (serialized as { questions?: unknown }).questions
    )
        ? ((serialized as { questions: unknown }).questions as QuizQuestion[])
        : [];

    // Khởi tạo thông tin chung với các giá trị dự phòng
    const metadata: QuizMetadata = {
        id: quizId,
        title,
        description:
            typeof serialized.description === "string"
                ? serialized.description
                : undefined,
        category:
            typeof serialized.category === "string"
                ? serialized.category
                : undefined,
        createdAt:
            typeof serialized.createdAt === "string"
                ? serialized.createdAt
                : String(serialized.createdAt ?? new Date().toISOString()),
        updatedAt:
            typeof serialized.updatedAt === "string"
                ? serialized.updatedAt
                : String(serialized.updatedAt ?? new Date().toISOString()),
        authorId:
            typeof serialized.authorId === "string"
                ? serialized.authorId
                : undefined,
        totalQuestions:
            typeof serialized.totalQuestions === "number"
                ? serialized.totalQuestions
                : questions.length,
        defaultTime:
            typeof serialized.defaultTime === "number"
                ? serialized.defaultTime
                : Number(serialized.defaultTime ?? 30),
        examTimeLimit:
            typeof serialized.examTimeLimit === "number"
                ? serialized.examTimeLimit
                : Number(serialized.examTimeLimit ?? DEFAULT_EXAM_TIME_LIMIT),
    };

    return { id: quizId, metadata, questions };
}

/** 
 * CHỨC NĂNG: Chuẩn hoá dữ liệu file JSON import, xoá metadata.
 */
export function flattenQuizJsonFile(
    data: Record<string, unknown>
): Record<string, unknown> {
    const flat = normalizeRawQuizDoc(data);
    const rest = { ...(flat as Record<string, unknown>) };
    delete rest.metadata; // del object metadata
    return rest;
}