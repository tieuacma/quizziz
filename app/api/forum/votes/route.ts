import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getMongoDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// POST /api/forum/votes
export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const targetType = body.targetType === 'comment' ? 'comment' : 'post'
  const targetIdRaw = body.targetId ? String(body.targetId) : ''
  const value = body.value === 'down' ? 'down' : 'up' // 'up' | 'down'

  if (!targetIdRaw) return NextResponse.json({ error: 'targetId required' }, { status: 400 })

  let targetId: ObjectId
  try {
    targetId = new ObjectId(targetIdRaw)
  } catch {
    return NextResponse.json({ error: 'ID đối tượng không hợp lệ.' }, { status: 400 })
  }

  const db = await getMongoDb()
  const votesCol = db.collection('votes')
  const postsCol = db.collection('posts')
  const commentsCol = db.collection('comments')

  // Kiểm tra đối tượng có tồn tại không
  let targetDoc: Record<string, unknown> | null = null
  if (targetType === 'post') {
    targetDoc = await postsCol.findOne({ _id: targetId })
  } else {
    targetDoc = await commentsCol.findOne({ _id: targetId })
  }

  if (!targetDoc) {
    return NextResponse.json({ error: 'Đối tượng bình chọn không tồn tại.' }, { status: 404 })
  }

  // Tìm vote cũ
  const query = { targetType, targetId, userId: session.userId }
  const existingVote = await votesCol.findOne(query)

  let scoreDiff = 0
  let userVote: number | null = null // 1 for up, -1 for down, 0 for retracted

  if (!existingVote) {
    // 1. Chưa vote bao giờ -> Tạo vote mới
    await votesCol.insertOne({
      ...query,
      value,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    scoreDiff = value === 'up' ? 1 : -1
    userVote = value === 'up' ? 1 : -1
  } else {
    // 2. Đã vote rồi
    if (existingVote.value === value) {
      // 2a. Click trùng nút -> Hủy vote (Retract vote)
      await votesCol.deleteOne({ _id: existingVote._id })
      scoreDiff = value === 'up' ? -1 : 1
      userVote = 0
    } else {
      // 2b. Đổi hướng vote -> Cập nhật vote mới
      await votesCol.updateOne({ _id: existingVote._id }, {
        $set: { value, updatedAt: new Date() }
      })
      scoreDiff = value === 'up' ? 2 : -2
      userVote = value === 'up' ? 1 : -1
    }
  }

  // Cập nhật điểm số vào Post/Comment denormalized fields
  let newScore = 0
  if (targetType === 'post') {
    const currentScore = (targetDoc as { meta?: { voteScore?: number } } | null)?.meta?.voteScore ?? 0
    newScore = currentScore + scoreDiff
    await postsCol.updateOne({ _id: targetId }, { $set: { 'meta.voteScore': newScore } })
  } else {
    const currentScore = (targetDoc?.voteScore as number | undefined) ?? 0
    newScore = currentScore + scoreDiff
    await commentsCol.updateOne({ _id: targetId }, { $set: { voteScore: newScore } })
  }

  return NextResponse.json({ ok: true, newScore, userVote })
}

