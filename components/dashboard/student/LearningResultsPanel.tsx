import DashboardCard from '@/components/dashboard/DashboardCard'
import { LEARNING_RESULTS } from '@/app/dashboard/student/data'

type Result = (typeof LEARNING_RESULTS)[number]

function gpaFromResults(results: readonly Result[]) {
  const avg =
    results.reduce((sum, r) => sum + r.currentAvg, 0) / Math.max(results.length, 1)
  return avg.toFixed(1)
}

export default function LearningResultsPanel({
  results,
}: {
  results: readonly Result[]
}) {
  const gpa = gpaFromResults(results)

  return (
    <DashboardCard className="h-full flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-white/8 bg-gradient-to-br from-emerald-500/10 to-transparent">
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
          Điểm TB học kỳ
        </p>
        <p className="text-3xl font-bold text-emerald-400 mt-1">{gpa}</p>
        <p className="text-xs text-slate-400 mt-0.5">Thang điểm 10</p>
      </div>

      <ul className="flex-1 divide-y divide-white/8">
        {results.map((r) => {
          const onTrack = r.currentAvg >= r.targetAvg
          return (
            <li key={r.id} className="px-5 py-3.5 hover:bg-white/[0.03] transition-colors">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-sm font-medium text-white truncate">{r.course}</p>
                <span
                  className={`text-xs font-semibold shrink-0 ${
                    onTrack ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {r.currentAvg}/{r.targetAvg}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    onTrack
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                  style={{ width: `${r.progress}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </DashboardCard>
  )
}
