import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMongoDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST /api/forum/posts/:postId/best-answer
export async function POST(
    req: Request,
    context: { params: Promise<{ postId: string }> }
) {
    const { postId } = await context.params;

    const session = await getSession();
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let _postId: ObjectId;
    try {
        _postId = new ObjectId(postId);
    } catch {
        return NextResponse.json(
            { error: "ID bài viết không hợp lệ." },
            { status: 400 }
        );
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.commentId) {
        return NextResponse.json(
            { error: "commentId is required" },
            { status: 400 }
        );
    }

    let _commentId: ObjectId;
    try {
        _commentId = new ObjectId(String(body.commentId));
    } catch {
        return NextResponse.json(
            { error: "ID bình luận không hợp lệ." },
            { status: 400 }
        );
    }

    const db = await getMongoDb();
    const postsCol = db.collection("posts");
    const commentsCol = db.collection("comments");

    // Lấy thông tin bài viết
    const postDoc = await postsCol.findOne({ _id: _postId });
    if (!postDoc)
        return NextResponse.json(
            { error: "Bài viết không tồn tại." },
            { status: 404 }
        );

    // Phân quyền: Chỉ tác giả bài đăng hoặc Giáo viên/Admin được chọn câu trả lời tốt nhất
    const isAuthor = session.userId === postDoc.authorId;
    const isTeacherOrAdmin =
        session.role === "teacher" || (session.role as string) === "admin";

    if (!isAuthor && !isTeacherOrAdmin) {
        return NextResponse.json(
            {
                error: "Bạn không có quyền chọn câu trả lời đúng nhất cho bài viết này.",
            },
            { status: 403 }
        );
    }

    // Xác thực bình luận này có thuộc bài viết gốc không
    const commentDoc = await commentsCol.findOne({
        _id: _commentId,
        postId: _postId,
    });
    if (!commentDoc) {
        return NextResponse.json(
            { error: "Bình luận không thuộc bài viết này." },
            { status: 400 }
        );
    }

    // Xử lý Toggle: Nếu bình luận này đã là Best Answer thì Unset nó, ngược lại thì Set nó làm Best Answer
    const currentBest = postDoc.bestAnswer;
    let newBest = null;

    if (
        currentBest &&
        currentBest.commentId.toString() === _commentId.toString()
    ) {
        // Unset
        await postsCol.updateOne(
            { _id: _postId },
            { $unset: { bestAnswer: "" } }
        );
    } else {
        // Set
        newBest = {
            commentId: _commentId,
            acceptedBy: isTeacherOrAdmin ? "teacher" : "author",
            acceptedAt: new Date(),
        };
        await postsCol.updateOne(
            { _id: _postId },
            { $set: { bestAnswer: newBest } }
        );
    }

    return NextResponse.json({
        ok: true,
        isBestAnswer: newBest !== null,
        bestAnswer: newBest,
    });
}
