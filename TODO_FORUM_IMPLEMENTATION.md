# TODO: Diễn đàn học tập (Forum) — theo PLAN_FORUM_TODO.html

## Sprint 1 — Recon & chuẩn hoá tech

- [x] Repo reconnaissance: auth/session, server actions pattern, Mongo access
- [x] Chốt tech stack cho forum: render math (KaTeX/MathJax), editor/upload strategy
- [x] Chốt route layout theo role: student/teacher/admin/moderator
- [x] Decision: moderation pipeline (AI/bộ lọc) mức mô phỏng

## Sprint 2 — Database schema & API contract

- [x] Thiết kế collections (Users, Posts, Comments, Votes, Reports) + indices
- [x] Implement/contract API: CRUD posts + threaded comments + vote + accepted answer
- [x] Implement/contract API: report create + deduplicate

## Sprint 3 — Moderation

- [x] Auto-moderation pipeline: score/labels => status (pending/blocked)
- [x] Moderation actions: approve/reject/block + audit trail
- [x] Sync UI state với moderation status

## Sprint 4 — UI/UX skeleton

- [x] Forum landing (list/filter/sort/pagination)
- [x] Post composer (anonymous toggle, title/body, attachments, math)
- [x] Post detail + comment tree + vote panel
- [x] Report modal
- [x] Admin moderation queue

## Sprint 5 — QA/Acceptance & security

- [x] Acceptance criteria + test plan
- [x] Security checklist: upload validation, rate limit, anti-spam
- [x] Validate idempotency của vote/report
