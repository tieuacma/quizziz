import type { ReadingSubQuestion } from "@/types/quiz";

export function parseCorrectOptionIds(correctOptionId: string): string[] {
  if (!correctOptionId.trim()) return [];
  return correctOptionId.split(",").map((id) => id.trim()).filter(Boolean);
}

export function gradeMultipleChoice(
  correctOptionId: string,
  selectedOptionId: string,
  isMultiChoice?: boolean,
): boolean {
  const correctIds = parseCorrectOptionIds(correctOptionId);
  if (correctIds.length === 0) return false;

  if (isMultiChoice) {
    const selectedIds = parseCorrectOptionIds(selectedOptionId);
    if (selectedIds.length !== correctIds.length) return false;
    return correctIds.every((id) => selectedIds.includes(id));
  }

  return correctIds[0] === selectedOptionId;
}

export function gradeFillBlank(
  answers: string[],
  userAnswer: string,
  caseSensitive?: boolean,
): boolean {
  const normalizedUser = caseSensitive
    ? userAnswer.trim()
    : userAnswer.trim().toLowerCase();

  return answers.some((answer) => {
    const normalized = caseSensitive
      ? answer.trim()
      : answer.toLowerCase().trim();
    return normalizedUser === normalized;
  });
}

export function gradeTrueFalse(
  correctAnswer: boolean,
  selected: boolean,
): boolean {
  return correctAnswer === selected;
}

export function gradeReadingSub(
  sub: ReadingSubQuestion,
  userAnswer: string,
): boolean {
  if (sub.type === "multiple-choice") {
    if (!sub.correctOptionId) return false;
    return sub.correctOptionId === userAnswer;
  }

  if (sub.type === "fill-in-the-blank") {
    if (!sub.answers?.length) return false;
    return gradeFillBlank(sub.answers, userAnswer, false);
  }

  if (sub.type === "true-false") {
    if (typeof sub.correctAnswer !== "boolean") return false;
    return gradeTrueFalse(sub.correctAnswer, userAnswer === "true");
  }

  return false;
}
