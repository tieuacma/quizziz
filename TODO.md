# TODO: Improve Play Quiz UI - Production Ready Plan

## Phase 0 – Define Design System (NEW)
- [ ] Define primary color & accent palette
- [ ] Define border radius scale (lg, xl, 2xl)
- [ ] Define shadow system
- [ ] Define animation duration tokens
- [ ] Create reusable Card component (glass variant)

## Phase 1 – Layout Refactor
- [ ] Centered responsive container (max-w-2xl)
- [ ] Sticky top progress section
- [ ] Card-based question layout
- [ ] Consistent spacing system (8px scale)

## Phase 2 – Question Interaction UX
- [ ] Highlight selected answer
- [ ] Show correct/incorrect state with color feedback
- [ ] Disable options after selection
- [ ] 800ms delay before auto next
- [ ] Animated progress bar
- [ ] Smooth slide transition between questions

## Phase 3 – Screen States
- [ ] Loading skeleton
- [ ] Ready screen with CTA emphasis
- [ ] Results screen:
  - [ ] Animated score counter
  - [ ] Performance message (Excellent / Good / Try Again)
  - [ ] Confetti (only when >80%)
  - [ ] Retry & Back buttons

## Phase 4 – Micro Interactions
- [ ] Button press scale animation
- [ ] Option hover elevation
- [ ] Timer pulse when <5s
- [ ] Reduced motion fallback

## Phase 5 – Responsive & Accessibility
- [ ] Mobile-first layout
- [ ] Keyboard navigation
- [ ] Focus ring styling
- [ ] ARIA roles for options
- [ ] Color contrast check
