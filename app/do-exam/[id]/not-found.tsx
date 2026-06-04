import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExamNotFound() {
	return (
		<div className="zenith-immersive min-h-screen text-slate-100 flex items-center justify-center px-4">
			<div className="absolute inset-0 zenith-grid opacity-40 pointer-events-none" />
			<div className="relative z-10 max-w-md w-full zenith-card p-8 text-center">
				<p className="text-sm text-rose-400 mb-3 font-semibold">404</p>
				<h1 className="font-display text-2xl font-bold text-white mb-2">Không tìm thấy đề thi</h1>
				<p className="text-slate-400 mb-6 text-sm">
					Đề thi có thể đã bị xóa hoặc đường dẫn không còn hợp lệ.
				</p>
				<Button asChild className="zenith-btn-glow w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 border-0">
					<Link href="/dashboard/teacher/quizzies">Quay về danh sách Quiz</Link>
				</Button>
			</div>
		</div>
	);
}
