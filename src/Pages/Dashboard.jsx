import { Link } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  ChartNoAxesCombined,
  GraduationCap,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Dashboard({ faculty = false }) {
  const { user } = useAuth();

  const stats = faculty
    ? [
        {
          title: "Subjects",
          value: "—",
          note: "Assigned subjects",
          Icon: BookOpen,
          color: "bg-violet-50 text-violet-700",
        },
        {
          title: "Students",
          value: "—",
          note: "Across your classes",
          Icon: Users,
          color: "bg-blue-50 text-blue-700",
        },
        {
          title: "Sessions",
          value: "—",
          note: "Attendance sessions",
          Icon: CalendarCheck,
          color: "bg-emerald-50 text-emerald-700",
        },
        {
          title: "Reports",
          value: "—",
          note: "Attendance overview",
          Icon: ChartNoAxesCombined,
          color: "bg-rose-50 text-rose-700",
        },
      ]
    : [
        {
          title: "Attendance rate",
          value: "—",
          note: "Your overall attendance",
          Icon: ChartNoAxesCombined,
          color: "bg-violet-50 text-violet-700",
        },
        {
          title: "Classes attended",
          value: "—",
          note: "Recorded attendance",
          Icon: CalendarCheck,
          color: "bg-blue-50 text-blue-700",
        },
        {
          title: "Subjects",
          value: "—",
          note: "Your enrolled subjects",
          Icon: BookOpen,
          color: "bg-emerald-50 text-emerald-700",
        },
        {
          title: "Improvement",
          value: "Keep going",
          note: "Consistency matters",
          Icon: TrendingUp,
          color: "bg-rose-50 text-rose-700",
        },
      ];

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 pb-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-800 via-indigo-800 to-slate-900 p-6 text-white shadow-lg sm:p-8 lg:p-10">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-violet-400/10" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-violet-100">
              <Sparkles size={14} />
              <span>AttendWise Dashboard</span>
            </div>

            <p className="text-sm text-indigo-200">{today}</p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Hello, {user?.name?.split(" ")[0] || "there"}!
              <span className="ml-2 inline-block">👋</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
              {faculty
                ? "Welcome back! Manage your classes, organize attendance, and keep your students on track."
                : "Welcome back! Review your attendance, monitor your academic progress, and keep moving toward your goals."}
            </p>

            <Link
              to="/attendance"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-800 shadow-sm transition hover:bg-indigo-50"
            >
              {faculty ? "Manage attendance" : "View attendance"}
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="hidden shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 p-6 sm:flex">
            <GraduationCap
              size={68}
              strokeWidth={1.4}
              className="text-white"
            />
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {faculty
                ? "A snapshot of your teaching activity"
                : "A snapshot of your academic activity"}
            </p>
          </div>

          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
            Attendance data pending
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ title, value, note, Icon, color }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {title}
                  </p>

                  <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                    {value}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${color}`}>
                  <Icon size={22} strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workspace and quick links */}
      <section className="grid gap-5 lg:grid-cols-5">
        {/* Workspace */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-3 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
              <BookOpen size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your workspace
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {faculty
                  ? "Access your subjects and manage attendance records for your classes."
                  : "Review attendance records and identify where you can improve your attendance."}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              {faculty
                ? "Ready to manage your classes?"
                : "Stay consistent with your attendance"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {faculty
                ? "Open your attendance workspace to continue."
                : "Regular attendance can help you stay on track academically."}
            </p>

            <Link
              to="/attendance"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
            >
              Open workspace
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Quick links */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2 sm:p-7">
          <h2 className="text-lg font-bold text-slate-900">
            Quick links
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Navigate to your frequently used pages.
          </p>

          <div className="mt-5 space-y-3">
            <Link
              to="/profile"
              className="group flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50/60"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                  <Users size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    My profile
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    View your account details
                  </p>
                </div>
              </div>

              <ArrowRight
                size={17}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-700"
              />
            </Link>

            {faculty && (
              <Link
                to="/subjects"
                className="group flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50/60"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                    <BookOpen size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      My subjects
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      View assigned subjects
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={17}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-700"
                />
              </Link>
            )}

            <Link
              to="/attendance"
              className="group flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50/60"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-rose-50 p-2 text-rose-700">
                  <CalendarCheck size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Attendance history
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Review attendance records
                  </p>
                </div>
              </div>

              <ArrowRight
                size={17}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-700"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <p className="text-center text-xs text-slate-400">
        AttendWise · Smart Attendance Management
      </p>
    </div>
  );
}