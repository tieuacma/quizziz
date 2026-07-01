import type { QuizQuestion, ReadingSubQuestion } from "@/types/quiz";

type PrimitiveAnswer = string | boolean | string[] | null;

export type SubmitAnswerPayload = {
    questionId: string;
    answer: PrimitiveAnswer;
    subAnswers?: Record<string, PrimitiveAnswer>;
    flagged?: boolean;
};

export function normalizeString(value: string): string {
    return value.trim().toLowerCase();
}

export function isMultiChoiceAnswerCorrect(
    answer: PrimitiveAnswer,
    question: Extract<QuizQuestion, { type: "multiple-choice" }>
): boolean {
    if (question.isMultiChoice) {
        const selected = Array.isArray(answer) ? answer : [];
        if (selected.length === 0) return false;
        return selected.every((item) => item === question.correctOptionId);
    }
    return typeof answer === "string" && answer === question.correctOptionId;
}

export function isFillBlankCorrect(
    answer: PrimitiveAnswer,
    question: Extract<QuizQuestion, { type: "fill-in-the-blank" }>
): boolean {
    if (typeof answer !== "string") return false;
    const expected = question.caseSensitive
        ? question.answers
        : question.answers.map(normalizeString);
    const current = question.caseSensitive
        ? answer.trim()
        : normalizeString(answer);
    return expected.includes(current);
}

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
            if (
                typeof answer !== "string" ||
                !Array.isArray(subQuestion.answers)
            )
                return false;
            return subQuestion.answers
                .map(normalizeString)
                .includes(normalizeString(answer));
        }
        default:
            return false;
    }
}

export function isQuestionCorrect(
    question: QuizQuestion,
    submitted?: SubmitAnswerPayload
): boolean {
    if (!submitted) return false;
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
            return question.questions.every((sub) =>
                isReadingSubQuestionCorrect(subAnswers[sub.id] ?? null, sub)
            );
        }
        default:
            return false;
    }
}
