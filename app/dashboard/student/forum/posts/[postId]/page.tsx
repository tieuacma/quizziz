import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMongoDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import PostInteractiveDetail from "@/components/forum/PostInteractiveDetail";

type PostPageProps = {
  params: Promise<{ postId: string }>;
};

type PostDoc = {
  _id: ObjectId;
  authorId: string;
  authorName?: string;
  anonymous: boolean;
  classScope?: { classId?: string; name?: string } | null;
  title: string;
  content?: {
    text?: string;
    attachments?: unknown[];
    hasMath?: boolean;
  };
  createdAt: Date;
  bestAnswer?: {
    commentId: ObjectId;
    acceptedBy: string;
    acceptedAt: Date;
  } | null;
  moderationStatus: string;
  deletedAt: string | null;
  meta?: { views?: number; voteScore?: number; commentCount?: number };
  commentCount?: number;
  voteScore?: number;
};

type VoteDoc = {
  targetId: ObjectId;
  value: string;
};

type CommentDoc = {
  _id: ObjectId;
  postId: ObjectId;
  authorId: string;
  authorName?: string;
  anonymous: boolean;
  content?: { text?: string };
  parentCommentId?: ObjectId | null;
  ancestorCommentId?: ObjectId | null;
  voteScore?: number;
  moderationStatus: string;
  createdAt: Date;
  deletedAt: Date | null;
};

export default async function PostDetailPage({ params }: PostPageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { postId } = await params;
  if (!postId) notFound();

  const db = await getMongoDb();
  const postsCol = db.collection("posts");
  const commentsCol = db.collection("comments");

  let _id: ObjectId;
  try {
    _id = new ObjectId(postId);
  } catch {
    notFound();
  }

  await postsCol.updateOne({ _id }, { $inc: { "meta.views": 1 } });

  const postDoc = (await postsCol.findOne({ _id })) as PostDoc | null;
  if (!postDoc || postDoc.deletedAt !== null) {
    notFound();
  }

  const isAuthor = session.userId === postDoc.authorId;
  const isTeacherOrAdmin = session.role === "teacher" || session.role === "admin";

  if (postDoc.moderationStatus !== "approved" && !isAuthor && !isTeacherOrAdmin) {
    notFound();
  }

  type CommentQuery = {
    postId: ObjectId;
    deletedAt: null;
    moderationStatus?: string;
    $or?: Array<{ moderationStatus: string } | { authorId: string }>;
  };

  const commentQuery: CommentQuery = { postId: _id, deletedAt: null };

  if (!isTeacherOrAdmin) {
    commentQuery.$or = [
      { moderationStatus: "approved" },
      { authorId: session.userId },
    ];
  }

  const commentDocs = (await commentsCol
    .find(commentQuery as unknown as Record<string, unknown>)
    .sort({ createdAt: 1 })
    .toArray()) as CommentDoc[];

  const showPostIdentity = !postDoc.anonymous || isAuthor || isTeacherOrAdmin;
  const mappedPost = {
    id: postDoc._id.toString(),
    authorId: showPostIdentity ? postDoc.authorId : "",
    authorName: showPostIdentity ? (postDoc.authorName ?? "Thành viên") : "Học sinh ẩn danh",
    anonymous: postDoc.anonymous,
    classScope: postDoc.classScope,
    title: postDoc.title,
    content: {
      text: postDoc.content?.text ?? "",
      attachments: (postDoc.content?.attachments ?? []) as Array<{ name: string; url: string; size: number; mimeType: string }>,
      hasMath: postDoc.content?.hasMath ?? false,
    },
    createdAt: postDoc.createdAt.toISOString(),
    bestAnswer: postDoc.bestAnswer
      ? {
          commentId: postDoc.bestAnswer.commentId.toString(),
          acceptedBy: postDoc.bestAnswer.acceptedBy as "teacher" | "author",
          acceptedAt: postDoc.bestAnswer.acceptedAt.toISOString(),
        }
      : null,
    moderationStatus: postDoc.moderationStatus,
    meta: {
      views: postDoc.meta?.views ?? 0,
      voteScore: postDoc.meta?.voteScore ?? 0,
      commentCount: postDoc.meta?.commentCount ?? 0,
    },
  };

  const mappedComments = commentDocs.map((c) => {
    const isCommentAuthor = session.userId === c.authorId;
    const showCommentIdentity = !c.anonymous || isCommentAuthor || isTeacherOrAdmin;

    return {
      id: c._id.toString(),
      postId: c.postId.toString(),
      authorId: showCommentIdentity ? c.authorId : "",
      authorName: showCommentIdentity ? (c.authorName ?? "Thành viên") : "Học sinh ẩn danh",
      anonymous: c.anonymous,
      parentCommentId: c.parentCommentId ? c.parentCommentId.toString() : null,
      ancestorCommentId: c.ancestorCommentId ? c.ancestorCommentId.toString() : null,
      content: { text: c.content?.text ?? "" },
      voteScore: c.voteScore ?? 0,
      moderationStatus: c.moderationStatus,
      createdAt: c.createdAt.toISOString(),
    };
  });

  const votes = await db
    .collection("votes")
    .find({
      userId: session.userId,
      $or: [
        { targetType: "post", targetId: _id },
        { targetType: "comment", targetId: { $in: commentDocs.map((c) => c._id) } },
      ],
    })
    .toArray();

  const userVotes: Record<string, number> = {};
  votes.forEach((v) => {
    const vote = v as unknown as VoteDoc;
    userVotes[vote.targetId.toString()] = vote.value === "down" ? -1 : 1;
  });

  const currentUser = {
    userId: session.userId,
    role: session.role,
    name: session.name,
  };

  return (
    <PostInteractiveDetail
      initialPost={mappedPost}
      initialComments={mappedComments}
      initialUserVotes={userVotes}
      currentUser={currentUser}
    />
  );
}

