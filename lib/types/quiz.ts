// Quiz Types and Interfaces

export interface QuizOverview {
    id: string;
    title: string;
    subject: string;
    classId: string;
    description: string;
    createdAt: string;
}

/* =========================
   MULTIPLE CHOICE
========================= */

export interface MultipleChoiceOption {
    id: string;
    text: string;
}

export interface MultipleChoiceQuestion {
    id: string;
    type: "multiple_choice";
    question: string;
    options: MultipleChoiceOption[];
    correctOptionId: string;
}

/* =========================
   FILL BLANK
========================= */

export interface FillBlankQuestion {
    id: string;
    type: "fill_blank";
    question: string;
    correctAnswer: string;
}

/* =========================
   READING
========================= */

export type ReadingSubQuestion =
    | {
        id: string;
        type: "multiple_choice";
        question: string;
        options: MultipleChoiceOption[];
        correctOptionId: string;
    }
    | {
        id: string;
        type: "fill_blank";
        question: string;
        correctAnswer: string;
    };

export interface ReadingQuestion {
    id: string;
    type: "reading";
    context: string;
    subQuestions: ReadingSubQuestion[];
}

/* =========================
   UNION QUESTION
========================= */

export type Question =
    | MultipleChoiceQuestion
    | FillBlankQuestion
    | ReadingQuestion;

/* =========================
   QUIZ DETAIL
========================= */

export interface QuizDetail {
    id: string;
    title: string;
    subject: string;
    classId: string;
    description: string;
    questions: Question[];
    createdAt: string;
    updatedAt: string;
}

/* =========================
   CLASS & STUDENT
========================= */

export interface ClassData {
    id: string;
    name: string;
    grade: string;
    activeQuizzes: number;
    completedQuizzes: number;
    avgScore: number;
}

export interface StudentData {
    id: string;
    name: string;
    email: string;
    classIds: string[];
    quizzesCompleted: number;
    avgScore: number;
    lastActivity: string;
    status: string;
}