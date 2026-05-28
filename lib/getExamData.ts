import { findQuizById } from "@/lib/quiz-repository";
import { mongoDocToQuizData } from "@/lib/normalize-quiz-doc";
import type {
	QuizData,
	QuizQuestion,
	MultipleChoiceQuestion,
	TrueFalseQuestion,
	FillInBlankQuestion,
	ReadingQuestion,
	ReadingSubQuestion,
} from "@/types/quiz";

type ExamReadingSubQuestion = Omit<
	ReadingSubQuestion,
	"correctOptionId" | "correctAnswer" | "answers"
>;
type ExamReadingQuestion = Omit<ReadingQuestion, "questions"> & {
	questions: ExamReadingSubQuestion[];
};
type ExamQuestion =
	| Omit<MultipleChoiceQuestion, "correctOptionId" | "explanation">
	| Omit<TrueFalseQuestion, "correctAnswer" | "explanation">
	| Omit<FillInBlankQuestion, "answers">
	| ExamReadingQuestion;

export type ExamQuizData = {
	id: string;
	metadata: QuizData["metadata"];
	questions: ExamQuestion[];
};

function sanitizeReadingSubQuestion(
	subQuestion: ReadingSubQuestion,
): ExamReadingSubQuestion {
	const { correctOptionId, correctAnswer, answers, ...rest } = subQuestion;
	void correctOptionId;
	void correctAnswer;
	void answers;
	return rest;
}

function sanitizeQuestion(question: QuizQuestion): ExamQuestion {
	switch (question.type) {
		case "multiple-choice": {
			const { correctOptionId, explanation, ...rest } = question;
			void correctOptionId;
			void explanation;
			return rest;
		}
		case "true-false": {
			const { correctAnswer, explanation, ...rest } = question;
			void correctAnswer;
			void explanation;
			return rest;
		}
		case "fill-in-the-blank": {
			const { answers, ...rest } = question;
			void answers;
			return rest;
		}
		case "reading":
			return {
				...question,
				questions: question.questions.map(sanitizeReadingSubQuestion),
			};
		default:
			return question as never;
	}
}

export async function getExamData(id: string): Promise<ExamQuizData | null> {
	const doc = await findQuizById(id);
	if (!doc) return null;

	const parsed = mongoDocToQuizData(doc as Record<string, unknown>);
	return {
		id: parsed.id,
		metadata: parsed.metadata,
		questions: parsed.questions.map(sanitizeQuestion),
	};
}
