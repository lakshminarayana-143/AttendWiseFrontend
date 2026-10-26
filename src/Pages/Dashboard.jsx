
import { Link } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  ChartNoAxesCombined,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Dashboard({ faculty = false }) {
  const { user } = useAuth();

  const stats = faculty
    ? [
        ["Subjects", "—", "Assigned subjects", BookOpen],
        ["Students", "—", "Across your classes", Users],
        ["Sessions", "—", "Attendance sessions", CalendarCheck],
        ["Reports", "—", "Attendance overview", ChartNoAxesCombined],
      ]
    : [
        ["Attendance rate", "—", "Connect attendance API", ChartNoAxesCombined],
        ["Classes attended", "—", "Recorded attendance", CalendarCheck],
        ["Subjects", "—", "Enrolled subjects", BookOpen],
        ["Improvement", "Keep going", "Consistency matters", TrendingUp],
      ];

  return (
    <div className="space-y-7">

      <section className="rounded-3xl bg-gradient-to-r from-violet-800 via-violet-700 to-[#800020] p-7 text-white sm:p-9">
        <p className="text-sm text-white/70">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>

        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
          Hello, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
          {faculty
            ? "Manage classes and keep attendance records organized."
            : "Check your attendance and stay on track with your academic goals."}
        </p>

        <GraduationCap className="mt-5 text-white/70" size={35} />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">Overview</h2>
          <span className="text-xs text-slate-500">
            Live values require backend API integration
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([title, value, note, Icon], index) => (
            <div
              key={title}
              className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{title}</p>
                  <p className="mt-2 text-3xl font-extrabold">{value}</p>
                  <p className="mt-2 text-xs text-slate-500">{note}</p>
                </div>

                <span
                  className={`rounded-xl p-3 ${
                    index === 1
                      ? "bg-rose-100 text-[#800020]"
                      : "bg-violet-100 text-violet-800"
                  }`}
                >
                  <Icon size={21} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-violet-100 bg-white p-6">
          <h2 className="font-bold">Your workspace</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {faculty
              ? "Review class attendance and access the subjects assigned to you."
              : "Review recorded sessions and identify where you can improve attendance."}
          </p>

          <Link
            to="/attendance"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-violet-800"
          >
            View attendance <ArrowRight size={16} />
          </Link>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white p-6">
          <h2 className="font-bold">Quick links</h2>

          <div className="mt-4 space-y-2">
            <Link
              to="/profile"
              className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm hover:bg-violet-50"
            >
              My profile <ArrowRight size={16} />
            </Link>

            {faculty && (
              <Link
                to="/subjects"
                className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm hover:bg-violet-50"
              >
                My subjects <ArrowRight size={16} />
              </Link>
            )}

            <Link
              to="/attendance"
              className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm hover:bg-violet-50"
            >
              Attendance history <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

