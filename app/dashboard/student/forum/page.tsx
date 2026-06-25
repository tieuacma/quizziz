import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMongoDb } from "@/lib/mongodb";
import PostComposer from "@/components/forum/PostComposer";
import ForumList from "@/components/forum/ForumList";

interface Props {
  searchParams: Promise<{
    limit?: string;
    page?: string;
    sort?: string;
    search?: string;
    classId?: string;
  }>;
}

type UnknownRecord = Record<string, unknown>;

type StudentForumPostDoc = {
  _id: { toString: () => string };
  title: string;
  authorId: string;
  authorName?: string;
  anonymous: boolean;
  createdAt: Date;
  moderationStatus?: string;
  content?: { hasMath?: boolean };
  classScope?: { classId?: string; name?: string } | null;
  meta?: { views?: number; voteScore?: number; commentCount?: number };
};

type PostsFilter = UnknownRecord & {
  deletedAt: null;
  $or: Array<{ moderationStatus: string } | { authorId: string }>;
  $and?: Array<UnknownRecord>;
};

export default async function StudentForumPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "student") redirect("/dashboard");

  const resolvedSearchParams = await searchParams;
  const limit = Math.min(Math.max(Number(resolvedSearchParams.limit ?? 10), 1), 50);
  const page = Math.max(Number(resolvedSearchParams.page ?? 1), 1);
  const sort = resolvedSearchParams.sort ?? "new";
  const search = resolvedSearchParams.search ?? "";
  const classId = resolvedSearchParams.classId ?? "";

  const db = await getMongoDb();
  const postsCol = db.collection("posts");

  // Bộ lọc bảo mật của Học sinh: Chỉ xem bài Approved HOẶC bài do chính mình viết
  const baseFilter: PostsFilter = {
    deletedAt: null,
    $or: [
      { moderationStatus: "approved" },
      { authorId: session.userId },
    ],
  };

  let filter2: PostsFilter = { ...baseFilter };

  // Áp dụng điều kiện Tìm kiếm
  if (search.trim()) {
    const searchRegex = { $regex: search.trim(), $options: "i" };
    const searchCond = {
      $or: [{ title: searchRegex }, { "content.text": searchRegex }],
    };

    filter2 = {
      ...filter2,
      $and: [
        // keep student $or privacy rule
        { $or: filter2.$or },
        searchCond,
        { deletedAt: null },
      ],
    };
  }

  // Áp dụng bộ lọc lớp học
  if (classId) {
    const andArr = filter2.$and ?? [];
    andArr.push({ "classScope.classId": classId });
    filter2.$and = andArr;
  }

  // Xác định sắp xếp
  let sortSpec: Record<string, 1 | -1> = { createdAt: -1 };
  if (sort === "top") {
    sortSpec = { "meta.voteScore": -1, createdAt: -1 };
  } else if (sort === "hot") {
    sortSpec = { "meta.commentCount": -1, "meta.views": -1, createdAt: -1 };
  }

  let items: StudentForumPostDoc[] = [];
  try {
    items = (await postsCol
      .find(filter2 as UnknownRecord)
      .sort(sortSpec)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()) as unknown as StudentForumPostDoc[];
  } catch (err) {
    console.error("Direct MongoDB read failed in StudentForumPage:", err);
  }

  const posts = items.map((doc) => {
    const isAuthor = session.userId === doc.authorId;
    const showIdentity = !doc.anonymous || isAuthor;

    return {
      id: doc._id.toString(),
      title: doc.title,
      authorId: showIdentity ? doc.authorId : "",
      authorName: showIdentity ? (doc.authorName ?? "Thành viên") : "Học sinh ẩn danh",
      anonymous: doc.anonymous,
      createdAt: doc.createdAt.toISOString(),
      moderationStatus: doc.moderationStatus ?? "approved",
      hasMath: doc.content?.hasMath ?? false,
      classScope: doc.classScope,
      meta: {
        views: doc.meta?.views ?? 0,
        voteScore: doc.meta?.voteScore ?? 0,
        commentCount: doc.meta?.commentCount ?? 0,
      },
    };
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <div className="text-white text-2xl font-bold flex items-center gap-2">
          <span>📚</span>
          <span>Diễn đàn thảo luận học tập</span>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          Nơi học sinh trao đổi kiến thức, giải đáp các thắc mắc toán học và tài liệu học tập.
        </p>
      </div>

      <PostComposer />

      <div className="border border-white/8 bg-white/[0.01] rounded-2xl p-5 space-y-4">
        <h3 className="text-white text-sm font-bold flex items-center gap-2">
          <span>💬</span>
          <span>Các chủ đề thảo luận sôi nổi</span>
        </h3>
        <ForumList posts={posts} />
      </div>
    </div>
  );
}

