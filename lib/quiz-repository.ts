import { ObjectId } from "mongodb";
import { getQuizzesCollection } from "./mongodb";
import { buildQuizIdFilter, normalizeRawQuizDoc } from "./normalize-quiz-doc";

export type QuizRecordId = string;

/**
 * CHỨC NĂNG: Ép string -> ObjectId của MongoDB.
 */
export function toObjectId(id: string): ObjectId {
    return new ObjectId(id);
}

export type QuizDbDoc = Record<string, unknown>;

/**
 * CHỨC NĂNG: Tìm kiếm bài Quiz trong DB theo ID/Slug.
 */
export async function findQuizById(quizId: string): Promise<QuizDbDoc | null> {
    try {
        const col = await getQuizzesCollection();
        const doc = await col.findOne(buildQuizIdFilter(quizId));
        return doc as QuizDbDoc | null;
    } catch {
        // Lỗi kết nối DB -> log warning và return null để app không bị sập (hỗ trợ trang 404 khi build)
        console.warn(`Failed to connect to MongoDB for quiz lookup: ${quizId}`);
        return null;
    }
}

/** * CHỨC NĂNG: Hàm cũ (Hạn chế dùng, trỏ ngược về hàm findQuizById mới).
 * @deprecated Use findQuizById 
 */
export async function getQuizById(quizId: string): Promise<QuizDbDoc | null> {
    return findQuizById(quizId);
}

/**
 * CHỨC NĂNG: Thêm mới hoặc Cập nhật (Upsert) dữ liệu bài Quiz vào DB.
 */
export async function upsertQuiz(
    quizId: string | null,
    quizDoc: QuizDbDoc
): Promise<{ id: string }> {
    const col = await getQuizzesCollection();

    // Trường hợp 1: Có quizId -> Tiến hành Cập nhật (Update)
    if (quizId) {
        const filter = buildQuizIdFilter(quizId);
        const existing = await col.findOne(filter);
        if (!existing) {
            throw new Error("Quiz not found"); // Không thấy bài test cũ -> báo lỗi
        }

        const flat = normalizeRawQuizDoc(existing as Record<string, unknown>);
        // Merge data mới vào data cũ, giữ lại các trường hệ thống nếu data mới bị thiếu
        const merged: QuizDbDoc = {
            ...quizDoc,
            id: quizId,
            createdAt: quizDoc.createdAt ?? flat.createdAt,
            slug:
                (quizDoc.slug as string | undefined) ??
                (flat.slug as string) ??
                quizId,
            authorId: quizDoc.authorId ?? flat.authorId,
        };

        // Ghi đè data mới ($set) và xóa bỏ trường metadata cũ ($unset) để chuẩn hóa phẳng
        await col.updateOne(filter, {
            $set: merged,
            $unset: { metadata: "" },
        });

        return { id: quizId };
    }

    // Trường hợp 2: quizId là null -> Tiến hành Thêm mới (Insert)
    const res = await col.insertOne(quizDoc);
    const insertedId =
        typeof quizDoc.id === "string" && quizDoc.id
            ? quizDoc.id
            : res.insertedId.toHexString(); // Hụt id tùy biến thì lấy mã hex tự sinh của Mongo
    return { id: insertedId };
}

/**
 * CHỨC NĂNG: Xóa bài Quiz khỏi DB dựa theo ID/Slug.
 */
export async function deleteQuiz(quizId: string): Promise<void> {
    const col = await getQuizzesCollection();
    await col.deleteOne(buildQuizIdFilter(quizId));
}