// app/api/quizzes/[id]/route.ts

import { unstable_noStore as noStore } from 'next/cache';
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Ép Next.js luôn chạy logic mới nhất, không dùng bản lưu tạm (cache) trên server
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const QUIZZIZ_DIR = path.join(process.cwd(), "data/admin/quizziz");
const OVERVIEW_FILE = path.join(process.cwd(), "data/admin/quizziz.json");

// Helper to read quiz overviews from file
async function getQuizzes() {
    try {
        const data = await fs.readFile(OVERVIEW_FILE, "utf-8");
        return JSON.parse(data || "[]");
    } catch (error) {
        return [];
    }
}

// FULL GET FUNCTION
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    noStore();
    try {
        const { id } = await params;
        const detailPath = path.join(QUIZZIZ_DIR, `${id}.json`);

        let quizData;

        try {
            // Ưu tiên đọc từ file chi tiết [id].json
            const data = await fs.readFile(detailPath, "utf-8");
            quizData = JSON.parse(data);
        } catch (fileError) {
            // Nếu không có file chi tiết, tìm trong file tổng hợp quizziz.json
            const quizzes = await getQuizzes();
            quizData = quizzes.find((q: any) => q.id === id);
        }

        if (!quizData) {
            return NextResponse.json(
                { error: "Không tìm thấy bộ câu hỏi này." },
                { status: 404 }
            );
        }

        // Trả về dữ liệu kèm theo Headers chặn Cache ở phía trình duyệt (Client)
        return NextResponse.json(quizData, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            }
        });

    } catch (error) {
        console.error("Lỗi khi đọc dữ liệu Quiz:", error);
        return NextResponse.json(
            { error: "Lỗi hệ thống khi tải dữ liệu." },
            { status: 500 }
        );
    }
}

// PUT - Update quiz (save to individual file)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Ensure directory exists
        await ensureDir();

        // Update overview in quizziz.json
        let quizzes = await getQuizzes();
        const index = quizzes.findIndex((q: any) => q.id === id);

        if (index === -1) {
            // Quiz doesn't exist - create new overview
            const newOverview = {
                id,
                title: body.title,
                subject: body.subject,
                classId: body.classId,
                description: body.description || "",
                createdAt: body.createdAt || new Date().toISOString(),
            };
            quizzes.push(newOverview);
            await saveQuizzes(quizzes);
        } else {
            // Update existing overview
            quizzes[index] = {
                ...quizzes[index],
                title: body.title,
                subject: body.subject,
                classId: body.classId,
                description: body.description,
            };
            await saveQuizzes(quizzes);
        }

        // Save detailed quiz to quizziz/[id].json
        const quizDetail = {
            id,
            title: body.title,
            subject: body.subject,
            classId: body.classId,
            description: body.description || "",
            questions: body.questions || [],
            createdAt: body.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const detailPath = path.join(QUIZZIZ_DIR, `${id}.json`);
        await fs.writeFile(detailPath, JSON.stringify(quizDetail, null, 2), "utf-8");

        return NextResponse.json(quizDetail);
    } catch (error) {
        console.error("Error updating quiz:", error);
        return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
    }
}

// DELETE - Delete quiz
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Delete from overview file
        let quizzes = await getQuizzes();
        const index = quizzes.findIndex((q: any) => q.id === id);

        if (index === -1) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        // Remove from overview
        quizzes.splice(index, 1);
        await saveQuizzes(quizzes);

        // Delete individual file
        const detailPath = path.join(QUIZZIZ_DIR, `${id}.json`);
        try {
            await fs.unlink(detailPath);
        } catch (e) {
            // File might not exist
        }

        return NextResponse.json({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
    }
}
async function ensureDir() {
    try {
        await fs.mkdir(QUIZZIZ_DIR, { recursive: true });
    } catch (error) {
        console.error("Error creating directory:", error);
    }
}

async function saveQuizzes(quizzes: any) {
    try {
        await fs.writeFile(OVERVIEW_FILE, JSON.stringify(quizzes, null, 2), "utf-8");
    } catch (error) {
        console.error("Error saving quizzes:", error);
        throw error;
    }
}

