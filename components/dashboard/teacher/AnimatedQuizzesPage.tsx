"use client";

import { useRef, useState, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Puzzle,
    Plus,
    Users,
    BarChart3,
    Search,
    Filter,
    Grid3X3,
    List,
    SortAsc,
    Archive,
    Trash2,
    MoreVertical,
    CheckSquare,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

const STATUS_LABEL = {
    active: {
        text: "Đang mở",
        className: "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20",
    },
    closed: {
        text: "Đã đóng",
        className: "bg-slate-500/20 text-slate-400 hover:bg-slate-500/30",
    },
    draft: {
        text: "Nháp",
        className: "bg-amber-500/15 text-amber-400 hover:bg-amber-500/20",
    },
};

interface QuizData {
    id: number | string;
    title: string;
    class: string;
    createdAt: string;
    status: "active" | "closed" | "draft";
    submissions: number;
    total: number;
    avg: number;
}

interface AnimatedQuizzesPageProps {
    quizzes: QuizData[];
    activeCount: number;
    totalSubmissions: number;
}

// Animated Stat Card Component
function AnimatedStatCard({
    children,
    index,
    color,
}: {
    children: React.ReactNode;
    index: number;
    color: string;
}) {
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const ctx = gsap.context(
                () => {
                    // Entrance animation with stagger
                    gsap.fromTo(
                        cardRef.current,
                        { opacity: 0, y: 25, scale: 0.95 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.5,
                            delay: 0.15 + index * 0.1,
                            ease: "back.out(1.4)",
                        }
                    );

                    // Hover lift effect
                    cardRef.current?.addEventListener("mouseenter", () => {
                        gsap.to(cardRef.current, {
                            y: -6,
                            boxShadow: `0 12px 40px ${color}30`,
                            duration: 0.3,
                            ease: "power2.out",
                        });
                    });

                    cardRef.current?.addEventListener("mouseleave", () => {
                        gsap.to(cardRef.current, {
                            y: 0,
                            boxShadow: "0 0 0 transparent",
                            duration: 0.3,
                            ease: "power2.out",
                        });
                    });
                },
                { scope: cardRef }
            );

            return () => ctx.revert();
        },
        { scope: cardRef }
    );

    return (
        <div ref={cardRef} className="h-full">
            {children}
        </div>
    );
}

// Animated Quiz Card Component
function AnimatedQuizCard({
    q,
    status,
    index,
}: {
    q: QuizData;
    status: (typeof STATUS_LABEL)[keyof typeof STATUS_LABEL];
    index: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const ctx = gsap.context(
                () => {
                    // Entrance animation with stagger
                    gsap.fromTo(
                        cardRef.current,
                        { opacity: 0, y: 20, scale: 0.98 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.45,
                            delay: 0.3 + index * 0.08,
                            ease: "power2.out",
                        }
                    );

                    // Hover effects
                    cardRef.current?.addEventListener("mouseenter", () => {
                        gsap.to(cardRef.current, {
                            y: -4,
                            borderColor: "rgba(139, 92, 246, 0.3)",
                            duration: 0.3,
                            ease: "power2.out",
                        });
                    });

                    cardRef.current?.addEventListener("mouseleave", () => {
                        gsap.to(cardRef.current, {
                            y: 0,
                            borderColor: "rgba(255, 255, 255, 0.08)",
                            duration: 0.3,
                            ease: "power2.out",
                        });
                    });
                },
                { scope: cardRef }
            );

            return () => ctx.revert();
        },
        { scope: cardRef }
    );

    return (
        <Card
            ref={cardRef}
            className="bg-white/[0.03] border-white/8 transition-colors duration-300"
        >
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-white font-medium text-sm">
                        {q.title}
                    </h3>
                    <Badge className={status.className}>{status.text}</Badge>
                </div>
                <p className="text-slate-400 text-xs">
                    📌 Lớp {q.class} · {q.createdAt}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/8">
                    <Link href={`/quiz-editor/${q.id}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-white/15 cursor-pointer"
                        >
                            Sửa quiz
                        </Button>
                    </Link>
                    <Link href={`/quiz-game/${q.id}`} target="_blank">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-white/15 cursor-pointer"
                        >
                            Chơi thử
                        </Button>
                    </Link>
                    <Link href={`/do-exam/${q.id}`} target="_blank">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs border-white/15 cursor-pointer"
                        >
                            Thi thử
                        </Button>
                    </Link>
                </div>
                <div className="flex gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <div>
                            <p className="text-slate-400 text-xs">Đã nộp</p>
                            <p className="text-white font-semibold text-sm">
                                {q.submissions}/{q.total}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                        <div>
                            <p className="text-slate-400 text-xs">Điểm TB</p>
                            <p className="text-emerald-400 font-semibold text-sm">
                                {q.status === "draft" ? "—" : `${q.avg}/10`}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AnimatedQuizzesPage({
    quizzes,
    activeCount,
    totalSubmissions,
}: AnimatedQuizzesPageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // State for filters and view
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "all" | "active" | "closed" | "draft"
    >("all");
    const [classFilter, setClassFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"date" | "submissions" | "avg">(
        "date"
    );
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedQuizzes, setSelectedQuizzes] = useState<
        Set<string | number>
    >(new Set());

    // Get unique classes for filter
    const uniqueClasses = useMemo(() => {
        const classes = new Set(quizzes.map((q) => q.class));
        return Array.from(classes);
    }, [quizzes]);

    // Filtered and sorted quizzes
    const filteredQuizzes = useMemo(() => {
        let result = [...quizzes];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (q) =>
                    q.title.toLowerCase().includes(query) ||
                    q.class.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter((q) => q.status === statusFilter);
        }

        // Apply class filter
        if (classFilter !== "all") {
            result = result.filter((q) => q.class === classFilter);
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case "date":
                    // Sort by createdAt (newest first) - simple string comparison
                    return b.createdAt.localeCompare(a.createdAt);
                case "submissions":
                    // Sort by submission rate
                    const rateA = a.total > 0 ? a.submissions / a.total : 0;
                    const rateB = b.total > 0 ? b.submissions / b.total : 0;
                    return rateB - rateA;
                case "avg":
                    return b.avg - a.avg;
                default:
                    return 0;
            }
        });

        return result;
    }, [quizzes, searchQuery, statusFilter, classFilter, sortBy]);

    // Toggle selection for bulk actions
    const toggleSelection = (id: string | number) => {
        setSelectedQuizzes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedQuizzes.size === filteredQuizzes.length) {
            setSelectedQuizzes(new Set());
        } else {
            setSelectedQuizzes(new Set(filteredQuizzes.map((q) => q.id)));
        }
    };
    // Note: toggleSelectAll is available for future bulk selection feature
    void toggleSelectAll;

    useGSAP(
        () => {
            const ctx = gsap.context(
                () => {
                    // Page entrance
                    gsap.fromTo(
                        containerRef.current,
                        { opacity: 0 },
                        {
                            opacity: 1,
                            duration: 0.4,
                            ease: "power2.out",
                        }
                    );

                    // Header entrance
                    gsap.fromTo(
                        headerRef.current,
                        { opacity: 0, y: -15 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            delay: 0.1,
                            ease: "power2.out",
                        }
                    );

                    // Button pulse animation
                    gsap.to(buttonRef.current, {
                        boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
                        duration: 1.5,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                    });

                    // Animate stat cards with stagger
                    const statCards = containerRef.current?.querySelectorAll(
                        '[class*="bg-white/[0.03]"]'
                    );
                    if (statCards && statCards.length > 0) {
                        gsap.fromTo(
                            statCards,
                            { opacity: 0, y: 25, scale: 0.95 },
                            {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                duration: 0.5,
                                stagger: 0.1,
                                delay: 0.2,
                                ease: "back.out(1.4)",
                            }
                        );
                    }

                    // Section title animation
                    const sectionTitle =
                        containerRef.current?.querySelector("section h2");
                    if (sectionTitle) {
                        gsap.fromTo(
                            sectionTitle,
                            { opacity: 0, x: -10 },
                            {
                                opacity: 1,
                                x: 0,
                                duration: 0.4,
                                delay: 0.35,
                                ease: "power2.out",
                            }
                        );
                    }
                },
                { scope: containerRef }
            );

            return () => ctx.revert();
        },
        { scope: containerRef }
    );

    return (
        <div ref={containerRef} className="space-y-8 max-w-5xl">
            <div
                ref={headerRef}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Puzzle className="w-7 h-7 text-primary" />
                        Trắc nghiệm
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Quản lý quiz, theo dõi lượt nộp và điểm trung bình.
                    </p>
                </div>
                <Link href="/quiz-create">
                    <Button
                        ref={buttonRef}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/20 cursor-pointer"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Tạo Quiz mới
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatedStatCard index={0} color="#10b981">
                    <Card className="bg-white/[0.03] border-white/8 h-full">
                        <CardContent className="p-5">
                            <p className="text-3xl font-bold text-emerald-400">
                                {quizzes.length}
                            </p>
                            <p className="text-slate-400 text-sm mt-0.5">
                                Tổng quiz
                            </p>
                        </CardContent>
                    </Card>
                </AnimatedStatCard>
                <AnimatedStatCard index={1} color="#8b5cf6">
                    <Card className="bg-white/[0.03] border-white/8 h-full">
                        <CardContent className="p-5">
                            <p className="text-3xl font-bold text-violet-400">
                                {activeCount}
                            </p>
                            <p className="text-slate-400 text-sm mt-0.5">
                                Đang mở
                            </p>
                        </CardContent>
                    </Card>
                </AnimatedStatCard>
                <AnimatedStatCard index={2} color="#f59e0b">
                    <Card className="bg-white/[0.03] border-white/8 col-span-2 lg:col-span-1 h-full">
                        <CardContent className="p-5">
                            <p className="text-3xl font-bold text-amber-400">
                                {totalSubmissions}
                            </p>
                            <p className="text-slate-400 text-sm mt-0.5">
                                Lượt nộp (tổng)
                            </p>
                        </CardContent>
                    </Card>
                </AnimatedStatCard>
            </div>

            {/* Filters and Controls */}
            <section>
                <div className="flex flex-col gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">
                            Danh sách quiz
                            <span className="ml-2 text-sm font-normal text-slate-400">
                                ({filteredQuizzes.length} quiz)
                            </span>
                        </h2>

                        {/* Bulk actions bar */}
                        {selectedQuizzes.size > 0 && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                                <CheckSquare className="w-4 h-4 text-violet-400" />
                                <span className="text-sm text-violet-300">
                                    Đã chọn {selectedQuizzes.size} quiz
                                </span>
                                <div className="flex items-center gap-1 ml-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-xs text-slate-300 hover:text-white cursor-pointer"
                                    >
                                        <Archive className="w-3.5 h-3.5 mr-1" />
                                        Lưu trữ
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                                        Xóa
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filter controls */}
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Tìm kiếm quiz, lớp học..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 border-white/10 bg-white/[0.02] text-sm"
                            />
                        </div>

                        {/* Status filter */}
                        <Select
                            value={statusFilter}
                            onValueChange={(v) =>
                                setStatusFilter(
                                    v as "all" | "active" | "closed" | "draft"
                                )
                            }
                        >
                            <SelectTrigger className="w-[130px] border-white/10 bg-white/[0.02] text-sm">
                                <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="active">Đang mở</SelectItem>
                                <SelectItem value="closed">Đã đóng</SelectItem>
                                <SelectItem value="draft">Nháp</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Class filter */}
                        <Select
                            value={classFilter}
                            onValueChange={setClassFilter}
                        >
                            <SelectTrigger className="w-[130px] border-white/10 bg-white/[0.02] text-sm">
                                <SelectValue placeholder="Lớp học" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả lớp</SelectItem>
                                {uniqueClasses.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        Lớp {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select
                            value={sortBy}
                            onValueChange={(v) =>
                                setSortBy(v as "date" | "submissions" | "avg")
                            }
                        >
                            <SelectTrigger className="w-[140px] border-white/10 bg-white/[0.02] text-sm">
                                <SortAsc className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                <SelectValue placeholder="Sắp xếp" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date">Mới nhất</SelectItem>
                                <SelectItem value="submissions">
                                    Tỷ lệ nộp
                                </SelectItem>
                                <SelectItem value="avg">Điểm TB</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* View toggle */}
                        <div className="flex items-center gap-1 ml-auto sm:ml-0 border border-white/10 rounded-lg p-1">
                            <Button
                                variant={
                                    viewMode === "grid" ? "secondary" : "ghost"
                                }
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className={`h-7 w-7 p-0 cursor-pointer ${
                                    viewMode === "grid"
                                        ? "bg-white/10 text-white"
                                        : "text-slate-400"
                                }`}
                            >
                                <Grid3X3 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === "list" ? "secondary" : "ghost"
                                }
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className={`h-7 w-7 p-0 cursor-pointer ${
                                    viewMode === "list"
                                        ? "bg-white/10 text-white"
                                        : "text-slate-400"
                                }`}
                            >
                                <List className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Quiz list */}
                {filteredQuizzes.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
                        <Puzzle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                        <p className="text-white font-medium">
                            Không tìm thấy quiz nào
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            Thử thay đổi bộ lọc hoặc tạo quiz mới.
                        </p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                        {filteredQuizzes.map((q, i) => {
                            const status = STATUS_LABEL[q.status];
                            const isSelected = selectedQuizzes.has(q.id);
                            return (
                                <div key={q.id} className="relative">
                                    {/* Selection checkbox */}
                                    <button
                                        onClick={() => toggleSelection(q.id)}
                                        className={`absolute top-3 left-3 z-10 w-5 h-5 rounded border transition-all cursor-pointer ${
                                            isSelected
                                                ? "bg-violet-500 border-violet-500 text-white"
                                                : "bg-white/5 border-white/20 text-transparent hover:border-white/40"
                                        }`}
                                    >
                                        <CheckSquare className="w-3.5 h-3.5 mx-auto" />
                                    </button>
                                    <div
                                        className={
                                            isSelected
                                                ? "ring-2 ring-violet-500/50 rounded-xl"
                                                : ""
                                        }
                                    >
                                        <AnimatedQuizCard
                                            q={q}
                                            status={status}
                                            index={i}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredQuizzes.map((q) => {
                            const status = STATUS_LABEL[q.status];
                            const isSelected = selectedQuizzes.has(q.id);
                            return (
                                <div
                                    key={q.id}
                                    className={`relative rounded-xl border transition-all ${
                                        isSelected
                                            ? "border-violet-500/50 bg-violet-500/5"
                                            : "border-white/8 bg-white/[0.03]"
                                    }`}
                                >
                                    {/* Selection checkbox */}
                                    <button
                                        onClick={() => toggleSelection(q.id)}
                                        className={`absolute top-4 left-4 z-10 w-5 h-5 rounded border transition-all cursor-pointer ${
                                            isSelected
                                                ? "bg-violet-500 border-violet-500 text-white"
                                                : "bg-white/5 border-white/20 text-transparent hover:border-white/40"
                                        }`}
                                    >
                                        <CheckSquare className="w-3.5 h-3.5 mx-auto" />
                                    </button>
                                    <div className="p-4 pl-12">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-white font-medium">
                                                        {q.title}
                                                    </h3>
                                                    <Badge
                                                        className={
                                                            status.className
                                                        }
                                                    >
                                                        {status.text}
                                                    </Badge>
                                                </div>
                                                <p className="text-slate-400 text-xs mb-3">
                                                    📌 Lớp {q.class} ·{" "}
                                                    {q.createdAt}
                                                </p>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-3.5 h-3.5 text-slate-500" />
                                                        <span className="text-slate-400 text-xs">
                                                            Đã nộp:
                                                        </span>
                                                        <span className="text-white font-semibold text-sm">
                                                            {q.submissions}/
                                                            {q.total}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                                                        <span className="text-slate-400 text-xs">
                                                            Điểm TB:
                                                        </span>
                                                        <span className="text-emerald-400 font-semibold text-sm">
                                                            {q.status ===
                                                            "draft"
                                                                ? "—"
                                                                : `${q.avg}/10`}
                                                        </span>
                                                    </div>
                                                    {/* Submission progress bar */}
                                                    <div className="flex-1 max-w-[120px]">
                                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                                                                style={{
                                                                    width: `${(q.submissions / q.total) * 100}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/quiz-editor/${q.id}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-xs border-white/15 cursor-pointer"
                                                    >
                                                        Sửa
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-8 h-8 p-0 text-slate-400 hover:text-white cursor-pointer"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
