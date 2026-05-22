export const CLASSES = [
  {
    id: 1,
    name: "Lập Trình Web - K22A",
    students: 38,
    lesson: "REST API Design",
    time: "T2, 7:30",
    status: "active" as const,
  },
  {
    id: 2,
    name: "Lập Trình Web - K22B",
    students: 35,
    lesson: "Authentication & JWT",
    time: "T4, 7:30",
    status: "active" as const,
  },
  {
    id: 3,
    name: "CSDL Nâng Cao - K21",
    students: 30,
    lesson: "Query Optimization",
    time: "T6, 13:00",
    status: "upcoming" as const,
  },
];

export const QUIZZES = [
  {
    id: 1,
    title: "HTTP Methods & Status Codes",
    class: "K22A",
    submissions: 32,
    total: 38,
    avg: 8.1,
    status: "active" as const,
    createdAt: "20/04/2026",
  },
  {
    id: 2,
    title: "SQL Joins & Subqueries",
    class: "K21",
    submissions: 28,
    total: 30,
    avg: 7.4,
    status: "active" as const,
    createdAt: "18/04/2026",
  },
  {
    id: 3,
    title: "JWT & Session Management",
    class: "K22B",
    submissions: 30,
    total: 35,
    avg: 7.8,
    status: "closed" as const,
    createdAt: "15/04/2026",
  },
  {
    id: 4,
    title: "React Hooks & State",
    class: "K22A",
    submissions: 0,
    total: 38,
    avg: 0,
    status: "draft" as const,
    createdAt: "21/04/2026",
  },
];

export const STUDENTS = [
  { id: 1, name: "Nguyễn Văn An", email: "an.nguyen@student.edu", class: "K22A", avg: 8.2, quizzesDone: 5 },
  { id: 2, name: "Trần Thị Bình", email: "binh.tran@student.edu", class: "K22A", avg: 7.9, quizzesDone: 5 },
  { id: 3, name: "Lê Hoàng Cường", email: "cuong.le@student.edu", class: "K22B", avg: 8.5, quizzesDone: 4 },
  { id: 4, name: "Phạm Minh Dũng", email: "dung.pham@student.edu", class: "K22B", avg: 7.1, quizzesDone: 4 },
  { id: 5, name: "Hoàng Thị Em", email: "em.hoang@student.edu", class: "K21", avg: 7.6, quizzesDone: 3 },
  { id: 6, name: "Võ Quốc Phú", email: "phu.vo@student.edu", class: "K21", avg: 8.0, quizzesDone: 3 },
];

export const ANALYTICS_WEEKLY = [
  { day: "T2", submissions: 12, avg: 7.8 },
  { day: "T3", submissions: 8, avg: 7.5 },
  { day: "T4", submissions: 15, avg: 8.1 },
  { day: "T5", submissions: 10, avg: 7.9 },
  { day: "T6", submissions: 18, avg: 8.0 },
  { day: "T7", submissions: 5, avg: 7.2 },
  { day: "CN", submissions: 2, avg: 8.4 },
];
