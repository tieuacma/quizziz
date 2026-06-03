import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 px-4">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-8 text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-300" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">
          Đang tải quiz...
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Chuẩn bị câu hỏi và xáo trộn nội dung
        </p>
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-2 w-3/4 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-2 w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-2 w-full animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
