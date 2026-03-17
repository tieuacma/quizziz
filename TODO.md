# Task: Real-time Supabase quiz_attempts saving after each answer

## Information Gathered
- lib/types/quiz.ts: Has QuizAttempt type matching table structure.
- lib/hooks/useSupabaseQuiz.ts: Has createQuizAttempt; need to add initializeAttempt (insert initial) and updateAttempt (update by id).
- lib/hooks/useQuizEngine.ts: Manages state.score, correctAnswers, streak, etc. Exposes state.
- components/quiz/QuizPlayer.tsx: Uses useQuizEngine, has handleSubmitAnswer calling answerQuestion then nextQuestion.
- app/play-quiz/[id]/page.tsx: Loads quiz, studentName input, renders QuizPlayer.

## Plan
1. lib/hooks/useSupabaseQuiz.ts: Add `initializeAttempt` (insert initial record with quiz_id, student_name, 0s), return id; `updateAttempt` (update by id with score, correct_count, wrong_count=totalAnswered-correct, streak=maxStreak, append to wrong_answers jsonb if wrong).
2. app/play-quiz/[id]/page.tsx: On startQuiz (showQuiz=true), call initializeAttempt with quiz.id, studentName → save attemptId to new context/state passed to QuizPlayer.
3. components/quiz/QuizPlayer.tsx: Accept attemptId prop, useSupabaseQuiz, after answerQuestion (optimistic), call updateAttempt with current state values. On finishQuiz, final update with completed_at.
4. lib/hooks/useQuizEngine.ts: Expose wrongAnswers array from state for wrong_answers jsonb ( {questionId, userAnswer, correctAnswer} ).
5. Handle async silently (fire-and-forget after optimistic UI), error logging.

## Dependent Files
- lib/hooks/useSupabaseQuiz.ts
- lib/types/quiz.ts (add AttemptId type if needed)
- app/play-quiz/[id]/page.tsx 
- components/quiz/QuizPlayer.tsx
- lib/hooks/useQuizEngine.ts (minor expose)

## Followup steps
- npm run dev
- Test: play quiz, check Supabase dashboard for real-time inserts/updates after each answer.
- Handle edge: offline, errors (queue? log).

Approve plan before edits?

