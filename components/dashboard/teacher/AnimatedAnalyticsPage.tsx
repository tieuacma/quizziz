"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Puzzle, Target } from "lucide-react";

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

// Animated Stat Card Component
function AnimatedStatCard({ s, index }: { s: StatData; index: number }) {
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
      <Card className="bg-white/[0.03] border-white/8 h-full overflow-hidden">
        <CardContent className="p-5 relative">
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
          <p ref={valueRef} className={`text-3xl font-bold mt-2 ${s.color}`}>
            {s.value}
          </p>
          <p className="text-slate-400 text-sm mt-0.5">{s.label}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Animated Bar Chart Component
function AnimatedBarChart({ data }: { data: AnalyticsData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const maxSubmissions = Math.max(...data.map((d) => d.submissions));

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
                  stagger: 0.1,
                  delay: 0.3,
                  ease: "power2.out",
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
                { opacity: 0, y: -10 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  stagger: 0.1,
                  delay: 0.5,
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
                  duration: 0.4,
                  stagger: 0.08,
                  delay: 0.6,
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

  return (
    <div
      ref={containerRef}
      className="flex items-end justify-between gap-2 h-40"
    >
      {data.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
          <span data-number="true" className="text-[10px] text-slate-500">
            {d.submissions}
          </span>
          <div
            data-bar="true"
            className="w-full max-w-10 rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500 transition-all"
            style={{
              height: `${(d.submissions / maxSubmissions) * 100}%`,
              minHeight: "8px",
            }}
          />
          <span
            data-label="true"
            className="text-xs text-slate-400 font-medium"
          >
            {d.day}
          </span>
        </div>
      ))}
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

export default function AnimatedAnalyticsPage({
  stats,
  analyticsWeekly,
}: AnimatedAnalyticsPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className="space-y-8 max-w-5xl">
      <div ref={headerRef}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-primary" />
          Báo cáo
        </h1>
        <p className="text-slate-400 mt-1">
          Thống kê hiệu suất lớp học và hoạt động quiz trong tuần.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, index) => (
          <AnimatedStatCard key={s.label} s={s} index={index} />
        ))}
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Lượt nộp theo ngày (tuần này)
        </h2>
        <Card className="bg-white/[0.03] border-white/8">
          <CardContent className="p-6">
            <AnimatedBarChart data={analyticsWeekly} />
            <p className="text-slate-500 text-xs mt-4 text-center">
              Biểu đồ chi tiết sẽ được tích hợp khi kết nối dữ liệu thật.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">
          Điểm trung bình theo ngày
        </h2>
        <Card className="bg-white/[0.03] border-white/8 overflow-hidden">
          {analyticsWeekly.map((d, i) => (
            <AnimatedProgressRow key={d.day} d={d} index={i} />
          ))}
        </Card>
      </section>
    </div>
  );
}
