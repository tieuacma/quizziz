/**
 * Debug quiz lookup for quiz-editor redirect issues.
 * Usage: node scripts/debug-quiz-lookup.mjs quiz-10-vanhoa-vn
 */
import { MongoClient, ObjectId } from 'mongodb'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

function loadEnvFile(name) {
  const p = resolve(process.cwd(), name)
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const key = t.slice(0, i).trim()
    let val = t.slice(i + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

const quizId = process.argv[2] || 'quiz-10-vanhoa-vn'
const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || process.env.MONGODB_DB_NAME || 'quizzes'

if (!uri) {
  console.error('Missing MONGODB_URI')
  process.exit(1)
}

function isObjectIdHex(id) {
  return ObjectId.isValid(id) && new ObjectId(id).toHexString() === id
}

function buildFilter(id) {
  if (isObjectIdHex(id)) return { _id: new ObjectId(id) }
  return { $or: [{ id }, { slug: id }, { 'metadata.id': id }, { _id: id }] }
}

const client = new MongoClient(uri)
try {
  await client.connect()
  const db = client.db(dbName)
  console.log('DB:', dbName)
  const collections = await db.listCollections().toArray()
  console.log(
    'Collections:',
    collections.map((c) => c.name),
  )

  for (const name of ['quizzes', 'questions', 'quiz']) {
    const col = db.collection(name)
    const count = await col.countDocuments()
    if (count === 0) continue
    console.log(`\n--- collection "${name}" (${count} docs) ---`)
    const filter = buildFilter(quizId)
    console.log('Filter:', JSON.stringify(filter))
    const doc = await col.findOne(filter)
    console.log('findOne:', doc ? 'FOUND' : 'NOT FOUND')
    if (doc) {
      console.log('_id:', doc._id)
      console.log('id:', doc.id)
      console.log('metadata.id:', doc.metadata?.id)
      console.log('slug:', doc.slug)
      console.log('title:', doc.title ?? doc.metadata?.title)
      console.log('questions:', Array.isArray(doc.questions) ? doc.questions.length : 0)
    }
    const sample = await col.findOne({})
    if (sample) {
      console.log('Sample doc keys:', Object.keys(sample))
      console.log('Sample _id type:', typeof sample._id, sample._id)
      if (sample.metadata) console.log('Sample metadata.id:', sample.metadata.id)
      if (sample.slug) console.log('Sample slug:', sample.slug)
    }
  }
} finally {
  await client.close()
}
