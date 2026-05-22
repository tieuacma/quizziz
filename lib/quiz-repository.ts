import { ObjectId } from 'mongodb'
import { getQuizzesCollection } from './mongodb'
import { buildQuizIdFilter, normalizeRawQuizDoc } from './normalize-quiz-doc'

export type QuizRecordId = string

export function toObjectId(id: string): ObjectId {
  return new ObjectId(id)
}

export type QuizDbDoc = Record<string, unknown>

export async function findQuizById(quizId: string): Promise<QuizDbDoc | null> {
  const col = await getQuizzesCollection()
  const doc = await col.findOne(buildQuizIdFilter(quizId))
  return doc as QuizDbDoc | null
}

/** @deprecated Use findQuizById */
export async function getQuizById(quizId: string): Promise<QuizDbDoc | null> {
  return findQuizById(quizId)
}

export async function upsertQuiz(
  quizId: string | null,
  quizDoc: QuizDbDoc,
): Promise<{ id: string }> {
  const col = await getQuizzesCollection()

  if (quizId) {
    const filter = buildQuizIdFilter(quizId)
    const existing = await col.findOne(filter)
    if (!existing) {
      throw new Error('Quiz not found')
    }

    const flat = normalizeRawQuizDoc(existing as Record<string, unknown>)
    const merged: QuizDbDoc = {
      ...quizDoc,
      id: quizId,
      createdAt: quizDoc.createdAt ?? flat.createdAt,
      slug: (quizDoc.slug as string | undefined) ?? (flat.slug as string) ?? quizId,
      authorId: quizDoc.authorId ?? flat.authorId,
    }

    await col.updateOne(filter, {
      $set: merged,
      $unset: { metadata: '' },
    })

    return { id: quizId }
  }

  const res = await col.insertOne(quizDoc)
  const insertedId =
    typeof quizDoc.id === 'string' && quizDoc.id
      ? quizDoc.id
      : res.insertedId.toHexString()
  return { id: insertedId }
}

export async function deleteQuiz(quizId: string): Promise<void> {
  const col = await getQuizzesCollection()
  await col.deleteOne(buildQuizIdFilter(quizId))
}
