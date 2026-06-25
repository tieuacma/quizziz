# Acceptance criteria — Forum (Sprint 1–2)

## Auth guard

- Student chỉ vào `/dashboard/student/forum`
- Teacher chỉ vào `/dashboard/teacher/forum`

## Posts

- Student có thể tạo post → API trả `postId`
- Post mới có `moderationStatus=pending` (hiển thị trạng thái ở UI)

## Comments

- Student tạo comment/threaded (parentCommentId) → API trả comment id

## Votes (skeleton)

- UI gọi vote endpoint được (chưa cần đầy đủ thống kê)
