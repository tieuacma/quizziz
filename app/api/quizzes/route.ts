import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const QUIZZIZ_DIR = path.join(process.cwd(), "data/admin/quizziz");
const OVERVIEW_FILE = path.join(process.cwd(), "data/admin/quizziz.json");

// Helper to ensure directory exists
async function ensureDir() {
    try {
        await fs.mkdir(QUIZZIZ_DIR, { recursive: true });
    } catch (error) {
        // Directory might already exist
    }
}

// Helper to read quiz overviews from file
async function getQuizzes() {
    try {
        const data = await fs.readFile(OVERVIEW_FILE, "utf-8");
        return JSON.parse(data || "[]");
    } catch (error) {
        return [];
    }
}

// Helper to write quiz overviews to file
async function saveQuizzes(quizzes: any[]) {
    await fs.writeFile(OVERVIEW_FILE, JSON.stringify(quizzes, null, 2), "utf-8");
}

// GET - List all quiz overviews
export async function GET() {
    try {
        const quizzes = await getQuizzes();
        return NextResponse.json(quizzes);
    } catch (error) {
        console.error("Error reading quizzes:", error);
        return NextResponse.json({ error: "Failed to read quizzes" }, { status: 500 });
    }
}

// POST - Create new quiz
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Ensure quizziz directory exists
        await ensureDir();

        // Generate new quiz ID
        const quizId = `quiz-${Date.now()}`;

        // Quiz overview (for quizziz.json)
        const quizOverview = {
            id: quizId,
            title: body.title,
            subject: body.subject,
            classId: body.classId,
            description: body.description || "",
            createdAt: new Date().toISOString(),
        };

        // Quiz detail (for quizziz/[id].json)
        const quizDetail = {
            ...quizOverview,
            questions: [],
            updatedAt: new Date().toISOString(),
        };

        // Save overview to quizziz.json
        const quizzes = await getQuizzes();
        quizzes.push(quizOverview);
        await saveQuizzes(quizzes);

        // Save detailed quiz to quizziz/[id].json
        const detailPath = path.join(QUIZZIZ_DIR, `${quizId}.json`);
        await fs.writeFile(detailPath, JSON.stringify(quizDetail, null, 2), "utf-8");

        return NextResponse.json(quizDetail, { status: 201 });
    } catch (error) {
        console.error("Error creating quiz:", error);
        return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
    }
}
