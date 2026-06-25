"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Check, X, ShieldAlert, AlertTriangle, FileText, MessageSquare, Clock, RefreshCw } from "lucide-react";
import MathRenderer from "./MathRenderer";

type ModerationItem = {
  id: string;
  title?: string;
  postId?: string; // For comments
  authorName: string;
  anonymous: boolean;
  content: { text: string };
  createdAt: string;
  moderationStatus: string;
  moderationReason?: string;
};

type ReportItem = {
  id: string;
  targetType: "post" | "comment";
  targetId: string;
  reporterId: string;
  reason: string;
  details?: string;
  createdAt: string;
};

const REASON_LABELS: Record<string, string> = {
  spam: "Nội dung rác / quảng cáo",
  harassment: "Quấy rối / công kích",
  hate_speech: "Ngôn từ kích động thù hận",
  inappropriate_content: "Nội dung học tập không phù hợp",
  other: "Lý do khác",
};

export default function ModerationQueue() {
  const [posts, setPosts] = useState<ModerationItem[]>([]);
  const [comments, setComments] = useState<ModerationItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  
  const [activeTab, setActiveTab] = useState<"posts" | "comments" | "reports">("posts");
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // Tải danh sách hàng đợi kiểm duyệt
  async function loadQueue() {
    setLoading(true);
    setActionError(null);
    try {
      const res = await fetch("/api/forum/moderation/resolve");
      if (!res.ok) throw new Error("Failed to fetch queue");
      const data = await res.json();
      setPosts(data.posts || []);
      setComments(data.comments || []);
      setReports(data.reports || []);
    } catch {
      setActionError("Không thể tải danh sách hàng đợi kiểm duyệt.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => loadQueue(), 0);
    return () => clearTimeout(timer);
  }, []);

  // Xử lý Phê duyệt hoặc Khóa nội dung
  async function handleAction(
    targetType: "post" | "comment",
    targetId: string,
    action: "approve" | "block"
  ) {
    let reason = "Được kiểm duyệt thủ công bởi Giáo viên/Admin.";
    
    if (action === "block") {
      const input = prompt("Nhập lý do khóa/từ chối nội dung này (tùy chọn):");
      if (input === null) return; // User cancelled
      if (input.trim()) reason = input.trim();
    }

    setActionError(null);
    setActionSuccess(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/forum/moderation/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetType, targetId, action, reason }),
        });

        const data = await res.json();
        if (!res.ok) {
          setActionError(data.error || "Thao tác kiểm duyệt thất bại.");
          return;
        }

        setActionSuccess(`Đã xử lý thành công: ${action === "approve" ? "Phê duyệt" : "Khóa"}`);
        setTimeout(() => setActionSuccess(null), 3000);
        
        // Cập nhật lại danh sách local
        if (targetType === "post") {
          setPosts(posts.filter((p) => p.id !== targetId));
        } else {
          setComments(comments.filter((c) => c.id !== targetId));
        }
        // Xóa các reports liên quan
        setReports(reports.filter((r) => r.targetId !== targetId));
      } catch {
        setActionError("Lỗi kết nối mạng.");
      }
    });
  }

  return (
    <div className="space-y-5">
      {/* Toast Feedback */}
      {actionSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl p-3 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-3 text-xs flex items-center gap-2">
          <X className="w-4 h-4 text-red-400" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Tabs list */}
      <div className="flex items-center gap-1.5 border-b border-white/6 pb-px">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition ${
            activeTab === "posts"
              ? "border-indigo-500 text-indigo-300 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          Bài viết chờ duyệt ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition ${
            activeTab === "comments"
              ? "border-indigo-500 text-indigo-300 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Bình luận chờ duyệt ({comments.length})
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition ${
            activeTab === "reports"
              ? "border-indigo-500 text-indigo-300 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Báo cáo vi phạm ({reports.length})
        </button>

        <button
          onClick={loadQueue}
          disabled={loading}
          className="ml-auto p-1.5 text-slate-400 hover:text-white transition disabled:opacity-40"
          title="Làm mới hàng đợi"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Content panel */}
      {loading ? (
        <div className="border border-white/6 bg-white/[0.01] rounded-2xl p-12 text-center text-slate-400 text-sm">
          Đang tải dữ liệu hàng đợi kiểm duyệt...
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === "posts" && (
            posts.length === 0 ? (
              <div className="border border-white/6 bg-white/[0.01] rounded-2xl p-8 text-center text-slate-400 text-sm">
                Không có bài viết nào đang chờ duyệt.
              </div>
            ) : (
              posts.map((p) => (
                <div key={p.id} className="border border-white/8 bg-white/[0.02] rounded-2xl p-5 space-y-3 relative group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <h4 className="text-white text-base font-bold">{p.title}</h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>Tác giả: <b>{p.authorName}</b> {p.anonymous ? "(Ẩn danh)" : ""}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(p.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAction("post", p.id, "approve")}
                        disabled={isPending}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 hover:text-white rounded-xl transition"
                        title="Phê duyệt bài"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction("post", p.id, "block")}
                        disabled={isPending}
                        className="p-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-xl transition"
                        title="Khóa/Từ chối bài"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/25 border border-white/5 rounded-xl p-3.5 text-sm text-slate-200">
                    <MathRenderer text={p.content.text} />
                  </div>

                  {p.moderationReason && (
                    <div className="text-xs text-amber-300/90 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex items-start gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">AI Flagged:</span> {p.moderationReason}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )
          )}

          {activeTab === "comments" && (
            comments.length === 0 ? (
              <div className="border border-white/6 bg-white/[0.01] rounded-2xl p-8 text-center text-slate-400 text-sm">
                Không có bình luận nào đang chờ duyệt.
              </div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="border border-white/8 bg-white/[0.02] rounded-2xl p-5 space-y-3 relative group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-indigo-300">Dưới bài viết: {c.postId}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Người viết: <b>{c.authorName}</b> {c.anonymous ? "(Ẩn danh)" : ""}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAction("comment", c.id, "approve")}
                        disabled={isPending}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 hover:text-white rounded-xl transition"
                        title="Phê duyệt bình luận"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction("comment", c.id, "block")}
                        disabled={isPending}
                        className="p-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-xl transition"
                        title="Khóa/Từ chối bình luận"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/25 border border-white/5 rounded-xl p-3.5 text-sm text-slate-200">
                    <MathRenderer text={c.content.text} />
                  </div>

                  {c.moderationReason && (
                    <div className="text-xs text-amber-300/90 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 flex items-start gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">AI Flagged:</span> {c.moderationReason}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )
          )}

          {activeTab === "reports" && (
            reports.length === 0 ? (
              <div className="border border-white/6 bg-white/[0.01] rounded-2xl p-8 text-center text-slate-400 text-sm">
                Không có báo cáo vi phạm nào chưa xử lý.
              </div>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="border border-white/8 bg-red-500/5 rounded-2xl p-5 space-y-3 relative group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Báo cáo: {REASON_LABELS[r.reason] || r.reason}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Đối tượng: <b>{r.targetType === "post" ? "Bài viết" : "Bình luận"}</b> (ID: {r.targetId})</span>
                        <span>•</span>
                        <span>Người báo cáo (User ID): {r.reporterId}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(r.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAction(r.targetType, r.targetId, "approve")}
                        disabled={isPending}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 hover:text-white rounded-xl text-xs font-semibold transition"
                        title="Bỏ qua báo cáo và giữ lại nội dung"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Bỏ qua (Giữ lại)
                      </button>
                      <button
                        onClick={() => handleAction(r.targetType, r.targetId, "block")}
                        disabled={isPending}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-xl text-xs font-semibold transition"
                        title="Khóa nội dung vi phạm"
                      >
                        <X className="w-3.5 h-3.5" />
                        Khóa nội dung
                      </button>
                    </div>
                  </div>

                  {r.details && (
                    <div className="bg-black/20 border border-white/5 rounded-xl p-3 text-xs text-slate-300">
                      <span className="font-semibold text-slate-400">Chi tiết báo cáo:</span> {r.details}
                    </div>
                  )}
                </div>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
}
