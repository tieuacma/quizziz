import { MongoClient, type Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI!
const MONGODB_DB = process.env.MONGODB_DB || process.env.MONGODB_DB_NAME || 'quizzes'

if (!process.env.MONGODB_URI) {
  throw new Error('Missing environment variable: MONGODB_URI')
}


// Singleton for hot-reload / Next.js server environment
let clientPromise: Promise<MongoClient> | null = null

function getClientPromise() {
  if (!clientPromise) {
    const client = new MongoClient(MONGODB_URI, {
      // Atlas recommends using the unified topology (default in driver v4)
      // Connection pool settings can be added here if needed.
    })
    clientPromise = client.connect()
  }
  return clientPromise
}

export async function getMongoDb(): Promise<Db> {
  const client = await getClientPromise()
  return client.db(MONGODB_DB)
}

export async function getQuizzesCollection() {
  const db = await getMongoDb()
  return db.collection('quizzes')
}

/** @deprecated Use getQuizzesCollection */
export async function getQuestionsCollection() {
  return getQuizzesCollection()
}

