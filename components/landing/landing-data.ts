import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Puzzle,
  School,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Tính năng", href: "#tinh-nang" },
  { label: "Vai trò", href: "#vai-tro" },
  { label: "Hướng dẫn", href: "#huong-dan" },
  { label: "FAQ", href: "#faq" },
] as const;

export const STATS = [
  { value: 120, suffix: "+", label: "Khóa học đang hoạt động" },
  { value: 2500, suffix: "+", label: "Người dùng trên nền tảng" },
  { value: 480, suffix: "+", label: "Quiz đã tạo" },
  { value: 94, suffix: "%", label: "Tỷ lệ hoàn thành bài" },
] as const;

export const FEATURES: {
  icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  {
    icon: BookOpen,
    title: "Khóa học đa dạng",
    desc: "Truy cập hàng trăm khóa học chất lượng cao từ các giảng viên hàng đầu.",
  },
  {
    icon: Users,
    title: "Quản lý lớp học",
    desc: "Dễ dàng quản lý lớp học, theo dõi tiến độ và tương tác với học sinh.",
  },
  {
    icon: BarChart3,
    title: "Báo cáo chi tiết",
    desc: "Theo dõi kết quả học tập với biểu đồ và báo cáo trực quan.",
  },
  {
    icon: Sparkles,
    title: "Trải nghiệm thông minh",
    desc: "Giao diện hiện đại, tối ưu cho mọi thiết bị.",
  },
];

export const ROLES = {
  teacher: {
    label: "Giáo viên",
    title: "Dạy học hiệu quả, quản lý tập trung",
    description:
      "Tạo quiz tương tác, theo dõi lớp và phân tích kết quả — tất cả trong một dashboard.",
    bullets: [
      { icon: Puzzle, text: "Tạo và chỉnh sửa quiz tại /quiz-create" },
      { icon: School, text: "Quản lý lớp học, học sinh và bài giảng" },
      { icon: TrendingUp, text: "Analytics chi tiết theo lớp và bài kiểm tra" },
    ],
  },
  student: {
    label: "Học sinh",
    title: "Học tập chủ động, theo dõi tiến độ",
    description:
      "Tham gia khóa học, làm bài tập và chơi quiz real-time cùng lớp.",
    bullets: [
      { icon: BookOpen, text: "Khóa học và tài liệu tại My Courses" },
      { icon: CalendarDays, text: "Lịch học và deadline bài tập" },
      { icon: ClipboardList, text: "Kết quả học tập và bảng xếp hạng quiz" },
    ],
  },
} as const;

export const STEPS = [
  {
    step: 1,
    title: "Đăng ký tài khoản",
    desc: "Chọn vai trò Giáo viên hoặc Học sinh — miễn phí, chỉ vài giây.",
  },
  {
    step: 2,
    title: "Thiết lập lớp & quiz",
    desc: "Giáo viên tạo lớp, thêm bài giảng và quiz; học sinh tham gia lớp.",
  },
  {
    step: 3,
    title: "Theo dõi & chơi quiz",
    desc: "Học sinh làm quiz real-time; giáo viên xem báo cáo ngay sau phiên.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Zenith EDU có miễn phí không?",
    answer:
      "Có. Bạn có thể đăng ký và sử dụng các tính năng cốt lõi miễn phí. Tài khoản demo cũng có sẵn trên trang đăng nhập để trải nghiệm nhanh.",
  },
  {
    question: "Phân quyền Giáo viên và Học sinh hoạt động thế nào?",
    answer:
      "Khi đăng ký, bạn chọn vai trò. Hệ thống tự chuyển hướng tới dashboard phù hợp: giáo viên quản lý lớp và quiz; học sinh xem khóa học, lịch và kết quả.",
  },
  {
    question: "Quiz real-time hoạt động ra sao?",
    answer:
      "Giáo viên tạo quiz và chia sẻ mã phiên. Học sinh tham gia, trả lời câu hỏi với animation và điểm số cập nhật theo thời gian thực — tương tự trải nghiệm game-based learning.",
  },
  {
    question: "Có dùng được trên điện thoại không?",
    answer:
      "Có. Giao diện responsive, tối ưu cho desktop, tablet và mobile — từ dashboard đến quiz game.",
  },
  {
    question: "Dữ liệu demo có an toàn không?",
    answer:
      "Phiên bản demo dùng dữ liệu mẫu. Không lưu thông tin nhạy cảm; phù hợp để thử nghiệm trong môi trường học tập.",
  },
  {
    question: "Làm sao để bắt đầu?",
    answer:
      'Nhấn "Bắt đầu ngay" hoặc "Tạo tài khoản miễn phí" để đăng ký. Đã có tài khoản? Chọn "Đăng nhập" ở menu hoặc cuối trang.',
  },
] as const;

export const FOOTER_LINKS = {
  product: [
    { label: "Tính năng", href: "#tinh-nang" },
    { label: "Vai trò", href: "#vai-tro" },
    { label: "Hướng dẫn", href: "#huong-dan" },
    { label: "FAQ", href: "#faq" },
  ],
  account: [
    { label: "Đăng nhập", href: "/login" },
    { label: "Đăng ký", href: "/signup" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  contact: [
    { label: "support@zenith.edu", href: "mailto:support@zenith.edu" },
    { label: "Hà Nội, Việt Nam", href: "#" },
  ],
} as const;

export const BRAND = {
  name: "Zenith EDU",
  tagline: "Hệ thống quản lý học tập thông minh",
  icon: GraduationCap,
} as const;
