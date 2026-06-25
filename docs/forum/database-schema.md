# Database schema đề xuất (Mongo) — Forum

> Lưu ý: Repo hiện dùng Mongo driver trực tiếp (`lib/mongodb.ts`). Phần này là spec để triển khai theo các Sprint sau.

## Collections

### 1) `users` (tạm thời dùng session demo; nếu cần mapping thì sẽ có collection users)

- `userId: string` (id từ session)
- `email: string`
- `name: string`
- `role: 'student' | 'teacher'`

### 2) `posts`

- `_id: ObjectId`
- `authorId: string`
- `anonymous: boolean`
- `classScope?: { classId?: string; name?: string }` (tuỳ chọn)
- `title: string`
- `content: { type: 'doc'; text: string; attachments?: Attachment[]; math?: boolean }`
- `createdAt: Date`
- `updatedAt: Date`
- `deletedAt?: Date`
- `moderationStatus: 'pending' | 'approved' | 'blocked'`
- `bestAnswer?: { commentId: ObjectId; acceptedBy: 'author' | 'teacher'; acceptedAt: Date }`
- `meta: { views: number }`

### 3) `comments`

- `_id: ObjectId`
- `postId: ObjectId`
- `authorId: string`
- `anonymous: boolean`
- `parentCommentId?: ObjectId`
- `content: { text: string; attachments?: Attachment[] }`
- `createdAt: Date`
- `updatedAt: Date`
- `deletedAt?: Date`
- `moderationStatus: 'pending' | 'approved' | 'blocked'`

### 4) `votes` (idempotent theo user + target)

- `_id: ObjectId`
- `targetType: 'post' | 'comment'`
- `targetId: ObjectId`
- `userId: string`
- `value: 'up' | 'down' | 'like' | 'dislike'` (chốt 1 mô hình sau)
- `createdAt: Date`
- `updatedAt: Date`

**Index gợi ý**

- `posts`: `{ moderationStatus: 1, createdAt: -1 }`, `{ authorId: 1, createdAt: -1 }`
- `comments`: `{ postId: 1, createdAt: 1 }`, `{ parentCommentId: 1 }`
- `votes`: unique compound `{ targetType: 1, targetId: 1, userId: 1 }`
- `reports`: unique compound `{ targetType: 1, targetId: 1, userId: 1 }` (giảm spam)

### 5) `reports`

- `_id: ObjectId`
- `targetType: 'post' | 'comment'`
- `targetId: ObjectId`
- `reporterId: string`
- `reason: string`
- `details?: string`
- `createdAt: Date`
- `status: 'open' | 'resolved' | 'blocked'`
