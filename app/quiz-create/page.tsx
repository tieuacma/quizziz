"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createQuizMongoAction } from "@/app/actions/quiz-mongodb";
import { ArrowLeft, Clock, Layers, FileText } from "lucide-react";

export default function QuizCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [defaultTime, setDefaultTime] = useState("30");
  const [examTimeLimitMinutes, setExamTimeLimitMinutes] = useState("30");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề quiz");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (description) formData.append("description", description);
      if (category) formData.append("category", category);
      formData.append("defaultTime", defaultTime || "30");
      formData.append(
        "examTimeLimit",
        String((parseInt(examTimeLimitMinutes || "30", 10) || 30) * 60),
      );

      const result = await createQuizMongoAction(undefined, formData);

      // If error, result will have error field
      if (result && !result.success) {
        setError(result.error || "Lỗi không xác định");
        setIsSubmitting(false);
        return;
      }

      // Success: go to quiz editor
      if (result && result.success) {
        setIsSubmitting(false);
        if (result.id) {
          router.push(`/quiz-editor/${result.id}`);
        } else {
          setError("Không lấy được ID quiz sau khi tạo.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi tạo quiz");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/teacher")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Tạo Quiz Mới</h1>
            <p className="text-slate-400 text-sm">Nhập thông tin cơ bản</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Thông tin Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <Label className="text-xs text-slate-400 mb-2 block">
                  Tiêu đề quiz *
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề quiz..."
                />
              </div>

              {/* Description */}
              <div>
                <Label className="text-xs text-slate-400 mb-2 block flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Mô tả
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả nội dung quiz (tùy chọn)..."
                  rows={3}
                />
              </div>

              {/* Category */}
              <div>
                <Label className="text-xs text-slate-400 mb-2 block flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Danh mục
                </Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ví dụ: Toán, Lý, Hóa (tùy chọn)..."
                />
              </div>

              {/* Default Time */}
              <div>
                <Label className="text-xs text-slate-400 mb-2 block flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Thời gian mặc định (giây)
                </Label>
                <Input
                  type="number"
                  value={defaultTime}
                  onChange={(e) => setDefaultTime(e.target.value)}
                  placeholder="30"
                  min="5"
                  max="300"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Thời gian mặc định cho mỗi câu hỏi
                </p>
              </div>

              <div>
                <Label className="text-xs text-slate-400 mb-2 block flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Thời gian làm bài thi (phút)
                </Label>
                <Input
                  type="number"
                  value={examTimeLimitMinutes}
                  onChange={(e) => setExamTimeLimitMinutes(e.target.value)}
                  placeholder="30"
                  min="5"
                  max="180"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Dùng cho chế độ Exam (đếm tổng thời gian)
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-400 text-sm p-2 bg-red-500/10 rounded">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Đang tạo..." : "Tạo Quiz & Chỉnh sửa"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
