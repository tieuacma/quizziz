import { QuizQuestionType, QuizDifficulty } from "@/types/quiz";

export const QuestionTypeLabel: Record<QuizQuestionType, string> = {
    "multiple-choice": "Trắc nghiệm",
    "fill-in-the-blank": "Điền khuyết",
    "true-false": "Đúng/Sai",
    reading: "Đọc hiểu",
} as const;

export const QuestionTypeIcon: Record<QuizQuestionType, string> = {
    "multiple-choice": "📝",
    "fill-in-the-blank": "🔤",
    "true-false": "✅❌",
    reading: "📖",
} as const;

interface DifficultyBadgeProps {
    difficulty: QuizDifficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
    const colors = {
        easy: "bg-green-500/20 text-green-400 border-green-500/30",
        medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        hard: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[difficulty]}`}
        >
            {difficulty === "easy"
                ? "Dễ"
                : difficulty === "medium"
                  ? "Trung bình"
                  : "Khó"}
        </span>
    );
}
