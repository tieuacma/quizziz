// Validation Types for Quiz Editor

export type ValidationError = {
    questionId: string;
    field: string;
    message: string;
};

export type ValidationResult = {
    isValid: boolean;
    errors: ValidationError[];
    firstErrorQuestionId: string | null;
};

export type QuestionError = {
    question: string;
    options: string[];
    correctOptionId: string;
    correctAnswer: string;
    context: string;
    subQuestions: SubQuestionError[];
};

export type SubQuestionError = {
    question: string;
    options: string[];
    correctOptionId: string;
    correctAnswer: string;
};

export function createEmptyQuestionError(): QuestionError {
    return {
        question: "",
        options: [],
        correctOptionId: "",
        correctAnswer: "",
        context: "",
        subQuestions: [],
    };
}

import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
    fullName: z.string().min(1, 'Full name required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

