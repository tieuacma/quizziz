# TODO_quiz_editor_ui_upgrade

- [ ] Create `components/quiz-editor/QuizQuestionView.tsx` (read-only neon preview for 4 question types)
- [ ] Create `components/quiz-editor/QuizQuestionEdit.tsx` (wrap existing `components/quiz-create/QuestionEditor` + per-question timeLimit)
- [ ] Refactor `app/quiz-editor/[id]/page.tsx` to show ViewMode when collapsed and EditMode when pencil-expanded
- [ ] Improve reading editor: implement “Thêm câu hỏi phụ” handler inside `components/quiz-create/QuestionEditor.tsx`
- [ ] Background/polish: upgrade quiz-editor page background/cards glow/gradients without breaking layout
- [ ] Run `npm run dev`, manual verify: pencil toggles one card, reading add sub-question works, save works
