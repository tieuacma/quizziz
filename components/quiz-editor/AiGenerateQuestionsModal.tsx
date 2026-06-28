"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wand2, X, Loader2, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types/quiz";
import {
  AI_MODEL_OPTIONS,
  MAX_AI_QUESTIONS,
  computeAiQuestionTotal,
  generateQuizQuestions,
} from "@/lib/ai/generate-quiz-questions";

interface AiGenerateQuestionsModalProps {
  open: boolean;
  onClose: () => void;
  defaultTime: number;
  onGenerated: (questions: QuizQuestion[]) => void;
}

function QuestionSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-3 bg-slate-700/60 rounded w-3/4" />
      <div className="h-3 bg-slate-700/40 rounded w-full" />
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="h-8 bg-slate-800/60 rounded-lg" />
        <div className="h-8 bg-slate-800/60 rounded-lg" />
      </div>
    </div>
  );
}

export default function AiGenerateQuestionsModal({
  open,
  onClose,
  defaultTime,
  onGenerated,
}: AiGenerateQuestionsModalProps) {
  const [topic, setTopic] = useState("");
  const [multipleChoiceCount, setMultipleChoiceCount] = useState(3);
  const [trueFalseCount, setTrueFalseCount] = useState(2);
  const [readingPassageCount, setReadingPassageCount] = useState(1);
  const [readingSubQuestionsPerPassage, setReadingSubQuestionsPerPassage] =
    useState(3);
  const [model, setModel] = useState<string>(AI_MODEL_OPTIONS[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(
    () =>
      computeAiQuestionTotal({
        multipleChoiceCount,
        trueFalseCount,
        readingPassageCount,
        readingSubQuestionsPerPassage,
      }),
    [
      multipleChoiceCount,
      trueFalseCount,
      readingPassageCount,
      readingSubQuestionsPerPassage,
    ],
  );

  const isOverLimit = total > MAX_AI_QUESTIONS;
  const isTopicValid = topic.trim().length >= 3;
  const canSubmit =
    !loading && isTopicValid && total > 0 && !isOverLimit;

  const handleClose = () => {
    if (loading) return;
    setError(null);
    onClose();
  };

  const handleGenerate = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const questions = await generateQuizQuestions(
        {
          topic: topic.trim(),
          multipleChoiceCount,
          trueFalseCount,
          readingPassageCount,
          readingSubQuestionsPerPassage,
          model,
        },
        defaultTime,
      );
      onGenerated(questions);
      setTopic("");
      setMultipleChoiceCount(3);
      setTrueFalseCount(2);
      setReadingPassageCount(1);
      setReadingSubQuestionsPerPassage(3);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-generate-dialog-title"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all"
        onClick={handleClose}
      />
      <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <h3
          id="ai-generate-dialog-title"
          className="text-lg font-bold text-white mb-1 flex items-center gap-2"
        >
          <Wand2 className="w-5 h-5 text-indigo-400" />
          Sinh câu hỏi bằng AI
        </h3>
        <p className="text-slate-400 text-xs mb-4 font-medium">
          AI sẽ tạo câu hỏi tiếng Việt theo chủ đề và tự động thêm vào quiz.
        </p>

        <div className="flex items-start gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 mb-4">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-indigo-200/80 leading-relaxed">
            Lần đầu sử dụng, Puter có thể yêu cầu đăng nhập qua cửa sổ popup.
            Vui lòng hoàn tất đăng nhập rồi thử lại nếu cần.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-200 leading-relaxed">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="space-y-4 py-2">
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-sm text-slate-300 font-semibold">
                AI đang sinh câu hỏi...
              </p>
              <p className="text-xs text-slate-500 text-center max-w-xs">
                Quá trình có thể mất 15–60 giây tùy số lượng và model.
              </p>
            </div>
            <div className="space-y-3 bg-slate-950/40 border border-white/5 rounded-2xl p-4">
              <QuestionSkeleton />
              <QuestionSkeleton />
              <QuestionSkeleton />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Chủ đề / Topic
              </Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder='Ví dụ: "Lịch sử nhà Trần", "Địa lý vùng đồng bằng sông Hồng"'
                className="bg-slate-950/60 border-white/10 focus:border-indigo-500 rounded-xl"
              />
              {topic.trim().length > 0 && !isTopicValid && (
                <p className="text-[11px] text-amber-400">
                  Chủ đề cần ít nhất 3 ký tự.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Trắc nghiệm
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={multipleChoiceCount}
                  onChange={(e) =>
                    setMultipleChoiceCount(
                      Math.max(0, parseInt(e.target.value, 10) || 0),
                    )
                  }
                  className="bg-slate-950/60 border-white/10 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Đúng / Sai
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={trueFalseCount}
                  onChange={(e) =>
                    setTrueFalseCount(
                      Math.max(0, parseInt(e.target.value, 10) || 0),
                    )
                  }
                  className="bg-slate-950/60 border-white/10 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Bài đọc hiểu
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={readingPassageCount}
                  onChange={(e) =>
                    setReadingPassageCount(
                      Math.max(0, parseInt(e.target.value, 10) || 0),
                    )
                  }
                  className="bg-slate-950/60 border-white/10 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Câu Đ/S mỗi bài
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  disabled={readingPassageCount === 0}
                  value={readingSubQuestionsPerPassage}
                  onChange={(e) =>
                    setReadingSubQuestionsPerPassage(
                      Math.max(1, parseInt(e.target.value, 10) || 1),
                    )
                  }
                  className="bg-slate-950/60 border-white/10 rounded-xl disabled:opacity-40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                Model AI
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="bg-slate-950/60 border-white/10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODEL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              className={cn(
                "text-center text-xs font-bold py-2 px-3 rounded-xl border",
                isOverLimit
                  ? "text-rose-300 bg-rose-500/10 border-rose-500/20"
                  : "text-slate-300 bg-slate-950/40 border-white/5",
              )}
            >
              Tổng: {total} / {MAX_AI_QUESTIONS} câu
              {readingPassageCount > 0 && (
                <span className="text-slate-500 font-normal ml-1">
                  (gồm {readingPassageCount} bài × {readingSubQuestionsPerPassage}{" "}
                  câu con)
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <Button
            variant="outline"
            className="flex-1 rounded-xl h-10 cursor-pointer border-white/10 text-xs font-semibold hover:bg-white/5"
            onClick={handleClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 rounded-xl h-10 cursor-pointer text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/10 disabled:opacity-50"
            onClick={handleGenerate}
            disabled={!canSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Đang sinh...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-1.5" />
                Sinh câu hỏi
              </>
            )}
          </Button>
        </div>

        <button
          type="button"
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
          onClick={handleClose}
          disabled={loading}
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
