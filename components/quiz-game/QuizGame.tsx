"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizLogic } from "@/hooks/useQuizLogic";
import { QuizQuestion } from "@/types/quiz";
import QuizLayout from "./QuizLayout";
import QuizSummary from "./QuizSummary";
import PrePlayScreen from "./PrePlayScreen";
import { sampleQuizData } from "./sample-data";
import { useQuestionMotion } from "./motion";

interface QuizGameProps {
  profileId: string;
  quizId: string;
  initialQuestions?: QuizQuestion[];
}

export default function QuizGame({
  profileId,
  quizId,
  initialQuestions,
}: QuizGameProps) {
  const pool = initialQuestions ?? sampleQuizData.questions;

  const {
    questions,
    sourceQuestions,
    quizState,
    timeLeft,
    estimatedSeconds,
    currentQuestion,
    handleAnswer,
    handleSubQuestionAnswer,
    handleCompleteReading,
    readingSubAnswers,
    isReadingQuestionComplete,
    startQuiz,
    restartQuiz,
    startPracticeWrong,
    isPracticeMode,
    isQuizFinished,
    isReady,
    isIdle,
  } = useQuizLogic(pool, profileId, quizId);

  const { variants: summaryVariants, transition: summaryTransition } =
    useQuestionMotion();

  const questionKey = currentQuestion
    ? `question-${quizState.current_question_index}-${currentQuestion.id}`
    : "loading";

  if (isIdle) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-slate-400">
        Đang tải...
      </div>
    );
  }

  if (isReady) {
    return (
      <PrePlayScreen
        questionCount={sourceQuestions.length}
        estimatedSeconds={estimatedSeconds}
        isPracticeMode={isPracticeMode}
        onStart={() => startQuiz()}
      />
    );
  }

  if (isQuizFinished) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="summary"
          className="h-screen w-screen"
          variants={summaryVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={summaryTransition}
        >
          <QuizSummary
            quizState={quizState}
            incorrectQuestions={sourceQuestions.filter((q) =>
              quizState.incorrect_questions.includes(q.id),
            )}
            onPlayAgain={restartQuiz}
            onPracticeWrong={startPracticeWrong}
            canPractice={quizState.incorrect_questions.length > 0}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <QuizLayout
      quizState={quizState}
      timeLeft={timeLeft}
      currentQuestion={currentQuestion}
      questions={questions}
      questionKey={questionKey}
      handleAnswer={handleAnswer}
      handleSubQuestionAnswer={handleSubQuestionAnswer}
      handleCompleteReading={handleCompleteReading}
      readingSubAnswers={readingSubAnswers}
      isReadingQuestionComplete={isReadingQuestionComplete}
    />
  );
}
