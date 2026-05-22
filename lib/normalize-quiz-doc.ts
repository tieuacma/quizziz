import { ObjectId, type Filter } from 'mongodb'
import type { QuizData, QuizMetadata, QuizQuestion } from '@/types/quiz'
import { serializeMongoDoc } from '@/lib/serializeMongo'

export function isObjectIdHex(id: string): boolean {
  return ObjectId.isValid(id) && new ObjectId(id).toHexString() === id
}

/** Resolve quiz by route id — primary field is root `id` (see data/quiz.json). */
export function buildQuizIdFilter(id: string): Filter<Record<string, unknown>> {
  if (isObjectIdHex(id)) {
    return { _id: new ObjectId(id) }
  }
  return {
    $or: [
      { id },
      { slug: id },
      { 'metadata.id': id },
      { _id: id },
    ],
  } as Filter<Record<string, unknown>>
}

type LegacyMetadata = {
  id?: string
  title?: string
  description?: string | null
  category?: string | null
  authorId?: string | null
  createdAt?: string
  updatedAt?: string
  totalQuestions?: number
  defaultTime?: number
}

/** Canonical quiz id: root `id`, then legacy metadata.id / slug, then Mongo `_id`. */
export function resolveQuizId(
  raw: Record<string, unknown>,
  flat?: Record<string, unknown>,
): string {
  if (typeof raw.id === 'string' && raw.id.trim()) {
    return raw.id.trim()
  }

  const meta = raw.metadata as LegacyMetadata | undefined
  if (typeof meta?.id === 'string' && meta.id.trim()) {
    return meta.id.trim()
  }

  const normalized = flat ?? normalizeRawQuizDoc(raw)
  if (typeof normalized.id === 'string' && normalized.id.trim()) {
    return normalized.id.trim()
  }
  if (typeof normalized.slug === 'string' && normalized.slug.trim()) {
    return normalized.slug.trim()
  }

  const serialized = serializeMongoDoc(normalized)
  return typeof serialized.id === 'string'
    ? serialized.id
    : String(serialized.id ?? '')
}

/** Flatten legacy `{ metadata, questions }` or pass through flat `{ id, title, ... }`. */
export function normalizeRawQuizDoc(
  doc: Record<string, unknown>,
): Record<string, unknown> {
  const meta = doc.metadata as LegacyMetadata | undefined
  const questions = Array.isArray(doc.questions)
    ? (doc.questions as QuizQuestion[])
    : []

  if (!meta) {
    return { ...doc, questions }
  }

  const now = new Date().toISOString()
  const legacyId = meta.id?.trim()
  return {
    ...doc,
    id: (typeof doc.id === 'string' && doc.id) || legacyId,
    slug: doc.slug ?? legacyId,
    title: doc.title ?? meta.title ?? '',
    description: doc.description ?? meta.description ?? null,
    category: doc.category ?? meta.category ?? null,
    authorId: doc.authorId ?? meta.authorId ?? null,
    createdAt: doc.createdAt ?? meta.createdAt ?? now,
    updatedAt: doc.updatedAt ?? meta.updatedAt ?? now,
    defaultTime: doc.defaultTime ?? meta.defaultTime ?? 30,
    totalQuestions:
      doc.totalQuestions ?? meta.totalQuestions ?? questions.length,
    questions,
  }
}

export function mongoDocToQuizData(
  raw: Record<string, unknown>,
): QuizData & { id: string } {
  const flat = normalizeRawQuizDoc(raw)
  const quizId = resolveQuizId(raw, flat)
  const serialized = serializeMongoDoc(flat)
  const title =
    typeof serialized.title === 'string'
      ? serialized.title
      : String(serialized.title ?? '')

  const questions = Array.isArray(
    (serialized as { questions?: unknown }).questions,
  )
    ? ((serialized as { questions: unknown }).questions as QuizQuestion[])
    : []

  const metadata: QuizMetadata = {
    id: quizId,
    title,
    description:
      typeof serialized.description === 'string'
        ? serialized.description
        : undefined,
    category:
      typeof serialized.category === 'string' ? serialized.category : undefined,
    createdAt:
      typeof serialized.createdAt === 'string'
        ? serialized.createdAt
        : String(serialized.createdAt ?? new Date().toISOString()),
    updatedAt:
      typeof serialized.updatedAt === 'string'
        ? serialized.updatedAt
        : String(serialized.updatedAt ?? new Date().toISOString()),
    authorId:
      typeof serialized.authorId === 'string' ? serialized.authorId : undefined,
    totalQuestions:
      typeof serialized.totalQuestions === 'number'
        ? serialized.totalQuestions
        : questions.length,
    defaultTime:
      typeof serialized.defaultTime === 'number'
        ? serialized.defaultTime
        : Number(serialized.defaultTime ?? 30),
  }

  return { id: quizId, metadata, questions }
}

/** Flat JSON file shape (no metadata wrapper) for imports. */
export function flattenQuizJsonFile(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const flat = normalizeRawQuizDoc(data)
  const rest = { ...(flat as Record<string, unknown>) }
  delete rest.metadata
  return rest
}
