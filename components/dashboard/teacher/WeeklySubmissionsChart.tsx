"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ANALYTICS_WEEKLY } from "@/app/dashboard/teacher/data";

export default function WeeklySubmissionsChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = ANALYTICS_WEEKLY;
  const maxSubmissions = 20;
  const maxAvg = 10;

  // SVG dimensions
  const width = 500;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const stepX = chartWidth / (data.length - 1);

  // Compute coordinates for Line Chart (Average Score)
  const linePoints = data.map((d, i) => {
    const x = paddingLeft + i * stepX;
    const y = height - paddingBottom - (d.avg / maxAvg) * chartHeight;
    return { x, y, ...d };
  });

  // Create SVG path string for the line
  const linePath = linePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Create SVG path string for the filled area under the line
  const areaPath = `
    ${linePath}
    L ${linePoints[linePoints.length - 1].x} ${height - paddingBottom}
    L ${linePoints[0].x} ${height - paddingBottom}
    Z
  `;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 h-full flex flex-col relative overflow-hidden group">
      {/* Glow highlight */}
      <div className="absolute -inset-px bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-white text-sm font-semibold">Hiệu suất bài kiểm tra</h3>
          <p className="text-xs text-slate-400 mt-0.5">Số bài nộp & điểm trung bình hàng tuần</p>
        </div>
        <div className="flex gap-4 text-[10px] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
            <span className="text-slate-400">Bài nộp (Cột)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Điểm TB (Đường)</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative min-h-[180px] z-10">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grids */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + ratio * chartHeight;
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-500 text-[9px] font-medium"
                >
                  {Math.round(maxSubmissions * (1 - ratio))}
                </text>
                <text
                  x={width - paddingRight + 8}
                  y={y + 3}
                  textAnchor="start"
                  className="fill-slate-500 text-[9px] font-medium"
                >
                  {((1 - ratio) * maxAvg).toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Bar Chart (Submissions) */}
          {data.map((d, i) => {
            const barWidth = 20;
            const x = paddingLeft + i * stepX - barWidth / 2;
            const barHeight = (d.submissions / maxSubmissions) * chartHeight;
            const y = height - paddingBottom - barHeight;

            return (
              <g key={i} className="group/bar">
                {/* Visual Bar */}
                <motion.rect
                  initial={{ height: 0, y: height - paddingBottom }}
                  animate={{ height: barHeight, y }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  className="fill-gradient-to-t fill-indigo-600/80 hover:fill-indigo-500 transition-colors"
                  style={{
                    fill: hoveredIdx === i ? "url(#indigoGlow)" : "url(#indigoGrad)",
                  }}
                />

                {/* Invisible larger hover area */}
                <rect
                  x={x - 15}
                  y={paddingTop}
                  width={barWidth + 30}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}

          {/* SVG Gradients definitions */}
          <defs>
            <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="indigoGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area under Line Chart */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            d={areaPath}
            fill="url(#emeraldGrad)"
            className="pointer-events-none"
          />

          {/* Line Chart Path */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
            d={linePath}
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="pointer-events-none"
          />

          {/* Line Chart Points (Nodes) */}
          {linePoints.map((p, i) => (
            <g key={i} className="pointer-events-none">
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: hoveredIdx === i ? 1.4 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 6 : 4}
                className="fill-emerald-400 stroke-[#05040f]"
                strokeWidth="2"
              />
              {hoveredIdx === i && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  className="fill-emerald-400/10 stroke-none"
                />
              )}
            </g>
          ))}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            const x = paddingLeft + i * stepX;
            return (
              <text
                key={i}
                x={x}
                y={height - 12}
                textAnchor="middle"
                className="fill-slate-400 text-[10px] font-semibold"
              >
                {d.day}
              </text>
            );
          })}
        </svg>

        {/* Tooltip Overlay */}
        {hoveredIdx !== null && (
          <div
            className="absolute rounded-xl bg-[#090915] border border-white/10 p-3 shadow-xl pointer-events-none flex flex-col gap-1 z-20 text-[11px] leading-4"
            style={{
              left: `${Math.min(
                Math.max((hoveredIdx * stepX) + paddingLeft - 60, 10),
                width - 150
              )}px`,
              top: `${Math.max(
                height -
                  paddingBottom -
                  (data[hoveredIdx].submissions / maxSubmissions) * chartHeight -
                  75,
                10
              )}px`,
            }}
          >
            <p className="text-white font-bold mb-1 border-b border-white/5 pb-1">
              Thứ {data[hoveredIdx].day === "CN" ? "Nhật" : data[hoveredIdx].day.replace("T", "")}
            </p>
            <p className="text-indigo-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Bài nộp: {data[hoveredIdx].submissions} bài
            </p>
            <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Điểm TB: {data[hoveredIdx].avg.toFixed(1)}/10
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
