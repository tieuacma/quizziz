"use client";

import Link from "next/link";
import QuizGame from "@/components/quiz-game/QuizGame";
import { sampleQuizData } from "@/components/quiz-game/sample-data";

export default function QuizGamePage() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-slate-950">
      <div className="absolute left-4 top-4 z-50 pt-[env(safe-area-inset-top)]">
        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white"
        >
          ← Trang chủ
        </Link>
      </div>
      <QuizGame
        profileId="demo-user-123"
        quizId="demo-quiz-456"
        initialQuestions={sampleQuizData.questions}
      />
    </div>
  );
}
