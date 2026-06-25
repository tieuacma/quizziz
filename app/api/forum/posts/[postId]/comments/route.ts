import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getMongoDb } from '@/lib/mongodb'
import { runAutoModeration, logModerationEvent } from '@/lib/forum-moderation'
import { ObjectId } from 'mongodb'

// POST /api/forum/posts/:postId/comments
export async function POST(req: Request, context: { params: Promise<{ postId: string }> }) {
  const { postId } = await context.params

  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let _postId: ObjectId
  try {
    _postId = new ObjectId(postId)
  } catch {
    return NextResponse.json({ error: 'ID bài viết không hợp lệ.' }, { status: 400 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const content = String(body.content ?? '').trim()
  const anonymous = Boolean(body.anonymous)
  const parentCommentIdRaw = body.parentCommentId

  if (!content) return NextResponse.json({ error: 'Nội dung bình luận là bắt buộc.' }, { status: 400 })

  const db = await getMongoDb()
  const commentsCol = db.collection('comments')
  const postsCol = db.collection('posts')

  // Kiểm tra bài viết gốc có tồn tại không
  const postDoc = await postsCol.findOne({ _id: _postId })
  if (!postDoc) return NextResponse.json({ error: 'Bài viết không tồn tại.' }, { status: 404 })

  // Tìm ancestorCommentId nếu có parentCommentId
  let parentCommentId: ObjectId | null = null
  let ancestorCommentId: ObjectId | null = null

  if (parentCommentIdRaw) {
    try {
      parentCommentId = new ObjectId(String(parentCommentIdRaw))
      const parentDoc = await commentsCol.findOne({ _id: parentCommentId })
      if (parentDoc) {
        // Ancestor là câu trả lời cấp 1 cao nhất của thread này
        ancestorCommentId = parentDoc.ancestorCommentId || parentDoc._id
      }
    } catch {
      return NextResponse.json({ error: 'ID bình luận cha không hợp lệ.' }, { status: 400 })
    }
  }

  // 1. Chạy bộ lọc kiểm duyệt tự động cho bình luận
  const modResult = runAutoModeration('', content)

  const now = new Date()
  const docToInsert = {
    postId: _postId,
    authorId: session.userId,
    authorName: session.name,
    anonymous,
    parentCommentId,
    ancestorCommentId,
    content: { text: content },
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    moderationStatus: modResult.status,
    moderationReason: modResult.reason,
    voteScore: 0
  }

  const result = await commentsCol.insertOne(docToInsert)
  const commentId = result.insertedId.toString()

  // 2. Cập nhật số lượng comment trong post (nếu bình luận được approved lập tức)
  if (modResult.status === 'approved') {
    await postsCol.updateOne({ _id: _postId }, { $inc: { 'meta.commentCount': 1 } })
  }

  // 3. Ghi log kiểm duyệt
  await logModerationEvent('comment', commentId, session.userId, modResult)

  return NextResponse.json({
    ok: true,
    commentId,
    moderationStatus: modResult.status,
    message: modResult.status === 'approved' 
      ? 'Gửi bình luận thành công.' 
      : modResult.status === 'blocked'
      ? 'Bình luận bị chặn do vi phạm quy tắc nội dung.'
      : 'Bình luận đang chờ kiểm duyệt từ hệ thống.'
  })
}
