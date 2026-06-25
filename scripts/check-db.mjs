import { MongoClient } from 'mongodb'
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

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'quizzes'

if (!uri) {
  console.error('No MONGODB_URI found')
  process.exit(1)
}

const client = new MongoClient(uri)
try {
  await client.connect()
  const db = client.db(dbName)
  console.log('Successfully connected to MongoDB database:', dbName)
  const collections = await db.listCollections().toArray()
  console.log('Existing collections:')
  for (const col of collections) {
    console.log(`- ${col.name}`)
    try {
      const indexes = await db.collection(col.name).listIndexes().toArray()
      console.log('  Indexes:', JSON.stringify(indexes, null, 2))
    } catch (e) {
      console.log(`  Failed to list indexes for ${col.name}:`, e.message)
    }
  }
} catch (err) {
  console.error('Connection error:', err)
} finally {
  await client.close()
}
