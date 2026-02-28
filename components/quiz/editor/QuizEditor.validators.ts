"use client";

import { Question, MultipleChoiceQuestion, FillBlankQuestion, ReadingQuestion, ReadingSubQuestion } from "@/lib/quizStore";
import { ValidationError, ValidationResult } from "@/lib/types/validation";

/**
 * Validate a single multiple choice question
 */
export function validateMultipleChoiceQuestion(question: MultipleChoiceQuestion): ValidationError[] {
    const errors: ValidationError[] = [];
    const qId = question.id;

    // Check question content
    if (!question.question || question.question.trim() === "") {
        errors.push({
            questionId: qId,
            field: "question",
            message: "Nội dung câu hỏi không được để trống",
        });
    }

    // Check options are not empty
    if (!question.options || question.options.length === 0) {
        errors.push({
            questionId: qId,
            field: "options",
            message: "Phải có ít nhất 2 lựa chọn",
        });
    } else {
        question.options.forEach((option, index) => {
            if (!option.text || option.text.trim() === "") {
                errors.push({
                    questionId: qId,
                    field: `options[${index}]`,
                    message: `Lựa chọn ${String.fromCharCode(65 + index)} không được để trống`,
                });
            }
        });
    }

    // Check correct answer is selected
    if (!question.correctOptionId || question.correctOptionId.trim() === "") {
        errors.push({
            questionId: qId,
            field: "correctOptionId",
            message: "Phải chọn ít nhất một đáp án đúng",
        });
    }

    return errors;
}

/**
 * Validate a single fill in blank question
 */
export function validateFillBlankQuestion(question: FillBlankQuestion): ValidationError[] {
    const errors: ValidationError[] = [];
    const qId = question.id;

    // Check question content
    if (!question.question || question.question.trim() === "") {
        errors.push({
            questionId: qId,
            field: "question",
            message: "Nội dung câu hỏi không được để trống",
        });
    }

    // Check correct answer
    if (!question.correctAnswer || question.correctAnswer.trim() === "") {
        errors.push({
            questionId: qId,
            field: "correctAnswer",
            message: "Đáp án đúng không được để trống",
        });
    }

    return errors;
}

/**
 * Validate a single reading sub question
 */
export function validateReadingSubQuestion(subQ: ReadingSubQuestion): ValidationError[] {
    const errors: ValidationError[] = [];
    const sqId = subQ.id;

    if (subQ.type === "multiple_choice") {
        // Check question content
        if (!subQ.question || subQ.question.trim() === "") {
            errors.push({
                questionId: sqId,
                field: "question",
                message: "Nội dung câu hỏi không được để trống",
            });
        }

        // Check options
        if (!subQ.options || subQ.options.length === 0) {
            errors.push({
                questionId: sqId,
                field: "options",
                message: "Phải có ít nhất 2 lựa chọn",
            });
        } else {
            subQ.options.forEach((option, index) => {
                if (!option.text || option.text.trim() === "") {
                    errors.push({
                        questionId: sqId,
                        field: `options[${index}]`,
                        message: `Lựa chọn ${String.fromCharCode(65 + index)} không được để trống`,
                    });
                }
            });
        }

        // Check correct answer
        if (!subQ.correctOptionId || subQ.correctOptionId.trim() === "") {
            errors.push({
                questionId: sqId,
                field: "correctOptionId",
                message: "Phải chọn ít nhất một đáp án đúng",
            });
        }
    } else if (subQ.type === "fill_blank") {
        // Check question content
        if (!subQ.question || subQ.question.trim() === "") {
            errors.push({
                questionId: sqId,
                field: "question",
                message: "Nội dung câu hỏi không được để trống",
            });
        }

        // Check correct answer
        if (!subQ.correctAnswer || subQ.correctAnswer.trim() === "") {
            errors.push({
                questionId: sqId,
                field: "correctAnswer",
                message: "Đáp án đúng không được để trống",
            });
        }
    }

    return errors;
}

/**
 * Validate a single reading question
 */
export function validateReadingQuestion(question: ReadingQuestion): ValidationError[] {
    const errors: ValidationError[] = [];
    const qId = question.id;

    // Check context
    if (!question.context || question.context.trim() === "") {
        errors.push({
            questionId: qId,
            field: "context",
            message: "Nội dung bài đọc không được để trống",
        });
    }

    // Check sub questions
    if (!question.subQuestions || question.subQuestions.length === 0) {
        errors.push({
            questionId: qId,
            field: "subQuestions",
            message: "Phải có ít nhất một câu hỏi phụ",
        });
    } else {
        question.subQuestions.forEach((subQ) => {
            const subErrors = validateReadingSubQuestion(subQ);
            errors.push(...subErrors);
        });
    }

    return errors;
}

/**
 * Validate a single question based on its type
 */
export function validateQuestion(question: Question): ValidationError[] {
    switch (question.type) {
        case "multiple_choice":
            return validateMultipleChoiceQuestion(question);
        case "fill_blank":
            return validateFillBlankQuestion(question);
        case "reading":
            return validateReadingQuestion(question);
        default:
            return [];
    }
}

/**
 * Validate entire quiz
 */
export function validateQuiz(questions: Question[]): ValidationResult {
    const errors: ValidationError[] = [];

    // Check if quiz has at least one question
    if (!questions || questions.length === 0) {
        return {
            isValid: false,
            errors: [{
                questionId: "root",
                field: "questions",
                message: "Quiz phải có ít nhất một câu hỏi",
            }],
            firstErrorQuestionId: "root",
        };
    }

    // Validate each question
    questions.forEach((question) => {
        const questionErrors = validateQuestion(question);
        errors.push(...questionErrors);
    });

    // Find first error question ID
    const firstError = errors.find(e => e.questionId !== "root");
    const firstErrorQuestionId = firstError?.questionId || null;

    return {
        isValid: errors.length === 0,
        errors,
        firstErrorQuestionId,
    };
}

/**
 * Get errors for a specific question
 */
export function getErrorsForQuestion(errors: ValidationError[], questionId: string): ValidationError[] {
    return errors.filter(error => error.questionId === questionId);
}

/**
 * Check if a specific field has error
 */
export function hasFieldError(errors: ValidationError[], questionId: string, field: string): boolean {
    return errors.some(error => error.questionId === questionId && error.field === field);
}
