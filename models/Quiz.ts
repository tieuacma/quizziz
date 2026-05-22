import type { QuizData, QuizQuestion, QuizMetadata } from '@/types/quiz'

// This is a *Type-only* helper to document Mongo doc shape.
// You said: use Mongo driver, no ORM.

export type QuizMongoDoc = {
  // Mongo will provide _id: ObjectId
  _id?: unknown

  /** Business id for routes / search (e.g. quiz-10-vanhoa-vn) */
  id?: string
  /** Alias of id (legacy imports) */
  slug?: string

  title: string
  description: string | null
  category: string | null
  authorId: string | null
  createdAt: string
  updatedAt: string
  defaultTime: number

  questions: QuizQuestion[]
  totalQuestions: number
}

export function quizToDbDoc(quiz: QuizData & { id?: string }): QuizMongoDoc {
  const m = quiz.metadata
  return {
    title: m.title,
    description: m.description ?? null,
    category: m.category ?? null,
    authorId: m.authorId ?? null,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
    defaultTime: m.defaultTime,
    questions: quiz.questions,
    totalQuestions: m.totalQuestions,
  }
}

export function dbDocToQuiz(doc: QuizMongoDoc): QuizData & { id: string } {
  // Convert _id to string in caller via serializeMongoDoc.
  const m: QuizMetadata = {
    id: quizToIdFallback(doc),
    title: doc.title,
    description: doc.description ?? undefined,
    category: doc.category ?? undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    authorId: doc.authorId ?? undefined,
    totalQuestions: doc.totalQuestions,
    defaultTime: doc.defaultTime,
  }

  return {
    id: m.id,
    metadata: m,
    questions: doc.questions,
  }
}

function quizToIdFallback(doc: QuizMongoDoc): string {
  return String(doc._id ?? doc)
}


