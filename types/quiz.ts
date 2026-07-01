// ─────────────────────────────────────────────────────────────
// Quiz TypeScript Interfaces
// ─────────────────────────────────────────────────────────────

export type QuizQuestionType =
    "multiple-choice" | "fill-in-the-blank" | "true-false" | "reading";

export type QuizDifficulty = "easy" | "medium" | "hard";

// ── Base Question Interface ──
export interface BaseQuestion {
    id: string;
    type: QuizQuestionType;
    question: string;
    difficulty: QuizDifficulty;
    category?: string;
    timeLimit: number; // in seconds
}

// ── Multiple Choice Question ──
export interface MultipleChoiceOption {
    id: string;
    text: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: "multiple-choice";
    options: MultipleChoiceOption[];
    correctOptionId: string; // ID of the correct option
    isMultiChoice?: boolean; // Support multiple correct answers
    explanation?: string; // Optional explanation for the answer
}

// ── Fill in the Blank Question ──
export interface FillInBlankQuestion extends BaseQuestion {
    type: "fill-in-the-blank";
    answers: string[]; // Multiple accepted answers (case-insensitive)
    caseSensitive?: boolean;
}

// ── True/False Question ──
export interface TrueFalseQuestion extends BaseQuestion {
    type: "true-false";
    correctAnswer: boolean;
    explanation?: string;
}

// ── Reading Sub-Question (Nested inside Reading Passage) ──
export interface ReadingSubQuestion {
    id: string;
    question: string;
    type: "multiple-choice" | "fill-in-the-blank" | "true-false";
    // For multiple-choice sub-question
    options?: MultipleChoiceOption[];
    correctOptionId?: string;
    // For fill-in-the-blank sub-question
    answers?: string[];
    // For true-false sub-question
    correctAnswer?: boolean;
}

export interface ReadingQuestion extends BaseQuestion {
    type: "reading";
    passage: string; // Long text passage
    questions: ReadingSubQuestion[]; // Array of sub-questions related to the passage
}

// ── Union Type for all question types ──
export type QuizQuestion =
    | MultipleChoiceQuestion
    | FillInBlankQuestion
    | TrueFalseQuestion
    | ReadingQuestion;

// ── NEW: QuizState for Game Logic ──
export type PowerUpType = "freeze" | "eraser" | "shield" | "double";

export interface PowerUpInventory {
    freeze: number;
    eraser: number;
    shield: number;
    double: number;
}

export interface PowerUpState {
    inventory: PowerUpInventory;
    active: {
        freeze: boolean;
        shield: boolean;
        double: boolean;
        eraser: boolean;
    };
}

export interface LeaderboardParticipant {
    id: string;
    name: string;
    avatar: string;
    score: number;
    streak: number;
    isPlayer: boolean;
}

export interface AudioSettingsState {
    music: boolean;
    sfx: boolean;
}

export interface QuizState {
    profile_id: string;
    quiz_id: string;
    correct_count: number;
    wrong_count: number;
    current_question_index: number;
    score: number;
    streak: number;
    status: "idle" | "ready" | "playing" | "finished";
    incorrect_questions: string[];
    currentSubQuestionIndex?: number;
    powerups?: PowerUpState;
    leaderboard?: LeaderboardParticipant[];
    audioSettings?: AudioSettingsState;
}

// ── Quiz Data Structure ──
export interface QuizMetadata {
    id: string;
    title: string;
    description?: string;
    category?: string;
    createdAt: string;
    updatedAt: string;
    authorId?: string;
    totalQuestions: number;
    defaultTime: number; // in seconds (per question)
    examTimeLimit?: number; // in seconds (total exam duration)
}

export interface QuizData {
    metadata: QuizMetadata;
    questions: QuizQuestion[];
}

// ── Form State for Server Action ──
export type QuizFormState =
    | { success: true; message: string }
    | { success: false; error: string; field?: string }
    | undefined;

// ── Helper Functions ──
export function generateId(): string {
    return crypto.randomUUID();
}

const DEFAULT_TIME_LIMIT = 30; // seconds

export function createEmptyQuestion(
    type: QuizQuestionType,
    defaultTime = DEFAULT_TIME_LIMIT
): QuizQuestion {
    const base = {
        id: generateId(),
        question: "",
        difficulty: "medium" as QuizDifficulty,
        timeLimit: defaultTime,
    };

    switch (type) {
        case "multiple-choice":
            return {
                ...base,
                type: "multiple-choice",
                options: [
                    { id: generateId(), text: "" },
                    { id: generateId(), text: "" },
                ],
                correctOptionId: "",
            };
        case "fill-in-the-blank":
            return {
                ...base,
                type: "fill-in-the-blank",
                answers: [""],
                caseSensitive: false,
            };
        case "true-false":
            return {
                ...base,
                type: "true-false",
                correctAnswer: true,
            };
        case "reading":
            return {
                ...base,
                type: "reading",
                passage: "",
                questions: [
                    {
                        id: generateId(),
                        question: "",
                        type: "multiple-choice",
                        options: [
                            { id: generateId(), text: "" },
                            { id: generateId(), text: "" },
                        ],
                        correctOptionId: "",
                    },
                ],
            };
    }
}
