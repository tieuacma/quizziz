import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import { CalendarDays } from 'lucide-react'
import SectionHeader from '@/components/dashboard/SectionHeader'
import SchedulePanel from '@/components/dashboard/student/SchedulePanel'
import StudentSubpageHeader from '@/components/dashboard/student/StudentSubpageHeader'
import { SCHEDULE } from '@/app/dashboard/student/data'

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const

export default async function SchedulePage() {
  const session = await getSession()
  if (!session || session.role !== 'student') redirect('/dashboard')

  const byDay = WEEK_DAYS.map((day) => ({
    day,
    items: SCHEDULE.filter((s) => s.day === day),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <StudentSubpageHeader
        title="Schedule"
        description={`${SCHEDULE.length} buổi học trong tuần`}
        aside={
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-3 text-center sm:text-right min-w-[120px]">
            <p className="text-[11px] uppercase tracking-wider text-indigo-400/80 font-semibold">
              Buổi/tuần
            </p>
            <p className="text-2xl font-bold text-indigo-400 mt-0.5">{SCHEDULE.length}</p>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SectionHeader icon={CalendarDays} title="Lịch sắp tới" />
          <SchedulePanel schedule={SCHEDULE} />
        </section>

        <section>
          <SectionHeader icon={CalendarDays} title="Theo ngày" />
          <div className="space-y-4">
            {byDay.map(({ day, items }) => (
              <div
                key={day}
                className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden"
              >
                <div className="px-4 py-2.5 border-b border-white/8 bg-white/[0.02]">
                  <span className="text-sm font-semibold text-indigo-400">{day}</span>
                </div>
                <ul className="divide-y divide-white/8">
                  {items.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{s.lesson}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{s.course}</p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{s.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
