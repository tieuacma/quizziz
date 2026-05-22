import DashboardCard from '@/components/dashboard/DashboardCard'
import { SCHEDULE } from '@/app/dashboard/student/data'

type ScheduleItem = (typeof SCHEDULE)[number]

const DAY_COLORS: Record<string, string> = {
  T2: 'from-blue-500/20 to-cyan-500/10 text-blue-300',
  T3: 'from-violet-500/20 to-purple-500/10 text-violet-300',
  T4: 'from-emerald-500/20 to-teal-500/10 text-emerald-300',
  T5: 'from-amber-500/20 to-orange-500/10 text-amber-300',
  T6: 'from-rose-500/20 to-pink-500/10 text-rose-300',
  T7: 'from-slate-500/20 to-slate-500/10 text-slate-300',
}

export default function SchedulePanel({
  schedule,
}: {
  schedule: readonly ScheduleItem[]
}) {
  return (
    <DashboardCard className="h-full p-4">
      <ul className="space-y-3">
        {schedule.map((s) => (
          <li
            key={s.id}
            className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors"
          >
            <div
              className={`shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br flex flex-col items-center justify-center font-bold text-xs ${
                DAY_COLORS[s.day] ?? DAY_COLORS.T2
              }`}
            >
              <span>{s.day}</span>
              <span className="text-[10px] font-normal opacity-80">{s.time}</span>
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-medium text-white leading-snug">{s.lesson}</p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{s.course}</p>
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}
