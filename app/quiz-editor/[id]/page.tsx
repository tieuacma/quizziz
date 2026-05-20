"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  updateQuizAction,
  getQuizAction,
  updateQuestionAction,
} from "@/app/actions/quiz-actions";

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
  AlertTriangle,
  X,
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
  const [draftQuestions, setDraftQuestions] = useState<
    Record<string, QuizQuestion>
  >({});

  const [errorByQuestionId, setErrorByQuestionId] = useState<
    Record<string, string>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    questionId: string | null;
    questionText: string;
  }>({ show: false, questionId: null, questionText: "" });
  const [scrolled, setScrolled] = useState(false);

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

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const confirmDeleteQuestion = (q: QuizQuestion) => {
    setDeleteConfirm({
      show: true,
      questionId: q.id,
      questionText: q.question || "Câu hỏi không tiêu đề",
    });
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev: QuizQuestion[]) =>
      prev.filter((q: QuizQuestion) => q.id !== id),
    );
    if (expandedQuestion === id) setExpandedQuestion(null);
    setDeleteConfirm({ show: false, questionId: null, questionText: "" });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, questionId: null, questionText: "" });
  };

  const updateQuestion = (id: string, updates: QuizQuestion) => {
    setQuestions((prev: QuizQuestion[]) =>
      prev.map((q: QuizQuestion) => (q.id === id ? updates : q)),
    );
  };

  const ensureDraftForQuestion = useCallback((question: QuizQuestion) => {
    setDraftQuestions((prev) => {
      if (prev[question.id]) return prev;
      return { ...prev, [question.id]: question };
    });
  }, []);

  // Wrap on open: snapshot original state for Cancel
  const toggleExpandQuestion = (qid: string) => {
    setExpandedQuestion((prev) => {
      if (prev === qid) return null;
      const q = questions.find((item) => item.id === qid);
      if (q) ensureDraftForQuestion(q);
      return qid;
    });
  };

  const saveQuestionToJson = async (question: QuizQuestion) => {
    // Partial update: update only this question in quiz.json
    const formData = new FormData();
    formData.append("quizId", quizId);
    formData.append("questionId", question.id);
    formData.append("question", JSON.stringify(question));

    // updateQuestionAction hiện nằm ở src/app/actions/quiz-actions.ts
    const result = await updateQuestionAction(undefined, formData);

    if (result?.success) {
      addToast("Đã lưu câu hỏi", "success");
      return true;
    }

    addToast(result?.error || "Lỗi khi lưu câu hỏi", "error");
    return false;
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

  const scrollToQuestion = (questionId: string) => {
    const el = document.querySelector(
      `[data-question-id="${questionId}"]`,
    ) as HTMLElement | null;

    if (!el) return;

    // Prefer scrolling such that the card error area is visible.
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // If the error is rendered inside expanded/collapsed, scroll again a bit.
    // (No-op if not found)
    const err = el.querySelector(".text-red-400") as HTMLElement | null;
    if (err) {
      err.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const validateQuestion = (q: QuizQuestion) => {
    // reading note: question field in schema is title; validate content based on type
    if (q.type !== "reading" && !q.question.trim())
      return "Câu hỏi chưa có nội dung";

    if (q.type === "multiple-choice") {
      if (!q.correctOptionId)
        return "Câu hỏi trắc nghiệm chưa chọn đáp án đúng";
      if (q.options.some((o) => !o.text.trim()))
        return "Lựa chọn trắc nghiệm chưa nhập nội dung";
    }

    if (q.type === "fill-in-the-blank") {
      if (q.answers.every((a) => !a.trim()))
        return "Câu hỏi điền khuyết chưa có đáp án";
    }

    if (q.type === "reading") {
      if (!q.passage.trim()) return "Đoạn văn đọc hiểu chưa có nội dung";
      if (!q.questions?.length) return "Cần ít nhất 1 câu hỏi phụ";

      // Validate sub-questions
      for (const sub of q.questions) {
        if (!sub.question.trim()) return "Câu hỏi phụ chưa có nội dung";

        if (sub.type === "multiple-choice") {
          if (!sub.correctOptionId)
            return "Câu hỏi phụ trắc nghiệm chưa chọn đáp án";
          if (!sub.options?.length)
            return "Câu hỏi phụ trắc nghiệm thiếu lựa chọn";
          if (sub.options.some((o) => !o.text?.trim()))
            return "Câu hỏi phụ trắc nghiệm có lựa chọn trống";
        }

        if (sub.type === "fill-in-the-blank") {
          if (!sub.answers?.length || sub.answers.every((a) => !a.trim()))
            return "Câu hỏi phụ điền khuyết chưa có đáp án";
        }

        if (sub.type === "true-false") {
          // correctAnswer is boolean, so just ensure it's present
          if (typeof sub.correctAnswer !== "boolean")
            return "Câu hỏi phụ đúng/sai chưa chọn đáp án";
        }
      }
    }

    return null;
  };

  const handleSave = async () => {
    if (questions.length === 0) {
      addToast("Vui lòng thêm ít nhất một câu hỏi", "error");
      return;
    }

    // Validate all and collect first error
    const nextErrors: Record<string, string> = {};
    let firstInvalidId: string | null = null;

    for (const q of questions) {
      const msg = validateQuestion(q);
      if (msg) {
        nextErrors[q.id] = msg;
        if (!firstInvalidId) firstInvalidId = q.id;
      }
    }

    setErrorByQuestionId(nextErrors);

    if (firstInvalidId) {
      // Scroll to the first invalid question (near nhất theo thứ tự xuất hiện)
      addToast(
        "Quiz có lỗi. Vui lòng kiểm tra các câu hỏi được tô đỏ.",
        "error",
      );
      scrollToQuestion(firstInvalidId);
      return;
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
    <div className="min-h-screen bg-slate-950 relative overflow-x-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      </div>

      {/* Sticky Header (appears on scroll) */}
      {scrolled && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-white/10 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-indigo-500/10 border-indigo-400/30"
              >
                {questions.length} câu hỏi
              </Badge>
              <span className="text-sm text-slate-300">
                {metadata?.title || "Quiz"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/teacher")}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Thoát
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-1" />
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/teacher")}
              className="hover:bg-white/10"
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

          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Đang lưu..." : "Lưu Quiz"}
          </Button>
        </div>

        {/* Quiz Settings Summary */}
        <Card className="mb-6 bg-slate-900/50 border-white/10 backdrop-blur-sm">
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
                className="gap-2 bg-slate-900/50 border-white/10 hover:bg-indigo-500/20 hover:border-indigo-400/30 transition-all"
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
            <Card
              key={q.id}
              data-question-id={q.id}
              className="bg-slate-900/40 border-white/10 backdrop-blur-sm hover:border-indigo-400/30 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Badge>{QuestionTypeLabel[q.type]}</Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {q.timeLimit}s
                    </span>
                  </div>

                  {errorByQuestionId[q.id] && (
                    <div className="w-[260px] text-red-400 text-sm text-right">
                      {errorByQuestionId[q.id]}
                    </div>
                  )}

                  <div className="flex gap-1">
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
                      onClick={() => toggleExpandQuestion(q.id)}
                      title="Chỉnh sửa"
                      className="hover:bg-indigo-500/20"
                    >
                      <span className="inline-flex items-center justify-center rounded-md text-indigo-200/90 bg-indigo-500/10 border border-indigo-400/20 shadow-[0_0_14px_rgba(99,102,241,0.35)]">
                        ✏️
                      </span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDeleteQuestion(q)}
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedQuestion === q.id && (
                <CardContent>
                  {errorByQuestionId[q.id] && (
                    <div className="w-full text-red-400 text-sm mb-3">
                      {errorByQuestionId[q.id]}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-slate-400">
                      Chỉnh sửa • {QuestionTypeLabel[q.type]}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const snapshot = draftQuestions[q.id];
                          if (!snapshot) {
                            addToast("Chưa có bản lưu tạm để hủy", "error");
                            return;
                          }
                          setQuestions((prev) =>
                            prev.map((item) =>
                              item.id === q.id ? snapshot : item,
                            ),
                          );
                          setExpandedQuestion(null);
                          setDraftQuestions((prev) => {
                            const next = { ...prev };
                            delete next[q.id];
                            return next;
                          });
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        variant="default"
                        onClick={async () => {
                          const ok = await saveQuestionToJson(q);
                          if (ok) {
                            addToast("Đã lưu thay đổi câu hỏi", "success");
                          }
                        }}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>

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
                  {errorByQuestionId[q.id] && (
                    <div className="w-full text-red-400 text-sm mb-3">
                      {errorByQuestionId[q.id]}
                    </div>
                  )}

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
          <Card className="bg-slate-900/40 border-white/10 backdrop-blur-sm">
            <CardContent className="py-12 text-center text-slate-500">
              Chưa có câu hỏi nào. Bấm nút bên trên để thêm câu hỏi.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={cancelDelete}
          />

          {/* Modal */}
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={cancelDelete}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Xóa câu hỏi</h3>
            </div>

            <p className="text-slate-300 text-sm mb-2">
              Bạn có chắc chắn muốn xóa câu hỏi này?
            </p>

            <div className="bg-slate-800/50 rounded-lg p-3 mb-6">
              <p className="text-sm text-slate-200 line-clamp-2">
                {deleteConfirm.questionText}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="flex-1 bg-slate-800/50 border-white/10 hover:bg-slate-700/50"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  deleteConfirm.questionId &&
                  removeQuestion(deleteConfirm.questionId)
                }
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
