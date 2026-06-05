"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PLAYGROUND_QUESTIONS } from "./landing-data";
import { Trophy, Zap, Award, RotateCcw, ChevronRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export default function LandingPlayground() {
  const [step, setStep] = useState<"intro" | "quiz" | "leaderboard">("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingScore, setFloatingScore] = useState<string | null>(null);

  const currentQuestion = PLAYGROUND_QUESTIONS[currentIdx];

  // Particle burst generator for correct answers
  const generateParticles = () => {
    const colors = ["#a78bfa", "#38bdf8", "#f43f5e", "#34d399", "#e879f9"];
    const newParticles: Particle[] = Array.from({ length: 30 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: 50 + (Math.random() - 0.5) * 40, // percentage from center
      y: 40 + (Math.random() - 0.5) * 30, // percentage from center
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));
    setParticles(newParticles);
    // Clear particles after animation
    setTimeout(() => setParticles([]), 1500);
  };

  const handleAnswerSelect = (optIdx: number) => {
    if (isAnswered) return;

    setSelectedOpt(optIdx);
    setIsAnswered(true);

    const isCorrect = optIdx === currentQuestion.correctIndex;
    if (isCorrect) {
      const addedScore = 800 + streak * 100;
      setScore((prev) => prev + addedScore);
      setStreak((prev) => prev + 1);
      setFloatingScore(`+${addedScore}`);
      generateParticles();
    } else {
      setStreak(0);
      setFloatingScore("0");
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setFloatingScore(null);

    if (currentIdx < PLAYGROUND_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setStep("leaderboard");
    }
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setShowExplanation(false);
    setFloatingScore(null);
    setParticles([]);
    setStep("quiz");
  };

  // Predefined leaderboard simulation
  const mockLeaderboard = [
    { name: "Cô Minh Trang", score: 3200, avatar: "👩‍🏫" },
    { name: "Bạn (Khách)", score: score, avatar: "🎮", highlight: true },
    { name: "Học sinh Minh Quân", score: 2600, avatar: "🧑‍🎓" },
    { name: "Thầy Hoàng Nam", score: 2400, avatar: "👨‍🏫" },
  ].sort((a, b) => b.score - a.score);

  return (
    <section
      id="trai-nghiem"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 overflow-hidden"
      aria-labelledby="playground-heading"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-900/10 blur-3xl opacity-60 -z-10" />
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-cyan-600/5 blur-3xl -z-10" />
      </div>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left column: Text details */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold text-violet-300 uppercase tracking-widest mb-4">
              Demo Trực Quan
            </p>
            <h2
              id="playground-heading"
              className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4"
            >
              Trải nghiệm{" "}
              <span className="zenith-gradient-text">
                Quiz Game Real-time
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              Lớp học của bạn sẽ tràn đầy hứng khởi với giao diện đấu bài câu hỏi cực kỳ sinh động. Chơi thử bản demo 3 câu bên cạnh để cảm nhận sự mượt mà!
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
              <span className="text-2xl mt-0.5">⚡</span>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Mượt mà & Sync cực nhanh</h3>
                <p className="text-xs text-slate-400">Đồng bộ câu hỏi & đáp án dưới 50ms nhờ nền tảng WebSocket.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
              <span className="text-2xl mt-0.5">🔥</span>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Hiệu ứng Streak & Neon</h3>
                <p className="text-xs text-slate-400">Kích thích động lực học tập thông qua điểm số và chuỗi trả lời đúng.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Device Widget */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-full max-w-[480px] p-1.5 rounded-[2.5rem] bg-gradient-to-br from-violet-600/30 to-purple-600/20 border border-violet-500/30 shadow-2xl shadow-violet-900/40">
            <div className="w-full rounded-[2.2rem] bg-[#0c0b18] overflow-hidden border border-white/10 flex flex-col relative min-h-[500px]">
              
              {/* Confetti Particle Overlay */}
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ x: `${p.x}%`, y: `${p.y}%`, scale: 0, opacity: 1 }}
                    animate={{
                      y: `${p.y - 40 - p.size * 2}%`,
                      x: `${p.x + (p.size % 10 - 5) * 5}%`,
                      scale: [0, 1.2, 0.4],
                      opacity: [1, 1, 0],
                      rotate: (p.size % 20) * 18,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute z-40 rounded-sm pointer-events-none"
                    style={{
                      backgroundColor: p.color,
                      width: p.size,
                      height: p.size,
                    }}
                  />
                ))}
              </AnimatePresence>

              {/* FLOATING SCORE ANIMATION */}
              <AnimatePresence>
                {floatingScore && (
                  <motion.div
                    initial={{ opacity: 0, y: 180, scale: 0.5 }}
                    animate={{ opacity: 1, y: 110, scale: 1.5 }}
                    exit={{ opacity: 0, y: 50, scale: 0.8 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`absolute inset-x-0 z-50 text-center font-black text-3xl tracking-wide ${
                      floatingScore === "0" ? "text-rose-400" : "text-emerald-400 text-neon-glow-emerald"
                    }`}
                  >
                    {floatingScore}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Game steps */}
              <AnimatePresence mode="wait">
                {step === "intro" && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-600/40 border border-white/20 mb-6">
                      <Zap className="w-10 h-10 text-white fill-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">ZENITH LIVE PLAYGROUND</h3>
                    <p className="text-sm text-slate-400 max-w-sm mb-8 leading-relaxed">
                      Sẵn sàng làm bài kiểm tra nhanh 3 câu hỏi để so tài cùng các thầy cô và bạn bè trên hệ thống?
                    </p>
                    <Button
                      onClick={() => setStep("quiz")}
                      className="zenith-btn-glow py-6 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-0 font-extrabold tracking-wide text-base w-full hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                    >
                      Bắt đầu thi ngay
                    </Button>
                  </motion.div>
                )}

                {step === "quiz" && (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col p-6"
                  >
                    {/* Header: Score and Streak */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Điểm số</span>
                        <span className="text-xl font-black text-white tracking-tight">{score} pts</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
                        <span className="text-base animate-pulse">🔥</span>
                        <span className="text-xs font-black">{streak} streak</span>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                        <span>Câu {currentIdx + 1} / {PLAYGROUND_QUESTIONS.length}</span>
                        <span>Đang đồng bộ...</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                          style={{ width: `${((currentIdx + 1) / PLAYGROUND_QUESTIONS.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question Card */}
                    <div className="mb-6 p-5 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden min-h-[92px] flex items-center">
                      <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
                      <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                        {currentQuestion.question}
                      </p>
                    </div>

                    {/* Options */}
                    <div className="flex-1 flex flex-col gap-3 justify-center">
                      {currentQuestion.options.map((opt, oIdx) => {
                        let btnStyle = "bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06] hover:border-white/20";
                        if (isAnswered) {
                          if (oIdx === currentQuestion.correctIndex) {
                            btnStyle = "neon-border-emerald bg-emerald-500/15 text-emerald-300 border-emerald-500/50";
                          } else if (selectedOpt === oIdx) {
                            btnStyle = "neon-border-rose bg-rose-500/15 text-rose-300 border-rose-500/50";
                          } else {
                            btnStyle = "bg-white/[0.01] border-white/5 text-slate-600 opacity-60";
                          }
                        }

                        return (
                          <motion.button
                            key={opt}
                            disabled={isAnswered}
                            whileHover={isAnswered ? {} : { scale: 1.02 }}
                            whileTap={isAnswered ? {} : { scale: 0.98 }}
                            onClick={() => handleAnswerSelect(oIdx)}
                            className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all relative ${btnStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                              {isAnswered && oIdx === currentQuestion.correctIndex && (
                                <Check className="w-4.5 h-4.5 text-emerald-400 absolute right-4 shrink-0" />
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Feedback / Explanation & Navigation */}
                    <div className="mt-6 min-h-[96px] flex flex-col justify-end">
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col gap-3"
                        >
                          <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20 text-xs text-slate-300 leading-relaxed">
                            💡 {currentQuestion.explanation}
                          </div>
                          <Button
                            onClick={handleNext}
                            className="w-full py-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm border-0 flex items-center justify-center gap-2 group transition-all"
                          >
                            {currentIdx === PLAYGROUND_QUESTIONS.length - 1 ? "Xem kết quả chung cuộc" : "Câu tiếp theo"}
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === "leaderboard" && (
                  <motion.div
                    key="leaderboard"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col p-6 justify-between"
                  >
                    <div>
                      {/* Title */}
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-2 text-yellow-400">
                          <Trophy className="w-6 h-6 fill-yellow-500/20" />
                        </div>
                        <h4 className="text-lg font-black text-white uppercase tracking-wider">Bảng Xếp Hạng Lớp Học</h4>
                        <p className="text-xs text-slate-400 mt-1">Đồng bộ tự động từ hệ thống Zenith Realtime</p>
                      </div>

                      {/* Players */}
                      <div className="flex flex-col gap-2.5">
                        {mockLeaderboard.map((player, index) => (
                          <motion.div
                            key={player.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                              player.highlight
                                ? "bg-violet-500/25 border-violet-500/60 neon-border-violet font-black"
                                : "bg-white/[0.02] border-white/5 text-slate-300 font-medium"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <span className={`text-sm font-black w-5 text-center ${index === 0 ? "text-yellow-400" : index === 1 ? "text-slate-300" : "text-slate-500"}`}>
                                #{index + 1}
                              </span>
                              <span className="text-lg leading-none">{player.avatar}</span>
                              <span className="text-sm">{player.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm text-right">{player.score}</span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">pts</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                      <Button
                        variant="outline"
                        onClick={resetGame}
                        className="flex-1 border-white/10 hover:bg-white/5 text-white font-bold rounded-xl py-5 text-xs sm:text-sm flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> Chơi lại
                      </Button>
                      <Button
                        onClick={() => window.location.href = "/signup"}
                        className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-extrabold hover:from-violet-500 hover:to-fuchsia-500 rounded-xl py-5 text-xs sm:text-sm border-0 flex items-center justify-center gap-2"
                      >
                        Tạo tài khoản học <Sparkles className="w-4 h-4 fill-white/10 animate-pulse" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
