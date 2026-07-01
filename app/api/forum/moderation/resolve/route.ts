import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMongoDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST /api/forum/moderation/resolve
export async function POST(req: Request) {
    const session = await getSession();
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Phân quyền: Chỉ Giáo viên hoặc Admin được thao tác kiểm duyệt thủ công
    const isModerator =
        session.role === "teacher" || (session.role as string) === "admin";
    if (!isModerator) {
        return NextResponse.json(
            { error: "Bạn không có quyền thực hiện hành động này." },
            { status: 403 }
        );
    }

    const body = await req.json().catch(() => null);
    if (!body)
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const targetType = body.targetType === "comment" ? "comment" : "post";
    const targetIdRaw = body.targetId ? String(body.targetId) : "";
    const action = body.action === "block" ? "blocked" : "approved"; // 'approved' | 'blocked'
    const reason = String(
        body.reason ?? "Được kiểm duyệt thủ công bởi Giáo viên/Admin."
    ).trim();

    if (!targetIdRaw)
        return NextResponse.json(
            { error: "targetId required" },
            { status: 400 }
        );

    let targetId: ObjectId;
    try {
        targetId = new ObjectId(targetIdRaw);
    } catch {
        return NextResponse.json(
            { error: "ID đối tượng không hợp lệ." },
            { status: 400 }
        );
    }

    const db = await getMongoDb();
    const postsCol = db.collection("posts");
    const commentsCol = db.collection("comments");
    const reportsCol = db.collection("reports");

    if (targetType === "post") {
        const postDoc = await postsCol.findOne({ _id: targetId });
        if (!postDoc)
            return NextResponse.json(
                { error: "Bài viết không tồn tại." },
                { status: 404 }
            );

        // Cập nhật trạng thái bài viết
        await postsCol.updateOne(
            { _id: targetId },
            {
                $set: {
                    moderationStatus: action,
                    moderationReason: reason,
                    updatedAt: new Date(),
                },
            }
        );
    } else {
        const commentDoc = await commentsCol.findOne({ _id: targetId });
        if (!commentDoc)
            return NextResponse.json(
                { error: "Bình luận không tồn tại." },
                { status: 404 }
            );

        const oldStatus = commentDoc.moderationStatus;

        // Cập nhật trạng thái bình luận
        await commentsCol.updateOne(
            { _id: targetId },
            {
                $set: {
                    moderationStatus: action,
                    moderationReason: reason,
                    updatedAt: new Date(),
                },
            }
        );

        // Đồng bộ trường commentCount trong bài viết gốc
        if (action === "approved" && oldStatus !== "approved") {
            await postsCol.updateOne(
                { _id: commentDoc.postId },
                { $inc: { "meta.commentCount": 1 } }
            );
        } else if (action === "blocked" && oldStatus === "approved") {
            await postsCol.updateOne(
                { _id: commentDoc.postId },
                { $inc: { "meta.commentCount": -1 } }
            );
        }
    }

    // Cập nhật tất cả các báo cáo liên quan thành resolved/dismissed
    const reportStatus = action === "blocked" ? "resolved" : "dismissed";
    await reportsCol.updateMany(
        { targetType, targetId, status: "open" },
        {
            $set: {
                status: reportStatus,
                moderatorNotes: `Đã xử lý bởi ${session.name} (${session.role}). Quyết định: ${action}. Lý do: ${reason}`,
                updatedAt: new Date(),
            },
        }
    );

    return NextResponse.json({
        ok: true,
        action,
        message: `Đã cập nhật trạng thái thành công sang: ${action}`,
    });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: Request) {
    // req is required by Next.js route handler signature but not used in body
    const session = await getSession();
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isModerator =
        session.role === "teacher" || (session.role as string) === "admin";
    if (!isModerator) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = await getMongoDb();
    const postsCol = db.collection("posts");
    const commentsCol = db.collection("comments");

    // Lấy các bài viết và bình luận đang ở trạng thái 'pending' hoặc bị báo cáo vi phạm
    const pendingPosts = await postsCol
        .find({ moderationStatus: "pending", deletedAt: null })
        .toArray();
    const pendingComments = await commentsCol
        .find({ moderationStatus: "pending", deletedAt: null })
        .toArray();

    // Lấy danh sách báo cáo còn mở
    const openReports = await db
        .collection("reports")
        .find({ status: "open" })
        .toArray();

    return NextResponse.json({
        posts: pendingPosts.map((p) => ({
            id: p._id.toString(),
            title: p.title,
            authorName: p.authorName ?? "Thành viên",
            anonymous: p.anonymous,
            content: p.content,
            createdAt: p.createdAt,
            moderationStatus: p.moderationStatus,
            moderationReason: p.moderationReason,
        })),
        comments: pendingComments.map((c) => ({
            id: c._id.toString(),
            postId: c.postId.toString(),
            authorName: c.authorName ?? "Thành viên",
            anonymous: c.anonymous,
            content: c.content,
            createdAt: c.createdAt,
            moderationStatus: c.moderationStatus,
            moderationReason: c.moderationReason,
        })),
        reports: openReports.map((r) => ({
            id: r._id.toString(),
            targetType: r.targetType,
            targetId: r.targetId.toString(),
            reporterId: r.reporterId,
            reason: r.reason,
            details: r.details,
            createdAt: r.createdAt,
        })),
    });
}
