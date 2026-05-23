import type { QuizQuestion } from "@/types/quiz";

export function validateQuestion(q: QuizQuestion): string | null {
  if (q.type !== "reading" && !q.question.trim()) {
    return "Câu hỏi chưa có nội dung";
  }

  if (q.type === "multiple-choice") {
    if (!q.correctOptionId) return "Câu hỏi trắc nghiệm chưa chọn đáp án đúng";
    if (q.options.some((o) => !o.text.trim())) {
      return "Lựa chọn trắc nghiệm chưa nhập nội dung";
    }
  }

  if (q.type === "fill-in-the-blank") {
    if (q.answers.every((a) => !a.trim())) {
      return "Câu hỏi điền khuyết chưa có đáp án";
    }
  }

  if (q.type === "reading") {
    if (!q.passage.trim()) return "Đoạn văn đọc hiểu chưa có nội dung";
    if (!q.questions?.length) return "Cần ít nhất 1 câu hỏi phụ";

    for (const sub of q.questions) {
      if (!sub.question.trim()) return "Câu hỏi phụ chưa có nội dung";

      if (sub.type === "multiple-choice") {
        if (!sub.correctOptionId) return "Câu hỏi phụ trắc nghiệm chưa chọn đáp án";
        if (!sub.options?.length) return "Câu hỏi phụ trắc nghiệm thiếu lựa chọn";
        if (sub.options.some((o) => !o.text?.trim())) {
          return "Câu hỏi phụ trắc nghiệm có lựa chọn trống";
        }
      }

      if (sub.type === "fill-in-the-blank") {
        if (!sub.answers?.length || sub.answers.every((a) => !a.trim())) {
          return "Câu hỏi phụ điền khuyết chưa có đáp án";
        }
      }

      if (sub.type === "true-false") {
        if (typeof sub.correctAnswer !== "boolean") {
          return "Câu hỏi phụ đúng/sai chưa chọn đáp án";
        }
      }
    }
  }

  return null;
}

export function scrollToQuestion(questionId: string) {
  const el = document.querySelector(
    `[data-question-id="${questionId}"]`,
  ) as HTMLElement | null;
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  const err = el.querySelector(".text-red-400") as HTMLElement | null;
  if (err) err.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
