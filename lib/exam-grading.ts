import type { QuizQuestion, ReadingSubQuestion } from "@/types/quiz";

type PrimitiveAnswer = string | boolean | string[] | null;

export type SubmitAnswerPayload = {
    questionId: string;
    answer: PrimitiveAnswer;
    subAnswers?: Record<string, PrimitiveAnswer>; // Dành riêng cho câu hỏi đọc hiểu (Reading) chứa nhiều câu hỏi con
    flagged?: boolean; // Đánh dấu câu hỏi để xem lại sau
};

/**
 * CHỨC NĂNG: Chuẩn hóa chuỗi (Xóa khoảng trắng 2 đầu và viết thường) để so sánh không phân biệt hoa thường.
 */
export function normalizeString(value: string): string {
    return value.trim().toLowerCase();
}

/**
 * CHỨC NĂNG: Check đáp án trắc nghiệm (Hỗ trợ cả chọn 1 hoặc chọn nhiều đáp án).
 */
export function isMultiChoiceAnswerCorrect(
    answer: PrimitiveAnswer,
    question: Extract<QuizQuestion, { type: "multiple-choice" }>
): boolean {
    // TH1: Câu hỏi cho phép chọn nhiều đáp án (Checkbox)
    if (question.isMultiChoice) {
        const selected = Array.isArray(answer) ? answer : [];
        if (selected.length === 0) return false;
        // Tất cả các lựa chọn của user phải trùng với ID đáp án đúng
        return selected.every((item) => item === question.correctOptionId);
    }
    // TH2: Trắc nghiệm chọn 1 (Radio)
    return typeof answer === "string" && answer === question.correctOptionId;
}

/**
 * CHỨC NĂNG: Check đáp án điền vào chỗ trống (Fill in the blank).
 */
export function isFillBlankCorrect(
    answer: PrimitiveAnswer,
    question: Extract<QuizQuestion, { type: "fill-in-the-blank" }>
): boolean {
    if (typeof answer !== "string") return false;

    // Check cấu hình phân biệt hoa thường (caseSensitive) để chuẩn hóa data so sánh
    const expected = question.caseSensitive
        ? question.answers
        : question.answers.map(normalizeString);
    const current = question.caseSensitive
        ? answer.trim()
        : normalizeString(answer);

    return expected.includes(current); // Khớp 1 trong các đáp án mẫu -> Đúng
}

/**
 * CHỨC NĂNG: Check đáp án cho từng câu hỏi con nằm trong bài đọc hiểu (Reading).
 */
export function isReadingSubQuestionCorrect(
    answer: PrimitiveAnswer,
    subQuestion: ReadingSubQuestion
): boolean {
    switch (subQuestion.type) {
        case "multiple-choice":
            return (
                typeof answer === "string" &&
                typeof subQuestion.correctOptionId === "string" &&
                answer === subQuestion.correctOptionId
            );
        case "true-false":
            return (
                typeof answer === "boolean" &&
                typeof subQuestion.correctAnswer === "boolean" &&
                answer === subQuestion.correctAnswer
            );
        case "fill-in-the-blank": {
            if (typeof answer !== "string" || !Array.isArray(subQuestion.answers))
                return false;
            return subQuestion.answers
                .map(normalizeString)
                .includes(normalizeString(answer));
        }
        default:
            return false;
    }
}

/**
 * CHỨC NĂNG: Hàm tổng - Định tuyến và kiểm tra tính chính xác của bất kỳ loại câu hỏi nào trong hệ thống.
 */
export function isQuestionCorrect(
    question: QuizQuestion,
    submitted?: SubmitAnswerPayload
): boolean {
    if (!submitted) return false; // Không nộp đáp án -> Sai

    switch (question.type) {
        case "multiple-choice":
            return isMultiChoiceAnswerCorrect(submitted.answer, question);
        case "true-false":
            return (
                typeof submitted.answer === "boolean" &&
                submitted.answer === question.correctAnswer
            );
        case "fill-in-the-blank":
            return isFillBlankCorrect(submitted.answer, question);
        case "reading": {
            const subAnswers = submitted.subAnswers ?? {};
            if (question.questions.length === 0) return false;
            // Bài đọc hiểu chỉ được tính là Đúng khi TẤT CẢ các câu hỏi con bên trong đều đúng
            return question.questions.every((sub) =>
                isReadingSubQuestionCorrect(subAnswers[sub.id] ?? null, sub)
            );
        }
        default:
            return false;
    }
}