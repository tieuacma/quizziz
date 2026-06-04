"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Puzzle, Plus, Users, BarChart3 } from "lucide-react";

gsap.registerPlugin(useGSAP);

const STATUS_LABEL = {
  active: {
    text: "Đang mở",
    className: "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20",
  },
  closed: {
    text: "Đã đóng",
    className: "bg-slate-500/20 text-slate-400 hover:bg-slate-500/30",
  },
  draft: {
    text: "Nháp",
    className: "bg-amber-500/15 text-amber-400 hover:bg-amber-500/20",
  },
};

interface QuizData {
  id: number | string;
  title: string;
  class: string;
  createdAt: string;
  status: "active" | "closed" | "draft";
  submissions: number;
  total: number;
  avg: number;
}

interface AnimatedQuizzesPageProps {
  quizzes: QuizData[];
  activeCount: number;
  totalSubmissions: number;
}

// Animated Stat Card Component
function AnimatedStatCard({
  children,
  index,
  color,
}: {
  children: React.ReactNode;
  index: number;
  color: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          // Entrance animation with stagger
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 25, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              delay: 0.15 + index * 0.1,
              ease: "back.out(1.4)",
            },
          );

          // Hover lift effect
          cardRef.current?.addEventListener("mouseenter", () => {
            gsap.to(cardRef.current, {
              y: -6,
              boxShadow: `0 12px 40px ${color}30`,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          cardRef.current?.addEventListener("mouseleave", () => {
            gsap.to(cardRef.current, {
              y: 0,
              boxShadow: "0 0 0 transparent",
              duration: 0.3,
              ease: "power2.out",
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
    <div ref={cardRef} className="h-full">
      {children}
    </div>
  );
}

// Animated Quiz Card Component
function AnimatedQuizCard({
  q,
  status,
  index,
}: {
  q: QuizData;
  status: (typeof STATUS_LABEL)[keyof typeof STATUS_LABEL];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          // Entrance animation with stagger
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 20, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.45,
              delay: 0.3 + index * 0.08,
              ease: "power2.out",
            },
          );

          // Hover effects
          cardRef.current?.addEventListener("mouseenter", () => {
            gsap.to(cardRef.current, {
              y: -4,
              borderColor: "rgba(139, 92, 246, 0.3)",
              duration: 0.3,
              ease: "power2.out",
            });
          });

          cardRef.current?.addEventListener("mouseleave", () => {
            gsap.to(cardRef.current, {
              y: 0,
              borderColor: "rgba(255, 255, 255, 0.08)",
              duration: 0.3,
              ease: "power2.out",
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
    <Card
      ref={cardRef}
      className="bg-white/[0.03] border-white/8 transition-colors duration-300"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-medium text-sm">{q.title}</h3>
          <Badge className={status.className}>{status.text}</Badge>
        </div>
        <p className="text-slate-400 text-xs">
          📌 Lớp {q.class} · {q.createdAt}
        </p>
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/8">
          <Link href={`/quiz-editor/${q.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-white/15 cursor-pointer"
            >
              Sửa quiz
            </Button>
          </Link>
          <Link href={`/quiz-game/${q.id}`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-white/15 cursor-pointer"
            >
              Chơi thử
            </Button>
          </Link>
          <Link href={`/do-exam/${q.id}`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-white/15 cursor-pointer"
            >
              Thi thử
            </Button>
          </Link>
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <div>
              <p className="text-slate-400 text-xs">Đã nộp</p>
              <p className="text-white font-semibold text-sm">
                {q.submissions}/{q.total}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <div>
              <p className="text-slate-400 text-xs">Điểm TB</p>
              <p className="text-emerald-400 font-semibold text-sm">
                {q.status === "draft" ? "—" : `${q.avg}/10`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnimatedQuizzesPage({
  quizzes,
  activeCount,
  totalSubmissions,
}: AnimatedQuizzesPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          // Page entrance
          gsap.fromTo(
            containerRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            },
          );

          // Header entrance
          gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: -15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: 0.1,
              ease: "power2.out",
            },
          );

          // Button pulse animation
          gsap.to(buttonRef.current, {
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          // Animate stat cards with stagger
          const statCards = containerRef.current?.querySelectorAll(
            '[class*="bg-white/[0.03]"]',
          );
          if (statCards && statCards.length > 0) {
            gsap.fromTo(
              statCards,
              { opacity: 0, y: 25, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                delay: 0.2,
                ease: "back.out(1.4)",
              },
            );
          }

          // Section title animation
          const sectionTitle =
            containerRef.current?.querySelector("section h2");
          if (sectionTitle) {
            gsap.fromTo(
              sectionTitle,
              { opacity: 0, x: -10 },
              {
                opacity: 1,
                x: 0,
                duration: 0.4,
                delay: 0.35,
                ease: "power2.out",
              },
            );
          }
        },
        { scope: containerRef },
      );

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="space-y-8 max-w-5xl">
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Puzzle className="w-7 h-7 text-primary" />
            Trắc nghiệm
          </h1>
          <p className="text-slate-400 mt-1">
            Quản lý quiz, theo dõi lượt nộp và điểm trung bình.
          </p>
        </div>
        <Link href="/quiz-create">
          <Button
            ref={buttonRef}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" /> Tạo Quiz mới
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatedStatCard index={0} color="#10b981">
          <Card className="bg-white/[0.03] border-white/8 h-full">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-emerald-400">
                {quizzes.length}
              </p>
              <p className="text-slate-400 text-sm mt-0.5">Tổng quiz</p>
            </CardContent>
          </Card>
        </AnimatedStatCard>
        <AnimatedStatCard index={1} color="#8b5cf6">
          <Card className="bg-white/[0.03] border-white/8 h-full">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-violet-400">
                {activeCount}
              </p>
              <p className="text-slate-400 text-sm mt-0.5">Đang mở</p>
            </CardContent>
          </Card>
        </AnimatedStatCard>
        <AnimatedStatCard index={2} color="#f59e0b">
          <Card className="bg-white/[0.03] border-white/8 col-span-2 lg:col-span-1 h-full">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-amber-400">
                {totalSubmissions}
              </p>
              <p className="text-slate-400 text-sm mt-0.5">Lượt nộp (tổng)</p>
            </CardContent>
          </Card>
        </AnimatedStatCard>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Danh sách quiz
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {quizzes.map((q, i) => {
            const status = STATUS_LABEL[q.status];
            return (
              <AnimatedQuizCard key={q.id} q={q} status={status} index={i} />
            );
          })}
        </div>
      </section>
    </div>
  );
}
