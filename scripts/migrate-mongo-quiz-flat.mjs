/**
 * One-time migration: hoist metadata.* to root and remove metadata.
 * Usage: node scripts/migrate-mongo-quiz-flat.mjs
 * Requires MONGODB_URI (and optional MONGODB_DB) in .env / environment.
 */
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName =
    process.env.MONGODB_DB || process.env.MONGODB_DB_NAME || "quizzes";

if (!uri) {
    console.error("Set MONGODB_URI before running this script.");
    process.exit(1);
}

const client = new MongoClient(uri);

try {
    await client.connect();
    const col = client.db(dbName).collection("quizzes");
    const cursor = col.find({ metadata: { $exists: true } });
    let count = 0;

    while (await cursor.hasNext()) {
        const doc = await cursor.next();
        const meta = doc.metadata || {};
        const questions = Array.isArray(doc.questions) ? doc.questions : [];

        await col.updateOne(
            { _id: doc._id },
            {
                $set: {
                    slug: doc.slug ?? meta.id,
                    title: doc.title ?? meta.title,
                    description: doc.description ?? meta.description ?? null,
                    category: doc.category ?? meta.category ?? null,
                    authorId: doc.authorId ?? meta.authorId ?? null,
                    createdAt: doc.createdAt ?? meta.createdAt,
                    updatedAt: doc.updatedAt ?? meta.updatedAt,
                    defaultTime: doc.defaultTime ?? meta.defaultTime ?? 30,
                    totalQuestions:
                        doc.totalQuestions ??
                        meta.totalQuestions ??
                        questions.length,
                    questions,
                },
                $unset: { metadata: "" },
            }
        );
        count++;
        console.log(
            "Migrated",
            doc._id instanceof ObjectId ? doc._id.toHexString() : doc._id
        );
    }

    console.log(`Done. Migrated ${count} document(s).`);
} finally {
    await client.close();
}
