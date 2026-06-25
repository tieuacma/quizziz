"use client";

import React, { useState, useTransition } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ReportModalProps {
  targetType: "post" | "comment";
  targetId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

const REASONS = [
  { value: "spam", label: "Nội dung rác, quảng cáo spam" },
  { value: "harassment", label: "Quấy rối, xúc phạm thành viên khác" },
  { value: "hate_speech", label: "Ngôn từ kích động thù hận, bạo lực" },
  { value: "inappropriate_content", label: "Nội dung không phù hợp với học tập" },
  { value: "other", label: "Lý do khác" },
];

export default function ReportModal({
  targetType,
  targetId,
  isOpen,
  onClose,
  onSuccess,
}: ReportModalProps) {
  const [reason, setReason] = useState("spam");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  async function submit() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/forum/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, reason, details }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "Gửi báo cáo thất bại.");
        return;
      }

      onSuccess(data?.message || "Báo cáo vi phạm thành công.");
      setDetails("");
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md border border-white/10 bg-[#0f172a]/95 text-white rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold">Báo cáo vi phạm</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-slate-300 text-xs font-medium mb-1.5">
              Chọn lý do báo cáo
            </label>
            <div className="space-y-2">
              {REASONS.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 hover:text-white transition p-2 rounded-xl hover:bg-white/[0.04]"
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={(e) => setReason(e.target.value)}
                    className="accent-red-500"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-medium mb-1.5">
              Chi tiết thêm (tùy chọn)
            </label>
            <textarea
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-red-500/50 transition min-h-[80px]"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Vui lòng cung cấp thêm thông tin chi tiết..."
            />
          </div>

          {error && <div className="text-red-400 text-xs">{error}</div>}

          <div className="flex items-center gap-3 mt-5 pt-3 border-t border-white/10">
            <button
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-xl border border-white/10 hover:bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={submit}
              disabled={isPending}
              className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
            >
              {isPending ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
