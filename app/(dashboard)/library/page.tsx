import { connectToMongoDB } from "@/lib/mongodb/client";
import { Quiz } from "@/models/quiz.model";
import QuizList from "@/components/library/QuizList";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LibraryPage() {
    // 1. Kết nối DB
    await connectToMongoDB();

    // 2. Lấy data từ MongoDB
    // .lean() giúp lấy dữ liệu thuần JS (tăng tốc độ)
    const rawQuizzes = await Quiz.find({}).lean();

    // 3. Chuyển đổi dữ liệu sang format component cần (Map _id to id)
    const quizzes = rawQuizzes.map((q: any) => ({
        id: q._id.toString(),
        title: q.title,
        subject: q.subject,
        classId: q.classId,
        description: q.description,
        createdAt: q.createdAt,
        questionsCount: q.questions?.length || 0,
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Thư viện</h1>
                <Link href="/create-quiz">
                    <Button className="bg-purple-600"><Plus size={18} className="mr-2" /> Tạo mới</Button>
                </Link>
            </div>

            {/* Truyền data trực tiếp xuống không cần qua useEffect/useState */}
            <QuizList quizzes={quizzes} viewMode="grid" />
        </div>
    );
}