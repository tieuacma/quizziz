"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Save,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Clock,
  Plus,
  AlertTriangle,
  X,
  Play,
  ShieldCheck,
} from "lucide-react";
import { QuizQuestionType } from "@/types/quiz";
import QuestionEditor from "@/components/quiz-create/QuestionEditor";
import QuizQuestionView from "@/components/quiz-editor/QuizQuestionView";
import {
  QuestionTypeLabel,
  DifficultyBadge,
} from "@/components/quiz-create/utils";
import {
  ToastProvider,
  useToast,
} from "@/components/quiz-create/ToastProvider";
import { useQuizEditor } from "@/hooks/useQuizEditor";
import { cn } from "@/lib/utils";

interface QuizEditorPageProps {
  params: Promise<{ id: string }>;
}

const questionTypes: QuizQuestionType[] = [
  "multiple-choice",
  "fill-in-the-blank",
  "true-false",
  "reading",
];

function QuizEditorContent({ routeQuizId }: { routeQuizId: string }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    questionId: string | null;
    questionText: string;
  }>({ show: false, questionId: null, questionText: "" });

  const {
    isLoading,
    metadata,
    questions,
    expandedQuestion,
    selectedQuestionId,
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
  } = useQuizEditor(routeQuizId, addToast);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Đang tải...</div>
      </div>
    );
  }

  const selectedQuestion =
    questions.find((q) => q.id === selectedQuestionId) ?? questions[0];

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {scrolled && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-slate-300 truncate">
              {metadata?.title || "Quiz"}
              {isDirty && (
                <span className="text-amber-400 ml-2">• Chưa lưu</span>
              )}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/teacher")}
              >
                Thoát
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
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
                {isDirty && " · Có thay đổi chưa lưu"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link
                href={`/quiz-game/${routeQuizId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="w-4 h-4 mr-2" />
                Chơi thử
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={`/do-exam/${routeQuizId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Thi thử
              </Link>
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Đang lưu..." : "Lưu Quiz"}
            </Button>
          </div>
        </div>

        <Card className="mb-6 bg-slate-900/50 border-white/10">
          <CardContent className="pt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">Tiêu đề</Label>
                <Input
                  value={metadata?.title ?? ""}
                  onChange={(e) => updateMetadata({ title: e.target.value })}
                  className="bg-slate-950/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Danh mục</Label>
                <Input
                  value={metadata?.category ?? ""}
                  onChange={(e) =>
                    updateMetadata({ category: e.target.value })
                  }
                  className="bg-slate-950/50 border-white/10"
                  placeholder="Tùy chọn"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Mô tả</Label>
              <Input
                value={metadata?.description ?? ""}
                onChange={(e) =>
                  updateMetadata({ description: e.target.value })
                }
                className="bg-slate-950/50 border-white/10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Label className="text-slate-400">Thời gian mặc định (giây)</Label>
              <Input
                type="number"
                className="w-24 bg-slate-950/50 border-white/10"
                value={defaultTime}
                min={5}
                max={600}
                onChange={(e) =>
                  updateMetadata({
                    defaultTime: parseInt(e.target.value, 10) || 30,
                  })
                }
              />
              <Button variant="outline" size="sm" onClick={applyTimeToAll}>
                Áp dụng cho tất cả
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Label className="text-slate-400">Thời gian thi (phút)</Label>
              <Input
                type="number"
                className="w-24 bg-slate-950/50 border-white/10"
                value={Math.max(
                  1,
                  Math.floor((metadata?.examTimeLimit ?? 1800) / 60),
                )}
                min={5}
                max={240}
                onChange={(e) =>
                  updateMetadata({
                    examTimeLimit:
                      (parseInt(e.target.value, 10) || 30) * 60,
                  })
                }
              />
              <p className="text-xs text-slate-500">
                Dùng cho chế độ Exam tại /do-exam/[id]
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4">
          <Label className="text-xs text-slate-400 mb-2 block">
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

        <div className="grid lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {questions.map((q, i) => (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  setSelectedQuestionId(q.id);
                  if (expandedQuestion !== q.id) toggleExpandQuestion(q.id);
                }}
                className={cn(
                  "w-full text-left rounded-xl border p-3 transition-all",
                  selectedQuestionId === q.id
                    ? "border-indigo-400/50 bg-indigo-500/10"
                    : "border-white/10 bg-slate-900/40 hover:bg-slate-900/60",
                  errorByQuestionId[q.id] && "border-red-400/40",
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs text-slate-500">#{i + 1}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {QuestionTypeLabel[q.type]}
                  </Badge>
                </div>
                <p className="text-sm text-slate-200 line-clamp-2">
                  {q.question || "(Chưa có nội dung)"}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {q.timeLimit}s
                </div>
                {errorByQuestionId[q.id] && (
                  <p className="text-xs text-red-400 mt-1 line-clamp-1">
                    {errorByQuestionId[q.id]}
                  </p>
                )}
              </button>
            ))}
            {questions.length === 0 && (
              <p className="text-slate-500 text-sm p-4 text-center">
                Chưa có câu hỏi
              </p>
            )}
          </aside>

          <div className="lg:col-span-8 space-y-4">
            {selectedQuestion ? (
              <Card
                data-question-id={selectedQuestion.id}
                className="bg-slate-900/40 border-white/10"
              >
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge>{QuestionTypeLabel[selectedQuestion.type]}</Badge>
                      <DifficultyBadge
                        difficulty={selectedQuestion.difficulty}
                      />
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedQuestion.timeLimit}s
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const idx = questions.findIndex(
                            (q) => q.id === selectedQuestion.id,
                          );
                          moveQuestion(idx, "up");
                        }}
                        disabled={
                          questions.findIndex(
                            (q) => q.id === selectedQuestion.id,
                          ) === 0
                        }
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const idx = questions.findIndex(
                            (q) => q.id === selectedQuestion.id,
                          );
                          moveQuestion(idx, "down");
                        }}
                        disabled={
                          questions.findIndex(
                            (q) => q.id === selectedQuestion.id,
                          ) ===
                          questions.length - 1
                        }
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400"
                        onClick={() =>
                          setDeleteConfirm({
                            show: true,
                            questionId: selectedQuestion.id,
                            questionText:
                              selectedQuestion.question ||
                              "Câu hỏi không tiêu đề",
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {errorByQuestionId[selectedQuestion.id] && (
                    <p className="text-red-400 text-sm mb-3">
                      {errorByQuestionId[selectedQuestion.id]}
                    </p>
                  )}

                  {expandedQuestion === selectedQuestion.id ? (
                    <>
                      <div className="flex justify-end gap-2 mb-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            cancelQuestionEdit(selectedQuestion.id)
                          }
                        >
                          Hủy
                        </Button>
                        <Button
                          type="button"
                          onClick={() =>
                            closeQuestionEdit(selectedQuestion.id)
                          }
                        >
                          Đóng
                        </Button>
                      </div>
                      <QuestionEditor
                        question={selectedQuestion}
                        onChange={(newQ) =>
                          updateQuestion(selectedQuestion.id, newQ)
                        }
                      />
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <Label className="text-xs text-slate-400">
                          Thời gian riêng (giây)
                        </Label>
                        <Input
                          type="number"
                          className="w-24 mt-1"
                          value={selectedQuestion.timeLimit}
                          min={5}
                          max={300}
                          onChange={(e) =>
                            updateQuestion(selectedQuestion.id, {
                              ...selectedQuestion,
                              timeLimit:
                                parseInt(e.target.value, 10) || defaultTime,
                            })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <QuizQuestionView question={selectedQuestion} />
                      <Button
                        className="mt-4"
                        variant="outline"
                        onClick={() =>
                          toggleExpandQuestion(selectedQuestion.id)
                        }
                      >
                        Chỉnh sửa câu này
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-900/40 border-white/10">
                <CardContent className="py-12 text-center text-slate-500">
                  Thêm câu hỏi từ thanh công cụ phía trên
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {deleteConfirm.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() =>
              setDeleteConfirm({
                show: false,
                questionId: null,
                questionText: "",
              })
            }
          />
          <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3
              id="delete-dialog-title"
              className="text-lg font-semibold text-white mb-4 flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Xóa câu hỏi
            </h3>
            <p className="text-slate-300 text-sm mb-4 line-clamp-3">
              {deleteConfirm.questionText}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  setDeleteConfirm({
                    show: false,
                    questionId: null,
                    questionText: "",
                  })
                }
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  if (deleteConfirm.questionId) {
                    removeQuestion(deleteConfirm.questionId);
                  }
                  setDeleteConfirm({
                    show: false,
                    questionId: null,
                    questionText: "",
                  });
                }}
              >
                Xóa
              </Button>
            </div>
            <button
              type="button"
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
              onClick={() =>
                setDeleteConfirm({
                  show: false,
                  questionId: null,
                  questionText: "",
                })
              }
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuizEditorPage({ params }: QuizEditorPageProps) {
  const { id: routeQuizId } = use(params);

  return (
    <ToastProvider>
      <QuizEditorContent routeQuizId={routeQuizId} />
    </ToastProvider>
  );
}
