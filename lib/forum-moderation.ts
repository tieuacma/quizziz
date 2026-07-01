import { getMongoDb } from "./mongodb";

// Danh sách từ khóa bị cấm trực tiếp (Blocked ngay lập tức)
const BANNED_KEYWORDS = [
    "cờ bạc",
    "cá độ",
    "đá gà",
    "hack game",
    "tải hack",
    "web sex",
    "phim người lớn",
    "lừa đảo",
    "hack points",
    "hack điểm",
    "mua điểm",
    "bán đề",
    "lộ đề thi",
];

// Danh sách từ khóa nghi vấn (Chuyển sang trạng thái Pending - Chờ duyệt)
const SENSITIVE_KEYWORDS = [
    "chửi",
    "ngu",
    "dốt",
    "gian lận",
    "phao thi",
    "quay cóp",
    "admin ơi",
    "giáo viên ơi",
    "đáp án thi",
    "tiết lộ",
    "spammer",
    "quảng cáo",
];

export interface ModerationResult {
    status: "approved" | "pending" | "blocked";
    score: number;
    reason: string;
}

/**
 * Pipeline kiểm duyệt tự động bài viết và bình luận
 * Kết hợp bộ lọc từ khóa nhanh và mô phỏng mô hình AI Toxicity Classifier
 */
export function runAutoModeration(
    title: string,
    text: string
): ModerationResult {
    const fullText = `${title} ${text}`.toLowerCase();

    // 1. Kiểm tra từ khóa bị cấm nghiêm trọng
    for (const keyword of BANNED_KEYWORDS) {
        if (fullText.includes(keyword)) {
            return {
                status: "blocked",
                score: 0.95,
                reason: `Chứa từ khóa cấm nghiêm trọng: "${keyword}"`,
            };
        }
    }

    // 2. Kiểm tra từ khóa nhạy cảm / nghi vấn
    const foundSensitive: string[] = [];
    for (const keyword of SENSITIVE_KEYWORDS) {
        if (fullText.includes(keyword)) {
            foundSensitive.push(keyword);
        }
    }

    if (foundSensitive.length > 0) {
        return {
            status: "pending",
            score: 0.65,
            reason: `Nội dung nghi vấn, chứa từ khóa nhạy cảm: ${foundSensitive.map((k) => `"${k}"`).join(", ")}`,
        };
    }

    // 3. Mô phỏng AI đánh giá độ dài và cấu trúc câu
    // Ví dụ: spam text quá ngắn hoặc lặp từ nhiều lần
    const words = fullText.split(/\s+/).filter((w) => w.length > 0);
    const uniqueWords = new Set(words);

    if (
        words.length > 0 &&
        uniqueWords.size / words.length < 0.4 &&
        words.length > 10
    ) {
        return {
            status: "pending",
            score: 0.55,
            reason: "Phát hiện tỷ lệ lặp từ cao (nghi ngờ spam)",
        };
    }

    // Mọi thứ bình thường
    return {
        status: "approved",
        score: 0.1,
        reason: "Nội dung an toàn",
    };
}

/**
 * Ghi log kết quả kiểm duyệt vào DB để phục vụ kiểm tra
 */
export async function logModerationEvent(
    targetType: "post" | "comment",
    targetId: string,
    userId: string,
    result: ModerationResult
) {
    try {
        const db = await getMongoDb();
        const logsCol = db.collection("auto_moderation_logs");
        await logsCol.insertOne({
            targetType,
            targetId,
            userId,
            status: result.status,
            score: result.score,
            reason: result.reason,
            createdAt: new Date(),
        });
    } catch (err) {
        console.error("Failed to log moderation event:", err);
    }
}
