"use client";

import { useState, useEffect, useCallback, use } from "react";
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
  Sparkles,
  BookOpen,
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
import { motion, AnimatePresence } from "framer-motion";

interface QuizEditorPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizEditorPage({ params }: QuizEditorPageProps) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;
  
  const router = useRouter();
  const [metadata, setMetadata] = useState<QuizMetadata | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  
  // Snapshots for cancel actions
  const [draftQuestions] = useState<Record<string, QuizQuestion>>({});

  const [errorByQuestionId, setErrorByQuestionId] = useState<
    Record<string, string>
  >({});

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
      try {
        const result = await getQuizAction(quizId);
        if (result.success && result.data) {
          setMetadata(result.data.metadata);
          const qList = result.data.questions || [];
          setQuestions(qList);
          
          // Select the first question by default
          if (qList.length > 0) {
            setSelectedQuestionId(qList[0].id);
          }
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
  }, [quizId, router, addToast]);

  const defaultTime = metadata?.defaultTime || 30;

  const addQuestion = (type: QuizQuestionType) => {
    const newQuestion = createEmptyQuestion(type, defaultTime);
    setQuestions((prev: QuizQuestion[]) => {
      const next = [...prev, newQuestion];
      setSelectedQuestionId(newQuestion.id);
      return next;
    });
    addToast(`Đã thêm câu hỏi ${QuestionTypeLabel[type]}`, "info");
  };

  const removeQuestion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting the card we are deleting
    
    setQuestions((prev: QuizQuestion[]) => {
      const filtered = prev.filter((q: QuizQuestion) => q.id !== id);
      if (selectedQuestionId === id) {
        setSelectedQuestionId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
    
    addToast("Đã xóa câu hỏi", "info");
  };

  const updateQuestion = (id: string, updates: QuizQuestion) => {
    setQuestions((prev: QuizQuestion[]) =>
      prev.map((q: QuizQuestion) => (q.id === id ? updates : q)),
    );
  };

  const moveQuestion = (index: number, direction: "up" | "down", e: React.MouseEvent): void => {
    e.stopPropagation(); // Avoid triggering selection
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

  const applyTimeToAll = () => {
    setQuestions((prev: QuizQuestion[]) =>
      prev.map((q: QuizQuestion) => ({ ...q, timeLimit: defaultTime })),
    );
    addToast(`Đã áp dụng ${defaultTime} giây cho tất cả câu hỏi`, "info");
  };

  const validateQuestion = (q: QuizQuestion) => {
    if (q.type !== "reading" && !q.question.trim())
      return "Nội dung câu hỏi không được để trống";

    if (q.type === "multiple-choice") {
      if (!q.correctOptionId)
        return "Vui lòng chọn ít nhất một đáp án đúng";
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
      addToast(
        "Quiz có lỗi. Vui lòng kiểm tra các câu hỏi được đánh dấu đỏ.",
        "error",
      );
      setSelectedQuestionId(firstInvalidId);
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

  const saveQuestionToJson = async (question: QuizQuestion) => {
    const formData = new FormData();
    formData.append("quizId", quizId);
    formData.append("questionId", question.id);
    formData.append("question", JSON.stringify(question));

    const result = await updateQuestionAction(undefined, formData);
    if (result?.success) {
      addToast("Đã lưu câu hỏi tạm thời", "success");
      return true;
    }

    addToast(result?.error || "Lỗi khi lưu câu hỏi", "error");
    return false;
  };

  const questionTypes: QuizQuestionType[] = [
    "multiple-choice",
    "fill-in-the-blank",
    "true-false",
    "reading",
  ];

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-slate-400 text-sm font-semibold">Đang tải cấu trúc đề thi...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Editor Control Panel Sticky Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 rounded-2xl bg-white/[0.02] border border-white/8 backdrop-blur-md gap-4 z-20 sticky top-16">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/teacher")}
            className="hover:bg-white/10 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white truncate leading-6">
              {metadata?.title || "Chỉnh sửa Quiz"}
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-2">
              <span className="font-semibold text-indigo-400">{questions.length} câu hỏi</span>
              <span>•</span>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Mặc định: {defaultTime}s
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={applyTimeToAll}
            className="border-white/8 hover:bg-white/[0.04] text-xs font-semibold rounded-xl gap-1.5 h-9 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Đồng bộ {defaultTime}s
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            size="sm"
            className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-90 shadow-lg shadow-indigo-600/15 text-xs font-bold rounded-xl gap-1.5 h-9 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Đang lưu..." : "Lưu Quiz"}
          </Button>
        </div>
      </div>

      {/* Primary Split View Two-Pane Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Question Directory List (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4.5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
                Danh sách câu hỏi
              </h3>
              <Badge className="bg-slate-900 border-white/8 text-[10px] text-slate-300">
                {questions.length} câu
              </Badge>
            </div>

            {/* Question Quick Add Sub-Toolbar */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                Thêm nhanh câu hỏi
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {questionTypes.map((qt) => (
                  <button
                    key={qt}
                    type="button"
                    onClick={() => addQuestion(qt)}
                    className="flex items-center gap-1.5 px-3 py-2 text-left rounded-xl bg-slate-950/40 border border-white/5 hover:border-indigo-500/35 hover:bg-indigo-500/5 text-[11px] font-bold text-slate-300 hover:text-indigo-300 transition-all cursor-pointer truncate"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    {QuestionTypeLabel[qt]}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Questions Trail */}
            <div className="space-y-2.5 max-h-[calc(100vh-25rem)] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {questions.map((q, i) => {
                  const isSelected = q.id === selectedQuestionId;
                  const hasError = !!errorByQuestionId[q.id];
                  
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      onClick={() => setSelectedQuestionId(q.id)}
                      className={`group rounded-xl border p-3.5 transition-all duration-300 cursor-pointer relative ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-500/[0.04] shadow-[0_4px_16px_rgba(99,102,241,0.06)]"
                          : hasError
                          ? "border-rose-500/50 bg-rose-500/[0.02]"
                          : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10"
                      }`}
                    >
                      {/* Ambient Left Active Highlight Glow */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-slate-500">
                            #{i + 1}
                          </span>
                          <Badge className="bg-slate-900/60 border-white/5 text-[9px] font-bold text-slate-300">
                            {QuestionTypeLabel[q.type]}
                          </Badge>
                        </div>

                        {/* Order & Delete Mini Action Items */}
                        <div className="flex items-center opacity-40 group-hover:opacity-100 transition-opacity gap-0.5">
                          <button
                            type="button"
                            disabled={i === 0}
                            onClick={(e) => moveQuestion(i, "up", e)}
                            className="h-6 w-6 rounded-md hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={i === questions.length - 1}
                            onClick={(e) => moveQuestion(i, "down", e)}
                            className="h-6 w-6 rounded-md hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => removeQuestion(q.id, e)}
                            className="h-6 w-6 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Question Text Snippet */}
                      <p className="text-xs font-semibold text-slate-200 mt-2 truncate max-w-full">
                        {q.type === "reading" ? q.passage : q.question || "(Chưa có nội dung câu hỏi)"}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                        <DifficultyBadge difficulty={q.difficulty} />
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {q.timeLimit}s
                        </span>
                      </div>

                      {/* Error Warning Badge */}
                      {hasError && (
                        <div className="text-[10px] text-rose-400 font-bold flex items-center gap-1 mt-2">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          {errorByQuestionId[q.id]}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {questions.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-xs border border-dashed border-white/5 rounded-xl">
                  Chưa có câu hỏi nào.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Question Detailed Form (Col 8) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedQuestion ? (
              <motion.div
                key={selectedQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-white/[0.02] border-white/8 rounded-2xl overflow-hidden shadow-xl">
                  <CardHeader className="border-b border-white/5 py-4 px-6 flex flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider block">
                        Đang hiệu chỉnh
                      </span>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        Câu hỏi chi tiết • {QuestionTypeLabel[selectedQuestion.type]}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const snapshot = draftQuestions[selectedQuestion.id];
                          if (snapshot) {
                            updateQuestion(selectedQuestion.id, snapshot);
                            addToast("Đã hoàn tác thay đổi", "info");
                          }
                        }}
                        className="h-8 border-white/8 hover:bg-white/[0.04] text-[11px] font-semibold rounded-lg cursor-pointer"
                      >
                        Hủy
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => saveQuestionToJson(selectedQuestion)}
                        className="h-8 bg-slate-900 hover:bg-slate-800 border border-white/8 text-xs font-semibold rounded-lg gap-1 cursor-pointer"
                      >
                        Lưu bản nháp
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {errorByQuestionId[selectedQuestion.id] && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {errorByQuestionId[selectedQuestion.id]}
                      </div>
                    )}

                    {/* Invoking our extended QuestionEditor */}
                    <QuestionEditor
                      question={selectedQuestion}
                      onChange={(newQ: QuizQuestion) =>
                        updateQuestion(selectedQuestion.id, newQ)
                      }
                    />

                    {/* Question Time Limit Controller */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                      <div>
                        <Label className="text-xs font-bold text-white">
                          Thời gian giới hạn câu hỏi
                        </Label>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Đặt thời gian trả lời cụ thể cho câu hỏi này (giây).
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={selectedQuestion.timeLimit}
                          onChange={(e) =>
                            updateQuestion(selectedQuestion.id, {
                              ...selectedQuestion,
                              timeLimit: parseInt(e.target.value) || defaultTime,
                            })
                          }
                          className="w-20 text-center bg-slate-950/40 border-white/8 focus:border-indigo-500 rounded-xl"
                          min="5"
                          max="300"
                        />
                        <span className="text-xs text-slate-400 font-semibold">giây</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-dashed border-white/8 bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center gap-4 min-h-[400px]"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Chưa chọn câu hỏi</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Chọn một câu hỏi từ danh sách bên trái để bắt đầu hiệu chỉnh, hoặc nhấp vào{" "}
                    <span className="text-white font-medium">Thêm nhanh câu hỏi</span> để bắt đầu viết đề thi mới.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    onClick={() => addQuestion("multiple-choice")}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Tạo trắc nghiệm
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
