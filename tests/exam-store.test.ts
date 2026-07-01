import test from "node:test";
import assert from "node:assert/strict";
import { useExamStore } from "@/stores/exam-store";

test("setExam initializes state for new quiz", () => {
    useExamStore.getState().reset();
    useExamStore.getState().setExam("quiz-1", 1000);
    const state = useExamStore.getState();
    assert.equal(state.quizId, "quiz-1");
    assert.equal(state.startTime, 1000);
    assert.equal(state.currentQuestion, 0);
});

test("setAnswer stores answer by question", () => {
    useExamStore.getState().reset();
    useExamStore.getState().setExam("quiz-2", 2000);
    useExamStore.getState().setAnswer({ questionId: "q1", answer: "a" });
    const state = useExamStore.getState();
    assert.equal(state.answers.q1?.answer, "a");
});
