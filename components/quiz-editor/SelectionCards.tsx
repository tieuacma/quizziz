"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Circle, HelpCircle, Layers, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MultipleChoiceOption {
  id: string;
  text: string;
}

interface SelectionCardsProps {
  options: MultipleChoiceOption[];
  correctOptionId: string;
  isMultiChoice?: boolean;
  onChangeOptions: (options: MultipleChoiceOption[]) => void;
  onChangeCorrect: (correctId: string) => void;
  onChangeMultiChoice: (isMulti: boolean) => void;
}

export default function SelectionCards({
  options = [],
  correctOptionId = "",
  isMultiChoice = false,
  onChangeOptions,
  onChangeCorrect,
  onChangeMultiChoice
}: SelectionCardsProps) {
  // Parse correct Option IDs
  const correctIds = React.useMemo(() => {
    if (!correctOptionId) return [];
    return correctOptionId.split(",").filter(Boolean);
  }, [correctOptionId]);

  const addOption = () => {
    const newOption: MultipleChoiceOption = {
      id: crypto.randomUUID(),
      text: ""
    };
    onChangeOptions([...options, newOption]);
  };

  const removeOption = (id: string) => {
    const updatedOptions = options.filter((opt) => opt.id !== id);
    onChangeOptions(updatedOptions);

    // If deleted option was correct, remove it from correct list
    if (correctIds.includes(id)) {
      const nextIds = correctIds.filter((cid) => cid !== id);
      onChangeCorrect(nextIds.join(","));
    }
  };

  const updateOptionText = (id: string, text: string) => {
    const updatedOptions = options.map((opt) =>
      opt.id === id ? { ...opt, text } : opt
    );
    onChangeOptions(updatedOptions);
  };

  const toggleOptionSelection = (id: string) => {
    if (isMultiChoice) {
      let nextIds;
      if (correctIds.includes(id)) {
        nextIds = correctIds.filter((cid) => cid !== id);
      } else {
        nextIds = [...correctIds, id];
      }
      onChangeCorrect(nextIds.join(","));
    } else {
      // Single choice sets exactly this ID
      onChangeCorrect(id);
    }
  };

  const handleModeChange = (multi: boolean) => {
    if (!multi) {
      // Switching to single choice: keep only the first selected correct option
      const firstCorrect = correctIds[0] || "";
      onChangeCorrect(firstCorrect);
    }
    // Update mode after handling correct option to avoid race conditions
    onChangeMultiChoice(multi);
  };

  return (
    <div className="space-y-4">
      {/* Choice Mode Toggle Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-indigo-400" />
            Thiết lập câu trả lời đúng
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Chọn chế độ một đáp án hoặc nhiều đáp án đúng cho câu hỏi.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-white/5 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => handleModeChange(false)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              !isMultiChoice
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Single-choice
          </button>
          <button
            type="button"
            onClick={() => handleModeChange(true)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              isMultiChoice
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            Multi-choice
          </button>
        </div>
      </div>

      {/* Options Cards Grid with AnimatePresence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence initial={false}>
          {options.map((option, index) => {
            const isCorrect = correctIds.includes(option.id);
            const letter = String.fromCharCode(65 + index);

            return (
              <motion.div
                key={option.id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className={cn(
                  "group rounded-2xl border p-4.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-3",
                  isCorrect
                    ? "border-emerald-500/50 bg-emerald-500/[0.04] shadow-[0_4px_24px_rgba(16,185,129,0.08),0_0_15px_rgba(16,185,129,0.15)]"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
                )}
              >
                {/* Correct Ambient Light Backglow */}
                {isCorrect && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                )}

                {/* Upper Section: Index Tag and Select Action */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-mono text-xs font-bold px-2 py-0.5 rounded-md border",
                        isCorrect
                          ? "text-emerald-300 bg-emerald-500/25 border-emerald-500/30"
                          : "text-slate-400 bg-slate-800/40 border-white/5"
                      )}
                    >
                      {letter}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Lựa chọn {index + 1}
                    </span>
                  </div>

                  {/* Selection Check Circle Trigger Area */}
                  <button
                    type="button"
                    onClick={() => toggleOptionSelection(option.id)}
                    className="cursor-pointer focus:outline-none"
                  >
                    <AnimatePresence mode="wait">
                      {isCorrect ? (
                        <motion.div
                          key="selected"
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.7, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className="text-emerald-400"
                        >
                          <CheckCircle2 className="w-5 h-5 fill-emerald-400/15" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="unselected"
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-slate-500 group-hover:text-slate-300 transition-colors"
                        >
                          <Circle className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

                {/* Middle Section: Option Edit Input */}
                <div className="relative">
                  <Input
                    value={option.text}
                    onChange={(e) => updateOptionText(option.id, e.target.value)}
                    placeholder={`Nhập nội dung lựa chọn ${letter}...`}
                    className={cn(
                      "w-full bg-slate-950/40 border-white/5 hover:border-white/10 focus:border-indigo-500 focus:bg-slate-900/50 text-xs px-3.5 py-2.5 rounded-xl transition-all placeholder:text-slate-600",
                      isCorrect && "border-emerald-500/20 focus:border-emerald-500"
                    )}
                  />
                </div>

                {/* Lower Section: Action Buttons */}
                <div className="flex items-center justify-between border-t border-white/[0.04] pt-2.5 mt-1">
                  <button
                    type="button"
                    onClick={() => toggleOptionSelection(option.id)}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider cursor-pointer select-none",
                      isCorrect
                        ? "text-emerald-400 hover:text-emerald-300"
                        : "text-slate-500 hover:text-slate-300 transition-colors"
                    )}
                  >
                    {isCorrect ? "Đáp án chính xác" : "Chọn làm đáp án đúng"}
                  </button>

                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(option.id)}
                      className="h-7 w-7 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg p-0 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Option Trigger button */}
      <Button
        type="button"
        variant="outline"
        onClick={addOption}
        className="w-full sm:w-auto gap-2 bg-slate-950/20 border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 text-xs py-2 px-4 rounded-xl transition-all text-slate-300 hover:text-indigo-400 cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        Thêm lựa chọn mới
      </Button>
    </div>
  );
}
