export const quizGameCopy = {
  prePlay: {
    title: "Sẵn sàng chơi?",
    questionCount: (n: number) => `${n} câu hỏi`,
    estimatedTime: (seconds: number) =>
      `Thời gian ước tính: ~${Math.max(1, Math.ceil(seconds / 60))} phút`,
    start: "Bắt đầu",
    practiceMode: "Chế độ luyện tập",
  },
  summary: {
    title: "Hoàn thành quiz!",
    subtitle: "Làm tốt lắm!",
    finalScore: "Tổng điểm",
    accuracy: "Độ chính xác",
    correct: "Câu đúng",
    wrong: "Câu sai",
    reviewTitle: (n: number) => `Ôn lại ${n} câu`,
    reviewHint: "Xem lại các câu đã trả lời sai",
    practiceWrong: "Luyện câu sai",
    playAgain: "Chơi lại",
    noWrong: "Bạn đã trả lời đúng tất cả!",
  },
  reading: {
    questionOf: (current: number, total: number) =>
      `Câu ${current} / ${total}`,
    complete: (answered: number, total: number) =>
      `Hoàn thành đọc hiểu (${answered}/${total})`,
    answerAll: (total: number) => `Trả lời đủ ${total} câu phụ trước`,
    noOptions: "Không có lựa chọn",
  },
  fillBlank: {
    placeholder: "Nhập câu trả lời...",
    submit: "Kiểm tra",
    correct: "Chính xác!",
    wrong: "Chưa đúng!",
  },
  trueFalse: {
    true: "Đúng",
    false: "Sai",
  },
  unsupported: (type: string) => `Loại câu hỏi chưa hỗ trợ: ${type}`,
  loading: "Đang tải câu hỏi...",
} as const;
