import { readFile } from 'fs/promises'
import path from 'path'
import { getQuizzesCollection } from '@/lib/mongodb'
import { buildQuizIdFilter, mongoDocToQuizData } from '@/lib/normalize-quiz-doc'

const QUIZ_FILE = path.join(process.cwd(), 'data', 'quiz.json')

type QuizJsonShape = {
  id?: string
  metadata?: { id?: string }
  questions?: unknown[]
}

function jsonMatchesQuizId(raw: QuizJsonShape, id: string): boolean {
  const want = id.trim()
  const rootId = raw.id?.trim()
  const metaId = raw.metadata?.id?.trim()
  return rootId === want || metaId === want
}

/** Read data/quiz.json when root `id` (or legacy metadata.id) matches. */
export async function readQuizJsonById(
  id: string,
): Promise<Record<string, unknown> | null> {
  try {
    const raw = JSON.parse(await readFile(QUIZ_FILE, 'utf-8')) as QuizJsonShape
    if (!jsonMatchesQuizId(raw, id)) return null
    return raw as Record<string, unknown>
  } catch {
    return null
  }
}

/** @deprecated Use readQuizJsonById */
export const readQuizJsonByMetadataId = readQuizJsonById

/** Upsert quiz.json into Mongo `quizzes` collection (indexed by root `id`). */
export async function seedQuizJsonToMongo(
  raw: Record<string, unknown>,
): Promise<void> {
  const quizId = resolveJsonQuizId(raw)
  if (!quizId) return

  const col = await getQuizzesCollection()
  const doc = {
    ...raw,
    id: quizId,
    slug: (raw.slug as string | undefined) ?? quizId,
  }

  await col.replaceOne(buildQuizIdFilter(quizId), doc, { upsert: true })
}

function resolveJsonQuizId(raw: Record<string, unknown>): string | null {
  if (typeof raw.id === 'string' && raw.id.trim()) return raw.id.trim()
  const meta = raw.metadata as { id?: string } | undefined
  if (typeof meta?.id === 'string' && meta.id.trim()) return meta.id.trim()
  return null
}

export async function loadQuizFromJsonFallback(id: string) {
  const raw = await readQuizJsonById(id)
  if (!raw) return null
  return mongoDocToQuizData(raw)
}
