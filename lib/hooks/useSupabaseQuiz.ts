"use client";

import { supabase } from "@/lib/supabase/client";
import type { QuizAttempt } from "@/lib/types/quiz";

export function useSupabaseQuiz() {
    const initializeAttempt = async (quizId: string, studentName: string): Promise<{ success: boolean; attemptId?: string; error?: any }> => {
        if (!quizId || !studentName.trim()) {
            return { success: false, error: new Error('quiz_id and student_name required') };
        }

        try {
            const { data, error } = await supabase
                .from('quiz_attempts')
                .insert({
                    quiz_id: quizId,
                    student_name: studentName.trim(),
                    score: 0,
                    correct_count: 0,
                    wrong_count: 0,
                    streak: 0,
                    wrong_answers: []
                })
                .select('id')
                .single();

            if (error) throw error;

            console.log('Quiz attempt initialized:', data?.id);
            return { success: true, attemptId: data!.id };
        } catch (error) {
            console.error('Initialize attempt error:', error);
            return { success: false, error };
        }
    };

    const updateAttempt = async (attemptId: string, updateData: Partial<Omit<QuizAttempt, 'id' | 'quiz_id' | 'student_name'>> & { wrongQuestion?: { questionId: string; userAnswer: string; correctAnswer: string; timeSpent: number } }): Promise<{ success: boolean; error?: any }> => {
        try {
            const updatePayload: any = {
                score: updateData.score ?? 0,
                correct_count: updateData.correct_count ?? 0,
                wrong_count: updateData.wrong_count ?? 0,
                streak: updateData.streak ?? 0,
                completed_at: updateData.completed_at
            };

            // Append to wrong_answers jsonb if wrongQuestion provided
            if (updateData.wrongQuestion) {
                const { data: current, error: fetchError } = await supabase
                    .from('quiz_attempts')
                    .select('wrong_answers')
                    .eq('id', attemptId)
                    .single();

                if (fetchError) throw fetchError;

                updatePayload.wrong_answers = [...(current?.wrong_answers || []), updateData.wrongQuestion];
            }

            const { error } = await supabase
                .from('quiz_attempts')
                .update(updatePayload)
                .eq('id', attemptId);

            if (error) throw error;

            console.log('Attempt updated:', attemptId);
            return { success: true };
        } catch (error) {
            console.error('Update attempt error:', error);
            return { success: false, error };
        }
    };

    const createQuizAttempt = async (data: Omit<QuizAttempt, 'id'>): Promise<{ success: boolean; data?: QuizAttempt; error?: any }> => {
        // Validate required fields
        if (!data.quiz_id || !data.student_name) {
            const error = new Error('quiz_id and student_name are required');
            return { success: false, error };
        }

        try {
            const { data: inserted, error } = await supabase
                .from("quiz_attempts")
                .insert(data)
                .select()
                .single();

            if (error) throw error;

            console.log('Quiz attempt saved:', inserted);
            return { success: true, data: inserted };
        } catch (error) {
            console.error("Supabase insert error:", error);
            return { success: false, error };
        }
    };

    return {
        initializeAttempt,
        updateAttempt,
        createQuizAttempt,
    };
}

