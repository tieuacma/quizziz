"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import React from "react";

const PATH_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  teacher: "Giáo viên",
  student: "Học sinh",
  quizzes: "Quizzes",
  quizzies: "Trắc nghiệm",
  edit: "Chỉnh sửa",
  classes: "Lớp học",
  lessons: "Bài học",
  reports: "Báo cáo",
  students: "Học sinh",
  settings: "Cài đặt",
  analytics: "Phân tích",
  overview: "Tổng quan",
  "my-courses": "Môn học",
  assignments: "Bài tập",
  "learning-results": "Kết quả học tập",
  schedule: "Lịch học",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 md:space-x-2 text-xs md:text-sm font-medium text-slate-400">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-white transition-colors duration-200"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Zenith</span>
      </Link>

      {segments.map((segment, idx) => {
        const url = `/${segments.slice(0, idx + 1).join("/")}`;
        const isLast = idx === segments.length - 1;
        
        // Check if the segment is a dynamic ID (like quiz UUID)
        const isId = /^[0-9a-fA-F-]{24,36}$/.test(segment) || /^\d+$/.test(segment);
        let label = PATH_MAP[segment] || segment;
        if (isId) {
          label = "Chi tiết";
        }

        return (
          <React.Fragment key={url}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {isLast ? (
              <span className="text-indigo-400 font-semibold select-none truncate max-w-[120px] sm:max-w-none">
                {label}
              </span>
            ) : (
              <Link
                href={url}
                className="hover:text-white transition-colors duration-200 truncate max-w-[100px] sm:max-w-none"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
