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

  // ── Undo / Redo History State ──
  const [history, setHistory] = useState<{ metadata: QuizMetadata | null; questions: QuizQuestion[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isHistoryActionRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pushHistoryDebounced = useCallback((meta: QuizMetadata | null, quest: QuizQuestion[]) => {
    if (isHistoryActionRef.current) {
      isHistoryActionRef.current = false;
      return;
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setHistory((prev) => {
        const cleanHistory = prev.slice(0, historyIndex + 1);
        const currentItem = cleanHistory[historyIndex];
        if (currentItem && JSON.stringify(currentItem) === JSON.stringify({ metadata: meta, questions: quest })) {
          return prev;
        }
        const nextHistory = [...cleanHistory, { metadata: meta ? { ...meta } : null, questions: structuredClone(quest) }];
        if (nextHistory.length > 50) {
          nextHistory.shift();
        }
        return nextHistory;
      });
      setHistoryIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex >= 50 ? 49 : nextIndex;
      });
    }, 400);
  }, [historyIndex]);

  useEffect(() => {
    if (metadata === null && questions.length === 0) return;
    if (historyIndex === -1) return;
    pushHistoryDebounced(metadata, questions);
  }, [metadata, questions, pushHistoryDebounced, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const snapshot = history[prevIndex];
      if (snapshot) {
        isHistoryActionRef.current = true;
        setMetadata(snapshot.metadata);
        setQuestions(snapshot.questions);
        setHistoryIndex(prevIndex);
        setIsDirty(true);
        addToast("Đã hoàn tác thao tác", "info");
      }
    }
  }, [history, historyIndex, addToast]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const snapshot = history[nextIndex];
      if (snapshot) {
        isHistoryActionRef.current = true;
        setMetadata(snapshot.metadata);
        setQuestions(snapshot.questions);
        setHistoryIndex(nextIndex);
        setIsDirty(true);
        addToast("Đã khôi phục thao tác", "info");
      }
    }
  }, [history, historyIndex, addToast]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // ── Import / Export JSON ──
  const exportToJSON = useCallback(() => {
    if (!metadata) return;
    const dataStr = JSON.stringify({ metadata, questions }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quiz-${metadata.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "editor"}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    addToast("Đã xuất tệp tin JSON thành công!", "success");
  }, [metadata, questions, addToast]);

  const importFromJSON = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Tệp JSON không chứa danh sách câu hỏi hợp lệ");
      }
      
      let newMetadata = metadata;
      if (parsed.metadata) {
        newMetadata = {
          ...metadata,
          ...parsed.metadata,
          id: routeQuizId,
          updatedAt: new Date().toISOString()
        } as QuizMetadata;
      }
      
      const newQuestions = parsed.questions.map((q: unknown) => {
        // Minimal runtime normalization without `any`
        const obj = q as Partial<QuizQuestion> & { [k: string]: unknown };
        if (obj == null || typeof obj !== "object") {
          throw new Error("Một trong các câu hỏi có cấu trúc không hợp lệ");
        }

        // Note: we intentionally only guarantee a stable core shape here.
        // The specific question-type structures (options/answers/etc.) are handled elsewhere in the app.
        const type =
          obj.type === "multiple-choice" ||
          obj.type === "fill-in-the-blank" ||
          obj.type === "true-false" ||
          obj.type === "reading"
            ? obj.type
            : "multiple-choice";

        const normalized: QuizQuestion = {
          ...(obj as QuizQuestion),
          id:
            typeof obj.id === "string" && obj.id ? obj.id : crypto.randomUUID(),
          type,
          timeLimit:
            typeof obj.timeLimit === "number"
              ? obj.timeLimit
              : metadata?.defaultTime ?? 30,
          difficulty:
            typeof obj.difficulty === "string" && obj.difficulty
              ? obj.difficulty
              : "medium",
        } as QuizQuestion;


        return normalized;
      });

      
      isHistoryActionRef.current = true;
      setMetadata(newMetadata);
      setQuestions(newQuestions);
      setHistory((prev) => {
        const cleanHistory = prev.slice(0, historyIndex + 1);
        return [...cleanHistory, { metadata: newMetadata, questions: newQuestions }];
      });
      setHistoryIndex((prev) => prev + 1);
      setIsDirty(true);
      addToast(`Nhập dữ liệu thành công! Đã tải ${newQuestions.length} câu hỏi.`, "success");
    } catch (err) {
      console.error(err);
      addToast(err instanceof Error ? err.message : "Tệp tin JSON không đúng định dạng cấu trúc Quiz", "error");
    }
  }, [metadata, routeQuizId, addToast, historyIndex]);

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
          // Initialize history
          setHistory([{ metadata: result.data.metadata, questions: result.data.questions ?? [] }]);
          setHistoryIndex(0);
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

  const addQuestion = useCallback((type: QuizQuestionType) => {
    const newQuestion = createEmptyQuestion(type, defaultTime);
    setQuestions((prev) => [...prev, newQuestion]);
    setExpandedQuestion(newQuestion.id);
    setSelectedQuestionId(newQuestion.id);
    markDirty();
    addToast(`Đã thêm câu hỏi ${QuestionTypeLabel[type]}`, "info");
  }, [defaultTime, markDirty, addToast]);

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (expandedQuestion === id) setExpandedQuestion(null);
    if (selectedQuestionId === id) setSelectedQuestionId(null);
    markDirty();
  }, [expandedQuestion, selectedQuestionId, markDirty]);

  const updateQuestion = useCallback((id: string, updates: QuizQuestion) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? updates : q)),
    );
    markDirty();
  }, [markDirty]);

  const ensureDraftForQuestion = useCallback((question: QuizQuestion) => {
    setDraftQuestions((prev) => {
      if (prev[question.id]) return prev;
      return { ...prev, [question.id]: structuredClone(question) };
    });
  }, []);

  const toggleExpandQuestion = useCallback((qid: string) => {
    setExpandedQuestion((prev) => {
      if (prev === qid) return null;
      const q = questions.find((item) => item.id === qid);
      if (q) ensureDraftForQuestion(q);
      return qid;
    });
    setSelectedQuestionId(qid);
  }, [questions, ensureDraftForQuestion]);

  const cancelQuestionEdit = useCallback((qid: string) => {
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
  }, [draftQuestions, addToast]);

  const closeQuestionEdit = useCallback((qid: string) => {
    setExpandedQuestion(null);
    setDraftQuestions((prev) => {
      const next = { ...prev };
      delete next[qid];
      return next;
    });
  }, []);

  const moveQuestion = useCallback((index: number, direction: "up" | "down") => {
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
  }, [questions, markDirty]);

  const applyTimeToAll = useCallback(() => {
    setQuestions((prev) =>
      prev.map((q) => ({ ...q, timeLimit: defaultTime })),
    );
    markDirty();
    addToast(`Đã áp dụng ${defaultTime} giây cho tất cả câu hỏi`, "info");
  }, [defaultTime, markDirty, addToast]);

  const updateMetadata = useCallback((updates: Partial<QuizMetadata>) => {
    setMetadata((prev) => (prev ? { ...prev, ...updates } : prev));
    markDirty();
  }, [markDirty]);

  const handleSave = useCallback(async () => {
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
      formData.append(
        "examTimeLimit",
        String(metadata?.examTimeLimit ?? 1800),
      );
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
  }, [questions, metadata, defaultTime, routeQuizId, addToast]);

  // ── Keyboard Shortcuts Listener ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if editing inside text inputs (unless Ctrl combination)
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      
      // Ctrl+S: Save Quiz
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void handleSave();
        return;
      }

      // Ctrl+Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl+Y: Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }

      // If typing inside form elements, avoid other shortcuts
      if (isInput) return;

      // Alt+1 to Alt+4: Add Questions
      if (e.altKey && e.key === "1") {
        e.preventDefault();
        addQuestion("multiple-choice");
      } else if (e.altKey && e.key === "2") {
        e.preventDefault();
        addQuestion("fill-in-the-blank");
      } else if (e.altKey && e.key === "3") {
        e.preventDefault();
        addQuestion("true-false");
      } else if (e.altKey && e.key === "4") {
        e.preventDefault();
        addQuestion("reading");
      } else if (e.altKey && e.key.toLowerCase() === "n") {
        // Alt+N also adds multiple choice
        e.preventDefault();
        addQuestion("multiple-choice");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, undo, redo, addQuestion]);

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
    undo,
    redo,
    canUndo,
    canRedo,
    exportToJSON,
    importFromJSON,
  };
}
