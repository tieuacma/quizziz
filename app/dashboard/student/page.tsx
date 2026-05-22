import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import SectionHeader from '@/components/dashboard/SectionHeader'
import StatCard from '@/components/dashboard/StatCard'

const COURSES = [
  {
    id: 1,
    name: 'Toán Giải Tích',
    instructor: 'TS. Lê Văn C',
    progress: 72,
    color: 'from-blue-500 to-cyan-500',
    credits: 3,
  },
  {
    id: 2,
    name: 'Lập Trình Web',
    instructor: 'ThS. Phạm Thị D',
    progress: 88,
    color: 'from-violet-500 to-purple-500',
    credits: 3,
  },
  {
    id: 3,
    name: 'Cơ Sở Dữ Liệu',
    instructor: 'TS. Hoàng Văn E',
    progress: 45,
    color: 'from-emerald-500 to-teal-500',
    credits: 4,
  },
  {
    id: 4,
    name: 'Mạng Máy Tính',
    instructor: 'TS. Ngô Thị F',
    progress: 60,
    color: 'from-rose-500 to-pink-500',
    credits: 3,
  },
]

const ASSIGNMENTS = [
  {
    id: 1,
    title: 'Bài tập Tích phân bất định',
    course: 'Toán Giải Tích',
    due: '29/04/2026',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Xây dựng REST API với Next.js',
    course: 'Lập Trình Web',
    due: '01/05/2026',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Thiết kế ERD hệ thống thư viện',
    course: 'CSDL',
    due: '25/04/2026',
    status: 'submitted',
  },
]

export default async function StudentPage() {
  const session = await getSession()
  if (!session || session.role !== 'student') redirect('/dashboard')

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">Xin chào, {session.name} 👋</h1>
        <p className="text-slate-400 mt-1">Đây là tổng quan học tập của bạn hôm nay.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Khóa học', value: '4', icon: '📚', color: 'text-blue-400' },
          { label: 'Bài tập', value: '2', icon: '📝', color: 'text-amber-400' },
          { label: 'GPA', value: '3.6', icon: '🏆', color: 'text-emerald-400' },
          { label: 'Điểm danh', value: '94%', icon: '✅', color: 'text-violet-400' },
        ].map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
            valueClassName={s.color}
          />
        ))}
      </div>

      {/* Courses */}
      <section>
        <SectionHeader icon={BookOpen} title="Khóa học đang theo học" />
        <div className="grid sm:grid-cols-2 gap-4">
          {COURSES.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-white/8 bg-white/4 p-5 hover:bg-white/7 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
              role="button"
              tabIndex={0}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold group-hover:text-violet-300 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {c.instructor} · {c.credits} tín chỉ
                  </p>
                </div>
                <span className="text-xs text-slate-400 bg-white/8 px-2 py-1 rounded-full">
                  {c.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${c.color} transition-all`}
                  style={{ width: `${c.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Assignments */}
      <section>
        <SectionHeader icon={BookOpen} title="Bài tập sắp đến hạn" />
        <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden">
          {ASSIGNMENTS.map((a, i) => (
            <div
              key={a.id}
              className={`flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors ${
                i !== 0 ? 'border-t border-white/8' : ''
              }`}
            >
              <div>
                <p className="text-white text-sm font-medium">{a.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">{a.course}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-slate-400 text-xs hidden sm:block">📅 {a.due}</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    a.status === 'submitted'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  {a.status === 'submitted' ? 'Đã nộp' : 'Chờ nộp'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

