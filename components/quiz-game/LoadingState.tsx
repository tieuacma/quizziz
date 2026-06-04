import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="zenith-immersive min-h-dvh w-full flex items-center justify-center px-4">
      <div className="absolute inset-0 zenith-grid opacity-40 pointer-events-none" />
      <div className="relative z-10 w-full max-w-md zenith-card rounded-[32px] p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-600/20 border border-violet-500/30 shadow-[0_0_24px_rgba(139,92,246,0.25)]">
          <Loader2 className="h-10 w-10 animate-spin text-violet-300" />
        </div>
        <h2 className="font-display text-2xl font-extrabold text-white mb-2">
          Đang tải quiz...
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Chuẩn bị câu hỏi và xáo trộn nội dung
        </p>
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-2 w-3/4 animate-pulse rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600" />
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-2 w-1/2 animate-pulse rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600" />
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-2 w-full animate-pulse rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
