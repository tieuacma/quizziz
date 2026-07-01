import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const quizPath = path.join(__dirname, "..", "data", "quiz.json");

const data = JSON.parse(fs.readFileSync(quizPath, "utf8"));
if (!data.metadata) {
    console.log("Already flat:", Object.keys(data).join(", "));
    process.exit(0);
}

const m = data.metadata;
const flat = {
    id: m.id,
    slug: m.id,
    title: m.title,
    category: m.category,
    totalQuestions: m.totalQuestions,
    defaultTime: m.defaultTime,
    updatedAt: m.updatedAt,
    createdAt: m.createdAt || m.updatedAt,
    description: m.description ?? null,
    authorId: m.authorId ?? null,
    questions: data.questions || [],
};

fs.writeFileSync(quizPath, JSON.stringify(flat, null, 2));
console.log("Flattened quiz.json →", Object.keys(flat).join(", "));
