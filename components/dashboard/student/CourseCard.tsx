"use client";

import { COURSES } from '@/app/dashboard/student/data';
import { motion } from 'framer-motion';

type Course = (typeof COURSES)[number];

export default function CourseCard({ course }: { course: Course }) {
  const radius = 16;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (course.progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 hover:bg-white/[0.06] hover:border-white/15 transition-all cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 h-full flex flex-col justify-between relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.05)]"
      role="button"
      tabIndex={0}
    >
      {/* Glow on hover */}
      <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="min-w-0">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Môn học</span>
          <h3 className="text-white font-bold text-sm group-hover:text-indigo-300 transition-colors mt-0.5 truncate leading-5">
            {course.name}
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            {course.instructor} · <span className="text-slate-500 font-semibold">{course.credits} tín chỉ</span>
          </p>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <svg className="w-12 h-12 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-white/5 fill-none"
              strokeWidth={strokeWidth}
            />
            {/* Progress Circle */}
            <motion.circle
              cx="24"
              cy="24"
              r={radius}
              className="fill-none stroke-current"
              style={{
                stroke: `url(#courseGrad-${course.id})`,
              }}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              strokeLinecap="round"
            />
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id={`courseGrad-${course.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={course.id === 1 ? "#3b82f6" : course.id === 2 ? "#8b5cf6" : course.id === 3 ? "#10b981" : "#f43f5e"} />
                <stop offset="100%" stopColor={course.id === 1 ? "#06b6d4" : course.id === 2 ? "#d946ef" : course.id === 3 ? "#14b8a6" : "#ec4899"} />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-[10px] font-black text-white">{course.progress}%</span>
        </div>
      </div>

      <div className="mt-6 space-y-2 relative z-10">
        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wide">
          <span>Tiến trình hoàn thành</span>
          <span className="text-indigo-400">{course.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${course.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${course.color} shadow-[0_0_8px_rgba(99,102,241,0.2)]`}
          />
        </div>
      </div>
    </motion.div>
  );
}

