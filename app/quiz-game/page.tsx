"use client";

import Link from "next/link";
import QuizGame from "@/components/quiz-game/QuizGame";
import { sampleQuizData } from "@/components/quiz-game/sample-data";

export default function QuizGamePage() {
  return (
    <div className="zenith-immersive relative min-h-dvh w-full overflow-hidden">
      <div className="absolute left-4 top-4 z-50 pt-[env(safe-area-inset-top)]">
        <Link
          href="/"
          className="zenith-glass rounded-xl px-3 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:text-white hover:border-violet-500/30"
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
