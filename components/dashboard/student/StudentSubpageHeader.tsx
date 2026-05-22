import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function StudentSubpageHeader({
  title,
  description,
  aside,
}: {
  title: string
  description: string
  aside?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Link
          href="/dashboard/student"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Tổng quan
        </Link>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="text-slate-400 mt-1">{description}</p>
      </div>
      {aside}
    </div>
  )
}
