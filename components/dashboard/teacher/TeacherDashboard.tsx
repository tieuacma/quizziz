"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  School,
  Users,
  BookText,
  BookOpen,
  Puzzle,
  PenLine,
  Plus,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import WeeklySubmissionsChart from "./WeeklySubmissionsChart";

gsap.registerPlugin(ScrollTrigger);

// Types
interface ClassData {
  id: number;
  name: string;
  students: number;
  lesson: string;
  time: string;
  status: "active" | "upcoming";
  progress?: number;
}

interface QuizData {
  id: number;
  title: string;
  class: string;
  submissions: number;
  avg: number;
  trend?: "up" | "down" | "neutral";
}

interface LessonData {
  id: number;
  title: string;
  class: string;
  updatedAt: string;
  status: "published" | "draft";
  views?: number;
}

type IconName = "School" | "Users" | "BookOpen" | "BookText" | "Puzzle";

interface StatData {
  label: string;
  value: string;
  icon: IconName;
  color: string;
  trend?: number;
  gradient: string;
}

// Icon mapping for stat cards
const ICON_MAP: Record<IconName, React.ElementType> = {
  School,
  Users,
  BookOpen,
  BookText,
  Puzzle,
};

interface TeacherDashboardProps {
  session: {
    name: string;
    role: string;
  };
  classes: ClassData[];
  recentQuizzes: QuizData[];
  lessons: LessonData[];
  stats: StatData[];
}

// Animated Stat Card Component
function AnimatedStatCard({ stat, index }: { stat: StatData; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);
  const [counted, setCounted] = useState(false);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          // Card entrance animation
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              delay: index * 0.1,
              ease: "back.out(1.7)",
            },
          );

          // Hover glow effect
          cardRef.current?.addEventListener("mouseenter", () => {
            gsap.to(cardRef.current, {
              y: -8,
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(".stat-glow-" + index, {
              opacity: 0.6,
              duration: 0.3,
            });
          });

          cardRef.current?.addEventListener("mouseleave", () => {
            gsap.to(cardRef.current, {
              y: 0,
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(".stat-glow-" + index, {
              opacity: 0,
              duration: 0.3,
            });
          });

          // CountUp animation for values
          if (valueRef.current && !counted) {
            const targetValue = parseInt(stat.value);
            if (!isNaN(targetValue)) {
              gsap.to(
                {},
                {
                  duration: 1.2,
                  ease: "power2.out",
                  onUpdate: function () {
                    const progress = this.progress();
                    const current = Math.round(
                      targetValue * easeInOutCubic(progress),
                    );
                    if (valueRef.current) {
                      valueRef.current.textContent = current.toString();
                    }
                  },
                  onComplete: () => setCounted(true),
                },
              );
            }
          }
        },
        { scope: cardRef },
      );

      return () => ctx.revert();
    },
    { scope: cardRef },
  );

  return (
    <div ref={cardRef} className="relative group">
      {/* Animated glow background */}
      <div
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl stat-glow-${index}`}
      />

      <div className="relative h-full zenith-card overflow-hidden rounded-2xl">
        {/* Gradient border effect */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
        />

        <CardContent className="p-5 relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p
                ref={valueRef}
                className={`font-display text-3xl font-extrabold tracking-tight ${stat.color}`}
              >
                {stat.value}
              </p>
              {stat.trend && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-semibold">
                    +{stat.trend}%
                  </span>
                </div>
              )}
            </div>
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-20`}
            >
              {(() => {
                const IconComponent = ICON_MAP[stat.icon];
                return <IconComponent className="w-6 h-6 text-white" />;
              })()}
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}

// Class Card Component
function ClassCard({ cls, index }: { cls: ClassData; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, x: -20, rotateY: -5 },
            {
              opacity: 1,
              x: 0,
              rotateY: 0,
              duration: 0.5,
              delay: index * 0.12,
              ease: "power2.out",
            },
          );

          // Magnetic hover effect
          cardRef.current?.addEventListener("mousemove", (e) => {
            const rect = cardRef.current!.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(cardRef.current, {
              rotationY: x / 20,
              rotationX: -y / 20,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          cardRef.current?.addEventListener("mouseleave", () => {
            gsap.to(cardRef.current, {
              rotationY: 0,
              rotationX: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.5)",
            });
          });
        },
        { scope: cardRef },
      );

      return () => ctx.revert();
    },
    { scope: cardRef },
  );

  return (
    <div ref={cardRef} className="perspective-1000">
      <Card className="h-full bg-white/[0.03] border-white/8 backdrop-blur-sm hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all duration-300 cursor-pointer group overflow-hidden">
        {/* Animated gradient line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm group-hover:text-indigo-300 transition-colors line-clamp-1">
              {cls.name}
            </h3>
            <Badge
              className={`${
                cls.status === "active"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                  : "bg-blue-500/15 text-blue-400 border-blue-500/20"
              } text-xs font-medium`}
            >
              {cls.status === "active" ? (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Đang dạy
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Sắp tới
                </span>
              )}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
            <BookText className="w-3.5 h-3.5 text-indigo-400" />
            <span>{cls.lesson}</span>
          </div>

          {/* Progress bar */}
          {cls.progress && (
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>Tiến độ</span>
                <span>{cls.progress}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{ width: `${cls.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8">
            <span className="text-slate-400 text-xs flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              {cls.students} học sinh
            </span>
            <span className="text-slate-300 text-xs font-semibold bg-white/5 px-2 py-1 rounded-lg">
              {cls.time}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Quiz Card Component
function QuizCard({ quiz, index }: { quiz: QuizData; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, x: 20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              delay: index * 0.15,
              ease: "power2.out",
            },
          );
        },
        { scope: cardRef },
      );
      return () => ctx.revert();
    },
    { scope: cardRef },
  );

  return (
    <Card
      ref={cardRef}
      className="bg-white/[0.03] border-white/8 backdrop-blur-sm hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-medium text-sm group-hover:text-indigo-300 transition-colors line-clamp-2 flex-1">
            {quiz.title}
          </h3>
          {quiz.trend && (
            <div
              className={`ml-2 p-1.5 rounded-lg ${
                quiz.trend === "up"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : quiz.trend === "down"
                    ? "bg-rose-500/10 text-rose-400"
                    : "bg-slate-500/10 text-slate-400"
              }`}
            >
              <TrendingUp
                className={`w-3.5 h-3.5 ${
                  quiz.trend === "down" ? "rotate-180" : ""
                }`}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
          <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md text-[10px] font-semibold">
            {quiz.class}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/8">
          <div>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
              Đã nộp
            </p>
            <p className="text-white font-bold text-lg">{quiz.submissions}</p>
          </div>
          <div>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
              Điểm TB
            </p>
            <div className="flex items-center gap-1">
              <p className="text-emerald-400 font-bold text-lg">{quiz.avg}</p>
              <span className="text-slate-500 text-xs">/10</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Lesson Row Component
function LessonRow({ lesson, index }: { lesson: LessonData; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          gsap.fromTo(
            rowRef.current,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              delay: index * 0.08,
              ease: "power2.out",
            },
          );

          // Stagger animation on hover
          rowRef.current?.addEventListener("mouseenter", () => {
            gsap.to(rowRef.current, {
              x: 4,
              backgroundColor: "rgba(255,255,255,0.04)",
              duration: 0.2,
            });
          });

          rowRef.current?.addEventListener("mouseleave", () => {
            gsap.to(rowRef.current, {
              x: 0,
              backgroundColor: "transparent",
              duration: 0.2,
            });
          });
        },
        { scope: rowRef },
      );
      return () => ctx.revert();
    },
    { scope: rowRef },
  );

  return (
    <div
      ref={rowRef}
      className={`flex items-center justify-between px-5 py-4 cursor-pointer group ${
        index !== 0 ? "border-t border-white/8" : ""
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <BookText className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium group-hover:text-indigo-300 transition-colors line-clamp-1">
            {lesson.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded">
              {lesson.class}
            </span>
            <span className="text-[10px] text-slate-500">
              Cập nhật {lesson.updatedAt}
            </span>
            {lesson.views && (
              <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                <Users className="w-2.5 h-2.5" /> {lesson.views}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          className={`${
            lesson.status === "published"
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
              : "bg-slate-500/20 text-slate-400 border-slate-500/30"
          } text-xs font-medium`}
        >
          {lesson.status === "published" ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Đã đăng
            </span>
          ) : (
            "Nháp"
          )}
        </Badge>
        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}

// Helper function to get time of day greeting
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "buổi sáng";
  else if (hour < 18) return "buổi chiều";
  else return "buổi tối";
}

// Welcome Section Component
function WelcomeSection({ session }: { session: { name: string } }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timeOfDay = getTimeOfDay();

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          // Stagger entrance for children
          if (sectionRef.current) {
            gsap.fromTo(
              sectionRef.current.children,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
              },
            );
          }
        },
        { scope: sectionRef },
      );
      return () => ctx.revert();
    },
    { scope: sectionRef },
  );

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 p-6 md:p-8"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">
              Chào {timeOfDay}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
            Xin chào, {session.name} 👋
          </h1>
          <p className="text-slate-400 text-sm max-w-md">
            Quản lý lớp học và tài nguyên giảng dạy của bạn hôm nay. Bạn có 3
            lớp học đang hoạt động và 8 bài quiz cần xem xét.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/teacher/schedule">
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/10 text-white cursor-pointer text-xs backdrop-blur-sm"
            >
              <CalendarDays className="w-4 h-4 mr-2 text-indigo-400" />
              Thời khoá biểu
            </Button>
          </Link>
          <Button
            id="create-lesson-btn"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/30 text-xs"
          >
            <PenLine className="w-4 h-4 mr-2" />
            Tạo bài học
          </Button>
          <Link href="/quiz-create">
            <Button
              id="create-quiz-btn"
              variant="outline"
              className="border-white/10 hover:bg-white/10 text-white cursor-pointer text-xs backdrop-blur-sm"
            >
              <Plus className="w-4 h-4 mr-2 text-indigo-400" />
              Tạo Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function TeacherDashboard({
  session,
  classes,
  recentQuizzes,
  lessons,
  stats,
}: TeacherDashboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          // Overall page entrance
          gsap.fromTo(
            containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3 },
          );
        },
        { scope: containerRef },
      );
      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <WelcomeSection session={session} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <AnimatedStatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Column: Classes & Lessons */}
        <div className="lg:col-span-2 space-y-8">
          {/* Classes Section */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-400" />
                Lớp học của tôi
              </h2>
              <Link
                href="/dashboard/teacher/classes"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                Xem tất cả
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {classes.map((cls, index) => (
                <ClassCard key={cls.id} cls={cls} index={index} />
              ))}
            </div>
          </section>

          {/* Lessons Section */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BookText className="w-5 h-5 text-indigo-400" />
                Bài học gần đây
              </h2>
              <Link
                href="/dashboard/teacher/lessons"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                Xem tất cả
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <Card className="bg-white/[0.03] border-white/8 backdrop-blur-sm overflow-hidden">
              {lessons.map((lesson, index) => (
                <LessonRow key={lesson.id} lesson={lesson} index={index} />
              ))}
            </Card>
          </section>
        </div>

        {/* Right Column: Analytics & Quizzes */}
        <div className="lg:col-span-1 space-y-6 flex flex-col">
          {/* Quick Stats Card */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    Hoạt động tuần này
                  </p>
                  <p className="text-slate-400 text-xs">
                    Tăng 23% so với tuần trước
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">
                    Bài nộp
                  </p>
                  <p className="text-white font-bold text-xl">156</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-slate-500 text-[10px] uppercase font-bold">
                    Hoàn thành
                  </p>
                  <p className="text-emerald-400 font-bold text-xl">89%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Section */}
          <div className="flex-1 min-h-[300px]">
            <WeeklySubmissionsChart />
          </div>

          {/* Quizzes Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-indigo-400" />
                Quiz gần đây
              </h2>
              <Link
                href="/dashboard/teacher/quizzies"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                Xem tất cả
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentQuizzes.map((quiz, index) => (
                <QuizCard key={quiz.id} quiz={quiz} index={index} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Easing function for CountUp
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
