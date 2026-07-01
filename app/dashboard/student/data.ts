export const COURSES = [
    {
        id: 1,
        name: "Toán Giải Tích",
        instructor: "TS. Lê Văn C",
        progress: 72,
        color: "from-blue-500 to-cyan-500",
        credits: 3,
    },
    {
        id: 2,
        name: "Lập Trình Web",
        instructor: "ThS. Phạm Thị D",
        progress: 88,
        color: "from-violet-500 to-purple-500",
        credits: 3,
    },
    {
        id: 3,
        name: "Cơ Sở Dữ Liệu",
        instructor: "TS. Hoàng Văn E",
        progress: 45,
        color: "from-emerald-500 to-teal-500",
        credits: 4,
    },
    {
        id: 4,
        name: "Mạng Máy Tính",
        instructor: "TS. Ngô Thị F",
        progress: 60,
        color: "from-rose-500 to-pink-500",
        credits: 3,
    },
] as const;

export const ASSIGNMENTS = [
    {
        id: 1,
        title: "Bài tập Tích phân bất định",
        course: "Toán Giải Tích",
        due: "29/04/2026",
        status: "pending",
    },
    {
        id: 2,
        title: "Xây dựng REST API với Next.js",
        course: "Lập Trình Web",
        due: "01/05/2026",
        status: "pending",
    },
    {
        id: 3,
        title: "Thiết kế ERD hệ thống thư viện",
        course: "CSDL",
        due: "25/04/2026",
        status: "submitted",
    },
] as const;

export const UPCOMING_QUIZZES = [
    {
        id: 1,
        title: "Quiz Toán Giải Tích - Chương 3",
        course: "Toán Giải Tích",
        due: "05/05/2026",
    },
    {
        id: 2,
        title: "Quiz Lập Trình Web - React",
        course: "Lập Trình Web",
        due: "08/05/2026",
    },
] as const;

export const LEARNING_RESULTS = [
    {
        id: 1,
        course: "Toán Giải Tích",
        currentAvg: 8.2,
        targetAvg: 8.5,
        progress: 72,
    },
    {
        id: 2,
        course: "Lập Trình Web",
        currentAvg: 7.9,
        targetAvg: 8.5,
        progress: 88,
    },
    {
        id: 3,
        course: "Cơ Sở Dữ Liệu",
        currentAvg: 7.1,
        targetAvg: 8.0,
        progress: 45,
    },
    {
        id: 4,
        course: "Mạng Máy Tính",
        currentAvg: 8.0,
        targetAvg: 8.2,
        progress: 60,
    },
] as const;

export const SCHEDULE = [
    {
        id: 1,
        day: "T2",
        time: "07:30",
        lesson: "REST API Design",
        course: "Lập Trình Web",
    },
    {
        id: 2,
        day: "T4",
        time: "07:30",
        lesson: "Authentication & JWT",
        course: "Lập Trình Web",
    },
    {
        id: 3,
        day: "T6",
        time: "13:00",
        lesson: "Query Optimization",
        course: "CSDL Nâng Cao",
    },
] as const;
