"use server";

import { redirect } from "next/navigation";
import type { QuizData, QuizFormState, QuizQuestion } from "@/types/quiz";
import { findQuizById, upsertQuiz } from "@/lib/quiz-repository";
import {
	loadQuizFromJsonFallback,
	readQuizJsonById,
	seedQuizJsonToMongo,
} from "@/lib/quiz-json-fallback";
import { generateId } from "@/types/quiz";
import {
	mongoDocToQuizData,
	normalizeRawQuizDoc,
} from "@/lib/normalize-quiz-doc";

export type ClientQuiz = QuizData & { id: string };

export type QuizLoadResult =
	| { success: true; data: ClientQuiz }
	| { success: false; error: string };

const DEFAULT_EXAM_TIME_LIMIT_SECONDS = 1800;

function parseExamTimeLimitSeconds(
	value: FormDataEntryValue | null,
): number {
	const raw = typeof value === "string" ? Number.parseInt(value, 10) : Number.NaN;
	if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_EXAM_TIME_LIMIT_SECONDS;
	return raw;
}

export async function createQuizMongoAction(
	_prev: QuizFormState,
	formData: FormData,
): Promise<QuizFormState> {
	try {
		const title = (formData.get("title") as string)?.trim();
		const description = (formData.get("description") as string)?.trim();
		const category = (formData.get("category") as string)?.trim();
		const defaultTimeStr = formData.get("defaultTime") as string | null;
		const defaultTime = defaultTimeStr ? parseInt(defaultTimeStr, 10) : 30;
		const examTimeLimit = parseExamTimeLimitSeconds(formData.get("examTimeLimit"));

		if (!title) {
			return {
				success: false,
				error: "Tiêu đề quiz là bắt buộc.",
				field: "title",
			};
		}

		const now = new Date().toISOString();
		const newId = generateId();

		const quizDoc = {
			id: newId,
			slug: newId,
			title,
			description: description || null,
			category: category || null,
			authorId: null,
			createdAt: now,
			updatedAt: now,
			defaultTime,
			examTimeLimit,
			questions: [] as QuizQuestion[],
			totalQuestions: 0,
		};

		const res = await upsertQuiz(null, quizDoc);
		redirect(`/quiz-editor/${res.id}`);
	} catch (e) {
		console.error(e);
		return {
			success: false,
			error: e instanceof Error ? e.message : "Lỗi khi tạo quiz",
		};
	}
}

export async function getQuizMongoAction(id: string): Promise<QuizLoadResult> {
	try {
		let doc = await findQuizById(id);

		if (!doc) {
			const rawJson = await readQuizJsonById(id);
			if (rawJson) {
				await seedQuizJsonToMongo(rawJson);
				doc = await findQuizById(id);
			}
		}

		if (!doc) {
			const fromFile = await loadQuizFromJsonFallback(id);
			if (fromFile?.metadata?.id) {
				return { success: true, data: fromFile };
			}
			return { success: false, error: "Không tìm thấy quiz" };
		}

		const data = mongoDocToQuizData(doc as Record<string, unknown>);
		if (!data.metadata?.id) {
			return { success: false, error: "Dữ liệu quiz không hợp lệ" };
		}

		return { success: true, data };
	} catch (e) {
		console.error("[getQuizMongoAction]", { id, e });
		return { success: false, error: "Lỗi hệ thống khi tải quiz" };
	}
}

export async function updateQuizMongoAction(
	_prev: QuizFormState,
	formData: FormData,
): Promise<QuizFormState> {
	try {
		const id = formData.get("id") as string;
		if (!id)
			return { success: false, error: "ID quiz không hợp lệ.", field: "id" };

		let existing = await findQuizById(id);
		if (!existing) {
			const rawJson = await readQuizJsonById(id);
			if (rawJson) {
				await seedQuizJsonToMongo(rawJson);
				existing = await findQuizById(id);
			}
		}
		if (!existing) {
			return { success: false, error: "Không tìm thấy quiz", field: "id" };
		}

		const title = (formData.get("title") as string | null)?.trim() ?? "";
		const description =
			(formData.get("description") as string | null)?.trim() ?? "";
		const category = (formData.get("category") as string | null)?.trim() ?? "";

		const defaultTimeStr = formData.get("defaultTime") as string | null;
		const defaultTime = defaultTimeStr
			? parseInt(defaultTimeStr, 10)
			: undefined;
		const examTimeLimit = parseExamTimeLimitSeconds(formData.get("examTimeLimit"));

		const questionsJson = formData.get("questions") as string | null;
		if (!questionsJson)
			return {
				success: false,
				error: "Danh sách câu hỏi không được để trống.",
				field: "questions",
			};

		const questions = JSON.parse(questionsJson) as QuizQuestion[];
		if (!Array.isArray(questions) || questions.length === 0) {
			return {
				success: false,
				error: "Cần ít nhất một câu hỏi.",
				field: "questions",
			};
		}

		const now = new Date().toISOString();
		const flat = normalizeRawQuizDoc(existing as Record<string, unknown>);

		const quizDoc = {
			id,
			title: title || (flat.title as string),
			description: description || flat.description || null,
			category: category || flat.category || null,
			authorId: flat.authorId ?? null,
			createdAt:
				typeof flat.createdAt === "string"
					? flat.createdAt
					: new Date().toISOString(),
			updatedAt: now,
			defaultTime: (defaultTime ?? flat.defaultTime ?? 30) as number,
			examTimeLimit:
				(examTimeLimit ?? (flat.examTimeLimit as number) ?? DEFAULT_EXAM_TIME_LIMIT_SECONDS) as number,
			questions,
			totalQuestions: questions.length,
			slug: (flat.slug as string | undefined) ?? id,
		};

		const res = await upsertQuiz(id, quizDoc);
		if (!res.id) throw new Error("Upsert failed");

		return { success: true, message: "Đã lưu quiz thành công!" };
	} catch (e) {
		console.error(e);
		return {
			success: false,
			error: e instanceof Error ? e.message : "Lỗi khi cập nhật quiz.",
		};
	}
}
