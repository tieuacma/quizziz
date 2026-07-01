import type { QuizQuestion } from "@/types/quiz";
import { generateId } from "@/types/quiz";

export const sampleQuizData = {
    metadata: {
        id: "demo-quiz",
        title: "Quiz mẫu — JavaScript",
        totalQuestions: 5,
        defaultTime: 30,
    },
    questions: [
        {
            id: "q1",
            type: "multiple-choice" as const,
            question: "Kết quả của typeof null trong JavaScript là gì?",
            difficulty: "medium" as const,
            timeLimit: 30,
            options: [
                { id: "a1", text: '"object"' },
                { id: "a2", text: '"null"' },
                { id: "a3", text: '"undefined"' },
                { id: "a4", text: '"string"' },
            ],
            correctOptionId: "a1",
        },
        {
            id: "q2",
            type: "fill-in-the-blank" as const,
            question: "Phương thức thêm phần tử vào cuối mảng là ______().",
            difficulty: "easy" as const,
            timeLimit: 25,
            answers: ["push", "append"],
            caseSensitive: false,
        },
        {
            id: "q3",
            type: "true-false" as const,
            question: "JavaScript và Java là cùng một ngôn ngữ.",
            difficulty: "easy" as const,
            timeLimit: 20,
            correctAnswer: false,
        },
        {
            id: "q4",
            type: "multiple-choice" as const,
            question: "Cách nào tạo mảng chỉ chứa giá trị duy nhất?",
            difficulty: "hard" as const,
            timeLimit: 35,
            options: [
                { id: "b1", text: "filter()" },
                { id: "b2", text: "map()" },
                { id: "b3", text: "[...new Set(array)]" },
                { id: "b4", text: "reduce()" },
            ],
            correctOptionId: "b3",
            isMultiChoice: false,
        },
        {
            id: "q5",
            type: "reading" as const,
            question: "Đọc hiểu: Biến trong JS",
            difficulty: "medium" as const,
            timeLimit: 90,
            passage:
                "Trong JavaScript, biến được khai báo bằng let, const hoặc var. const không cho phép gán lại; let và var cho phép. var có phạm vi function, còn let/const có phạm vi block.",
            questions: [
                {
                    id: generateId(),
                    question: "Từ khóa nào không cho phép gán lại giá trị?",
                    type: "multiple-choice" as const,
                    options: [
                        { id: "r1a", text: "var" },
                        { id: "r1b", text: "let" },
                        { id: "r1c", text: "const" },
                    ],
                    correctOptionId: "r1c",
                },
                {
                    id: generateId(),
                    question: "var có phạm vi block.",
                    type: "true-false" as const,
                    correctAnswer: false,
                },
            ],
        },
    ] as QuizQuestion[],
};
