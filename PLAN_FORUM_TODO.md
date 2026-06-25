# PLAN_FORUM_TODO.md

## Mục tiêu

Thiết kế đặc tả chức năng (PRD) + giải pháp thiết kế (Database/Backend API/UI-UX) cho tính năng **“Diễn đàn học tập”**.

---

## 1) Thu thập ngữ cảnh dự án

- [x] Xem cấu trúc routes hiện có (`app/`, `app/dashboard/...`).
- [x] Đọc các phần liên quan đến auth/session (`lib/session.ts`, `app/actions/auth.ts`).
- [x] Xác định cách truy cập MongoDB hiện tại (`lib/mongodb.ts`).
- [x] Nhận diện style/UI component pattern đang dùng (`components/ui/*`, `globals.css`).

**Kết quả cần có:**

- Ghi nhận cách app xử lý user/role, session và layer server action.

---

## 2) Phân tích nghiệp vụ & phạm vi chức năng

- [x] Xác định actors: học sinh, giáo viên, admin/moderator.
- [x] Chốt luồng đăng bài: tài khoản chính vs ẩn danh.
- [x] Chốt tương tác: threaded comments, like/dislike/upvote/downvote.
- [x] Chốt cơ chế “đánh dấu câu trả lời đúng/hữu ích nhất”.
- [x] Chốt kiểm duyệt: auto-moderation + report + trạng thái bài/ comment.

**Kết quả cần có:**

- Danh sách use cases + invariant (quy tắc dữ liệu/role).

---

## 3) Brainstorm & thiết kế kiến trúc giải pháp

- [x] Thiết kế PRD chi tiết (user flow, acceptance criteria).
- [x] Thiết kế Database schema (Mongo collections) cho: Users, Posts, Comments, Votes, Reports.
- [x] Thiết kế API endpoints (REST/route handlers hoặc server actions) gồm:
  - CRUD posts
  - create threaded comments
  - vote/unvote
  - mark accepted answer
  - report content
  - moderation actions (approve/reject/block)
  - AI auto-moderation pipeline (mô tả luồng xử lý, store results)
- [x] Thiết kế UI/UX components cho trang diễn đàn:
  - list/filter/sort posts
  - composer editor (text + hình ảnh + file + công thức)
  - post detail + comment tree
  - report modal + feedback
  - moderation queue (admin)
  - trạng thái “Chờ duyệt/Bị chặn”

**Kết quả cần có:**

- Bản thiết kế tổng thể + mapping giữa yêu cầu ↔ database ↔ API ↔ UI.

---

## 4) Viết tài liệu đầu ra (Deliverables)

- [x] Viết **PRD** hoàn chỉnh theo các mục trong yêu cầu:
  - [x] User flow đăng bài (ẩn danh + bị kiểm duyệt)
  - [x] Database schema cơ bản cho Users/Posts/Comments/Votes/Reports
  - [x] Gợi ý UI/UX components cần có trên trang diễn đàn
- [x] Trình bày rõ quy tắc quyền truy cập theo role.
- [x] Ghi chú các quyết định kiến trúc quan trọng (index, consistency, moderation states).

---

## 5) Rà soát tính khả thi & chuẩn dự án

- [x] Đảm bảo đề xuất tương thích với session/auth hiện tại.
- [x] Đảm bảo phù hợp mô hình Mongo driver và patterns server actions trong repo.
- [x] Tối ưu UX: trạng thái loading, error, optimistic update cho vote.
- [x] Rà soát security: validation upload, rate limit, abuse mitigation.

---

## 6) Kiểm thử / Acceptance criteria (ở mức tài liệu)

- [x] Acceptance criteria cho đăng bài/ẩn danh.
- [x] Acceptance criteria cho threaded comments & vote.
- [x] Acceptance criteria moderation: auto-moderation và admin actions.
- [x] Acceptance criteria report & xử lý trùng lặp report.

---

## Trạng thái

- [x] Đã hoàn thành (Tất cả Sprint 1–5 đã hoàn tất và kiểm thử thành công)
