"use client";

import { QuizQuestion } from "@/types/quiz";
import { QuestionTypeIcon } from "@/components/quiz-create/utils";

import { Clock } from "lucide-react";

function safeText(text?: string) {
  const t = text?.trim();
  return t || "";
}

function OptionLetter(idx: number) {
  return String.fromCharCode(65 + idx);
}

export default function QuizQuestionView({
  question,
}: {
  question: QuizQuestion;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-2xl border border-white/10 bg-gradient-to-b from-indigo-500/5 via-slate-950/40 to-slate-950/60 p-4 shadow-[0_0_60px_rgba(99,102,241,0.14)]">
        <div className="text-xs font-mono tracking-wide text-indigo-200/70 flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <span className="text-base">{QuestionTypeIcon[question.type]}</span>
            Câu hỏi
          </span>
        </div>

        <div className="text-sm text-slate-200 leading-relaxed">
          {question.type === "reading"
            ? safeText(question.question) || "(Không có tiêu đề)"
            : safeText(question.question) || "Chưa có nội dung"}
        </div>
      </div>

      {/* Multiple choice */}
      {question.type === "multiple-choice" && (
        <div className="grid grid-cols-1 gap-2">
          {(question.options || []).map((opt, idx) => {
            const isCorrect = question.correctOptionId === opt.id;
            const letter = OptionLetter(idx);

            return (
              <div
                key={opt.id}
                className={
                  "flex items-start gap-3 rounded-lg border p-3 backdrop-blur-sm " +
                  (isCorrect
                    ? "border-emerald-400/30 bg-emerald-500/10 shadow-[0_0_18px_rgba(52,211,153,0.35)]"
                    : "border-white/10 bg-white/5")
                }
              >
                <div
                  className={
                    "mt-0.5 font-mono text-sm px-2 py-0.5 rounded-md border " +
                    (isCorrect
                      ? "text-emerald-100 bg-emerald-400/20 border-emerald-400/30"
                      : "text-slate-300 bg-slate-800/40 border-white/10")
                  }
                >
                  {letter}
                </div>
                <div className="text-sm text-slate-200 leading-relaxed">
                  {safeText(opt.text) || (
                    <span className="text-slate-500">(Trống)</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fill in the blank */}
      {question.type === "fill-in-the-blank" && (
        <div className="space-y-2">
          <div className="text-xs text-slate-400">Đáp án</div>
          <div className="flex flex-wrap gap-2">
            {(question.answers || []).map((a, idx) => {
              const text = a?.trim();
              if (!text) return null;
              return (
                <div
                  key={idx}
                  className="font-mono text-sm px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/15 via-indigo-500/10 to-purple-500/15 border border-emerald-400/20 text-emerald-100 shadow-[0_0_16px_rgba(52,211,153,0.25)]"
                >
                  {text}
                </div>
              );
            })}

            {(question.answers || []).every((a) => !a?.trim()) && (
              <div className="text-sm text-slate-500">Chưa có đáp án</div>
            )}
          </div>
        </div>
      )}

      {/* True/false */}
      {question.type === "true-false" && (
        <div className="flex items-center gap-3">
          <div
            className={
              "px-4 py-2 rounded-xl border text-sm font-semibold " +
              (question.correctAnswer
                ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.35)]"
                : "bg-red-500/15 border-red-400/30 text-red-100 shadow-[0_0_18px_rgba(248,113,113,0.35)]")
            }
          >
            {question.correctAnswer ? "✅ ĐÚNG" : "❌ SAI"}
          </div>
          {question.explanation?.trim() && (
            <div className="text-sm text-slate-300">{question.explanation}</div>
          )}
        </div>
      )}

      {/* Reading */}
      {question.type === "reading" && (
        <div className="space-y-4">
          <div className="text-xs font-mono tracking-wide text-indigo-200/70">
            Đoạn văn đọc hiểu
          </div>

          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 p-4 shadow-[0_0_24px_rgba(139,92,246,0.18)]">
            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {question.passage?.trim() || "Chưa có đoạn văn"}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs text-slate-400">Câu hỏi phụ</div>

            <div className="space-y-2">
              {(question.questions || []).map((sq, idx) => {
                const isMCQ = sq.type === "multiple-choice";
                return (
                  <div
                    key={sq.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="font-mono text-xs text-indigo-200/80">
                        {idx + 1}.
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-slate-200">
                          {sq.question?.trim() || "(Trống)"}
                        </div>

                        {/* sub question preview by type */}
                        {isMCQ && (
                          <div className="grid grid-cols-1 gap-2 mt-3">
                            {(sq.options || []).map((opt, j) => {
                              const isCorrect = sq.correctOptionId === opt.id;
                              const letter = OptionLetter(j);
                              return (
                                <div
                                  key={opt.id}
                                  className={
                                    "flex items-start gap-3 rounded-lg border p-2 " +
                                    (isCorrect
                                      ? "border-emerald-400/30 bg-emerald-500/10 shadow-[0_0_18px_rgba(52,211,153,0.35)]"
                                      : "border-white/10 bg-white/5")
                                  }
                                >
                                  <div
                                    className={
                                      "font-mono text-xs px-2 py-0.5 rounded-md border " +
                                      (isCorrect
                                        ? "text-emerald-100 bg-emerald-400/20 border-emerald-400/30"
                                        : "text-slate-300 bg-slate-800/40 border-white/10")
                                    }
                                  >
                                    {letter}
                                  </div>
                                  <div className="text-sm text-slate-200">
                                    {opt.text?.trim() || (
                                      <span className="text-slate-500">
                                        (Trống)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {sq.type === "fill-in-the-blank" && (
                          <div className="mt-3 text-sm text-slate-200">
                            {(sq.answers || []).filter((a) => a?.trim())
                              .length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {(sq.answers || [])
                                  .filter((a) => a?.trim())
                                  .map((a, k) => (
                                    <span
                                      key={k}
                                      className="font-mono text-xs px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-100 shadow-[0_0_16px_rgba(52,211,153,0.25)]"
                                    >
                                      {a.trim()}
                                    </span>
                                  ))}
                              </div>
                            ) : (
                              <span className="text-slate-500">
                                Chưa có đáp án
                              </span>
                            )}
                          </div>
                        )}

                        {sq.type === "true-false" && (
                          <div
                            className={
                              "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mt-3 " +
                              (sq.correctAnswer
                                ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.35)]"
                                : "bg-red-500/15 border-red-400/30 text-red-100 shadow-[0_0_18px_rgba(248,113,113,0.35)]")
                            }
                          >
                            {sq.correctAnswer ? "✅ ĐÚNG" : "❌ SAI"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Meta hint */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Clock className="w-3 h-3" />
        <span>Thời gian: {question.timeLimit}s</span>
      </div>
    </div>
  );
}
