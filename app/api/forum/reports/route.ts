import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMongoDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST /api/forum/reports
export async function POST(req: Request) {
    const session = await getSession();
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body)
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const targetType = body.targetType === "comment" ? "comment" : "post";
    const targetIdRaw = body.targetId ? String(body.targetId) : "";
    const reason = String(body.reason ?? "other").trim();
    const details = String(body.details ?? "").trim();

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
    const reportsCol = db.collection("reports");
    const postsCol = db.collection("posts");
    const commentsCol = db.collection("comments");

    type TargetDoc = {
        moderationStatus?: "approved" | "pending" | "blocked";
        postId?: ObjectId;
    };

    // 1. Kiểm tra đối tượng báo cáo có tồn tại không
    let targetDoc: TargetDoc | null = null;

    if (targetType === "post") {
        targetDoc = (await postsCol.findOne({
            _id: targetId,
        })) as TargetDoc | null;
    } else {
        targetDoc = (await commentsCol.findOne({
            _id: targetId,
        })) as TargetDoc | null;
    }

    if (!targetDoc) {
        return NextResponse.json(
            { error: "Đối tượng bị báo cáo không tồn tại." },
            { status: 404 }
        );
    }

    // 2. Kiểm tra xem người dùng đã báo cáo đối tượng này chưa (Deduplication)
    const existingReport = await reportsCol.findOne({
        targetType,
        targetId,
        reporterId: session.userId,
    });

    if (existingReport) {
        return NextResponse.json(
            { error: "Bạn đã gửi báo cáo vi phạm cho nội dung này rồi." },
            { status: 400 }
        );
    }

    // 3. Ghi nhận báo cáo mới
    const now = new Date();
    await reportsCol.insertOne({
        targetType,
        targetId,
        reporterId: session.userId,
        reason,
        details,
        status: "open",
        moderatorNotes: "",
        createdAt: now,
        updatedAt: now,
    });

    // 4. Kiểm tra tổng số lượng báo cáo (ngưỡng báo cáo tự động chuyển Pending)
    const reportCount = await reportsCol.countDocuments({
        targetType,
        targetId,
        status: "open",
    });

    let statusChanged = false;
    if (reportCount >= 3) {
        // Tự động chuyển sang Pending (Chờ duyệt)
        if (targetType === "post") {
            if (targetDoc?.moderationStatus === "approved") {
                await postsCol.updateOne(
                    { _id: targetId },
                    {
                        $set: {
                            moderationStatus: "pending",
                            moderationReason: `Bị báo cáo vi phạm liên tục (${reportCount} báo cáo).`,
                        },
                    }
                );
                statusChanged = true;
            }
        } else {
            if (targetDoc?.moderationStatus === "approved") {
                await commentsCol.updateOne(
                    { _id: targetId },
                    {
                        $set: {
                            moderationStatus: "pending",
                            moderationReason: `Bị báo cáo vi phạm liên tục (${reportCount} báo cáo).`,
                        },
                    }
                );

                // Trừ bớt commentCount của bài viết gốc
                if (targetDoc?.postId) {
                    await postsCol.updateOne(
                        { _id: targetDoc.postId },
                        { $inc: { "meta.commentCount": -1 } }
                    );
                }

                statusChanged = true;
            }
        }
    }

    return NextResponse.json({
        ok: true,
        reportCount,
        statusChanged,
        message: statusChanged
            ? "Báo cáo thành công. Nội dung đã bị tạm ẩn để kiểm duyệt."
            : "Báo cáo thành công. Ban quản trị sẽ rà soát nội dung này.",
    });
}
