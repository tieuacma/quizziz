"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { 
  QuizQuestion, 
  QuizState,
  MultipleChoiceQuestion,
  ReadingQuestion
} from '@/types/quiz'

// --- Super Shuffle Algorithm (Fisher-Yates 2-pass) ---
export function superShuffle<T extends QuizQuestion[]>(questions: T): T {
  const globalShuffled = [...questions]
  for (let i = globalShuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[globalShuffled[i], globalShuffled[j]] = [globalShuffled[j], globalShuffled[i]]
  }

  return globalShuffled.map(question => {
    if ('options' in question) {
      const mcq = question as MultipleChoiceQuestion
      const options = [...mcq.options]
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[options[i], options[j]] = [options[j], options[i]]
      }
      return { ...mcq, options } as MultipleChoiceQuestion
    }
    
    if ('questions' in question) {
      const reading = question as ReadingQuestion
      const subQuestions = [...reading.questions]
      for (let i = subQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[subQuestions[i], subQuestions[j]] = [subQuestions[j], subQuestions[i]]
      }
      return { ...reading, questions: subQuestions } as ReadingQuestion
    }
    
    return question
  }) as T
}

// --- Main Quiz Logic Hook ---
export function useQuizLogic(
  initialQuestions: QuizQuestion[],
  profileId: string,
  quizId: string
) {
  const isInitialized = useRef(false);
  
  const [quizState, setQuizState] = useState<QuizState & { currentSubQuestionIndex: number }>({
    profile_id: profileId,
    quiz_id: quizId,
    correct_count: 0,
    wrong_count: 0,
    current_question_index: 0,
    score: 0,
    streak: 0,
    status: 'idle' as const,
    incorrect_questions: [],
    currentSubQuestionIndex: 0
  });

  const [timeLeft, setTimeLeft] = useState(0);
  const [readingSubAnswers, setReadingSubAnswers] = useState<Record<string, string>>({});
  const [answeredSubQuestions, setAnsweredSubQuestions] = useState<Record<string, boolean>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. CHUẨN HÓA LOGIC TIME: Lấy defaultTime làm time chính cho mọi câu hỏi
  const questions = useMemo(() => {
    const normalized = initialQuestions.map(q => ({
      ...q,
      // Ưu tiên defaultTime từ DB, mặc định 180s nếu thiếu
      // defaultTime không có trong type BaseQuestion; giữ fallback an toàn
      timeLimit: ("defaultTime" in q ? (q as { defaultTime?: number }).defaultTime : undefined) ?? 180 

    }));

    return superShuffle(normalized);
  }, [initialQuestions]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 2. AUTO-START: Khởi tạo với thời gian chuẩn từ câu hỏi đầu tiên
  useEffect(() => {
    if (isInitialized.current || questions.length === 0) return;
    
    const firstQuestionTime = questions[0].timeLimit;
    
    setQuizState(prev => ({
      ...prev,
      status: 'playing'
    }));
    
    setTimeLeft(firstQuestionTime);
    isInitialized.current = true;
  }, [questions]);

  // Reset trạng thái câu hỏi con khi chuyển câu hỏi chính
  useEffect(() => {
    const timeout = setTimeout(() => {
      setReadingSubAnswers({});
      setAnsweredSubQuestions({});
      setQuizState(prev => ({ ...prev, currentSubQuestionIndex: 0 }));
    }, 0);
    return () => clearTimeout(timeout);
  }, [quizState.current_question_index]);

  const calculateScore = useCallback((isCorrect: boolean, question?: QuizQuestion) => {
    if (!isCorrect || !question) return 0

    // Sử dụng timeLimit (đã gán bằng defaultTime) để tính điểm
    const baseScore = (timeLeft / question.timeLimit) * 1000
    const bonusScore = Math.min((quizState.streak / 3) * 200, 1000)
    return Math.round(baseScore + bonusScore)
  }, [timeLeft, quizState.streak]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    clearTimer();
    
    const currentQuestion = questions[quizState.current_question_index];
    const points = calculateScore(isCorrect, currentQuestion);

    const newStreak = isCorrect ? quizState.streak + 1 : 0;
    const incorrect = isCorrect 
      ? quizState.incorrect_questions 
      : [...quizState.incorrect_questions, currentQuestion.id];
    
    const nextIndex = quizState.current_question_index + 1;
    const isFinished = nextIndex >= questions.length;

    if (isFinished) {
      setQuizState(prev => ({
        ...prev,
        status: 'finished',
        correct_count: isCorrect ? prev.correct_count + 1 : prev.correct_count,
        wrong_count: isCorrect ? prev.wrong_count : prev.wrong_count + 1,
        score: prev.score + points,
        streak: newStreak,
        incorrect_questions: incorrect
      }));
      return;
    }

    // Reset thời gian cho câu hỏi tiếp theo
    const nextQuestionTime = questions[nextIndex].timeLimit;
    setTimeLeft(nextQuestionTime);
    
    setQuizState(prev => ({
      ...prev,
      correct_count: isCorrect ? prev.correct_count + 1 : prev.correct_count,
      wrong_count: isCorrect ? prev.wrong_count : prev.wrong_count + 1,
      score: prev.score + points,
      streak: newStreak,
      current_question_index: nextIndex,
      incorrect_questions: incorrect
    }));
  }, [questions, quizState, calculateScore, clearTimer]);

  const handleTimeOut = useCallback(() => {
    handleAnswer(false);
  }, [handleAnswer]);

  // --- SUB-QUESTION HANDLERS ---
  const handleSubQuestionAnswer = useCallback((subQuestionId: string, selectedOptionId: string) => {
    setReadingSubAnswers(prev => ({ ...prev, [subQuestionId]: selectedOptionId }));
    
    const currentQuestion = questions[quizState.current_question_index];
    if ('questions' in currentQuestion) {
      const sub = (currentQuestion as ReadingQuestion).questions.find(q => q.id === subQuestionId);
      if (sub && 'correctOptionId' in sub && sub.correctOptionId === selectedOptionId) {
        setAnsweredSubQuestions(prev => ({ ...prev, [subQuestionId]: true }));
      }

      // Tự động chuyển sub-question tiếp theo
      const readingQuestion = currentQuestion as ReadingQuestion;
      setTimeout(() => {
        setQuizState(prev => {
          if (prev.currentSubQuestionIndex < readingQuestion.questions.length - 1) {
            return { ...prev, currentSubQuestionIndex: prev.currentSubQuestionIndex + 1 };
          }
          return prev;
        });
      }, 800);
    }
  }, [questions, quizState.current_question_index]);

  const getCurrentSubQuestion = useCallback((question: ReadingQuestion) => {
    return question.questions[quizState.currentSubQuestionIndex];
  }, [quizState.currentSubQuestionIndex]);

  const isReadingQuestionComplete = useCallback((question?: QuizQuestion) => {
    if (!question || !('questions' in question)) return true;
    const reading = question as ReadingQuestion;
    return Object.keys(readingSubAnswers).length === reading.questions.length;
  }, [readingSubAnswers]);

  const handleCompleteReading = useCallback((question: ReadingQuestion) => {
    if (!isReadingQuestionComplete(question)) return;

    let correctSubCount = 0;
    const totalSubs = question.questions.length;

    question.questions.forEach(sub => {
      const userAnswer = readingSubAnswers[sub.id];
      if (userAnswer === sub.correctOptionId) {
        correctSubCount++;
      }
    });

    const isOverallCorrect = correctSubCount === totalSubs;
    const points = calculateScore(isOverallCorrect, question) * (correctSubCount / totalSubs);

    const nextIndex = quizState.current_question_index + 1;
    const isFinished = nextIndex >= questions.length;

    setQuizState(prev => ({
      ...prev,
      correct_count: isOverallCorrect ? prev.correct_count + 1 : prev.correct_count,
      wrong_count: isOverallCorrect ? prev.wrong_count : prev.wrong_count + 1,
      score: prev.score + Math.round(points),
      streak: isOverallCorrect ? prev.streak + 1 : 0,
      status: isFinished ? 'finished' : prev.status,
      current_question_index: isFinished ? prev.current_question_index : nextIndex
    }));

    if (!isFinished) {
      setTimeLeft(questions[nextIndex].timeLimit);
    }
    
    setReadingSubAnswers({});
  }, [isReadingQuestionComplete, readingSubAnswers, calculateScore, quizState.current_question_index, questions]);

  // --- TIMER EFFECT ---
  useEffect(() => {
    if (quizState.status !== 'playing' || questions.length === 0 || timeLeft === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizState.status, questions.length, timeLeft, handleTimeOut]);

  const goToPrevious = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      current_question_index: Math.max(0, prev.current_question_index - 1)
    }));
  }, []);

  const restartQuiz = useCallback(() => {
    setQuizState({
      profile_id: profileId,
      quiz_id: quizId,
      correct_count: 0,
      wrong_count: 0,
      current_question_index: 0,
      score: 0,
      streak: 0,
      status: 'idle',
      incorrect_questions: [],
      currentSubQuestionIndex: 0
    });
    setReadingSubAnswers({});
    setAnsweredSubQuestions({});
    setTimeLeft(0);
    isInitialized.current = false;
    clearTimer();
  }, [profileId, quizId, clearTimer]);

  return {
    questions,
    quizState,
    timeLeft,
    readingSubAnswers,
    answeredSubQuestions,
    currentQuestion: questions[quizState.current_question_index],
    handleAnswer,
    handleSubQuestionAnswer,
    handleCompleteReading,
    getCurrentSubQuestion,
    isReadingQuestionComplete,
    goToPrevious,
    restartQuiz,
    isQuizFinished: quizState.status === 'finished'
  };
}