// Question type definitions
import { ListChecks, Type, BookOpen } from "lucide-react";

export const QUESTION_TYPES = {
    multiple_choice: {
        label: "Trắc nghiệm",
        icon: ListChecks,
        color: "bg-blue-100 text-blue-600",
    },
    fill_blank: {
        label: "Điền ô trống",
        icon: Type,
        color: "bg-green-100 text-green-600",
    },
    reading: {
        label: "Bài đọc",
        icon: BookOpen,
        color: "bg-purple-100 text-purple-600",
    },
} as const;

export type QuestionType = keyof typeof QUESTION_TYPES;
