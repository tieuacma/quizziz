"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, FileQuestion, Play, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExamQuizData } from "@/lib/getExamData";
import { formatDuration } from "./exam-utils";

type Props = {
	metadata: ExamQuizData["metadata"];
	questionCount: number;
	examTimeLimit: number;
	onStart: () => void;
};

export default function ExamPreStart({
	metadata,
	questionCount,
	examTimeLimit,
	onStart,
}: Props) {
	return (
		<div className="zenith-immersive min-h-dvh w-full flex items-center justify-center text-white relative overflow-hidden select-none px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
			<div className="absolute inset-0 z-0 zenith-grid opacity-40 pointer-events-none" />
			<div className="pointer-events-none absolute inset-0 z-0 opacity-50 blur-3xl">
				<div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-violet-500/20 animate-[float1_12s_ease-in-out_infinite]" />
				<div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-fuchsia-500/15 animate-[float2_14s_ease-in-out_infinite]" />
			</div>

			<motion.div
				className="max-w-lg w-full zenith-card rounded-[28px] p-8 md:p-10 text-center z-10"
				initial={{ opacity: 0, scale: 0.96, y: 16 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{ duration: 0.45, ease: "easeOut" }}
			>
				<div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.25)] ring-1 ring-white/10">
					<BookOpen className="w-8 h-8 text-violet-300" />
				</div>

				<p className="text-[10px] font-black text-violet-300/80 uppercase tracking-[0.2em] mb-2">
					Phòng thi Zenith
				</p>
				<h1 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
					{metadata.title}
				</h1>
				{metadata.description ? (
					<p className="text-slate-400 text-sm mb-6 leading-relaxed">{metadata.description}</p>
				) : (
					<p className="text-slate-500 text-sm mb-6">
						Chế độ thi thử bảo mật — đáp án chấm trên server.
					</p>
				)}

				<div className="grid grid-cols-2 gap-3 mb-6 text-left">
					<div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
						<div className="flex items-center gap-2 text-violet-300 mb-1">
							<FileQuestion className="w-4 h-4" />
							<span className="text-[10px] font-bold uppercase tracking-wider">Số câu</span>
						</div>
						<p className="text-lg font-bold text-white">{questionCount}</p>
					</div>
					<div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
						<div className="flex items-center gap-2 text-fuchsia-300 mb-1">
							<Clock className="w-4 h-4" />
							<span className="text-[10px] font-bold uppercase tracking-wider">Thời gian</span>
						</div>
						<p className="text-lg font-bold text-white">{formatDuration(examTimeLimit)}</p>
					</div>
				</div>

				<div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-left mb-8">
					<Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
					<p className="text-xs text-emerald-100/90 leading-relaxed">
						Tiến độ được lưu tạm trên thiết bị. Hết giờ hệ thống tự nộp bài. Sau khi nộp không thể sửa đáp án.
					</p>
				</div>

				<motion.div
					animate={{ scale: [1, 1.02, 1] }}
					transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
				>
					<Button
						size="lg"
						className="zenith-btn-glow w-full min-h-11 h-14 text-base font-bold gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500 border-0"
						onClick={onStart}
					>
						<Play className="w-4 h-4 fill-white" />
						Bắt đầu làm bài
					</Button>
				</motion.div>
			</motion.div>
		</div>
	);
}
