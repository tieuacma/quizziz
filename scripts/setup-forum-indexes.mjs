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
const dbName = process.env.MONGODB_DB || "quizzes";

if (!uri) {
    console.error("No MONGODB_URI found");
    process.exit(1);
}

const client = new MongoClient(uri);
try {
    await client.connect();
    const db = client.db(dbName);
    console.log("Successfully connected to MongoDB database:", dbName);

    // 1. Setup indices for posts
    const postsCol = db.collection("posts");
    console.log("Creating indexes for posts...");
    await postsCol.createIndex({ moderationStatus: 1, createdAt: -1 });
    await postsCol.createIndex({ authorId: 1, createdAt: -1 });

    // 2. Setup indices for comments
    const commentsCol = db.collection("comments");
    console.log("Creating indexes for comments...");
    await commentsCol.createIndex({ postId: 1, createdAt: 1 });
    await commentsCol.createIndex({ parentCommentId: 1 });

    // 3. Setup indices for votes (unique compound index for idempotency)
    const votesCol = db.collection("votes");
    console.log("Creating unique compound index for votes...");
    await votesCol.createIndex(
        { targetType: 1, targetId: 1, userId: 1 },
        { unique: true }
    );

    // 4. Setup indices for reports (unique compound index to prevent double reporting)
    const reportsCol = db.collection("reports");
    console.log("Creating unique compound index for reports...");
    await reportsCol.createIndex(
        { targetType: 1, targetId: 1, reporterId: 1 },
        { unique: true }
    );

    console.log("All forum indexes set up successfully!");
} catch (err) {
    console.error("Index setup error:", err);
} finally {
    await client.close();
}
