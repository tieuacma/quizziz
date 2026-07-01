"use client";

import puter from "@heyputer/puter.js";
import type { ChatMessage } from "@heyputer/puter.js";
import {
    generateId,
    type MultipleChoiceQuestion,
    type QuizQuestion,
    type ReadingQuestion,
    type ReadingSubQuestion,
} from "@/types/quiz";

export interface AiGenerateConfig {
    topic: string;
    multipleChoiceCount: number;
    trueFalseCount: number;
    readingPassageCount: number;
    readingSubQuestionsPerPassage: number;
    model?: string;
}

export const MAX_AI_QUESTIONS = 20;

export const AI_MODEL_OPTIONS = [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet" },
] as const;

export function computeAiQuestionTotal(
    config: Pick<
        AiGenerateConfig,
        | "multipleChoiceCount"
        | "trueFalseCount"
        | "readingPassageCount"
        | "readingSubQuestionsPerPassage"
    >
): number {
    return (
        config.multipleChoiceCount +
        config.trueFalseCount +
        config.readingPassageCount * config.readingSubQuestionsPerPassage
    );
}

const SYSTEM_PROMPT = `Bạn là chuyên gia biên soạn câu hỏi trắc nghiệm tiếng Việt cho hệ thống quiz.

NHIỆM VỤ: Trả về MỘT mảng JSON thuần túy (array) chứa các câu hỏi. KHÔNG bọc trong markdown, KHÔNG thêm giải thích, KHÔNG dùng \`\`\`json.

QUY TẮC BẮT BUỘC:
1. Toàn bộ nội dung (question, options, passage) phải bằng tiếng Việt chuẩn, chính xác về mặt kiến thức theo chủ đề.
2. Mỗi phần tử phải có trường "id" (chuỗi ngẫu nhiên, prefix "ai_").
3. Trắc nghiệm nhiều lựa chọn:
   - "type": "multiple-choice"
   - "question": nội dung câu hỏi
   - "options": đúng 4 phần tử, mỗi phần tử { "id": "opt_...", "text": "Đáp án A/B/C/D" }
   - "correctOptionId": id của đáp án đúng (phải khớp một option.id)
4. Câu Đúng/Sai:
   - "type": "multiple-choice"
   - "question": nội dung câu hỏi
   - "options": CHÍNH XÁC 2 phần tử: [{ "id": "opt_...", "text": "Đ" }, { "id": "opt_...", "text": "S" }]
   - "correctOptionId": id của "Đ" hoặc "S" tùy câu
5. Bài đọc hiểu:
   - "type": "reading"
   - "passage": đoạn văn ngắn gọn, phù hợp chủ đề (150-400 từ)
   - "questions": mảng câu hỏi con, mỗi câu con là Đúng/Sai dạng multiple-choice với options "Đ" và "S"
6. Sinh ĐÚNG số lượng từng loại theo yêu cầu user.
7. Không thiếu trường bắt buộc. Không dùng ký tự lạ hay lỗi encoding.

VÍ DỤ TRẮC NGHIỆM:
{
  "id": "ai_mcq_1",
  "question": "Ai là vua sáng lập nhà Trần?",
  "type": "multiple-choice",
  "options": [
    { "id": "opt_a", "text": "Trần Thái Tổ" },
    { "id": "opt_b", "text": "Lý Thái Tổ" },
    { "id": "opt_c", "text": "Lê Lợi" },
    { "id": "opt_d", "text": "Quang Trung" }
  ],
  "correctOptionId": "opt_a"
}

VÍ DỤ ĐÚNG/SAI:
{
  "id": "ai_tf_1",
  "question": "Nhà Trần được thành lập năm 1225.",
  "type": "multiple-choice",
  "options": [
    { "id": "opt_d", "text": "Đ" },
    { "id": "opt_s", "text": "S" }
  ],
  "correctOptionId": "opt_d"
}

VÍ DỤ READING:
{
  "id": "ai_read_1",
  "type": "reading",
  "passage": "Nhà Trần...",
  "questions": [
    {
      "id": "ai_sub_1",
      "question": "Nhà Trần thay thế nhà Lý.",
      "type": "multiple-choice",
      "options": [
        { "id": "sub_d", "text": "Đ" },
        { "id": "sub_s", "text": "S" }
      ],
      "correctOptionId": "sub_d"
    }
  ]
}`;

function buildUserPrompt(config: AiGenerateConfig): string {
    const parts = [`Chủ đề bài học: "${config.topic.trim()}".`];

    if (config.multipleChoiceCount > 0) {
        parts.push(
            `Sinh ${config.multipleChoiceCount} câu trắc nghiệm nhiều lựa chọn (4 đáp án A/B/C/D).`
        );
    }
    if (config.trueFalseCount > 0) {
        parts.push(
            `Sinh ${config.trueFalseCount} câu Đúng/Sai (options "Đ" và "S").`
        );
    }
    if (config.readingPassageCount > 0) {
        parts.push(
            `Sinh ${config.readingPassageCount} bài đọc hiểu, mỗi bài có ${config.readingSubQuestionsPerPassage} câu hỏi con Đúng/Sai.`
        );
    }

    parts.push("Trả về duy nhất mảng JSON, không có text khác.");
    return parts.join(" ");
}

export function extractJsonArray(raw: string): unknown {
    let text = raw.trim();

    const fenceMatch = text.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
    if (fenceMatch) {
        text = fenceMatch[1].trim();
    } else {
        text = text
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/```\s*$/, "")
            .trim();
    }

    try {
        return JSON.parse(text);
    } catch {
        const arrayMatch = text.match(/\[[\s\S]*\]/);
        if (!arrayMatch) {
            throw new Error(
                "AI không trả về mảng JSON hợp lệ. Vui lòng thử lại."
            );
        }
        try {
            return JSON.parse(arrayMatch[0]);
        } catch {
            throw new Error(
                "Không thể phân tích JSON từ phản hồi AI. Vui lòng thử lại."
            );
        }
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return value != null && typeof value === "object" && !Array.isArray(value);
}

function validateOption(opt: unknown, label: string): void {
    if (
        !isRecord(opt) ||
        typeof opt.id !== "string" ||
        typeof opt.text !== "string"
    ) {
        throw new Error(`${label}: option thiếu id hoặc text.`);
    }
    if (!opt.text.trim()) {
        throw new Error(`${label}: option có nội dung trống.`);
    }
}

function validateMultipleChoiceItem(
    item: Record<string, unknown>,
    label: string
): void {
    if (typeof item.question !== "string" || !item.question.trim()) {
        throw new Error(`${label}: thiếu nội dung câu hỏi.`);
    }
    if (!Array.isArray(item.options) || item.options.length < 2) {
        throw new Error(`${label}: thiếu options.`);
    }
    for (const opt of item.options) {
        validateOption(opt, label);
    }
    if (typeof item.correctOptionId !== "string" || !item.correctOptionId) {
        throw new Error(`${label}: thiếu correctOptionId.`);
    }
    const optionIds = new Set(
        item.options
            .filter(isRecord)
            .map((o) => o.id)
            .filter((id): id is string => typeof id === "string")
    );
    if (!optionIds.has(item.correctOptionId)) {
        throw new Error(`${label}: correctOptionId không khớp options.`);
    }
}

function validateAiQuestions(parsed: unknown): void {
    if (!Array.isArray(parsed)) {
        throw new Error("Phản hồi AI phải là một mảng câu hỏi.");
    }
    if (parsed.length === 0) {
        throw new Error("AI không sinh được câu hỏi nào.");
    }

    parsed.forEach((item, index) => {
        const label = `Câu hỏi #${index + 1}`;
        if (!isRecord(item)) {
            throw new Error(`${label}: cấu trúc không hợp lệ.`);
        }
        if (typeof item.id !== "string" || !item.id) {
            throw new Error(`${label}: thiếu id.`);
        }
        if (item.type === "multiple-choice") {
            validateMultipleChoiceItem(item, label);
            return;
        }
        if (item.type === "reading") {
            if (typeof item.passage !== "string" || !item.passage.trim()) {
                throw new Error(`${label}: thiếu passage.`);
            }
            if (!Array.isArray(item.questions) || item.questions.length === 0) {
                throw new Error(
                    `${label}: thiếu câu hỏi con trong bài đọc hiểu.`
                );
            }
            item.questions.forEach((sub, subIndex) => {
                if (!isRecord(sub)) {
                    throw new Error(
                        `${label} - câu con #${subIndex + 1}: cấu trúc không hợp lệ.`
                    );
                }
                if (sub.type !== "multiple-choice") {
                    throw new Error(
                        `${label} - câu con #${subIndex + 1}: phải là multiple-choice.`
                    );
                }
                validateMultipleChoiceItem(
                    sub,
                    `${label} - câu con #${subIndex + 1}`
                );
            });
            return;
        }
        throw new Error(
            `${label}: type không được hỗ trợ (${String(item.type)}).`
        );
    });
}

function normalizeOptions(options: Array<{ id: string; text: string }>): {
    options: Array<{ id: string; text: string }>;
    correctOptionId: string;
    oldToNew: Map<string, string>;
} {
    const oldToNew = new Map<string, string>();
    const normalized = options.map((opt) => {
        const newId = generateId();
        oldToNew.set(opt.id, newId);
        return { id: newId, text: opt.text.trim() };
    });
    return { options: normalized, correctOptionId: "", oldToNew };
}

function normalizeMultipleChoice(
    item: Record<string, unknown>,
    defaultTime: number
): MultipleChoiceQuestion {
    const rawOptions = (
        item.options as Array<{ id: string; text: string }>
    ).map((o) => ({
        id: String(o.id),
        text: String(o.text),
    }));
    const { options, oldToNew } = normalizeOptions(rawOptions);
    const oldCorrect = String(item.correctOptionId);
    const correctOptionId = oldToNew.get(oldCorrect) ?? options[0]?.id ?? "";

    return {
        id: generateId(),
        type: "multiple-choice",
        question: String(item.question).trim(),
        difficulty: "medium",
        timeLimit: defaultTime,
        options,
        correctOptionId,
    };
}

function normalizeReadingSubQuestion(
    sub: Record<string, unknown>
): ReadingSubQuestion {
    const rawOptions = (sub.options as Array<{ id: string; text: string }>).map(
        (o) => ({
            id: String(o.id),
            text: String(o.text),
        })
    );
    const { options, oldToNew } = normalizeOptions(rawOptions);
    const oldCorrect = String(sub.correctOptionId);
    const correctOptionId = oldToNew.get(oldCorrect) ?? options[0]?.id ?? "";

    return {
        id: generateId(),
        question: String(sub.question).trim(),
        type: "multiple-choice",
        options,
        correctOptionId,
    };
}

function normalizeToQuizQuestions(
    parsed: unknown,
    defaultTime: number,
    topic: string
): QuizQuestion[] {
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item) => {
        if (!isRecord(item)) {
            throw new Error("Cấu trúc câu hỏi không hợp lệ.");
        }

        if (item.type === "reading") {
            const subQuestions = (item.questions as unknown[]).map((sub) => {
                if (!isRecord(sub))
                    throw new Error("Câu hỏi con reading không hợp lệ.");
                return normalizeReadingSubQuestion(sub);
            });

            const reading: ReadingQuestion = {
                id: generateId(),
                type: "reading",
                question:
                    typeof item.question === "string" && item.question.trim()
                        ? item.question.trim()
                        : `Đọc hiểu: ${topic}`,
                difficulty: "medium",
                timeLimit: defaultTime,
                passage: String(item.passage).trim(),
                questions: subQuestions,
            };
            return reading;
        }

        return normalizeMultipleChoice(item, defaultTime);
    });
}

function getResponseContent(response: unknown): string {
    if (response == null || typeof response !== "object") {
        throw new Error("Phản hồi AI không hợp lệ.");
    }

    const message = (response as { message?: { content?: unknown } }).message;
    const content = message?.content;

    if (typeof content === "string" && content.trim()) {
        return content;
    }

    if (Array.isArray(content)) {
        const textPart = content.find(
            (part) =>
                isRecord(part) &&
                part.type === "text" &&
                typeof part.text === "string" &&
                part.text.trim()
        );
        if (
            textPart &&
            isRecord(textPart) &&
            typeof textPart.text === "string"
        ) {
            return textPart.text;
        }
    }

    throw new Error("Không đọc được nội dung phản hồi từ AI.");
}

export async function generateQuizQuestions(
    config: AiGenerateConfig,
    defaultTime: number
): Promise<QuizQuestion[]> {
    const total = computeAiQuestionTotal(config);
    if (total <= 0) {
        throw new Error("Vui lòng chọn ít nhất 1 câu hỏi để sinh.");
    }
    if (total > MAX_AI_QUESTIONS) {
        throw new Error(
            `Tổng số câu hỏi không được vượt quá ${MAX_AI_QUESTIONS}.`
        );
    }
    if (!config.topic.trim() || config.topic.trim().length < 3) {
        throw new Error("Chủ đề phải có ít nhất 3 ký tự.");
    }

    const model = config.model ?? "gpt-4o";

    let response: unknown;
    try {
        const messages: ChatMessage[] = [
            { role: "system", content: SYSTEM_PROMPT, images: [] },
            { role: "user", content: buildUserPrompt(config), images: [] },
        ];
        response = await puter.ai.chat(messages, { model, temperature: 0.3 });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (/auth|login|sign/i.test(message)) {
            throw new Error(
                "Cần đăng nhập Puter để sử dụng AI. Vui lòng hoàn tất đăng nhập trong cửa sổ popup và thử lại."
            );
        }
        throw new Error(`Không thể gọi AI: ${message}`);
    }

    const raw = getResponseContent(response);
    const parsed = extractJsonArray(raw);
    validateAiQuestions(parsed);
    return normalizeToQuizQuestions(parsed, defaultTime, config.topic.trim());
}
