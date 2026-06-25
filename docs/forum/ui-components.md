# UI components list — Sprint 1–2 skeleton

## Pages

- `app/dashboard/student/forum/page.tsx`: list + composer entry
- `app/dashboard/teacher/forum/page.tsx`: list + moderation banner (skeleton)
- `app/dashboard/student/forum/[id]/page.tsx`: post detail + comment tree

## Components

- `components/forum/ForumList.tsx`: filter/search/sort skeleton
- `components/forum/PostComposer.tsx`: title/body + anonymous toggle + submit
- `components/forum/PostCard.tsx`: render title/meta
- `components/forum/PostDetail.tsx`: math render (KaTeX) + attachments skeleton
- `components/forum/CommentTree.tsx`: threaded comments skeleton
- `components/forum/ReportModal.tsx`: modal skeleton (pending)

## Math rendering

- Dùng KaTeX cho phần `content` (S1 skeleton: render inline block theo markdown-like text).
