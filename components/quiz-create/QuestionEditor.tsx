"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Sparkles, BookOpen } from "lucide-react";
import {
  QuizQuestion,
  QuizDifficulty,
  MultipleChoiceQuestion,
  FillInBlankQuestion,
  TrueFalseQuestion,
  ReadingQuestion,
  MultipleChoiceOption,
  ReadingSubQuestion,
} from "@/types/quiz";
import { QuestionTypeLabel } from "./utils";
import SelectionCards from "@/components/quiz-editor/SelectionCards";
import { cn } from "@/lib/utils";

interface QuestionEditorProps {
  question: QuizQuestion;
  onChange: (question: QuizQuestion) => void;
}

export default function QuestionEditor({
  question,
  onChange,
}: QuestionEditorProps) {
  const updateQuestion = useCallback(
    (updates: Partial<QuizQuestion>) => {
      onChange({ ...question, ...updates } as QuizQuestion);
    },
    [question, onChange],
  );

  const addOption = () => {
    if (question.type === "multiple-choice") {
      const newQuestion = question as MultipleChoiceQuestion;
      const newOption: MultipleChoiceOption = {
        id: crypto.randomUUID(),
        text: "",
      };
      onChange({
        ...newQuestion,
        options: [...newQuestion.options, newOption],
      });
    } else if (question.type === "fill-in-the-blank") {
      const newQuestion = question as FillInBlankQuestion;
      onChange({
        ...newQuestion,
        answers: [...newQuestion.answers, ""],
      });
    }
  };

  const removeOption = (optionId: string) => {
    if (question.type === "multiple-choice") {
      const newQuestion = question as MultipleChoiceQuestion;
      onChange({
        ...newQuestion,
        options: newQuestion.options.filter((opt) => opt.id !== optionId),
      });
    } else if (question.type === "fill-in-the-blank") {
      const newQuestion = question as FillInBlankQuestion;
      const index = parseInt(optionId);
      if (!isNaN(index)) {
        onChange({
          ...newQuestion,
          answers: newQuestion.answers.filter((_, i) => i !== index),
        });
      }
    }
  };

  const updateSubQuestion = (
    subId: string,
    updates: Partial<ReadingSubQuestion>,
  ) => {
    if (question.type === "reading") {
      const newQuestion = question as ReadingQuestion;
      onChange({
        ...newQuestion,
        questions: newQuestion.questions.map((sq) =>
          sq.id === subId ? { ...sq, ...updates } : sq,
        ),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Meta Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.02] border border-white/10 p-5 rounded-3xl backdrop-blur-xl shadow-lg">
        <div className="flex flex-col justify-center">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Loại câu hỏi</Label>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold">
              {QuestionTypeLabel[question.type]}
            </Badge>
          </div>
        </div>
        
        {/* Modern Sliding Pill Selector for Difficulty */}
        <div>
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Độ khó câu hỏi</Label>
          <div className="mt-1.5 flex bg-slate-950 border border-white/10 p-1 rounded-xl relative overflow-hidden">
            {(["easy", "medium", "hard"] as QuizDifficulty[]).map((diff) => {
              const isActive = question.difficulty === diff;
              const labels: Record<QuizDifficulty, string> = {
                easy: "Dễ",
                medium: "Trung bình",
                hard: "Khó",
              };
              const activeStyles: Record<QuizDifficulty, string> = {
                easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/25 shadow-[0_2px_12px_rgba(16,185,129,0.15)]",
                medium: "bg-amber-500/20 text-amber-400 border-amber-500/25 shadow-[0_2px_12px_rgba(245,158,11,0.15)]",
                hard: "bg-rose-500/20 text-rose-400 border-rose-500/25 shadow-[0_2px_12px_rgba(244,63,94,0.15)]",
              };
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => updateQuestion({ difficulty: diff })}
                  className={cn(
                    "flex-1 py-1 px-3 rounded-lg text-xs font-bold transition-all duration-300 border border-transparent cursor-pointer",
                    isActive
                      ? activeStyles[diff]
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {labels[diff]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* READING TYPE: DEDICATED SPLIT SCREEN LAYOUT */}
      {question.type === "reading" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Passage Editor */}
          <div className="lg:col-span-6 space-y-3.5 bg-slate-900/20 border border-white/10 p-5 rounded-3xl backdrop-blur-md shadow-lg">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Đoạn văn đọc hiểu
              </Label>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-900 border border-white/10 px-2 py-0.5 rounded-md font-mono">
                {((question as ReadingQuestion).passage || "").split(/\s+/).filter(Boolean).length} từ
              </span>
            </div>
            <Textarea
              value={(question as ReadingQuestion).passage}
              onChange={(e) => updateQuestion({ passage: e.target.value })}
              placeholder="Nhập đoạn văn đọc hiểu dài tại đây để làm ngữ liệu cho các câu hỏi phụ bên phải..."
              className="min-h-[400px] bg-slate-950/40 border-white/10 hover:border-white/20 focus:border-indigo-500 text-xs leading-relaxed focus:bg-slate-900/50 rounded-xl resize-y"
            />
          </div>
          
          {/* Right Column: Sub-Questions scroll container */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex justify-between items-center bg-slate-900/20 border border-white/10 px-4 py-3 rounded-2xl backdrop-blur-md">
              <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Câu hỏi phụ liên kết
              </Label>
              <Badge className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold font-mono">
                {((question as ReadingQuestion).questions || []).length} câu hỏi
              </Badge>
            </div>

            {/* Scrollable container for sub questions */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1.5 scrollbar-thin">
              {((question as ReadingQuestion).questions || []).map((subQ, idx) => (
                <div
                  key={subQ.id}
                  className="p-5 bg-slate-900/40 border border-white/10 hover:border-white/20 rounded-3xl space-y-4 transition-all relative overflow-hidden group/sub shadow-md"
                >
                  {/* Subtle top indicator border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

                  {/* Header Row of Sub-question */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-800/60 px-2 py-0.5 border border-white/5 rounded-md">
                      #{idx + 1}
                    </span>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg p-0 opacity-0 group-hover/sub:opacity-100 transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        const newQuestion = question as ReadingQuestion;
                        onChange({
                          ...newQuestion,
                          questions: newQuestion.questions.filter((sq) => sq.id !== subQ.id),
                        });
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Sub Question content */}
                  <div className="space-y-2">
                    <Input
                      value={subQ.question}
                      onChange={(e) =>
                        updateSubQuestion(subQ.id, { question: e.target.value })
                      }
                      placeholder={`Nhập câu hỏi phụ thứ ${idx + 1}...`}
                      className="bg-slate-950/30 border-white/8 hover:border-white/12 text-xs py-2 rounded-xl focus:bg-slate-900/50"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Loại đáp án</Label>
                        <Select
                          value={subQ.type}
                          onValueChange={(value) => {
                            const nextType = value as ReadingSubQuestion["type"];
                            if (nextType === "multiple-choice") {
                              updateSubQuestion(subQ.id, {
                                type: nextType,
                                options: [
                                  { id: crypto.randomUUID(), text: "" },
                                  { id: crypto.randomUUID(), text: "" },
                                ],
                                correctOptionId: "",
                                answers: undefined,
                                correctAnswer: undefined,
                              });
                            } else if (nextType === "fill-in-the-blank") {
                              updateSubQuestion(subQ.id, {
                                type: nextType,
                                answers: [""],
                                options: undefined,
                                correctOptionId: undefined,
                                correctAnswer: undefined,
                              });
                            } else {
                              updateSubQuestion(subQ.id, {
                                type: nextType,
                                correctAnswer: true,
                                options: undefined,
                                correctOptionId: undefined,
                                answers: undefined,
                              });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full h-8 text-[11px] bg-slate-950/40 border-white/8 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-xs">
                            <SelectItem value="multiple-choice" className="text-xs">Trắc nghiệm</SelectItem>
                            <SelectItem value="fill-in-the-blank" className="text-xs">Điền khuyết</SelectItem>
                            <SelectItem value="true-false" className="text-xs">Đúng / Sai</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col justify-end">
                        <span className="text-[9px] font-mono text-slate-600 block truncate">
                          ID: {subQ.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sub content: Multiple Choice */}
                  {subQ.type === "multiple-choice" && (
                    <div className="space-y-2.5 pt-2 border-t border-white/[0.04]">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Các lựa chọn đáp án</Label>
                      <div className="space-y-1.5">
                        {(subQ.options || []).map((opt, oIdx) => (
                          <div
                            key={opt.id}
                            className={cn(
                              "flex items-center gap-2 p-2 bg-slate-950/30 border rounded-xl transition-all",
                              subQ.correctOptionId === opt.id ? "border-emerald-500/30 bg-emerald-500/[0.03]" : "border-white/10"
                            )}
                          >
                            <span className="font-mono text-[10px] font-bold text-slate-500 shrink-0 w-4">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            <Input
                              value={opt.text}
                              onChange={(e) => {
                                updateSubQuestion(subQ.id, {
                                  options: (subQ.options || []).map((o) =>
                                    o.id === opt.id
                                      ? { ...o, text: e.target.value }
                                      : o
                                  ),
                                });
                              }}
                              placeholder={`Lựa chọn ${String.fromCharCode(65 + oIdx)}...`}
                              className="flex-1 h-7 text-xs bg-transparent border-none hover:bg-white/[0.02] focus:bg-white/[0.04] p-1 text-slate-200"
                            />
                            
                            <Select
                              value={subQ.correctOptionId === opt.id ? "correct" : "wrong"}
                              onValueChange={(value) => {
                                updateSubQuestion(subQ.id, {
                                  correctOptionId: value === "correct" ? opt.id : "",
                                });
                              }}
                            >
                              <SelectTrigger className="w-16 h-6 text-[10px] bg-slate-900 border-white/5 rounded px-1.5">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-white/10 text-xs">
                                <SelectItem value="wrong" className="text-xs">Sai</SelectItem>
                                <SelectItem value="correct" className="text-xs text-emerald-400 font-bold">Đúng</SelectItem>
                              </SelectContent>
                            </Select>

                            {(subQ.options || []).length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
                                onClick={() => {
                                  updateSubQuestion(subQ.id, {
                                    options: (subQ.options || []).filter((o) => o.id !== opt.id),
                                    correctOptionId: subQ.correctOptionId === opt.id ? "" : subQ.correctOptionId,
                                  });
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateSubQuestion(subQ.id, {
                            options: [
                              ...(subQ.options || []),
                              { id: crypto.randomUUID(), text: "" },
                            ],
                          });
                        }}
                        className="w-full gap-1.5 border-dashed border-white/10 bg-slate-950/20 text-[10px] h-7 rounded-lg text-slate-400 hover:text-indigo-400 hover:border-indigo-500/25 transition-all cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        Thêm lựa chọn mới
                      </Button>
                    </div>
                  )}

                  {/* Sub content: Fill in the blank */}
                  {subQ.type === "fill-in-the-blank" && (
                    <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Đáp án chấp nhận</Label>
                      <div className="space-y-1.5">
                        {(subQ.answers || []).map((a, aIdx) => (
                          <div key={aIdx} className="flex items-center gap-2">
                            <Input
                              value={a}
                              onChange={(e) => {
                                const next = [...(subQ.answers || [])];
                                next[aIdx] = e.target.value;
                                updateSubQuestion(subQ.id, { answers: next });
                              }}
                              placeholder={`Đáp án hợp lệ ${aIdx + 1}...`}
                              className="flex-1 h-7 text-xs bg-slate-950/30 border-white/8 hover:border-white/12 rounded-xl"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer shrink-0"
                              onClick={() => {
                                const next = (subQ.answers || []).filter((_, i) => i !== aIdx);
                                updateSubQuestion(subQ.id, { answers: next });
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateSubQuestion(subQ.id, {
                            answers: [...(subQ.answers || []), ""],
                          });
                        }}
                        className="w-full gap-1.5 border-dashed border-white/10 bg-slate-950/20 text-[10px] h-7 rounded-lg text-slate-400 hover:text-indigo-400 hover:border-indigo-500/25 transition-all cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        Thêm đáp án điền
                      </Button>
                    </div>
                  )}

                  {/* Sub content: True / False */}
                  {subQ.type === "true-false" && (
                    <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Chọn đáp án đúng</Label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => updateSubQuestion(subQ.id, { correctAnswer: true })}
                          className={cn(
                            "flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer",
                            subQ.correctAnswer === true
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-[0_2px_8px_rgba(16,185,129,0.15)]"
                              : "bg-slate-950/40 border-white/5 text-slate-500 hover:text-slate-300"
                          )}
                        >
                          ✅ ĐÚNG
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSubQuestion(subQ.id, { correctAnswer: false })}
                          className={cn(
                            "flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer",
                            subQ.correctAnswer === false
                              ? "bg-rose-500/15 border-rose-500 text-rose-300 shadow-[0_2px_8px_rgba(244,63,94,0.15)]"
                              : "bg-slate-950/40 border-white/5 text-slate-500 hover:text-slate-300"
                          )}
                        >
                          ❌ SAI
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {((question as ReadingQuestion).questions || []).length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                  Chưa có câu hỏi phụ nào. Nhấn nút bên dưới để thêm mới.
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 bg-slate-950/30 border-white/8 hover:bg-indigo-500/10 hover:border-indigo-500/30 text-xs py-2.5 rounded-xl transition-all text-slate-300 cursor-pointer"
              onClick={() => {
                const newSubQ: ReadingSubQuestion = {
                  id: crypto.randomUUID(),
                  question: "",
                  type: "multiple-choice",
                  options: [
                    { id: crypto.randomUUID(), text: "" },
                    { id: crypto.randomUUID(), text: "" },
                  ],
                  correctOptionId: "",
                };

                const newQuestion = question as ReadingQuestion;
                onChange({
                  ...newQuestion,
                  questions: [...newQuestion.questions, newSubQ],
                });
              }}
            >
              <Plus className="h-4 w-4 text-indigo-400" />
              Thêm câu hỏi phụ mới
            </Button>
          </div>
        </div>
      ) : (
        /* NORMAL QUESTIONS: STANDARD ONE COLUMN LAYOUT */
        <div className="space-y-5">
          {/* Question main content */}
          <div className="bg-slate-900/20 border border-white/10 p-5 rounded-3xl space-y-3 shadow-md backdrop-blur-md">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Nội dung câu hỏi</Label>
            <Textarea
              value={question.question}
              onChange={(e) => updateQuestion({ question: e.target.value })}
              placeholder="Nhập nội dung câu hỏi chính tại đây..."
              className="min-h-[100px] bg-slate-950/40 border-white/10 hover:border-white/20 focus:border-indigo-500 text-xs leading-relaxed focus:bg-slate-900/50 rounded-xl py-3 px-4 transition-colors resize-y"
            />
          </div>

          {/* Multiple Choice Option Cards System */}
          {question.type === "multiple-choice" && (
            <SelectionCards
              options={(question as MultipleChoiceQuestion).options}
              correctOptionId={(question as MultipleChoiceQuestion).correctOptionId || ""}
              isMultiChoice={(question as MultipleChoiceQuestion).isMultiChoice}
              onChangeOptions={(newOptions) => {
                onChange({
                  ...question,
                  options: newOptions,
                } as QuizQuestion);
              }}
              onChangeCorrect={(correctId) => {
                onChange({
                  ...question,
                  correctOptionId: correctId,
                } as QuizQuestion);
              }}
              onChangeMultiChoice={(isMulti) => {
                onChange({
                  ...question,
                  isMultiChoice: isMulti,
                } as QuizQuestion);
              }}
            />
          )}

          {/* Fill in the Blank */}
          {question.type === "fill-in-the-blank" && (
            <Card className="bg-white/[0.01] border-white/5 rounded-2xl overflow-hidden shadow-lg">
              <CardContent className="pt-5 space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Các đáp án được chấp nhận</Label>
                  <span className="text-[10px] text-slate-500 italic">Mỗi hàng là một đáp án đúng thay thế</span>
                </div>
                <div className="space-y-2">
                  {(question as FillInBlankQuestion).answers.map(
                    (answer, index) => (
                      <div key={index} className="flex items-center gap-2.5">
                        <Input
                          value={answer}
                          onChange={(e) => {
                            const newQuestion = question as FillInBlankQuestion;
                            const newAnswers = [...newQuestion.answers];
                            newAnswers[index] = e.target.value;
                            onChange({ ...newQuestion, answers: newAnswers });
                          }}
                          placeholder={`Đáp án đúng thay thế ${index + 1}...`}
                          className="bg-slate-950/40 border-white/8 hover:border-white/12 rounded-xl text-xs py-2"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg p-0 cursor-pointer shrink-0"
                          onClick={() => removeOption(String(index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="gap-2 bg-slate-950/20 border-white/8 hover:bg-indigo-500/10 hover:border-indigo-500/30 text-xs py-2 px-4 rounded-xl transition-all text-slate-300 hover:text-indigo-400 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Thêm đáp án thay thế
                </Button>
                
                <div className="pt-4 border-t border-white/5">
                  <label className="inline-flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={
                        (question as FillInBlankQuestion).caseSensitive || false
                      }
                      onChange={(e) =>
                        updateQuestion({ caseSensitive: e.target.checked })
                      }
                      className="rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-300 transition-colors">
                      Yêu cầu phân biệt chữ HOA / chữ thường chính xác
                    </span>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* True / False */}
          {question.type === "true-false" && (
            <Card className="bg-white/[0.01] border-white/5 rounded-2xl overflow-hidden shadow-lg">
              <CardContent className="pt-5 space-y-4">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Chọn đáp án đúng</Label>
                
                <div className="flex items-center justify-center gap-6 text-sm font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => updateQuestion({ correctAnswer: true })}
                    className={cn(
                      "flex-1 p-6 rounded-2xl transition-all duration-300 border flex flex-col items-center gap-2 cursor-pointer",
                      (question as TrueFalseQuestion).correctAnswer
                        ? "bg-emerald-500/[0.08] border-emerald-500 text-emerald-300 shadow-[0_4px_24px_rgba(16,185,129,0.15)]"
                        : "bg-slate-900/40 border-white/5 text-slate-500 hover:bg-slate-900/60 hover:text-slate-300"
                    )}
                  >
                    <span className="text-2xl">✅</span>
                    ĐÚNG
                  </button>
                  <button
                    type="button"
                    onClick={() => updateQuestion({ correctAnswer: false })}
                    className={cn(
                      "flex-1 p-6 rounded-2xl transition-all duration-300 border flex flex-col items-center gap-2 cursor-pointer",
                      !(question as TrueFalseQuestion).correctAnswer
                        ? "bg-rose-500/[0.08] border-rose-500 text-rose-300 shadow-[0_4px_24px_rgba(244,63,94,0.15)]"
                        : "bg-slate-900/40 border-white/5 text-slate-500 hover:bg-slate-900/60 hover:text-slate-300"
                    )}
                  >
                    <span className="text-2xl">❌</span>
                    SAI
                  </button>
                </div>

                <div className="pt-3 space-y-2">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Giải thích đáp án (không bắt buộc)</Label>
                  <Textarea
                    placeholder="Giải thích vì sao câu hỏi này đúng hoặc sai để học sinh có thể tự ôn tập sau bài kiểm tra..."
                    value={(question as TrueFalseQuestion).explanation || ""}
                    onChange={(e) =>
                      updateQuestion({ explanation: e.target.value })
                    }
                    className="min-h-[70px] bg-slate-950/40 border-white/8 hover:border-white/12 focus:border-indigo-500 text-xs rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
