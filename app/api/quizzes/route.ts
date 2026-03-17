import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb/client";
import { Quiz } from "@/models/quiz.model";

export async function GET() {
    try {
        await connectToMongoDB();
        const quizzes = await Quiz.find({}).sort({ createdAt: -1 }).lean();
        // Convert _id to id for client compatibility
        const formattedQuizzes = quizzes.map(quiz => ({
            id: quiz._id.toString(),
            ...quiz,
            _id: undefined
        }));
        return NextResponse.json(formattedQuizzes);
    } catch (error) {
        console.error("Error reading quizzes:", error);
        return NextResponse.json({ error: "Failed to read quizzes" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.subject || !body.classId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectToMongoDB();

        // Generate new quiz ID (compatible with existing format)
        const quizId = `quiz-${Date.now()}`;

        const quizData = {
            _id: quizId,
            title: body.title,
            subject: body.subject,
            classId: body.classId,
            description: body.description || "",
            questions: [],
        };

        const newQuiz = await Quiz.create(quizData);

        // Format response (convert _id to id)
        const responseQuiz = {
            id: newQuiz._id.toString(),
            ...newQuiz.toObject(),
            _id: undefined
        };

        return NextResponse.json(responseQuiz, { status: 201 });
    } catch (error) {
        console.error("Error creating quiz:", error);
        return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
    }
}
