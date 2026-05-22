import * as React from 'react'

export default function StatCard({
  label,
  value,
  icon,
  className,
  valueClassName,
}: {
  label: string
  value: string
  icon: React.ReactNode
  className?: string
  valueClassName?: string
}) {
  return (
    <div
      className={
        "rounded-2xl border border-white/8 bg-white/4 p-5 hover:bg-white/7 transition-colors " +
        (className ?? '')
      }
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold mt-2 ${valueClassName ?? 'text-white'}`}>{value}</p>
      <p className="text-slate-400 text-sm mt-0.5">{label}</p>
    </div>
  )
}


