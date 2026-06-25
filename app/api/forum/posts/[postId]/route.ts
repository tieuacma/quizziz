import { NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'
import { getSession } from '@/lib/session'
import { ObjectId } from 'mongodb'

// GET /api/forum/posts/:postId
export async function GET(req: Request, context: { params: Promise<{ postId: string }> }) {
  const { postId } = await context.params

  if (!postId) return NextResponse.json({ error: 'Missing postId' }, { status: 400 })

  const session = await getSession()
  const db = await getMongoDb()
  const postsCol = db.collection('posts')
  const commentsCol = db.collection('comments')

  let _id: ObjectId
  try {
    _id = new ObjectId(postId)
  } catch {
    return NextResponse.json({ error: 'ID bài viết không hợp lệ.' }, { status: 400 })
  }

  // Tăng lượt xem (views)
  await postsCol.updateOne({ _id }, { $inc: { 'meta.views': 1 } })

  const postDoc = await postsCol.findOne({ _id })
  if (!postDoc || postDoc.deletedAt !== null) {
    return NextResponse.json({ error: 'Bài viết không tồn tại.' }, { status: 404 })
  }

  const isAuthor = session && session.userId === postDoc.authorId
  const isTeacherOrAdmin = session && (session.role === 'teacher' || session.role === 'admin')

  // Kiểm duyệt bài viết: Chỉ cho phép Xem nếu bài đã Approved HOẶC là Tác giả HOẶC là Giáo viên/Admin
  if (postDoc.moderationStatus !== 'approved' && !isAuthor && !isTeacherOrAdmin) {
    return NextResponse.json({ error: 'Bài viết đang chờ phê duyệt hoặc bị chặn.' }, { status: 403 })
  }

  // Lấy danh sách bình luận (chỉ lấy bình luận chưa bị xóa)
  type CommentQuery = {
    postId: ObjectId
    deletedAt: null
    moderationStatus?: string
    $or?: Array<{ moderationStatus: string } | { authorId: string }>
  }

  const commentQuery: CommentQuery = { postId: _id, deletedAt: null }

  if (!session) {
    commentQuery.moderationStatus = 'approved'
  } else if (!isTeacherOrAdmin) {
    commentQuery.$or = [
      { moderationStatus: 'approved' },
      { authorId: session.userId },
    ]
  }


  const commentDocs = await commentsCol
    .find(commentQuery)
    .sort({ createdAt: 1 })
    .toArray()

  // Map post data & Bảo vệ thông tin ẩn danh
  const showPostIdentity = !postDoc.anonymous || isAuthor || isTeacherOrAdmin
  const mappedPost = {
    id: postDoc._id.toString(),
    authorId: showPostIdentity ? postDoc.authorId : '',
    authorName: showPostIdentity ? (postDoc.authorName ?? 'Thành viên') : 'Học sinh ẩn danh',
    anonymous: postDoc.anonymous,
    classScope: postDoc.classScope,
    title: postDoc.title,
    content: postDoc.content,
    createdAt: postDoc.createdAt,
    bestAnswer: postDoc.bestAnswer ?? null,
    moderationStatus: postDoc.moderationStatus,
    meta: {
      views: postDoc.meta?.views ?? 0,
      voteScore: postDoc.meta?.voteScore ?? 0,
      commentCount: postDoc.meta?.commentCount ?? 0
    }
  }

  // Map comments & Bảo vệ thông tin ẩn danh
  type CommentDoc = {
    _id: ObjectId
    postId: ObjectId
    authorId: string
    authorName?: string
    anonymous: boolean
    content: unknown
    parentCommentId?: ObjectId | null
    ancestorCommentId?: ObjectId | null
    voteScore?: number
    moderationStatus: string
    createdAt: Date
  }

  const mappedComments = (commentDocs as CommentDoc[]).map((c) => {
    const isCommentAuthor = session && session.userId === c.authorId
    const showCommentIdentity = !c.anonymous || isCommentAuthor || isTeacherOrAdmin

    const content = (c.content as { text?: string } | null) ?? null

    return {
      id: c._id.toString(),
      postId: c.postId.toString(),
      authorId: showCommentIdentity ? c.authorId : '',
      authorName: showCommentIdentity ? (c.authorName ?? 'Thành viên') : 'Học sinh ẩn danh',
      anonymous: c.anonymous,
      parentCommentId: c.parentCommentId ? c.parentCommentId.toString() : null,
      ancestorCommentId: c.ancestorCommentId ? c.ancestorCommentId.toString() : null,
      content: { text: content?.text ?? '' },
      voteScore: c.voteScore ?? 0,
      moderationStatus: c.moderationStatus,
      createdAt: c.createdAt,
    }
  })


  // Tìm nạp thông tin Vote của user hiện tại trên Post và các Comments (để hiển thị trạng thái đã Vote trên UI)
  const userVotes: Record<string, number> = {}
  if (session) {
    const votes = await db.collection('votes').find({
      userId: session.userId,
      $or: [
        { targetType: 'post', targetId: _id },
        { targetType: 'comment', targetId: { $in: commentDocs.map((c) => c._id) } },
      ],
    }).toArray()

    type VoteDoc = { targetId: ObjectId; value: number }
    votes.forEach((v) => {
      const vote = v as unknown as VoteDoc
      userVotes[vote.targetId.toString()] = vote.value
    })


  }

  return NextResponse.json({
    post: mappedPost,
    comments: mappedComments,
    userVotes
  })
}
