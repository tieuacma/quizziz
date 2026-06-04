# TODO - Nâng cấp UI quiz-game (GRADIENT + NEON + GALAXY)

## Plan đã chốt: Option B (đồng bộ mạnh)

- [x] B1. Nâng cấp `app/globals.css`:
  - [x] Thêm starfield/scanlines/nebula drift cho `.zenith-immersive`
  - [x] Thêm utility class neon-glow/border để dùng thống nhất

- [ ] B2. Nâng cấp `components/quiz-game/QuizLayout.tsx`:
  - [ ] Gradient border/scan glow cho header/footer/status
  - [ ] Đồng bộ glow cho time + leaderboard toggle + progress

- [ ] B3. Nâng cấp `components/quiz-game/MultiChoiceCard.tsx`:
  - [ ] Neoning correct/wrong/selected bằng gradient glow ring
  - [ ] Làm shimmer/shine sắc nét hơn (nhưng không nổ sáng)

- [ ] B4. Nâng cấp `components/quiz-game/TrueFalseCard.tsx`:
  - [ ] Đồng bộ correct/wrong neon effect như MultiChoiceCard

- [ ] B5. Nâng cấp `components/quiz-game/FillBlankCard.tsx`:
  - [ ] Neon pulse overlay khi submitted đúng/sai

- [ ] B6. Đồng bộ thêm `components/quiz-game/ScoreBoard.tsx` + `StreakAndRank.tsx`:
  - [ ] Glow intensity + gradient theme đồng nhất

- [x] B7. Test:
  - [x] Build production thành công
  - [ ] Chạy dev server và kiểm tra `/quiz-game/[id]`
  - [ ] Kiểm tra responsive + hiệu ứng không gây chói/lag

- [ ] B8. Fix nếu phát sinh lỗi UI/lint/build
