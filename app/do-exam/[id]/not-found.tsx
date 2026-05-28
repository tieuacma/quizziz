import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExamNotFound() {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
			<div className="max-w-md w-full rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl">
				<p className="text-sm text-rose-400 mb-3">404</p>
				<h1 className="text-2xl font-semibold mb-2">Không tìm thấy đề thi</h1>
				<p className="text-slate-400 mb-6">
					Đề thi có thể đã bị xóa hoặc đường dẫn không còn hợp lệ.
				</p>
				<Button asChild className="w-full">
					<Link href="/dashboard/teacher/quizzies">Quay về danh sách Quiz</Link>
				</Button>
			</div>
		</div>
	);
}
