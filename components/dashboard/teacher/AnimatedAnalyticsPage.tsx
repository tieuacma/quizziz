"use client";

import { useRef, useState, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Users,
  Puzzle,
  Target,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  AlertTriangle,
  Clock,
  ChevronDown,
  Star,
  Activity,
  FileText,
  MoreHorizontal,
  RefreshCw,
  Eye,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

interface AnalyticsData {
  day: string;
  submissions: number;
  avg: number;
}

type IconName = "TrendingUp" | "Users" | "Puzzle" | "Target";

interface StatData {
  label: string;
  value: string;
  icon: IconName;
  color: string;
}

const ICON_MAP: Record<IconName, React.ElementType> = {
  TrendingUp,
  Users,
  Puzzle,
  Target,
};

interface AnimatedAnalyticsPageProps {
  stats: StatData[];
  analyticsWeekly: AnalyticsData[];
}

// Enhanced Stat Card with trend indicator
function EnhancedStatCard({
  s,
  index,
  trend,
}: {
  s: StatData;
  index: number;
  trend?: { value: number; isPositive: boolean };
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const valueRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          // Entrance animation with stagger
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 25, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              delay: 0.1 + index * 0.12,
              ease: "back.out(1.5)",
            },
          );

          // Icon bounce animation
          gsap.fromTo(
            iconRef.current,
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              delay: 0.2 + index * 0.12,
              ease: "elastic.out(1, 0.5)",
            },
          );

          // CountUp animation for values
          if (valueRef.current) {
            const targetValue = parseFloat(s.value);
            if (!isNaN(targetValue)) {
              gsap.to(
                {},
                {
                  duration: 1,
                  delay: 0.3 + index * 0.12,
                  ease: "power2.out",
                  onUpdate: function () {
                    const progress = this.progress();
                    const easedProgress =
                      progress < 0.5
                        ? 4 * progress * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                    const current = targetValue * easedProgress;
                    if (valueRef.current) {
                      valueRef.current.textContent = s.value.includes("%")
                        ? `${Math.round(current)}%`
                        : current.toFixed(1);
                    }
                  },
                },
              );
            }
          }

          // Hover effects
          cardRef.current?.addEventListener("mouseenter", () => {
            gsap.to(cardRef.current, {
              y: -8,
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(iconRef.current, {
              scale: 1.2,
              rotation: 10,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          cardRef.current?.addEventListener("mouseleave", () => {
            gsap.to(cardRef.current, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
            gsap.to(iconRef.current, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        },
        { scope: cardRef },
      );

      return () => ctx.revert();
    },
    { scope: cardRef },
  );

  return (
    <div ref={cardRef} className="h-full">
      <Card className="bg-white/[0.03] border-white/8 h-full overflow-hidden group hover:border-white/15 transition-colors">
        <CardContent className="p-5 relative">
          <div className="flex items-start justify-between">
            <div>
              {(() => {
                const IconComponent = ICON_MAP[s.icon];
                return (
                  <IconComponent
                    ref={iconRef}
                    className={`w-6 h-6 ${s.color}`}
                    style={{ display: "inline-block" }}
                  />
                );
              })()}
              <p
                ref={valueRef}
                className={`text-3xl font-bold mt-2 ${s.color}`}
              >
                {s.value}
              </p>
              <p className="text-slate-400 text-sm mt-0.5">{s.label}</p>
            </div>
            {trend && (
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  trend.isPositive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-rose-500/15 text-rose-400"
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {trend.value}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Original Animated Stat Card (kept for compatibility)
function AnimatedStatCard({ s, index }: { s: StatData; index: number }) {
  return <EnhancedStatCard s={s} index={index} />;
}

// Score Distribution Chart Component
function ScoreDistributionChart({ data }: { data: AnalyticsData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  // Calculate score distribution
  const distribution = useMemo(() => {
    const avgScores = data.map((d) => d.avg);
    const ranges = [
      { label: "9-10", count: 0, color: "bg-emerald-500" },
      { label: "7-8", count: 0, color: "bg-blue-500" },
      { label: "5-6", count: 0, color: "bg-amber-500" },
      { label: "3-4", count: 0, color: "bg-orange-500" },
      { label: "0-2", count: 0, color: "bg-rose-500" },
    ];

    avgScores.forEach((score) => {
      if (score >= 9) ranges[0].count++;
      else if (score >= 7) ranges[1].count++;
      else if (score >= 5) ranges[2].count++;
      else if (score >= 3) ranges[3].count++;
      else ranges[4].count++;
    });

    const total = ranges.reduce((sum, r) => sum + r.count, 0) || 1;
    return ranges.map((r) => ({
      ...r,
      percentage: Math.round((r.count / total) * 100),
    }));
  }, [data]);

  useGSAP(
    () => {
      if (!animated) {
        const bars = containerRef.current?.querySelectorAll(
          '[data-dist-bar="true"]',
        );
        if (bars && bars.length > 0) {
          gsap.fromTo(
            bars,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.6,
              stagger: 0.1,
              delay: 0.3,
              ease: "power2.out",
              transformOrigin: "left",
            },
          );
        }
        setAnimated(true);
      }
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="space-y-3">
      {distribution.map((range) => (
        <div key={range.label} className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-10 text-right">
            {range.label}
          </span>
          <div className="flex-1 h-6 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              data-dist-bar="true"
              className={`h-full ${range.color} rounded-full transition-all`}
              style={{ width: `${range.percentage}%` }}
            />
          </div>
          <span className="text-xs text-slate-300 w-10">
            {range.percentage}%
          </span>
        </div>
      ))}
    </div>
  );
}

// Enhanced Animated Bar Chart Component
function AnimatedBarChart({ data }: { data: AnalyticsData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const maxSubmissions = Math.max(...data.map((d) => d.submissions));
  const totalSubmissions = data.reduce((sum, d) => sum + d.submissions, 0);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          if (!animated) {
            // Animate bars with stagger
            const bars =
              containerRef.current?.querySelectorAll('[data-bar="true"]');
            if (bars && bars.length > 0) {
              gsap.fromTo(
                bars,
                { scaleY: 0, opacity: 0 },
                {
                  scaleY: 1,
                  opacity: 1,
                  duration: 0.8,
                  stagger: 0.08,
                  delay: 0.2,
                  ease: "back.out(1.2)",
                  transformOrigin: "bottom",
                },
              );
            }

            // Animate submission numbers
            const numbers = containerRef.current?.querySelectorAll(
              '[data-number="true"]',
            );
            if (numbers && numbers.length > 0) {
              gsap.fromTo(
                numbers,
                { opacity: 0, y: -10, scale: 0.5 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.4,
                  stagger: 0.08,
                  delay: 0.4,
                  ease: "power2.out",
                },
              );
            }

            // Animate day labels
            const labels = containerRef.current?.querySelectorAll(
              '[data-label="true"]',
            );
            if (labels && labels.length > 0) {
              gsap.fromTo(
                labels,
                { opacity: 0, y: 10 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.3,
                  stagger: 0.06,
                  delay: 0.5,
                  ease: "power2.out",
                },
              );
            }

            setAnimated(true);
          }
        },
        { scope: containerRef },
      );

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  // Color gradient based on value intensity
  const getBarColor = (value: number, index: number) => {
    const ratio = maxSubmissions > 0 ? value / maxSubmissions : 0;
    if (ratio > 0.8) return "from-violet-600 to-purple-500";
    if (ratio > 0.6) return "from-indigo-600 to-violet-500";
    if (ratio > 0.4) return "from-blue-600 to-indigo-500";
    if (ratio > 0.2) return "from-sky-600 to-blue-500";
    return "from-slate-600 to-slate-500";
  };

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-xs text-slate-400">
              Tổng:{" "}
              <span className="text-white font-medium">{totalSubmissions}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-400">
              TB:{" "}
              <span className="text-white font-medium">
                {(totalSubmissions / data.length).toFixed(1)}
              </span>
              /ngày
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          Cao nhất:{" "}
          <span className="text-white font-medium">{maxSubmissions}</span> lượt
        </div>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="relative">
        {/* Y-axis reference lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1 h-px bg-white/5" />
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between gap-2 h-40 relative z-10">
          {data.map((d, index) => {
            const percentage =
              maxSubmissions > 0 ? (d.submissions / maxSubmissions) * 100 : 0;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center gap-2 group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 shadow-xl">
                    <p className="text-xs text-white font-medium">{d.day}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {d.submissions} lượt nộp · {percentage.toFixed(0)}% max
                    </p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-800 border-r border-b border-white/10 rotate-45" />
                  </div>
                )}

                {/* Value number */}
                <span
                  data-number="true"
                  className={`text-xs font-semibold transition-all duration-300 ${
                    isHovered ? "text-violet-400 scale-110" : "text-slate-500"
                  }`}
                >
                  {d.submissions}
                </span>

                {/* Bar */}
                <div
                  data-bar="true"
                  className={`w-full max-w-[32px] rounded-t-md bg-gradient-to-t ${getBarColor(d.submissions, index)} transition-all duration-300 relative overflow-hidden ${
                    isHovered ? "scale-105 shadow-lg shadow-violet-500/30" : ""
                  }`}
                  style={{
                    height: `${Math.max(percentage, 4)}%`,
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                </div>

                {/* Day label */}
                <span
                  data-label="true"
                  className={`text-xs font-medium transition-colors duration-300 ${
                    isHovered ? "text-violet-400" : "text-slate-400"
                  }`}
                >
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Animated Progress Row Component
function AnimatedProgressRow({
  d,
  index,
}: {
  d: AnalyticsData;
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          // Entrance animation with stagger
          gsap.fromTo(
            rowRef.current,
            { opacity: 0, x: -15 },
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              delay: 0.2 + index * 0.08,
              ease: "power2.out",
            },
          );

          // Progress bar animation
          if (barRef.current) {
            gsap.fromTo(
              barRef.current,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.8,
                delay: 0.3 + index * 0.08,
                ease: "power2.out",
                transformOrigin: "left",
              },
            );
          }

          // Hover effect
          rowRef.current?.addEventListener("mouseenter", () => {
            gsap.to(rowRef.current, {
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              duration: 0.2,
            });
          });

          rowRef.current?.addEventListener("mouseleave", () => {
            gsap.to(rowRef.current, {
              backgroundColor: "transparent",
              duration: 0.2,
            });
          });
        },
        { scope: rowRef },
      );

      return () => ctx.revert();
    },
    { scope: rowRef },
  );

  return (
    <div
      ref={rowRef}
      className={`flex items-center justify-between px-5 py-3.5 ${
        index !== 0 ? "border-t border-white/8" : ""
      }`}
    >
      <span className="text-white text-sm font-medium w-8">{d.day}</span>
      <div className="flex-1 mx-4 h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500"
          style={{ width: `${(d.avg / 10) * 100}%` }}
        />
      </div>
      <span className="text-emerald-400 font-semibold text-sm w-12 text-right">
        {d.avg}/10
      </span>
    </div>
  );
}

// Quick Insights Card Component with Sparkline
function QuickInsightCard({
  title,
  value,
  icon,
  color,
  sparklineData,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  sparklineData?: number[];
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              delay: 0.5,
              ease: "power2.out",
            },
          );
        },
        { scope: cardRef },
      );
      return () => ctx.revert();
    },
    { scope: cardRef },
  );

  // Generate sparkline SVG path
  const sparklinePath = useMemo(() => {
    if (!sparklineData || sparklineData.length < 2) return "";
    const max = Math.max(...sparklineData);
    const min = Math.min(...sparklineData);
    const range = max - min || 1;
    const width = 60;
    const height = 20;
    const points = sparklineData.map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    });
    return `M${points.join(" L")}`;
  }, [sparklineData]);

  return (
    <div
      ref={cardRef}
      className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400">{title}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
      {sparklineData && sparklineData.length > 1 && (
        <svg width="60" height="20" className="flex-shrink-0">
          <path
            d={sparklinePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-violet-400"
          />
        </svg>
      )}
    </div>
  );
}

// Top Performing Students Component
function TopStudentsCard({
  students,
}: {
  students: Array<{
    name: string;
    avg: number;
    class: string;
    avatar?: string;
  }>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          // Animate rows with stagger
          const rows = containerRef.current?.querySelectorAll(
            '[data-student-row="true"]',
          );
          if (rows && rows.length > 0) {
            gsap.fromTo(
              rows,
              { opacity: 0, x: -15 },
              {
                opacity: 1,
                x: 0,
                duration: 0.4,
                stagger: 0.08,
                delay: 0.3,
                ease: "power2.out",
              },
            );
          }
        },
        { scope: containerRef },
      );
      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  const getRankBadge = (index: number) => {
    const badges = [
      { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: "🥇" },
      { bg: "bg-slate-400/20", text: "text-slate-300", icon: "🥈" },
      { bg: "bg-amber-600/20", text: "text-amber-400", icon: "🥉" },
    ];
    if (index < 3) return badges[index];
    return { bg: "bg-white/5", text: "text-slate-400", icon: `${index + 1}` };
  };

  return (
    <Card className="bg-white/[0.03] border-white/8">
      <CardContent className="p-0">
        <div className="px-5 py-4 border-b border-white/8">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Học sinh xuất sắc
            </h3>
            <button className="text-xs text-slate-400 hover:text-white transition-colors">
              Xem tất cả →
            </button>
          </div>
        </div>
        <div ref={containerRef} className="divide-y divide-white/5">
          {students.map((student, index) => {
            const badge = getRankBadge(index);
            return (
              <div
                key={index}
                data-student-row="true"
                className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${badge.bg} ${badge.text}`}
                >
                  {badge.icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-violet-300 transition-colors">
                    {student.name}
                  </p>
                  <p className="text-xs text-slate-500">{student.class}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold text-sm">
                    {student.avg.toFixed(1)}
                  </p>
                  <p className="text-xs text-slate-500">/10</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Activity Feed Component
function RecentActivityFeed({
  activities,
}: {
  activities: Array<{
    type: "submission" | "quiz" | "achievement";
    message: string;
    time: string;
    icon?: React.ReactNode;
  }>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ctx = gsap.context(
        () => {
          const items = containerRef.current?.querySelectorAll(
            '[data-activity="true"]',
          );
          if (items && items.length > 0) {
            gsap.fromTo(
              items,
              { opacity: 0, y: 10 },
              {
                opacity: 1,
                y: 0,
                duration: 0.35,
                stagger: 0.06,
                delay: 0.4,
                ease: "power2.out",
              },
            );
          }
        },
        { scope: containerRef },
      );
      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  const getActivityColor = (type: string) => {
    switch (type) {
      case "submission":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "quiz":
        return "bg-violet-500/20 text-violet-400 border-violet-500/30";
      case "achievement":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-white/5 text-slate-400 border-white/10";
    }
  };

  return (
    <Card className="bg-white/[0.03] border-white/8">
      <CardContent className="p-0">
        <div className="px-5 py-4 border-b border-white/8">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Hoạt động gần đây
            </h3>
            <button className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Cập nhật
            </button>
          </div>
        </div>
        <div
          ref={containerRef}
          className="p-4 space-y-3 max-h-[280px] overflow-y-auto"
        >
          {activities.map((activity, index) => (
            <div
              key={index}
              data-activity="true"
              className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityColor(activity.type)} transition-all hover:scale-[1.02]`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                {activity.icon || <FileText className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{activity.message}</p>
                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Export Modal Component
function ExportModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [format, setFormat] = useState<"csv" | "pdf" | "xlsx">("csv");
  const [exporting, setExporting] = useState(false);

  useGSAP(
    () => {
      if (isOpen && modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.95, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          },
        );
      }
    },
    { scope: modalRef },
  );

  if (!isOpen) return null;

  const handleExport = () => {
    setExporting(true);
    // Simulate export
    setTimeout(() => {
      setExporting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative bg-slate-900 border border-white/10 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-violet-400" />
          Xuất dữ liệu
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Định dạng
            </label>
            <div className="flex gap-2">
              {(["csv", "pdf", "xlsx"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    format === f
                      ? "bg-violet-500/20 border-violet-500/50 text-violet-400"
                      : "bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Phạm vi dữ liệu
            </label>
            <Select defaultValue="week">
              <SelectTrigger className="w-full border-white/10 bg-white/[0.02] text-sm">
                <SelectValue placeholder="Chọn phạm vi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="semester">Học kỳ này</SelectItem>
                <SelectItem value="all">Tất cả</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/15 text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white cursor-pointer disabled:opacity-50"
          >
            {exporting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Đang xuất...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Xuất {format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Sample data for top students (would come from real data in production)
const TOP_STUDENTS = [
  { name: "Nguyễn Minh Châu", avg: 9.5, class: "K22A" },
  { name: "Trần Hoàng Nam", avg: 9.3, class: "K21" },
  { name: "Lê Thị Hạnh", avg: 9.1, class: "K22B" },
  { name: "Phạm Văn Đức", avg: 8.9, class: "K22A" },
  { name: "Đỗ Thanh Thảo", avg: 8.8, class: "K21" },
];

// Sample activity data
const RECENT_ACTIVITIES = [
  {
    type: "submission" as const,
    message: "Nguyễn Văn An vừa nộp bài quiz 'HTTP Methods'",
    time: "2 phút trước",
  },
  {
    type: "achievement" as const,
    message: "Trần Thị Bình đạt điểm cao nhất tuần (9.8/10)",
    time: "15 phút trước",
  },
  {
    type: "quiz" as const,
    message: "Quiz 'React Hooks' đã được tạo cho lớp K22A",
    time: "1 giờ trước",
  },
  {
    type: "submission" as const,
    message: "Lê Hoàng Cường vừa hoàn thành quiz 'SQL Joins'",
    time: "2 giờ trước",
  },
  {
    type: "achievement" as const,
    message: "Lớp K22A đạt tỷ lệ nộp bài 95% trong tuần",
    time: "3 giờ trước",
  },
  {
    type: "quiz" as const,
    message: "Quiz 'JWT Authentication' đã đóng",
    time: "5 giờ trước",
  },
];

export default function AnimatedAnalyticsPage({
  stats,
  analyticsWeekly,
}: AnimatedAnalyticsPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // State for filters
  const [timeRange, setTimeRange] = useState<"week" | "month" | "semester">(
    "week",
  );
  const [classFilter, setClassFilter] = useState<string>("all");
  const [showExportModal, setShowExportModal] = useState(false);

  // Sample trend data (would come from real data in production)
  const trends = [
    { value: 12, isPositive: true },
    { value: 8, isPositive: true },
    { value: 5, isPositive: false },
    { value: 15, isPositive: true },
  ];

  // Calculate quick insights with sparkline data
  const insights = useMemo(() => {
    const totalSubmissions = analyticsWeekly.reduce(
      (sum, d) => sum + d.submissions,
      0,
    );
    const avgScore =
      analyticsWeekly.reduce((sum, d) => sum + d.avg, 0) /
      analyticsWeekly.length;
    const bestDay = analyticsWeekly.reduce(
      (best, d) => (d.avg > best.avg ? d : best),
      analyticsWeekly[0],
    );
    const mostActiveDay = analyticsWeekly.reduce(
      (best, d) => (d.submissions > best.submissions ? d : best),
      analyticsWeekly[0],
    );

    return [
      {
        title: "Tổng lượt nộp",
        value: String(totalSubmissions),
        icon: <Award className="w-4 h-4" />,
        color: "bg-violet-500/20 text-violet-400",
        sparklineData: analyticsWeekly.map((d) => d.submissions),
      },
      {
        title: "Điểm TB tuần",
        value: `${avgScore.toFixed(1)}/10`,
        icon: <Target className="w-4 h-4" />,
        color: "bg-emerald-500/20 text-emerald-400",
        sparklineData: analyticsWeekly.map((d) => d.avg),
      },
      {
        title: "Ngày tốt nhất",
        value: bestDay.day,
        icon: <TrendingUp className="w-4 h-4" />,
        color: "bg-blue-500/20 text-blue-400",
      },
      {
        title: "Ngày sôi động nhất",
        value: mostActiveDay.day,
        icon: <Clock className="w-4 h-4" />,
        color: "bg-amber-500/20 text-amber-400",
      },
    ];
  }, [analyticsWeekly]);

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
            },
          );

          // Header entrance
          gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: -20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: 0.1,
              ease: "power2.out",
            },
          );

          // Animate section titles
          const sectionTitles =
            containerRef.current?.querySelectorAll("section h2");
          if (sectionTitles && sectionTitles.length > 0) {
            gsap.fromTo(
              sectionTitles,
              { opacity: 0, x: -10 },
              {
                opacity: 1,
                x: 0,
                duration: 0.4,
                stagger: 0.1,
                delay: 0.2,
                ease: "power2.out",
              },
            );
          }
        },
        { scope: containerRef },
      );

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="space-y-8 max-w-6xl">
      {/* Header with controls */}
      <div ref={headerRef} className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-primary" />
            Báo cáo
          </h1>
          <p className="text-slate-400 mt-1">
            Thống kê hiệu suất lớp học và hoạt động quiz.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Time range selector */}
          <div className="flex items-center gap-1 border border-white/10 rounded-lg p-1">
            {(["week", "month", "semester"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`text-xs cursor-pointer ${
                  timeRange === range
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {range === "week"
                  ? "Tuần"
                  : range === "month"
                    ? "Tháng"
                    : "Học kỳ"}
              </Button>
            ))}
          </div>

          {/* Class filter */}
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[150px] border-white/10 bg-white/[0.02] text-sm">
              <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              <SelectValue placeholder="Tất cả lớp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả lớp</SelectItem>
              <SelectItem value="K22A">Lớp K22A</SelectItem>
              <SelectItem value="K22B">Lớp K22B</SelectItem>
              <SelectItem value="K21">Lớp K21</SelectItem>
            </SelectContent>
          </Select>

          {/* Export button */}
          <Button
            onClick={() => setShowExportModal(true)}
            variant="outline"
            size="sm"
            className="ml-auto border-white/15 text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Xuất dữ liệu
          </Button>
        </div>
      </div>

      {/* Stats cards with trends */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, index) => (
          <EnhancedStatCard
            key={s.label}
            s={s}
            index={index}
            trend={trends[index]}
          />
        ))}
      </div>

      {/* Quick insights */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Tổng quan nhanh
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {insights.map((insight, index) => (
            <QuickInsightCard key={index} {...insight} />
          ))}
        </div>
      </section>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Submissions chart */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">
            Lượt nộp theo ngày
          </h2>
          <Card className="bg-white/[0.03] border-white/8">
            <CardContent className="p-6">
              <AnimatedBarChart data={analyticsWeekly} />
            </CardContent>
          </Card>
        </section>

        {/* Score distribution */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">
            Phân bố điểm số
          </h2>
          <Card className="bg-white/[0.03] border-white/8">
            <CardContent className="p-6">
              <ScoreDistributionChart data={analyticsWeekly} />
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Top Students and Activity Feed */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section>
          <TopStudentsCard students={TOP_STUDENTS} />
        </section>
        <section>
          <RecentActivityFeed activities={RECENT_ACTIVITIES} />
        </section>
      </div>

      {/* Daily average scores */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Điểm trung bình theo ngày
          </h2>
          <span className="text-xs text-slate-500">Thang điểm 10</span>
        </div>
        <Card className="bg-white/[0.03] border-white/8 overflow-hidden">
          {analyticsWeekly.map((d, i) => (
            <AnimatedProgressRow key={d.day} d={d} index={i} />
          ))}
        </Card>
      </section>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
