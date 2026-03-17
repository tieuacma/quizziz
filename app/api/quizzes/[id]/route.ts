import { unstable_noStore as noStore } from 'next/cache';
import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb/client";
import { Quiz } from "@/models/quiz.model";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    noStore();
    try {
        const { id } = await params;
        await connectToMongoDB();

        const quiz = await Quiz.findById(id).lean();

        if (!quiz) {
            return NextResponse.json(
                { error: "Không tìm thấy bộ câu hỏi này." },
                { status: 404 }
            );
        }

        // Format response for client compatibility
        const formattedQuiz = {
            id: quiz._id.toString(),
            ...quiz,
            _id: undefined
        };

        return NextResponse.json(formattedQuiz, {
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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        await connectToMongoDB();

        const updateData = {
            title: body.title,
            subject: body.subject,
            classId: body.classId,
            description: body.description || "",
            questions: body.questions || [],
        };

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).lean();

        if (!updatedQuiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        const responseQuiz = {
            id: updatedQuiz._id.toString(),
            ...updatedQuiz,
            _id: undefined
        };

        return NextResponse.json(responseQuiz);
    } catch (error) {
        console.error("Error updating quiz:", error);
        return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToMongoDB();

        const deletedQuiz = await Quiz.findByIdAndDelete(id);

        if (!deletedQuiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Quiz deleted successfully" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
    }
}

