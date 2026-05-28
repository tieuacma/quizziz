import test from "node:test";
import assert from "node:assert/strict";
import {
	isFillBlankCorrect,
	isMultiChoiceAnswerCorrect,
	isReadingSubQuestionCorrect,
} from "@/lib/exam-grading";
import type { FillInBlankQuestion, MultipleChoiceQuestion, ReadingSubQuestion } from "@/types/quiz";

test("isMultiChoiceAnswerCorrect validates selected option", () => {
	const question: MultipleChoiceQuestion = {
		id: "q1",
		type: "multiple-choice",
		question: "Q",
		difficulty: "easy",
		timeLimit: 30,
		options: [{ id: "a", text: "A" }],
		correctOptionId: "a",
	};
	assert.equal(isMultiChoiceAnswerCorrect("a", question), true);
	assert.equal(isMultiChoiceAnswerCorrect("b", question), false);
});

test("isFillBlankCorrect handles case insensitive check", () => {
	const question: FillInBlankQuestion = {
		id: "q2",
		type: "fill-in-the-blank",
		question: "Q",
		difficulty: "easy",
		timeLimit: 30,
		answers: ["Paris"],
		caseSensitive: false,
	};
	assert.equal(isFillBlankCorrect("paris", question), true);
	assert.equal(isFillBlankCorrect("London", question), false);
});

test("isReadingSubQuestionCorrect validates true-false", () => {
	const sub: ReadingSubQuestion = {
		id: "r1",
		question: "Q",
		type: "true-false",
		correctAnswer: true,
	};
	assert.equal(isReadingSubQuestionCorrect(true, sub), true);
	assert.equal(isReadingSubQuestionCorrect(false, sub), false);
});
