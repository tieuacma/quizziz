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
import { Trash2, Plus } from "lucide-react";
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

  const updateOptionText = (optionId: string, text: string) => {
    if (question.type === "multiple-choice") {
      const newQuestion = question as MultipleChoiceQuestion;
      onChange({
        ...newQuestion,
        options: newQuestion.options.map((opt) =>
          opt.id === optionId ? { ...opt, text } : opt,
        ),
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

  const setCorrectOption = (optionId: string) => {
    if (question.type === "multiple-choice") {
      const newQuestion = question as MultipleChoiceQuestion;
      onChange({
        ...newQuestion,
        correctOptionId: optionId,
      });
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
      {/* Common Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Loại câu hỏi</Label>
          <Badge variant="secondary" className="mt-1">
            {QuestionTypeLabel[question.type]}
          </Badge>
        </div>
        <div>
          <Label className="text-sm font-medium">Độ khó</Label>
          <div className="mt-1">
            <Select
              value={question.difficulty}
              onValueChange={(value) =>
                updateQuestion({ difficulty: value as QuizDifficulty })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div>
        <Label className="text-sm font-medium">Nội dung câu hỏi</Label>
        {question.type === "reading" ? (
          <Textarea
            value={(question as ReadingQuestion).passage}
            onChange={(e) => updateQuestion({ passage: e.target.value })}
            placeholder="Nhập đoạn văn đọc hiểu..."
            className="min-h-[120px]"
          />
        ) : (
          <Textarea
            value={question.question}
            onChange={(e) => updateQuestion({ question: e.target.value })}
            placeholder="Nhập câu hỏi..."
            className="min-h-[80px]"
          />
        )}
      </div>

      {/* Multiple Choice */}
      {question.type === "multiple-choice" && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Label className="text-sm font-medium">
              Lựa chọn (chọn đáp án đúng)
            </Label>
            <div className="space-y-2">
              {(question as MultipleChoiceQuestion).options.map(
                (option, index) => (
                  <div
                    key={option.id}
                    className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg"
                  >
                    <Label className="text-sm font-mono min-w-[24px] mt-1">
                      {String(index + 1)}.
                    </Label>
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        updateOptionText(option.id, e.target.value)
                      }
                      placeholder={`Lựa chọn ${index + 1}...`}
                      className="flex-1"
                    />
                    <Select
                      value={
                        question.correctOptionId === option.id
                          ? "correct"
                          : "wrong"
                      }
                      onValueChange={(value) =>
                        setCorrectOption(value === "correct" ? option.id : "")
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wrong">Sai</SelectItem>
                        <SelectItem value="correct">Đúng</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(option.id)}
                      className="h-8 w-8 p-0"
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
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm lựa chọn
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Fill in the Blank */}
      {question.type === "fill-in-the-blank" && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Label className="text-sm font-medium">Đáp án</Label>
            <div className="space-y-2">
              {(question as FillInBlankQuestion).answers.map(
                (answer, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input
                      value={answer}
                      onChange={(e) => {
                        const newQuestion = question as FillInBlankQuestion;
                        const newAnswers = [...newQuestion.answers];
                        newAnswers[index] = e.target.value;
                        onChange({ ...newQuestion, answers: newAnswers });
                      }}
                      placeholder={`Đáp án ${index + 1}...`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
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
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm đáp án
            </Button>
            <div className="pt-4 mt-4 border-t border-slate-800">
              <Label className="text-xs text-slate-400 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    (question as FillInBlankQuestion).caseSensitive || false
                  }
                  onChange={(e) =>
                    updateQuestion({ caseSensitive: e.target.checked })
                  }
                  className="rounded"
                />
                Phân biệt hoa thường
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* True/False */}
      {question.type === "true-false" && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-8 text-lg font-semibold">
                <button
                  onClick={() => updateQuestion({ correctAnswer: true })}
                  className={`p-4 rounded-xl transition-all ${
                    (question as TrueFalseQuestion).correctAnswer
                      ? "bg-green-500/20 border-2 border-green-500 text-green-100"
                      : "bg-slate-800/50 border-2 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  ✅ ĐÚNG
                </button>
                <button
                  onClick={() => updateQuestion({ correctAnswer: false })}
                  className={`p-4 rounded-xl transition-all ${
                    !(question as TrueFalseQuestion).correctAnswer
                      ? "bg-red-500/20 border-2 border-red-500 text-red-100"
                      : "bg-slate-800/50 border-2 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  ❌ SAI
                </button>
              </div>
              <Textarea
                placeholder="Giải thích đáp án (tùy chọn)..."
                value={(question as TrueFalseQuestion).explanation || ""}
                onChange={(e) =>
                  updateQuestion({ explanation: e.target.value })
                }
                className="min-h-[60px]"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reading */}
      {question.type === "reading" && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Label className="text-sm font-medium">Câu hỏi phụ</Label>

            {(question as ReadingQuestion).questions.map((subQ) => (
              <div
                key={subQ.id}
                className="p-4 bg-slate-900/50 rounded-lg space-y-3"
              >
                <div className="space-y-2">
                  <Input
                    value={subQ.question}
                    onChange={(e) =>
                      updateSubQuestion(subQ.id, { question: e.target.value })
                    }
                    placeholder="Câu hỏi phụ..."
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-slate-400 mb-1 block">
                        Loại
                      </Label>
                      <Select
                        value={subQ.type}
                        onValueChange={(value) => {
                          const nextType = value as ReadingSubQuestion["type"];

                          // Reset payload fields based on selected type
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
                            // true-false
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
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">
                            Trắc nghiệm
                          </SelectItem>
                          <SelectItem value="fill-in-the-blank">
                            Điền khuyết
                          </SelectItem>
                          <SelectItem value="true-false">Đúng / Sai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-5">
                      <Label className="text-xs text-slate-400 mb-1 block">
                        ID
                      </Label>
                      <div className="text-[10px] font-mono text-slate-500 break-all">
                        {subQ.id}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub: multiple-choice */}
                {subQ.type === "multiple-choice" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Lựa chọn</Label>
                    <div className="space-y-2">
                      {(subQ.options || []).map((opt, idx) => (
                        <div
                          key={opt.id}
                          className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg"
                        >
                          <Label className="text-sm font-mono min-w-[24px] mt-1">
                            {String(idx + 1)}.
                          </Label>
                          <Input
                            value={opt.text}
                            onChange={(e) => {
                              updateSubQuestion(subQ.id, {
                                options: (subQ.options || []).map((o) =>
                                  o.id === opt.id
                                    ? { ...o, text: e.target.value }
                                    : o,
                                ),
                              });
                            }}
                            placeholder={`Lựa chọn ${idx + 1}...`}
                            className="flex-1"
                          />
                          <Select
                            value={
                              subQ.correctOptionId === opt.id
                                ? "correct"
                                : "wrong"
                            }
                            onValueChange={(value) => {
                              updateSubQuestion(subQ.id, {
                                correctOptionId:
                                  value === "correct" ? opt.id : "",
                              });
                            }}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wrong">Sai</SelectItem>
                              <SelectItem value="correct">Đúng</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              updateSubQuestion(subQ.id, {
                                options: (subQ.options || []).filter(
                                  (o) => o.id !== opt.id,
                                ),
                                correctOptionId:
                                  subQ.correctOptionId === opt.id
                                    ? ""
                                    : subQ.correctOptionId,
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        updateSubQuestion(subQ.id, {
                          options: [
                            ...(subQ.options || []),
                            { id: crypto.randomUUID(), text: "" },
                          ],
                        });
                      }}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Thêm lựa chọn
                    </Button>
                  </div>
                )}

                {/* Sub: fill-in-the-blank */}
                {subQ.type === "fill-in-the-blank" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Đáp án</Label>
                    <div className="space-y-2">
                      {(subQ.answers || []).map((a, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Input
                            value={a}
                            onChange={(e) => {
                              const next = [...(subQ.answers || [])];
                              next[idx] = e.target.value;
                              updateSubQuestion(subQ.id, { answers: next });
                            }}
                            placeholder={`Đáp án ${idx + 1}...`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              const next = (subQ.answers || []).filter(
                                (_, i) => i !== idx,
                              );
                              updateSubQuestion(subQ.id, { answers: next });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        updateSubQuestion(subQ.id, {
                          answers: [...(subQ.answers || []), ""],
                        });
                      }}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Thêm đáp án
                    </Button>
                  </div>
                )}

                {/* Sub: true-false */}
                {subQ.type === "true-false" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Chọn đáp án</Label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          updateSubQuestion(subQ.id, { correctAnswer: true })
                        }
                        className={`p-3 rounded-xl transition-all border ${
                          subQ.correctAnswer === true
                            ? "bg-green-500/20 border-green-500 text-green-100"
                            : "bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-200"
                        }`}
                      >
                        ✅ ĐÚNG
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateSubQuestion(subQ.id, { correctAnswer: false })
                        }
                        className={`p-3 rounded-xl transition-all border ${
                          subQ.correctAnswer === false
                            ? "bg-red-500/20 border-red-500 text-red-100"
                            : "bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-200"
                        }`}
                      >
                        ❌ SAI
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => {
                if (question.type !== "reading") return;

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
              <Plus className="h-4 w-4" />
              Thêm câu hỏi phụ
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
