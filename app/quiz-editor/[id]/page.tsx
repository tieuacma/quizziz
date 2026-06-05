"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Undo2,
  Redo2,
  FileUp,
  FileDown,
  Sparkles,
  Search,
  Filter,
  Keyboard,
  BookOpen,
} from "lucide-react";
import { QuizQuestionType, ReadingQuestion } from "@/types/quiz";
import QuestionEditor from "@/components/quiz-create/QuestionEditor";
import QuizQuestionView from "@/components/quiz-editor/QuizQuestionView";
import QuizLivePreview from "@/components/quiz-editor/QuizLivePreview";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom UI States
  const [scrolled, setScrolled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
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
    undo,
    redo,
    canUndo,
    canRedo,
    exportToJSON,
    importFromJSON,
  } = useQuizEditor(routeQuizId, addToast);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-slate-400 text-sm font-semibold">Đang tải cấu hình câu hỏi...</div>
        </div>
      </div>
    );
  }

  const selectedQuestion =
    questions.find((q) => q.id === selectedQuestionId) ?? questions[0] ?? null;

  // Handle local JSON file import
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result;
        if (typeof text === "string") {
          importFromJSON(text);
        }
      };
      reader.readAsText(file);
    }
    // Reset file input value so user can import the same file again
    e.target.value = "";
  };

  // Filter questions based on search & category
  const filteredQuestions = questions.filter((q, index) => {
    const questionText = q.question || "";
    const passageText = q.type === "reading" ? (q as ReadingQuestion).passage || "" : "";

    const matchesSearch =
      questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      passageText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(index + 1).includes(searchQuery);

    const matchesType = typeFilter === "all" || q.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-x-hidden text-slate-100 pb-16">
      
      {/* Decorative ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Mobile: always-visible compact action bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/5 shadow-xl lg:hidden pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-300 truncate font-bold flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
            <span className="truncate">{metadata?.title || "Quiz"}</span>
            {isDirty && (
              <span className="text-amber-400 font-mono text-[9px] bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20 shrink-0">•</span>
            )}
          </span>
          <div className="flex gap-1.5 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" disabled={!canUndo} onClick={undo}>
              <Undo2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSubmitting}
              className="h-8 bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-[11px] px-3"
            >
              {isSubmitting ? "..." : "Lưu"}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop: sticky top action bar when scrolled */}
      {scrolled && (
        <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-slate-300 truncate font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              {metadata?.title || "Quiz"}
              {isDirty && (
                <span className="text-amber-400 font-mono text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">• Chưa lưu</span>
              )}
            </span>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" disabled={!canUndo} onClick={undo}>
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" disabled={!canRedo} onClick={redo}>
                  <Redo2 className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/teacher")}
                className="cursor-pointer text-xs"
              >
                Thoát
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave} 
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-xs"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu Quiz"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 pt-14 lg:pt-8 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/teacher")}
              className="border border-white/5 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                {metadata?.title || "Chỉnh sửa Quiz"}
                {isDirty && (
                  <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/20 bg-amber-500/5 py-0.5 px-2">
                    Có thay đổi chưa lưu
                  </Badge>
                )}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">
                Quản lý tổng số {questions.length} câu hỏi biên soạn.
              </p>
            </div>
          </div>

          {/* Action Header controls */}
          <div className="flex flex-wrap gap-2 items-center">
            
            {/* Undo / Redo controls */}
            <div className="flex items-center gap-1 bg-slate-900/60 border border-white/5 p-1 rounded-xl shrink-0 mr-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg cursor-pointer text-slate-400 hover:text-white disabled:opacity-30"
                disabled={!canUndo}
                onClick={undo}
                title="Hoàn tác (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg cursor-pointer text-slate-400 hover:text-white disabled:opacity-30"
                disabled={!canRedo}
                onClick={redo}
                title="Khôi phục (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Hidden Input File for JSON Import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFileChange}
              accept=".json"
              className="hidden"
            />

            {/* Import / Export JSON buttons */}
            <div className="flex gap-1.5 shrink-0 mr-1 bg-white/[0.02] border border-white/5 p-1 rounded-xl">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 cursor-pointer rounded-lg text-xs h-8 text-slate-300 hover:text-white hover:bg-white/5"
                onClick={() => fileInputRef.current?.click()}
                title="Nhập câu hỏi từ tệp tin cấu trúc JSON"
              >
                <FileUp className="w-3.5 h-3.5 text-indigo-400" />
                Nhập JSON
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 cursor-pointer rounded-lg text-xs h-8 text-slate-300 hover:text-white hover:bg-white/5"
                onClick={exportToJSON}
                title="Xuất câu hỏi thành file JSON"
              >
                <FileDown className="w-3.5 h-3.5 text-indigo-400" />
                Xuất JSON
              </Button>
            </div>

            {/* Live Preview toggler */}
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-1.5 cursor-pointer rounded-xl text-xs h-9 transition-all mr-1",
                showLivePreview 
                  ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20" 
                  : "bg-slate-900 border-white/5 hover:bg-slate-800 text-slate-300"
              )}
              onClick={() => setShowLivePreview(!showLivePreview)}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Xem trước: {showLivePreview ? "Bật" : "Tắt"}
            </Button>

            {/* Shortcuts help button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 border border-white/5 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl cursor-pointer mr-1 text-slate-400 hover:text-white"
              onClick={() => setShowShortcutsHelp(true)}
              title="Danh sách phím tắt nhanh"
            >
              <Keyboard className="w-4 h-4" />
            </Button>

            {/* Play/Exam tests */}
            <Button variant="outline" className="h-9 border-white/5 hover:bg-white/5 rounded-xl cursor-pointer text-xs" asChild={false}>
              <a
                href={`/quiz-game/${routeQuizId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <Play className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Chơi thử
              </a>
            </Button>
            <Button variant="outline" className="h-9 border-white/5 hover:bg-white/5 rounded-xl cursor-pointer text-xs" asChild={false}>
              <a
                href={`/do-exam/${routeQuizId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Thi thử
              </a>
            </Button>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="h-9 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-600/10 cursor-pointer text-xs font-bold"
            >
              <Save className="w-4 h-4 mr-1.5" />
              {isSubmitting ? "Đang lưu..." : "Lưu Quiz"}
            </Button>
          </div>
        </div>

        {/* METADATA BLOCK: ELEGANT COLLAPSIBLE ACCORDION */}
        <Card className="mb-6 bg-slate-900/60 border-white/10 shadow-xl overflow-hidden backdrop-blur-xl rounded-3xl">
          <div 
            className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
            onClick={() => setShowSettings(!showSettings)}
          >
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <BookOpen className="w-4.5 h-4.5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Cấu hình chung của Quiz</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {metadata?.title || "Chưa đặt tên"} · {metadata?.category || "Chưa có danh mục"} · Thời gian mặc định: {defaultTime}s · Thời gian thi: {Math.max(1, Math.floor((metadata?.examTimeLimit ?? 1800) / 60))} phút
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5 shrink-0 text-slate-400 hover:text-white cursor-pointer rounded-lg" type="button">
              {showSettings ? "Thu gọn" : "Thiết lập cấu hình"}
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showSettings && "rotate-180")} />
            </Button>
          </div>
          
          {showSettings && (
            <CardContent className="pt-2 pb-6 px-6 border-t border-white/10 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Tiêu đề Quiz</Label>
                  <Input
                    value={metadata?.title ?? ""}
                    onChange={(e) => updateMetadata({ title: e.target.value })}
                    className="bg-slate-950/60 border-white/10 focus:border-indigo-500 rounded-xl py-2 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Danh mục</Label>
                  <Input
                    value={metadata?.category ?? ""}
                    onChange={(e) =>
                      updateMetadata({ category: e.target.value })
                    }
                    className="bg-slate-950/60 border-white/10 focus:border-indigo-500 rounded-xl py-2 transition-colors"
                    placeholder="Ví dụ: Lịch sử, Tiếng Anh..."
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Mô tả chi tiết</Label>
                <Input
                  value={metadata?.description ?? ""}
                  onChange={(e) =>
                    updateMetadata({ description: e.target.value })
                  }
                  className="bg-slate-950/60 border-white/10 focus:border-indigo-500 rounded-xl py-2 transition-colors"
                  placeholder="Mô tả nội dung học sinh ôn luyện..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/[0.04]">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Thời gian mặc định câu hỏi</Label>
                    <p className="text-[10px] text-slate-500">Giây khả dụng cho mỗi câu hỏi</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      className="w-20 bg-slate-950/40 border-white/5 focus:border-indigo-500 rounded-xl"
                      value={defaultTime}
                      min={5}
                      max={600}
                      onChange={(e) =>
                        updateMetadata({
                          defaultTime: parseInt(e.target.value, 10) || 30,
                        })
                      }
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={applyTimeToAll}
                      className="h-8 text-[11px] rounded-lg border-white/10 hover:bg-white/5 cursor-pointer"
                    >
                      Áp dụng tất cả
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <Label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Thời gian làm bài thi thử (Exam)</Label>
                    <p className="text-[10px] text-slate-500 font-medium">Quy đổi phút hiển thị tại /do-exam</p>
                  </div>
                  <Input
                    type="number"
                    className="w-20 bg-slate-950/40 border-white/5 focus:border-indigo-500 rounded-xl"
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
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* QUICK QUESTION CREATION BUTTONS */}
        <div className="mb-6 bg-slate-900/30 border border-white/5 p-4 rounded-2xl">
          <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5 block">
            Thêm nhanh câu hỏi mới
          </Label>
          <div className="flex flex-wrap gap-2">
            {questionTypes.map((qt) => (
              <Button
                key={qt}
                variant="outline"
                onClick={() => addQuestion(qt)}
                className="gap-1.5 h-9 border-white/10 bg-slate-950/20 text-xs rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 transition-all cursor-pointer font-bold"
              >
                <Plus className="w-4 h-4 text-indigo-400" />
                {QuestionTypeLabel[qt]}
              </Button>
            ))}
          </div>
        </div>

        {/* 3-COLUMN WORKSPACE LAYOUT */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: SIDEBAR QUESTIONS LIST */}
          <aside className={cn(
            "space-y-3 pr-1 transition-all duration-300",
            "lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:flex lg:flex-col lg:min-h-0",
            showLivePreview ? "lg:col-span-3" : "lg:col-span-4"
          )}>
            
            {/* Sidebar filter header */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-3.5 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Tìm câu hỏi (#1, từ khóa)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950/50 border-white/5 pl-8 text-xs py-1.5 h-8.5 rounded-lg placeholder:text-slate-600 focus:border-indigo-500"
                />
              </div>

              {/* Filtering selector pill */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full h-8 text-[11px] bg-slate-950/40 border-white/5 rounded-lg px-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-xs">
                    <SelectItem value="all" className="text-xs">Tất cả thể loại</SelectItem>
                    <SelectItem value="multiple-choice" className="text-xs">Trắc nghiệm</SelectItem>
                    <SelectItem value="fill-in-the-blank" className="text-xs">Điền khuyết</SelectItem>
                    <SelectItem value="true-false" className="text-xs">Đúng / Sai</SelectItem>
                    <SelectItem value="reading" className="text-xs">Đọc hiểu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Questions Navigator list */}
            <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-2 scrollbar-thin lg:flex-1 lg:min-h-0 lg:max-h-none">
              {filteredQuestions.map((q) => {
                const originalIndex = questions.findIndex((org) => org.id === q.id);
                const isSelected = selectedQuestionId === q.id;
                const hasError = errorByQuestionId[q.id];

                return (
                  <button
                    key={q.id}
                    type="button"
                    data-question-id={q.id}
                    onClick={() => {
                      setSelectedQuestionId(q.id);
                      if (expandedQuestion !== q.id) toggleExpandQuestion(q.id);
                    }}
                    className={cn(
                      "w-full text-left rounded-2xl border p-3.5 transition-all relative overflow-hidden cursor-pointer",
                      isSelected
                        ? "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.12)]"
                        : "border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-white/20",
                      hasError && "border-rose-500/40 bg-rose-500/[0.02]",
                    )}
                  >
                    {/* Pulsing indicator for active selections */}
                    {isSelected && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-500 shadow-[2px_0_10px_rgba(99,102,241,0.4)]" />
                    )}

                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[10px] font-bold text-slate-500">#{originalIndex + 1}</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-slate-950/60 text-slate-400 border-white/5 uppercase">
                        {QuestionTypeLabel[q.type]}
                      </Badge>
                    </div>

                    <p className="text-xs font-bold text-slate-200 line-clamp-2 leading-relaxed">
                      {q.type === "reading" 
                        ? (q.passage || "(Chưa có đoạn văn đọc hiểu)") 
                        : (q.question || "(Câu hỏi chưa có tiêu đề)")}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {q.timeLimit}s
                    </div>

                    {hasError && (
                      <p
                        data-question-error
                        className="text-[10px] font-semibold text-rose-400 mt-2 flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                        {hasError}
                      </p>
                    )}
                  </button>
                );
              })}

              {filteredQuestions.length === 0 && (
                <div className="text-slate-600 text-xs p-6 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                  Không tìm thấy câu hỏi phù hợp
                </div>
              )}
            </div>
          </aside>

          {/* COLUMN 2: ACTIVE QUESTION EDITOR PANEL */}
          <div className={cn(
            "space-y-4 transition-all duration-300",
            "lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:min-h-0 pr-1",
            showLivePreview ? "lg:col-span-5" : "lg:col-span-8"
          )}>
            {selectedQuestion ? (
              <Card
                data-question-id={selectedQuestion.id}
                className={cn(
                  "bg-slate-900/60 border-white/10 shadow-xl overflow-hidden rounded-3xl backdrop-blur-xl",
                  errorByQuestionId[selectedQuestion.id] && "border-rose-500/30 shadow-rose-500/5"
                )}
              >
                {/* Editor question header action panel */}
                <CardHeader className="py-4 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-white">
                        Câu #
                        {questions.findIndex((q) => q.id === selectedQuestion.id) +
                          1}
                      </span>
                      <Badge className="bg-indigo-600 text-white font-bold text-[10px]">
                        {QuestionTypeLabel[selectedQuestion.type]}
                      </Badge>
                      <DifficultyBadge
                        difficulty={selectedQuestion.difficulty}
                      />
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {selectedQuestion.timeLimit}s
                      </span>
                    </div>

                    {/* Question reordering & delete buttons */}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white rounded-lg cursor-pointer disabled:opacity-30"
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
                        title="Di chuyển lên"
                      >
                        <ChevronUp className="w-4.5 h-4.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-white rounded-lg cursor-pointer disabled:opacity-30"
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
                        title="Di chuyển xuống"
                      >
                        <ChevronDown className="w-4.5 h-4.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                        onClick={() =>
                          setDeleteConfirm({
                            show: true,
                            questionId: selectedQuestion.id,
                            questionText:
                              selectedQuestion.question ||
                              (selectedQuestion.type === "reading" 
                                ? selectedQuestion.passage 
                                : "Câu hỏi không tiêu đề"),
                          })
                        }
                        title="Xóa câu hỏi này"
                      >
                        <Trash2 className="w-4.5 h-4.5 text-rose-500/80" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5 px-6 pb-6">
                  {errorByQuestionId[selectedQuestion.id] && (
                    <div
                      data-question-error
                      className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-3.5 py-2.5 rounded-xl mb-4 font-semibold flex items-start gap-2"
                    >
                      <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                      {errorByQuestionId[selectedQuestion.id]}
                    </div>
                  )}

                  {expandedQuestion === selectedQuestion.id ? (
                    <>
                      {/* Control panel buttons to Close/Cancel draft */}
                      <div className="flex justify-end gap-1.5 mb-4 p-1.5 bg-slate-950/40 border border-white/5 rounded-xl w-fit ml-auto">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            cancelQuestionEdit(selectedQuestion.id)
                          }
                          className="h-7 text-xs rounded-lg cursor-pointer px-3 text-slate-400 hover:text-white"
                        >
                          Hủy thay đổi
                        </Button>
                        <Button
                          type="button"
                          onClick={() =>
                            closeQuestionEdit(selectedQuestion.id)
                          }
                          className="h-7 text-xs rounded-lg cursor-pointer px-3 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                        >
                          Lưu & Đóng
                        </Button>
                      </div>

                      {/* Question forms */}
                      <QuestionEditor
                        question={selectedQuestion}
                        onChange={(newQ) =>
                          updateQuestion(selectedQuestion.id, newQ)
                        }
                      />

                      {/* TimeLimit selector */}
                      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thời gian trả lời câu này</Label>
                          <p className="text-[10px] text-slate-500 font-medium">Thiết lập thời gian riêng biệt tính bằng giây</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            className="w-20 bg-slate-950/40 border-white/5 focus:border-indigo-500 rounded-xl"
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
                          <span className="text-xs font-bold text-slate-500">giây</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <QuizQuestionView question={selectedQuestion} />
                      <Button
                        className="mt-5 w-full bg-slate-950/60 border border-white/5 hover:border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all cursor-pointer font-bold text-xs"
                        variant="outline"
                        onClick={() =>
                          toggleExpandQuestion(selectedQuestion.id)
                        }
                      >
                        Chỉnh sửa cấu hình câu hỏi này
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-900/40 border-white/5 rounded-3xl border-dashed">
                <CardContent className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-4">
                  <AlertTriangle className="w-10 h-10 text-slate-600 stroke-[1.5]" />
                  <div>
                    <p className="text-sm font-semibold text-slate-300">Quiz chưa có câu hỏi nào</p>
                    <p className="text-xs text-slate-600 max-w-xs mt-1">
                      Thêm câu hỏi đầu tiên để bắt đầu biên soạn nội dung.
                    </p>
                  </div>
                  <Button
                    onClick={() => addQuestion("multiple-choice")}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl cursor-pointer font-bold gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm câu đầu tiên
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* COLUMN 3: STUDENT DEVICE LIVE PREVIEW */}
          {showLivePreview && (
            <div className="lg:col-span-4 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto bg-slate-900/20 border border-white/5 p-5 rounded-3xl backdrop-blur-md flex justify-center items-start animate-in fade-in slide-in-from-right-4 duration-300">
              <QuizLivePreview question={selectedQuestion} defaultTime={defaultTime} />
            </div>
          )}
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirm.show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all"
            onClick={() =>
              setDeleteConfirm({
                show: false,
                questionId: null,
                questionText: "",
              })
            }
          />
          <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3
              id="delete-dialog-title"
              className="text-lg font-bold text-white mb-2 flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Xóa câu hỏi
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-5 font-medium">
              Bạn có chắc chắn muốn xóa vĩnh viễn câu hỏi này khỏi bài Quiz? Hành động này có thể hoàn tác qua nút bấm `Ctrl + Z`.
            </p>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5 mb-5 max-h-24 overflow-y-auto">
              <p className="text-xs text-slate-300 leading-relaxed font-mono line-clamp-3">
                {deleteConfirm.questionText}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-10 cursor-pointer border-white/10 text-xs font-semibold hover:bg-white/5"
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
                className="flex-1 rounded-xl h-10 cursor-pointer text-xs font-bold bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/10"
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
                Xóa câu hỏi
              </Button>
            </div>
            <button
              type="button"
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
              onClick={() =>
                setDeleteConfirm({
                  show: false,
                  questionId: null,
                  questionText: "",
                })
              }
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}

      {/* KEYBOARD SHORTCUTS HELP MODAL */}
      {showShortcutsHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-all"
            onClick={() => setShowShortcutsHelp(false)}
          />
          <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Keyboard className="w-5 h-5 text-indigo-400" />
              Bảng phím tắt soạn thảo nhanh
            </h3>
            
            <div className="space-y-3.5 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Lưu cấu hình Quiz</span>
                <span className="font-mono bg-slate-950 border border-white/5 px-2 py-1 rounded text-indigo-300 font-bold">Ctrl + S</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Hoàn tác hành động</span>
                <span className="font-mono bg-slate-950 border border-white/5 px-2 py-1 rounded text-indigo-300 font-bold">Ctrl + Z</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Khôi phục hành động</span>
                <span className="font-mono bg-slate-950 border border-white/5 px-2 py-1 rounded text-indigo-300 font-bold">Ctrl + Y</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-white/[0.04] pt-3.5">
                <span className="text-slate-400 font-medium">Thêm câu hỏi Trắc nghiệm</span>
                <span className="font-mono bg-slate-950 border border-white/5 px-2 py-1 rounded text-indigo-300 font-bold">Alt + 1 / Alt + N</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Thêm câu hỏi Điền khuyết</span>
                <span className="font-mono bg-slate-950 border border-white/5 px-2 py-1 rounded text-indigo-300 font-bold">Alt + 2</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Thêm câu hỏi Đúng / Sai</span>
                <span className="font-mono bg-slate-950 border border-white/5 px-2 py-1 rounded text-indigo-300 font-bold">Alt + 3</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Thêm câu hỏi Đọc hiểu</span>
                <span className="font-mono bg-slate-950 border border-white/5 px-2 py-1 rounded text-indigo-300 font-bold">Alt + 4</span>
              </div>
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-xl h-10 text-xs font-bold cursor-pointer"
              onClick={() => setShowShortcutsHelp(false)}
            >
              Đã hiểu
            </Button>
            
            <button
              type="button"
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
              onClick={() => setShowShortcutsHelp(false)}
            >
              <X className="w-4.5 h-4.5" />
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
