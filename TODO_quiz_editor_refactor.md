# TODO - Quiz Editor UI Refactor (Neon Gradient + Read-only View Mode)

- [ ] Inspect existing quiz-editor page structure and question rendering (app/quiz-editor/[id]/page.tsx)
- [ ] Add a View Mode (read-only) component for each question card
- [ ] Add an Edit Mode wrapper that reuses existing QuestionEditor + per-question time limit input
- [ ] Refactor question card UI:
  - [ ] Modern neon/gradient theme (dark background, glow borders, smooth transitions)
  - [ ] Show full question content in View Mode:
    - [ ] Full question text
    - [ ] Multiple-choice options (A/B/C/D) as static typography, highlight correct option in neon green
    - [ ] Fill-in-the-blank answers list as static typography, optionally highlight accepted answers
    - [ ] True/false answer highlighted in neon
    - [ ] Reading: show passage and nested sub-questions in read-only typography
  - [ ] Remove all input/select elements from View Mode
  - [ ] Only pencil icon switches a specific card from View Mode to Edit Mode
- [ ] Ensure pencil toggles exactly one expanded question (or maintain current behavior)
- [ ] Keep existing actions: move up/down, delete, save quiz, add questions
- [ ] Add any small shared helper(s) for static rendering (option letter mapping, sanitizing empty text)
- [ ] Run typecheck/lint + manual test by running Next dev server and verifying editor UI
