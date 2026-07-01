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
    { label: "Trải nghiệm", href: "#trai-nghiem" },
    { label: "Vai trò", href: "#vai-tro" },
    { label: "Hướng dẫn", href: "#huong-dan" },
    { label: "Đánh giá", href: "#danh-gia" },
    { label: "Bảng giá", href: "#bang-gia" },
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
            {
                icon: TrendingUp,
                text: "Analytics chi tiết theo lớp và bài kiểm tra",
            },
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
            {
                icon: ClipboardList,
                text: "Kết quả học tập và bảng xếp hạng quiz",
            },
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
        answer: "Có. Bạn có thể đăng ký và sử dụng các tính năng cốt lõi miễn phí. Tài khoản demo cũng có sẵn trên trang đăng nhập để trải nghiệm nhanh.",
    },
    {
        question: "Phân quyền Giáo viên và Học sinh hoạt động thế nào?",
        answer: "Khi đăng ký, bạn chọn vai trò. Hệ thống tự chuyển hướng tới dashboard phù hợp: giáo viên quản lý lớp và quiz; học sinh xem khóa học, lịch và kết quả.",
    },
    {
        question: "Quiz real-time hoạt động ra sao?",
        answer: "Giáo viên tạo quiz và chia sẻ mã phiên. Học sinh tham gia, trả lời câu hỏi với animation và điểm số cập nhật theo thời gian thực — tương tự trải nghiệm game-based learning.",
    },
    {
        question:
            "Giáo viên có thể xem kết quả & đánh giá sau mỗi phiên quiz không?",
        answer: "Có. Sau khi kết thúc phiên, giáo viên có thể xem thống kê theo lớp, từng câu hỏi và mức độ hoàn thành để hỗ trợ đánh giá nhanh.",
    },
    {
        question: "Tôi có thể tạo nhiều lớp học cùng lúc không?",
        answer: "Được. Tùy gói tài khoản, bạn có thể tạo và quản lý nhiều lớp học, mời học sinh tham gia và tổ chức quiz theo lịch.",
    },
    {
        question: "Có dùng được trên điện thoại không?",
        answer: "Có. Giao diện responsive, tối ưu cho desktop, tablet và mobile — từ dashboard đến quiz game.",
    },
    {
        question: "Dữ liệu demo có an toàn không?",
        answer: "Phiên bản demo dùng dữ liệu mẫu. Không lưu thông tin nhạy cảm; phù hợp để thử nghiệm trong môi trường học tập.",
    },
    {
        question: "Làm sao để bắt đầu?",
        answer: 'Nhấn "Bắt đầu ngay" hoặc "Tạo tài khoản miễn phí" để đăng ký. Đã có tài khoản? Chọn "Đăng nhập" ở menu hoặc cuối trang.',
    },
    {
        question: "Có thể xuất báo cáo kết quả ra file không?",
        answer: "Có. Gói Pro và School cho phép xuất báo cáo chi tiết ra Excel và PDF, bao gồm thống kê theo lớp, từng học sinh và từng câu hỏi.",
    },
    {
        question: "AI Smart Generator hoạt động như thế nào?",
        answer: "Bạn chỉ cần tải lên tài liệu (slide, giáo án, văn bản). AI sẽ phân tích nội dung và tự động tạo bộ câu hỏi trắc nghiệm phù hợp, tiết kiệm đến 80% thời gian soạn bài.",
    },
    {
        question: "Học sinh có thể tham gia quiz từ nhà không?",
        answer: "Có. Học sinh chỉ cần mã phiên do giáo viên cung cấp để tham gia quiz từ bất kỳ đâu, trên bất kỳ thiết bị nào có kết nối internet.",
    },
    {
        question: "Có hỗ trợ tích hợp với hệ thống trường học không?",
        answer: "Gói School hỗ trợ tích hợp SSO/LDAP, cho phép đồng bộ tài khoản với hệ thống hiện có của trường. Liên hệ support@zenith.edu để được tư vấn.",
    },
    {
        question: "Dữ liệu học tập được lưu trữ bao lâu?",
        answer: "Gói Free lưu trữ 30 ngày. Gói Pro lưu trữ không giới hạn. Gói School có thể tùy chỉnh theo yêu cầu và cam kết bảo mật theo tiêu chuẩn giáo dục.",
    },
    {
        question: "Có chế độ offline cho quiz không?",
        answer: "Hiện tại quiz yêu cầu kết nối internet để đồng bộ real-time. Tuy nhiên, giáo viên có thể xuất đề thi dạng PDF để in và sử dụng offline khi cần.",
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

export const PLAYGROUND_QUESTIONS = [
    {
        question:
            "Zenith EDU sử dụng công nghệ nào để đồng bộ kết quả quiz thời gian thực?",
        options: [
            "Rest API truyền thống",
            "WebSocket / Real-time Sync",
            "Gửi email báo cáo",
            "Lưu local storage",
        ],
        correctIndex: 1,
        explanation:
            "Zenith sử dụng WebSocket/Real-time Engine giúp đồng bộ điểm số và hiệu ứng giữa Giáo viên và Học sinh dưới 50ms!",
    },
    {
        question:
            "Tính năng nổi bật giúp giáo viên tiết kiệm 80% thời gian soạn bài kiểm tra là gì?",
        options: [
            "Nhập tay từng câu",
            "AI Smart Generator (Tự động tạo quiz)",
            "Copy từ sách giáo khoa",
            "Chụp ảnh đề thi",
        ],
        correctIndex: 1,
        explanation:
            "AI Smart Generator tích hợp sẵn giúp tự động phân tích tài liệu và tạo câu hỏi trắc nghiệm đa dạng trong vài giây.",
    },
    {
        question: "Giao diện quiz-game của Zenith hỗ trợ các loại câu hỏi nào?",
        options: [
            "Chỉ trắc nghiệm đơn",
            "Trắc nghiệm, Đúng/Sai & Điền vào chỗ trống",
            "Chỉ điền vào chỗ trống",
            "Tự luận dài",
        ],
        correctIndex: 1,
        explanation:
            "Zenith hỗ trợ bộ câu hỏi tương tác phong phú gồm Trắc nghiệm (Multi-choice), Đúng/Sai (True/False) và Điền khuyết (Fill Blank).",
    },
] as const;

export const TESTIMONIALS = [
    {
        name: "Cô Nguyễn Minh Trang",
        role: "Giáo viên Tin học",
        school: "Trường THPT Chuyên Hà Nội - Amsterdam",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        quote: "Từ khi dùng Zenith EDU, học sinh lớp tôi hào hứng làm bài kiểm tra hơn hẳn. Hiệu ứng âm thanh và bảng xếp hạng real-time kích thích tinh thần cạnh tranh lành mạnh rất tốt.",
    },
    {
        name: "Thầy Trần Hoàng Nam",
        role: "Giáo viên Vật lý",
        school: "Trường THPT Nguyễn Thượng Hiền, TP. HCM",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        quote: "Công cụ AI Smart Generator của Zenith thực sự là cứu cảnh. Tôi chỉ cần tải giáo án slide lên là hệ thống tự động xuất ra bộ câu hỏi trắc nghiệm cực kỳ sát nội dung.",
    },
    {
        name: "Em Lê Minh Quân",
        role: "Học sinh lớp 11",
        school: "Trường THPT Lê Hồng Phong, Nam Định",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        quote: "Giao diện quiz-game siêu đẹp, chơi giống như game mobile. Em có thể theo dõi streak và biết ngay điểm số của mình để cố gắng vượt qua các bạn khác.",
    },
] as const;

export const PRICING_PLANS = [
    {
        name: "Cơ Bản (Free)",
        priceMonthly: 0,
        priceAnnually: 0,
        description:
            "Trải nghiệm đầy đủ các tính năng cốt lõi cho lớp học nhỏ.",
        features: [
            "Tạo tối đa 5 lớp học chủ động",
            "Tối đa 40 học sinh mỗi lớp",
            "Làm quiz tương tác real-time",
            "Báo cáo kết quả cơ bản",
            "Lưu trữ dữ liệu trong 30 ngày",
        ],
        ctaText: "Bắt đầu miễn phí",
        popular: false,
        href: "/signup",
    },
    {
        name: "Chuyên Nghiệp (Pro)",
        priceMonthly: 99000,
        priceAnnually: 79000,
        description: "Dành cho giáo viên muốn tối ưu hóa hiệu quả giảng dạy.",
        features: [
            "Không giới hạn số lượng lớp học",
            "Tối đa 150 học sinh mỗi lớp",
            "AI Smart Generator (100 lượt/tháng)",
            "Analytics chi tiết & Xuất file Excel/PDF",
            "Tùy biến bộ câu hỏi & Âm thanh riêng",
            "Hỗ trợ ưu tiên 24/7",
        ],
        ctaText: "Nâng cấp ngay",
        popular: true,
        href: "/signup?plan=pro",
    },
    {
        name: "Trường Học (School)",
        priceMonthly: -1,
        priceAnnually: -1,
        description: "Giải pháp quản lý học tập toàn diện cho toàn trường học.",
        features: [
            "Không giới hạn lớp học & học sinh",
            "Dashboard quản lý cho Ban Giám Hiệu",
            "Tích hợp hệ thống SSO / LDAP",
            "AI Smart Generator không giới hạn",
            "Tập huấn giáo viên & Hỗ trợ kỹ thuật 1-1",
            "Cam kết bảo mật & SLA 99.9%",
        ],
        ctaText: "Liên hệ hỗ trợ",
        popular: false,
        href: "mailto:school@zenith.edu?subject=Tu%20van%20Zenith%20School",
    },
] as const;
