"use client"

import { motion } from 'framer-motion'
import { CheckCircle, Send, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useSupabaseQuiz } from '@/lib/hooks/useSupabaseQuiz'
import { QuizAttempt } from '@/lib/types/quiz'
import { useState } from 'react'

interface TrulyFinishedScreenProps {
    score: number
    correctCount: number
    wrongCount: number
    streak: number
    finalData: QuizAttempt
    studentName?: string
    onRestart: () => void
}

export function TrulyFinishedScreen({ score, correctCount, wrongCount, streak, finalData, studentName = '', onRestart }: TrulyFinishedScreenProps) {
    const [localStudentName, setLocalStudentName] = useState(studentName)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { createQuizAttempt } = useSupabaseQuiz()

    const handleSubmit = async () => {
        if (!localStudentName.trim()) return

        setIsSubmitting(true)
        try {
            await createQuizAttempt({
                ...finalData,
                student_name: localStudentName.trim(),
            })
            alert('Lưu kết quả thành công!')
        } catch (error) {
            alert('Lỗi lưu kết quả. Vui lòng thử lại.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const accuracy = Math.round((correctCount / (correctCount + wrongCount)) * 100)

    return (
        <div className="min-h-screen bg-[#1a0a2e] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <Card className="bg-[#2d1b4e]/90 border-[#00ff88]/30 shadow-[0_0_50px_rgba(0,255,136,0.3)]">
                    <CardContent className="p-8">
                        <div className="text-center mb-8">
                            <motion.div
                                className="w-24 h-24 mx-auto mb-6 bg-[#00ff88]/20 rounded-full flex items-center justify-center border-4 border-[#00ff88]/50 shadow-[0_0_30px_rgba(0,255,136,0.4)]"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                                <CheckCircle className="w-16 h-16 text-[#00ff88]" />
                            </motion.div>
                            <h1 className="text-3xl font-black text-[#00ff88] mb-4 drop-shadow-lg">
                                Hoàn thành!
                            </h1>
                            <p className="text-xl text-[#e0e0ff] mb-4">
                                Kết quả cuối cùng của bạn
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="text-center p-6 bg-[#00ff88]/10 rounded-2xl border border-[#00ff88]/30">
                                <div className="text-4xl font-black text-[#00ff88] mb-2">
                                    {score.toLocaleString()}
                                </div>
                                <div className="text-sm font-bold text-[#00ff88]/80 uppercase tracking-wide">
                                    Tổng điểm
                                </div>
                            </div>
                            <div className="text-center p-6 bg-[#00d4ff]/10 rounded-2xl border border-[#00d4ff]/30">
                                <div className="text-4xl font-black text-[#00d4ff] mb-2">{accuracy}%</div>
                                <div className="text-sm font-bold text-[#00d4ff]/80 uppercase tracking-wide">
                                    Độ chính xác
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-bold text-[#e0e0ff] mb-3">
                                Nhập tên để lưu kết quả
                            </label>
                            <Input
                                value={localStudentName}
                                onChange={(e) => setLocalStudentName(e.target.value)}
                                placeholder="Tên học sinh..."
                                className="bg-[#3d2b5e]/80 border-[#00ff88]/50 text-white placeholder-[#00d4ff]/70 h-14 text-xl rounded-2xl focus:ring-[#00ff88] focus:border-[#00ff88]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.div
                                className="flex-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!localStudentName.trim() || isSubmitting}
                                    className="w-full bg-gradient-to-r from-[#00ff88] to-[#00d2ad] hover:opacity-90 text-black font-bold py-7 text-lg shadow-[0_0_30px_rgba(0,255,136,0.4)] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Lưu kết quả
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                            <motion.div
                                className="flex-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    onClick={onRestart}
                                    variant="outline"
                                    className="w-full py-7 border-[#ffcc00]/50 text-[#ffcc00] hover:bg-[#ffcc00]/10 font-bold text-lg"
                                >
                                    <RotateCcw className="w-5 h-5 mr-2" />
                                    Chơi lại
                                </Button>
                            </motion.div>
                        </div>

                        <p className="text-center text-[#e0e0ff]/60 text-sm mt-6">
                            💾 Kết quả sẽ được lưu vào bảng quiz_attempts trên Supabase
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
