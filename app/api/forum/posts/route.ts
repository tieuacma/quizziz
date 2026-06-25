import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getMongoDb } from '@/lib/mongodb'
import { runAutoModeration, logModerationEvent } from '@/lib/forum-moderation'

type PostItem = {
  id: string
  title: string
  authorId: string
  authorName: string
  anonymous: boolean
  createdAt: Date | string
  moderationStatus: 'approved' | 'pending' | 'blocked'
  meta?: { views?: number; voteScore?: number; commentCount?: number }
  hasMath?: boolean
  classScope?: { classId?: string; name?: string } | null
}

type PostsListResponse = {
  items: PostItem[]
  pagination: { limit: number; page: number; totalItems: number; totalPages: number }
}

// GET /api/forum/posts
export async function GET(req: Request) {
  const url = new URL(req.url)
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') ?? 10), 1), 50)
  const page = Math.max(Number(url.searchParams.get('page') ?? 1), 1)
  const sort = url.searchParams.get('sort') ?? 'new'
  const search = url.searchParams.get('search') ?? ''
  const classId = url.searchParams.get('classId') ?? ''

  const session = await getSession()
  const db = await getMongoDb()
  const postsCol = db.collection('posts')

  type Filter = Record<string, unknown> & {
    moderationStatus?: 'approved' | 'pending' | 'blocked'
    deletedAt?: null
    authorId?: string
    $or?: Array<Record<string, unknown>>
    $and?: Array<Record<string, unknown>>
    'classScope.classId'?: string

  }

  // Xây dựng bộ lọc bảo mật theo Role
  let filter: Filter = {}


  if (!session) {
    // Khách vãng lai: Chỉ xem bài đã được duyệt
    filter.moderationStatus = 'approved'
    filter.deletedAt = null
  } else if (session.role === 'teacher') {
    // Giáo viên: Xem tất cả các bài trong phạm vi (không ẩn bài pending/blocked)
    filter.deletedAt = null
  } else {
    // Học sinh: Xem các bài đã được duyệt HOẶC bài viết do chính mình tạo ra
    filter.deletedAt = null
    filter.$or = [
      { moderationStatus: 'approved' },
      { authorId: session.userId }
    ]
  }

  // Kết hợp điều kiện tìm kiếm (search query)
  if (search.trim()) {
    const searchRegex = { $regex: search.trim(), $options: 'i' }
    const searchCond = {
      $or: [
        { title: searchRegex },
        { 'content.text': searchRegex }
      ]
    }

    if (filter.$or) {
      filter = {
        $and: [
          { $or: filter.$or },
          searchCond,
          { deletedAt: null },
        ],
      }
    } else {
      filter.$and = [
        searchCond,
        { deletedAt: null },
      ]
    }

  }

  // Lọc theo lớp học (classId)
  if (classId) {
    if (filter.$and) {
      filter.$and.push({ 'classScope.classId': classId })
    } else {
      ; (filter as Record<string, unknown>)['classScope.classId'] = classId
    }

  }

  // Xử lý sắp xếp (Sorting)
  let sortSpec: Record<string, 1 | -1> = { createdAt: -1 }
  if (sort === 'top') {
    sortSpec = { 'meta.voteScore': -1, createdAt: -1 }
  } else if (sort === 'hot') {
    sortSpec = { 'meta.commentCount': -1, 'meta.views': -1, createdAt: -1 }
  }

  // Query database
  const totalItems = await postsCol.countDocuments(filter)
  const cursor = postsCol
    .find(filter)
    .sort(sortSpec)
    .skip((page - 1) * limit)
    .limit(limit)

  const items = await cursor.toArray()

  type PostDoc = {
    _id: { toString(): string }
    authorId: string
    authorName?: string
    anonymous: boolean
    title: string
    createdAt: Date | string
    deletedAt: string | null
    moderationStatus?: 'approved' | 'pending' | 'blocked'
    content?: { hasMath?: boolean }
    classScope?: { classId?: string; name?: string } | null
    meta?: { views?: number; voteScore?: number; commentCount?: number }
  }

  const mapped: PostItem[] = (items as unknown as PostDoc[]).map((doc) => {

    const isAuthor = session && session.userId === doc.authorId
    const isTeacherOrAdmin = session && session.role === 'teacher'

    const showIdentity = !doc.anonymous || isAuthor || isTeacherOrAdmin

    return {
      id: doc._id.toString(),
      title: doc.title,
      authorId: showIdentity ? doc.authorId : '',
      authorName: showIdentity ? (doc.authorName ?? 'Thành viên') : 'Học sinh ẩn danh',
      anonymous: doc.anonymous,
      createdAt: doc.createdAt,
      moderationStatus: doc.moderationStatus ?? 'approved',
      hasMath: doc.content?.hasMath ?? false,
      classScope: doc.classScope,
      meta: {
        views: doc.meta?.views ?? 0,
        voteScore: doc.meta?.voteScore ?? 0,
        commentCount: doc.meta?.commentCount ?? 0,
      },
    }
  })


  const res: PostsListResponse = {
    items: mapped,
    pagination: {
      limit,
      page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  return NextResponse.json(res)
}

// POST /api/forum/posts
export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const title = String(body.title ?? '').trim()
  const content = String(body.content ?? '').trim()
  const anonymous = Boolean(body.anonymous)
  const classId = body.classId ? String(body.classId) : null
  const className = body.className ? String(body.className) : null

  if (!title || !content) {
    return NextResponse.json({ error: 'Tiêu đề và nội dung là bắt buộc.' }, { status: 400 })
  }

  // 1. Chạy bộ kiểm duyệt tự động (Auto-moderation)
  const modResult = runAutoModeration(title, content)

  const db = await getMongoDb()
  const postsCol = db.collection('posts')

  const now = new Date()
  const docToInsert = {
    authorId: session.userId,
    authorName: session.name,
    anonymous,
    classScope: classId ? { classId, name: className ?? 'Lớp học' } : null,
    title,
    content: {
      type: 'doc',
      text: content,
      attachments: body.attachments || [],
      hasMath: content.includes('$')
    },
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    moderationStatus: modResult.status,
    moderationReason: modResult.reason,
    meta: {
      views: 0,
      voteScore: 0,
      commentCount: 0
    }
  }

  const result = await postsCol.insertOne(docToInsert)
  const postId = result.insertedId.toString()

  // Ghi nhận nhật ký kiểm duyệt vào db
  await logModerationEvent('post', postId, session.userId, modResult)

  return NextResponse.json({
    ok: true,
    postId,
    moderationStatus: modResult.status,
    message: modResult.status === 'approved'
      ? 'Đăng bài thành công.'
      : modResult.status === 'blocked'
        ? 'Bài viết bị chặn do vi phạm quy tắc nội dung.'
        : 'Bài viết đang chờ kiểm duyệt từ hệ thống.'
  })
}
