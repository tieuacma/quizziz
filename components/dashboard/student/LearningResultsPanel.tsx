"use client";

import { motion } from 'framer-motion';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { LEARNING_RESULTS } from '@/app/dashboard/student/data';

type Result = (typeof LEARNING_RESULTS)[number];

function gpaFromResults(results: readonly Result[]) {
  const avg =
    results.reduce((sum, r) => sum + r.currentAvg, 0) / Math.max(results.length, 1);
  return parseFloat(avg.toFixed(1));
}

export default function LearningResultsPanel({
  results,
}: {
  results: readonly Result[];
}) {
  const gpa = gpaFromResults(results);
  const targetGpa = 8.5; // Overall target
  const pct = Math.min((gpa / 10) * 100, 100);

  const radius = 22;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const isExcellent = gpa >= 8.0;
  const isAverage = gpa >= 6.5 && gpa < 8.0;
  const gpaColor = isExcellent
    ? 'text-emerald-400'
    : isAverage
    ? 'text-amber-400'
    : 'text-rose-400';

  const gpaStroke = isExcellent
    ? '#10b981'
    : isAverage
    ? '#f59e0b'
    : '#ef4444';

  return (
    <DashboardCard className="h-full flex flex-col overflow-hidden">
      {/* Header with Circular GPA Gauge */}
      <div className="px-5 py-4 border-b border-white/8 bg-gradient-to-br from-indigo-500/[0.03] to-transparent flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            Điểm TB học kỳ
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-3xl font-black ${gpaColor}`}>{gpa.toFixed(1)}</span>
            <span className="text-slate-500 text-xs font-semibold">/10</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            🎯 Mục tiêu: {targetGpa}
          </p>
        </div>

        {/* Circular GPA Ring */}
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
          <svg className="w-14 h-14 transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r={radius}
              className="stroke-white/5 fill-none"
              strokeWidth={strokeWidth}
            />
            <motion.circle
              cx="28"
              cy="28"
              r={radius}
              className="fill-none stroke-current"
              style={{ stroke: gpaStroke }}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-[10px] font-bold text-slate-400">
            {pct.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Results List */}
      <ul className="flex-1 divide-y divide-white/8">
        {results.map((r, i) => {
          const onTrack = r.currentAvg >= r.targetAvg;
          return (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <p className="text-xs font-bold text-white truncate">{r.course}</p>
                <span
                  className={`text-xs font-bold shrink-0 ${
                    onTrack ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {r.currentAvg.toFixed(1)} <span className="text-slate-500 text-[10px] font-medium">/ {r.targetAvg}</span>
                </span>
              </div>
              
              {/* Progress mini bar */}
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
                  className={`h-full rounded-full ${
                    onTrack
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                />
              </div>
            </motion.li>
          );
        })}
      </ul>
    </DashboardCard>
  );
}

