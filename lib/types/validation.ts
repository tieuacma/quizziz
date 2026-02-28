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
