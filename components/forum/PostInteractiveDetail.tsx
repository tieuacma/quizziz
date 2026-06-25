"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronUp, ChevronDown, MessageSquare, ShieldAlert, Check, 
  Flag, Award, Clock, ArrowLeft, Paperclip, CheckCircle2 
} from "lucide-react";
import MathRenderer from "./MathRenderer";
import CommentComposer from "./CommentComposer";
import ReportModal from "./ReportModal";

type CommentItem = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  anonymous: boolean;
  parentCommentId: string | null;
  ancestorCommentId: string | null;
  content: { text: string };
  voteScore: number;
  moderationStatus: string;
  createdAt: string;
};

type PostDetail = {
  id: string;
  authorId: string;
  authorName: string;
  anonymous: boolean;
  title: string;
  content: {
    text: string;
    attachments?: Array<{ name: string; url: string; size: number; mimeType: string }>;
    hasMath?: boolean;
  };
  createdAt: string;
  bestAnswer?: {
    commentId: string;
    acceptedBy: "author" | "teacher";
    acceptedAt: string;
  } | null;
  moderationStatus: string;
  meta: {
    views: number;
    voteScore: number;
    commentCount: number;
  };
};

interface PostInteractiveDetailProps {
  initialPost: PostDetail;
  initialComments: CommentItem[];
  initialUserVotes: Record<string, number>;
  currentUser: {
    userId: string;
    role: "student" | "teacher" | "admin";
    name: string;
  };
}

interface CommentNode extends CommentItem {
  replies: CommentNode[];
}

export default function PostInteractiveDetail({
  initialPost,
  initialComments,
  initialUserVotes,
  currentUser,
}: PostInteractiveDetailProps) {
  const [post, setPost] = useState<PostDetail>(initialPost);
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [userVotes, setUserVotes] = useState<Record<string, number>>(initialUserVotes);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // States for reporting
  const [reportTarget, setReportTarget] = useState<{ type: "post" | "comment"; id: string } | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // 1. Dựng cấu trúc cây bình luận (Comment Tree)
  const commentMap: Record<string, CommentNode> = {};
  const rootComments: CommentNode[] = [];

  comments.forEach((c) => {
    commentMap[c.id] = { ...c, replies: [] };
  });

  comments.forEach((c) => {
    const node = commentMap[c.id];
    if (c.parentCommentId && commentMap[c.parentCommentId]) {
      commentMap[c.parentCommentId].replies.push(node);
    } else {
      rootComments.push(node);
    }
  });

  // 2. Hàm xử lý Vote (Optimistic Update)
  async function handleVote(targetType: "post" | "comment", targetId: string, voteType: "up" | "down") {
    const currentValue = userVotes[targetId] || 0; // 1: up, -1: down, 0: none
    const newValue = voteType === "up" ? 1 : -1;
    
    let nextValue = 0;
    let scoreDiff = 0;

    if (currentValue === newValue) {
      // Hủy vote
      nextValue = 0;
      scoreDiff = newValue === 1 ? -1 : 1;
    } else {
      // Đổi vote hoặc vote mới
      nextValue = newValue;
      scoreDiff = currentValue === 0 ? newValue : newValue * 2;
    }

    // Cập nhật Optimistic UI
    setUserVotes((prev) => ({ ...prev, [targetId]: nextValue }));
    if (targetType === "post") {
      setPost((prev) => ({
        ...prev,
        meta: { ...prev.meta, voteScore: prev.meta.voteScore + scoreDiff },
      }));
    } else {
      setComments((prev) =>
        prev.map((c) =>
          c.id === targetId ? { ...c, voteScore: c.voteScore + scoreDiff } : c
        )
      );
    }

    // Gửi yêu cầu lên server
    try {
      const res = await fetch("/api/forum/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          targetId,
          value: voteType,
        }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }
      const data = await res.json();
      // Đồng bộ kết quả thực tế từ DB
      setUserVotes((prev) => ({ ...prev, [targetId]: data.userVote }));
      if (targetType === "post") {
        setPost((prev) => ({
          ...prev,
          meta: { ...prev.meta, voteScore: data.newScore },
        }));
      } else {
        setComments((prev) =>
          prev.map((c) =>
            c.id === targetId ? { ...c, voteScore: data.newScore } : c
          )
        );
      }
    } catch {
      // Hoàn tác (Revert) nếu lỗi
      setUserVotes((prev) => ({ ...prev, [targetId]: currentValue }));
      const revertDiff = -scoreDiff;
      if (targetType === "post") {
        setPost((prev) => ({
          ...prev,
          meta: { ...prev.meta, voteScore: prev.meta.voteScore + revertDiff },
        }));
      } else {
        setComments((prev) =>
          prev.map((c) =>
            c.id === targetId ? { ...c, voteScore: c.voteScore + revertDiff } : c
          )
        );
      }
      setAlertMessage("Không thể gửi đánh giá. Vui lòng thử lại sau.");
    }
  }

  // 3. Chọn câu trả lời hữu ích nhất (Best Answer)
  async function handleMarkBestAnswer(commentId: string) {
    try {
      const res = await fetch(`/api/forum/posts/${post.id}/best-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAlertMessage(data.error || "Không thể thiết lập câu trả lời đúng.");
        return;
      }

      setPost((prev) => ({
        ...prev,
        bestAnswer: data.isBestAnswer ? data.bestAnswer : null,
      }));

      setAlertMessage(
        data.isBestAnswer
          ? "Đã đánh dấu câu trả lời tốt nhất thành công."
          : "Đã hủy đánh dấu câu trả lời tốt nhất."
      );
    } catch {
      setAlertMessage("Có lỗi xảy ra khi cập nhật câu trả lời tốt nhất.");
    }
  }

  // 4. Reload bình luận khi thêm mới thành công
  async function handleCommentAdded() {
    // Tải lại danh sách comments từ API chi tiết bài viết
    try {
      const res = await fetch(`/api/forum/posts/${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        setReplyingTo(null);
      }
    } catch (err) {
      console.error("Failed to refresh comments:", err);
    }
  }

  // Render một Node bình luận đệ quy
  function renderComment(node: CommentNode, depth: number = 0) {
    const isVotedUp = userVotes[node.id] === 1;
    const isVotedDown = userVotes[node.id] === -1;
    const isBest = post.bestAnswer?.commentId === node.id;
    const isAuthor = currentUser.userId === post.authorId;
    const isTeacher = currentUser.role === "teacher";

    // Thụt lề tối đa 3 cấp để tránh vỡ giao diện điện thoại
    const indentClass = depth === 0 ? "" : depth === 1 ? "ml-4 sm:ml-6" : depth === 2 ? "ml-8 sm:ml-12" : "ml-12";

    return (
      <div key={node.id} className={`space-y-3 pt-2 ${indentClass}`}>
        <div className={`border border-white/8 rounded-xl p-4 bg-white/[0.01] hover:bg-white/[0.03] transition relative group ${
          isBest ? "border-amber-500/30 bg-amber-500/[0.02]" : ""
        }`}>
          {isBest && (
            <div className="absolute top-0 right-0 bg-amber-500/20 border-b border-l border-amber-500/30 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Học hữu ích nhất
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs text-indigo-300 font-bold">
                {node.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className={`text-xs font-semibold ${node.anonymous ? "text-slate-400 italic" : "text-slate-200"}`}>
                  {node.authorName}
                </span>
                <span className="text-[10px] text-slate-400 block sm:inline sm:ml-2">
                  {new Date(node.createdAt).toLocaleDateString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit"
                  })}
                </span>
              </div>
            </div>

            {node.moderationStatus !== "approved" && (
              <span className="text-[9px] font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-400">
                {node.moderationStatus === "pending" ? "Chờ duyệt" : "Bị chặn"}
              </span>
            )}
          </div>

          <div className="mt-3 text-slate-200 text-sm pl-1">
            <MathRenderer text={node.content.text} />
          </div>

          {/* Comment actions bar */}
          <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-white/5">
            {/* Voting comment */}
            <div className="flex items-center gap-1 bg-black/10 border border-white/5 rounded-lg px-1.5 py-0.5">
              <button
                onClick={() => handleVote("comment", node.id, "up")}
                className={`p-1 hover:text-indigo-400 transition ${isVotedUp ? "text-indigo-400" : "text-slate-400"}`}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-300 min-w-[12px] text-center">
                {node.voteScore}
              </span>
              <button
                onClick={() => handleVote("comment", node.id, "down")}
                className={`p-1 hover:text-red-400 transition ${isVotedDown ? "text-red-400" : "text-slate-400"}`}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Quick reply, Mark best, Report triggers */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <button
                onClick={() => setReplyingTo(replyingTo === node.id ? null : node.id)}
                className="hover:text-indigo-300 transition flex items-center gap-1 font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Phản hồi
              </button>

              {(isAuthor || isTeacher) && (
                <button
                  onClick={() => handleMarkBestAnswer(node.id)}
                  className={`hover:text-amber-300 transition flex items-center gap-1 font-medium ${
                    isBest ? "text-amber-300 font-bold" : ""
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  {isBest ? "Bỏ ghim đáp án" : "Đáp án đúng"}
                </button>
              )}

              {currentUser.userId !== node.authorId && (
                <button
                  onClick={() => setReportTarget({ type: "comment", id: node.id })}
                  className="hover:text-red-400 transition flex items-center gap-1 font-medium"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Báo cáo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inline reply composer */}
        {replyingTo === node.id && (
          <div className="ml-4 border-l border-white/8 pl-3 py-1">
            <CommentComposer
              postId={post.id}
              parentCommentId={node.id}
              onSubmitted={handleCommentAdded}
            />
          </div>
        )}

        {/* Render child replies */}
        {node.replies.length > 0 && (
          <div className="space-y-2 mt-2 border-l border-white/5 pl-2 sm:pl-3">
            {node.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  const isPostVotedUp = userVotes[post.id] === 1;
  const isPostVotedDown = userVotes[post.id] === -1;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Toast Alert message */}
      {alertMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#0f172a] border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{alertMessage}</span>
          <button onClick={() => setAlertMessage(null)} className="ml-2 text-slate-400 hover:text-white text-xs">×</button>
        </div>
      )}

      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/student/forum"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại diễn đàn
        </Link>

        {post.moderationStatus !== "approved" && (
          <div className="text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 flex items-center gap-1.5 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            Trạng thái bài viết: {post.moderationStatus === "pending" ? "Đang chờ duyệt" : "Bị chặn"}
          </div>
        )}
      </div>

      {/* Post content body */}
      <div className="border border-white/8 bg-gradient-to-b from-white/[0.03] to-white/[0.01] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500" />
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1.5">
              <h2 className="text-white text-xl font-bold leading-snug">{post.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{post.authorName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}
                </span>
                <span>•</span>
                <span>{post.meta.views} lượt xem</span>
              </div>
            </div>
            {post.bestAnswer && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 self-start sm:self-auto shadow-sm">
                <Check className="w-4 h-4 text-emerald-400" />
                Đã có câu trả lời đúng
              </div>
            )}
          </div>

          {/* Main post text content */}
          <div className="text-slate-100 text-base leading-relaxed pl-0.5 mt-2 prose prose-invert">
            <MathRenderer text={post.content.text} />
          </div>

          {/* Post Attachments */}
          {post.content.attachments && post.content.attachments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/6 space-y-2">
              <div className="text-xs font-bold text-slate-400">Tài liệu đính kèm:</div>
              <div className="flex flex-wrap gap-3">
                {post.content.attachments.map((file) => (
                  <a
                    key={file.name}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.04] border border-white/8 hover:bg-white/[0.08] hover:border-white/12 rounded-xl text-xs text-slate-200 transition"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-medium max-w-[200px] truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-400">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Post voting and flagging toolbar */}
          <div className="flex items-center justify-between border-t border-white/6 pt-4 mt-3">
            {/* Voting */}
            <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl px-2.5 py-1">
              <button
                onClick={() => handleVote("post", post.id, "up")}
                className={`p-1.5 hover:text-indigo-400 transition ${isPostVotedUp ? "text-indigo-400 scale-110" : "text-slate-400"}`}
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-slate-200 min-w-[20px] text-center">
                {post.meta.voteScore}
              </span>
              <button
                onClick={() => handleVote("post", post.id, "down")}
                className={`p-1.5 hover:text-red-400 transition ${isPostVotedDown ? "text-red-400 scale-110" : "text-slate-400"}`}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Flagging post */}
            {currentUser.userId !== post.authorId && (
              <button
                onClick={() => setReportTarget({ type: "post", id: post.id })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 rounded-xl transition font-medium"
              >
                <Flag className="w-3.5 h-3.5" />
                Báo cáo bài viết
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Discussion comments area */}
      <div className="border border-white/8 bg-white/[0.01] rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
        <h3 className="text-white text-base font-bold flex items-center gap-2 border-b border-white/6 pb-3">
          <span>💬</span>
          <span>Bình luận ({comments.length})</span>
        </h3>

        {comments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-white/6 rounded-xl">
            Chưa có bình luận nào dưới chủ đề này. Hãy là người trả lời đầu tiên!
          </div>
        ) : (
          <div className="space-y-4">
            {rootComments.map((node) => renderComment(node, 0))}
          </div>
        )}

        {/* Global comment composer */}
        <div className="pt-4 border-t border-white/5">
          <CommentComposer
            postId={post.id}
            onSubmitted={handleCommentAdded}
          />
        </div>
      </div>

      {/* Report Modal Component */}
      <ReportModal
        targetType={reportTarget?.type || "post"}
        targetId={reportTarget?.id || ""}
        isOpen={reportTarget !== null}
        onClose={() => setReportTarget(null)}
        onSuccess={(msg) => {
          setAlertMessage(msg);
          // Refresh data if needed (e.g. if the post was auto-moderated to pending due to report count)
          handleCommentAdded();
        }}
      />
    </div>
  );
}
