# API spec (route handlers) — Sprint 1–2

> Route prefix: `/api/forum`

## Auth

- Require session via `lib/session.ts` cookie `session`
- Guard theo role: student/teacher

## Endpoints (tối thiểu)

### Posts

- `GET /api/forum/posts?limit=&page=&sort=&classScope=`
  - Resp: `{ items: PostSummary[], page: { ... }, total? }`

- `POST /api/forum/posts`
  - Body: `{ title: string; content: string; anonymous: boolean }`
  - Resp: `{ ok: true, postId: string }`
  - Behavior Sprint 1–2: tạo `moderationStatus: 'pending'` (auto-moderation mô phỏng)

- `GET /api/forum/posts/:postId`
  - Resp: `{ post: Post, comments: Comment[] }`

### Votes (skeleton)

- `POST /api/forum/votes`
  - Body: `{ targetType: 'post'|'comment'; targetId: string; value: 'up'|'down' }`

### Comments

- `POST /api/forum/posts/:postId/comments`
  - Body: `{ parentCommentId?: string; content: string; anonymous: boolean }`

> Moderation/admin queue sẽ bổ sung ở sprint sau.
