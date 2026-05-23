"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  getQuizMongoAction,
  updateQuizMongoAction,
  type QuizLoadResult,
} from "@/app/actions/quiz-mongodb";
import {
  QuizQuestion,
  QuizQuestionType,
  createEmptyQuestion,
  QuizMetadata,
} from "@/types/quiz";
import { QuestionTypeLabel } from "@/components/quiz-create/utils";
import type { ToastType } from "@/components/quiz-create/ToastProvider";
import { validateQuestion, scrollToQuestion } from "@/lib/quiz-editor/validate";

function isQuizLoaded(result: QuizLoadResult): result is Extract<
  QuizLoadResult,
  { success: true }
> {
  if (result.success !== true || result.data == null) return false;
  const metaId = result.data.metadata?.id ?? result.data.id;
  return typeof metaId === "string" && metaId.length > 0;
}

export function useQuizEditor(
  routeQuizId: string,
  addToast: (message: string, type: ToastType) => void,
) {
  const router = useRouter();
  const [loadedQuizId, setLoadedQuizId] = useState<string | null>(null);
  const isLoading = loadedQuizId !== routeQuizId;
  const [metadata, setMetadata] = useState<QuizMetadata | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [draftQuestions, setDraftQuestions] = useState<
    Record<string, QuizQuestion>
  >({});
  const [errorByQuestionId, setErrorByQuestionId] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const savedSnapshotRef = useRef<string>("");

  const defaultTime = metadata?.defaultTime ?? 30;

  const markDirty = useCallback(() => setIsDirty(true), []);

  useEffect(() => {
    let cancelled = false;

    const loadQuiz = async () => {
      try {
        const result = await getQuizMongoAction(routeQuizId);
        if (cancelled) return;

        if (isQuizLoaded(result)) {
          setMetadata(result.data.metadata);
          setQuestions(result.data.questions ?? []);
          setLoadedQuizId(routeQuizId);
          savedSnapshotRef.current = JSON.stringify({
            metadata: result.data.metadata,
            questions: result.data.questions ?? [],
          });
          setIsDirty(false);
        } else {
          const message =
            result.success === false ? result.error : "Không tìm thấy quiz";
          addToast(message, "error");
          router.push("/dashboard/teacher");
        }
      } catch {
        if (cancelled) return;
        addToast("Lỗi khi tải quiz", "error");
        router.push("/dashboard/teacher");
      }
    };

    void loadQuiz();
    return () => {
      cancelled = true;
    };
  }, [routeQuizId, addToast, router]);

  const activeSelectedQuestionId = useMemo(() => {
    if (
      selectedQuestionId &&
      questions.some((q) => q.id === selectedQuestionId)
    ) {
      return selectedQuestionId;
    }
    return questions[0]?.id ?? null;
  }, [selectedQuestionId, questions]);

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const addQuestion = (type: QuizQuestionType) => {
    const newQuestion = createEmptyQuestion(type, defaultTime);
    setQuestions((prev) => [...prev, newQuestion]);
    setExpandedQuestion(newQuestion.id);
    setSelectedQuestionId(newQuestion.id);
    markDirty();
    addToast(`Đã thêm câu hỏi ${QuestionTypeLabel[type]}`, "info");
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (expandedQuestion === id) setExpandedQuestion(null);
    if (selectedQuestionId === id) setSelectedQuestionId(null);
    markDirty();
  };

  const updateQuestion = (id: string, updates: QuizQuestion) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? updates : q)),
    );
    markDirty();
  };

  const ensureDraftForQuestion = useCallback((question: QuizQuestion) => {
    setDraftQuestions((prev) => {
      if (prev[question.id]) return prev;
      return { ...prev, [question.id]: structuredClone(question) };
    });
  }, []);

  const toggleExpandQuestion = (qid: string) => {
    setExpandedQuestion((prev) => {
      if (prev === qid) return null;
      const q = questions.find((item) => item.id === qid);
      if (q) ensureDraftForQuestion(q);
      return qid;
    });
    setSelectedQuestionId(qid);
  };

  const cancelQuestionEdit = (qid: string) => {
    const snapshot = draftQuestions[qid];
    if (!snapshot) {
      addToast("Chưa có bản lưu tạm để hủy", "error");
      return;
    }
    setQuestions((prev) =>
      prev.map((item) => (item.id === qid ? snapshot : item)),
    );
    setExpandedQuestion(null);
    setDraftQuestions((prev) => {
      const next = { ...prev };
      delete next[qid];
      return next;
    });
  };

  const closeQuestionEdit = (qid: string) => {
    setExpandedQuestion(null);
    setDraftQuestions((prev) => {
      const next = { ...prev };
      delete next[qid];
      return next;
    });
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === questions.length - 1) return;
    const newQuestions = [...questions];
    const target = direction === "up" ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[target]] = [
      newQuestions[target],
      newQuestions[index],
    ];
    setQuestions(newQuestions);
    markDirty();
  };

  const applyTimeToAll = () => {
    setQuestions((prev) =>
      prev.map((q) => ({ ...q, timeLimit: defaultTime })),
    );
    markDirty();
    addToast(`Đã áp dụng ${defaultTime} giây cho tất cả câu hỏi`, "info");
  };

  const updateMetadata = (updates: Partial<QuizMetadata>) => {
    setMetadata((prev) => (prev ? { ...prev, ...updates } : prev));
    markDirty();
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
        "Quiz có lỗi. Vui lòng kiểm tra các câu hỏi được tô đỏ.",
        "error",
      );
      scrollToQuestion(firstInvalidId);
      setSelectedQuestionId(firstInvalidId);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("id", routeQuizId);
      if (metadata?.title) formData.append("title", metadata.title);
      if (metadata?.description)
        formData.append("description", metadata.description);
      if (metadata?.category) formData.append("category", metadata.category);
      formData.append("defaultTime", String(defaultTime));
      formData.append("questions", JSON.stringify(questions));

      const result = await updateQuizMongoAction(undefined, formData);

      if (result?.success) {
        addToast(result.message || "Đã lưu quiz thành công!", "success");
        savedSnapshotRef.current = JSON.stringify({ metadata, questions });
        setIsDirty(false);
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

  return {
    isLoading,
    metadata,
    questions,
    expandedQuestion,
    selectedQuestionId: activeSelectedQuestionId,
    setSelectedQuestionId,
    errorByQuestionId,
    isSubmitting,
    isDirty,
    defaultTime,
    addQuestion,
    removeQuestion,
    updateQuestion,
    toggleExpandQuestion,
    cancelQuestionEdit,
    closeQuestionEdit,
    moveQuestion,
    applyTimeToAll,
    updateMetadata,
    handleSave,
  };
}
