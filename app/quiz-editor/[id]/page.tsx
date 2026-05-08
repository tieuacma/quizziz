"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateQuizAction, getQuizAction } from "@/app/actions/quiz-actions";
import {
  QuizQuestion,
  QuizQuestionType,
  createEmptyQuestion,
  QuizMetadata,
} from "@/types/quiz";
import {
  Trash2,
  Save,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Clock,
  Plus,
  CheckCircle2,
} from "lucide-react";
import QuestionEditor from "@/components/quiz-create/QuestionEditor";
import {
  QuestionTypeLabel,
  DifficultyBadge,
} from "@/components/quiz-create/utils";
import {
  ToastContainer,
  type Toast,
  type ToastType,
} from "@/components/quiz-create/ToastProvider";

interface QuizEditorPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizEditorPage({ params }: QuizEditorPageProps) {
  const router = useRouter();
  const [quizId, setQuizId] = useState<string>("");
  const [metadata, setMetadata] = useState<QuizMetadata | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToasts((prev: Toast[]) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id));
  }, []);

  // Load quiz data on mount
  useEffect(() => {
    const loadQuiz = async () => {
      const resolvedParams = await params;
      setQuizId(resolvedParams.id);

      try {
        const result = await getQuizAction(resolvedParams.id);
        if (result.success && result.data) {
          setMetadata(result.data.metadata);
          setQuestions(result.data.questions || []);
        } else {
          addToast(result.error || "Không tìm thấy quiz", "error");
          router.push("/dashboard/teacher");
        }
      } catch {
        addToast("Lỗi khi tải quiz", "error");
        router.push("/dashboard/teacher");
      } finally {
        setIsLoading(false);
      }
    };
    loadQuiz();
  }, [params, router, addToast]);

  const defaultTime = metadata?.defaultTime || 30;

  const addQuestion = (type: QuizQuestionType) => {
    const newQuestion = createEmptyQuestion(type, defaultTime);
    setQuestions((prev: QuizQuestion[]) => [...prev, newQuestion]);
    setExpandedQuestion(newQuestion.id);
    addToast(`Đã thêm câu hỏi ${QuestionTypeLabel[type]}`, "info");
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev: QuizQuestion[]) =>
      prev.filter((q: QuizQuestion) => q.id !== id),
    );
    if (expandedQuestion === id) setExpandedQuestion(null);
  };

  const updateQuestion = (id: string, updates: QuizQuestion) => {
    setQuestions((prev: QuizQuestion[]) =>
      prev.map((q: QuizQuestion) => (q.id === id ? updates : q)),
    );
  };

  const moveQuestion = (index: number, direction: "up" | "down"): void => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === questions.length - 1) return;

    const newQuestions = [...questions];
    const target = direction === "up" ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[target]] = [
      newQuestions[target],
      newQuestions[index],
    ];
    setQuestions(newQuestions);
  };

  // Apply default time to all questions (client state)
  const applyTimeToAll = () => {
    setQuestions((prev: QuizQuestion[]) =>
      prev.map((q: QuizQuestion) => ({ ...q, timeLimit: defaultTime })),
    );
    addToast(`Đã áp dụng ${defaultTime} giây cho tất cả câu hỏi`, "info");
  };

  const handleSave = async () => {
    // Validation
    if (questions.length === 0) {
      addToast("Vui lòng thêm ít nhất một câu hỏi", "error");
      return;
    }

    for (const q of questions) {
      if (!q.question.trim()) {
        addToast("Có câu hỏi chưa có nội dung", "error");
        return;
      }
      if (q.type === "multiple-choice") {
        if (!q.correctOptionId) {
          addToast("Có câu hỏi trắc nghiệm chưa chọn đáp án đúng", "error");
          return;
        }
        if (q.options.some((o) => !o.text.trim())) {
          addToast("Có lựa chọn trắc nghiệm chưa nhập nội dung", "error");
          return;
        }
      }
      if (q.type === "fill-in-the-blank" && q.answers.every((a) => !a.trim())) {
        addToast("Có câu hỏi điền khuyết chưa có đáp án", "error");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("id", quizId);
      if (metadata?.title) formData.append("title", metadata.title);
      if (metadata?.description)
        formData.append("description", metadata.description);
      if (metadata?.category) formData.append("category", metadata.category);
      formData.append(
        "defaultTime",
        String(metadata?.defaultTime || defaultTime),
      );
      formData.append("questions", JSON.stringify(questions));

      const result = await updateQuizAction(undefined, formData);

      if (result && result.success) {
        addToast(result.message || "Đã lưu quiz thành công!", "success");
      } else if (result) {
        addToast(result.error || "Lỗi khi lưu quiz", "error");
      } else {
        addToast("Lỗi khi lưu quiz", "error");
      }
    } catch {
      addToast("Lỗi khi lưu quiz", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const questionTypes: QuizQuestionType[] = [
    "multiple-choice",
    "fill-in-the-blank",
    "true-false",
    "reading",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/teacher")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {metadata?.title || "Chỉnh sửa Quiz"}
              </h1>
              <p className="text-slate-400 text-sm">
                {questions.length} câu hỏi
              </p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Đang lưu..." : "Lưu Quiz"}
          </Button>
        </div>

        {/* Quiz Settings Summary */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                {metadata?.description && (
                  <span className="truncate max-w-md">
                    {metadata.description}
                  </span>
                )}
                {metadata?.category && (
                  <Badge variant="outline">{metadata.category}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-400">
                  Mặc định: {defaultTime}s
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyTimeToAll}
                  title="Áp dụng cho tất cả câu hỏi"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Áp dụng
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Type Toolbar */}
        <div className="mb-6">
          <Label className="text-xs text-slate-400 mb-3 block">
            Thêm câu hỏi
          </Label>
          <div className="flex flex-wrap gap-2">
            {questionTypes.map((qt) => (
              <Button
                key={qt}
                variant="outline"
                onClick={() => addQuestion(qt)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {QuestionTypeLabel[qt]}
              </Button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, i) => (
            <Card key={q.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <Badge>{QuestionTypeLabel[q.type]}</Badge>
                    <DifficultyBadge difficulty={q.difficulty} />
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {q.timeLimit}s
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveQuestion(i, "up")}
                      disabled={i === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveQuestion(i, "down")}
                      disabled={i === questions.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setExpandedQuestion((prev) =>
                          prev === q.id ? null : q.id,
                        )
                      }
                      title="Chỉnh sửa"
                    >
                      {/* Pencil icon (lucide-react) */}
                      <span className="inline-flex items-center justify-center rounded-md text-indigo-200/90 bg-indigo-500/10 border border-indigo-400/20 shadow-[0_0_14px_rgba(99,102,241,0.35)]">
                        ✏️
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(q.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedQuestion === q.id && (
                <CardContent>
                  <QuestionEditor
                    question={q}
                    onChange={(newQ: QuizQuestion) =>
                      updateQuestion(q.id, newQ)
                    }
                  />
                  {/* Individual time limit */}
                  <div className="mt-4 pt-4 border-t">
                    <Label className="text-xs text-slate-400 mb-2 block">
                      Thời gian riêng (giây)
                    </Label>
                    <Input
                      type="number"
                      value={q.timeLimit}
                      onChange={(e) =>
                        updateQuestion(q.id, {
                          ...q,
                          timeLimit: parseInt(e.target.value) || defaultTime,
                        })
                      }
                      className="w-24"
                      min="5"
                      max="300"
                    />
                  </div>
                </CardContent>
              )}

              {expandedQuestion !== q.id && (
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-xs font-mono tracking-wide text-indigo-200/80">
                        Câu hỏi • Xem đầy đủ
                      </div>
                      <div className="text-sm text-slate-200 leading-relaxed">
                        {q.type === "reading"
                          ? q.question || "(Không có tiêu đề câu hỏi)"
                          : q.question || "Chưa có nội dung"}
                      </div>
                    </div>

                    {q.type === "multiple-choice" && (
                      <div className="grid grid-cols-1 gap-2">
                        {(q.options || []).map((opt, idx) => {
                          const isCorrect = q.correctOptionId === opt.id;
                          const letter = String.fromCharCode(65 + idx);
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
                                  "mt-0.5 font-mono text-sm px-2 py-0.5 rounded-md " +
                                  (isCorrect
                                    ? "text-emerald-100 bg-emerald-400/20 border border-emerald-400/30"
                                    : "text-slate-300 bg-slate-800/40 border border-white/10")
                                }
                              >
                                {letter}
                              </div>
                              <div className="text-sm text-slate-200 leading-relaxed">
                                {opt.text || (
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

                    {q.type === "fill-in-the-blank" && (
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400">Đáp án</div>
                        <div className="flex flex-wrap gap-2">
                          {(q.answers || []).map((a, idx) => {
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
                          {(q.answers || []).every((a) => !a?.trim()) && (
                            <div className="text-sm text-slate-500">
                              Chưa có đáp án
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {q.type === "true-false" && (
                      <div className="flex items-center gap-3">
                        <div
                          className={
                            "px-4 py-2 rounded-xl border text-sm font-semibold " +
                            (q.correctAnswer
                              ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.35)]"
                              : "bg-red-500/15 border-red-400/30 text-red-100 shadow-[0_0_18px_rgba(248,113,113,0.35)]")
                          }
                        >
                          {q.correctAnswer ? "✅ ĐÚNG" : "❌ SAI"}
                        </div>
                        {q.explanation?.trim() && (
                          <div className="text-sm text-slate-300">
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    )}

                    {q.type === "reading" && (
                      <div className="space-y-4">
                        <div className="text-xs font-mono tracking-wide text-indigo-200/80">
                          Đoạn văn đọc hiểu
                        </div>
                        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 p-4 shadow-[0_0_24px_rgba(139,92,246,0.18)]">
                          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                            {q.passage || "Chưa có đoạn văn"}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="text-xs text-slate-400">
                            Câu hỏi phụ
                          </div>
                          <div className="space-y-2">
                            {(q.questions || []).map((sq, idx) => (
                              <div
                                key={sq.id}
                                className="rounded-lg border border-white/10 bg-white/5 p-3"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="font-mono text-xs text-indigo-200/80">
                                    {idx + 1}.
                                  </div>
                                  <div className="text-sm text-slate-200">
                                    {sq.question || "(Trống)"}
                                  </div>
                                </div>

                                {sq.type === "multiple-choice" && (
                                  <div className="grid grid-cols-1 gap-2">
                                    {(sq.options || []).map((opt, j) => {
                                      const isCorrect =
                                        sq.correctOptionId === opt.id;
                                      const letter = String.fromCharCode(
                                        65 + j,
                                      );
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
                                              "font-mono text-xs px-2 py-0.5 rounded-md " +
                                              (isCorrect
                                                ? "text-emerald-100 bg-emerald-400/20 border border-emerald-400/30"
                                                : "text-slate-300 bg-slate-800/40 border border-white/10")
                                            }
                                          >
                                            {letter}
                                          </div>
                                          <div className="text-sm text-slate-200">
                                            {opt.text || (
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
                                  <div className="text-sm text-slate-200">
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
                                              {a}
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
                                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border " +
                                      (sq.correctAnswer
                                        ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.35)]"
                                        : "bg-red-500/15 border-red-400/30 text-red-100 shadow-[0_0_18px_rgba(248,113,113,0.35)]")
                                    }
                                  >
                                    {sq.correctAnswer ? "✅ ĐÚNG" : "❌ SAI"}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {questions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">
              Chưa có câu hỏi nào. Bấm nút bên trên để thêm câu hỏi.
            </CardContent>
          </Card>
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
