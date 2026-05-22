import * as React from 'react'

export default function DashboardCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={
        "rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors " +
        (className ?? '')
      }
    >
      {children}
    </div>
  )
}

