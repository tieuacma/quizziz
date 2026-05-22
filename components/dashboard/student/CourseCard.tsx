import { COURSES } from '@/app/dashboard/student/data'

type Course = (typeof COURSES)[number]

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div
      className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 h-full flex flex-col"
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-white font-semibold group-hover:text-violet-300 transition-colors truncate">
            {course.name}
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {course.instructor} · {course.credits} tín chỉ
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-slate-300 bg-white/8 px-2.5 py-1 rounded-full">
          {course.progress}%
        </span>
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>Tiến độ</span>
          <span>{course.progress}% hoàn thành</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${course.color} transition-all`}
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
