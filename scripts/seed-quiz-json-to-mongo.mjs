/**
 * Import data/quiz.json into MongoDB collection `quizzes` (root `id` field).
 * Usage: node scripts/seed-quiz-json-to-mongo.mjs
 */
import { MongoClient } from "mongodb";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvFile(name) {
    const p = resolve(process.cwd(), name);
    if (!existsSync(p)) return;
    for (const line of readFileSync(p, "utf8").split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const i = t.indexOf("=");
        if (i === -1) continue;
        const key = t.slice(0, i).trim();
        let val = t.slice(i + 1).trim();
        if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
        ) {
            val = val.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = val;
    }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const uri = process.env.MONGODB_URI;
const dbName =
    process.env.MONGODB_DB || process.env.MONGODB_DB_NAME || "quizzes";

if (!uri) {
    console.error("Set MONGODB_URI in .env.local");
    process.exit(1);
}

const quizPath = resolve(process.cwd(), "data", "quiz.json");
const raw = JSON.parse(readFileSync(quizPath, "utf8"));
const quizId = raw.id ?? raw.metadata?.id;

if (!quizId) {
    console.error("quiz.json must have root id (or legacy metadata.id)");
    process.exit(1);
}

const filter = {
    $or: [
        { id: quizId },
        { slug: quizId },
        { "metadata.id": quizId },
        { _id: quizId },
    ],
};

const doc = { ...raw, id: quizId, slug: raw.slug ?? quizId };

const client = new MongoClient(uri);
try {
    await client.connect();
    const col = client.db(dbName).collection("quizzes");
    const res = await col.replaceOne(filter, doc, { upsert: true });
    console.log(
        "Seeded quiz",
        quizId,
        res.upsertedCount ? "(inserted)" : "(replaced)"
    );
} finally {
    await client.close();
}
