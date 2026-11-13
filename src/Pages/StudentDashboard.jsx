
import { useEffect, useState } from "react";
import { API } from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

import {
  BookOpen,
  CalendarCheck,
  CalendarX,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Target,
} from "lucide-react";

const EMPTY_SUMMARY = {
  total: 0,
  present: 0,
  absent: 0,
  percentage: 0,
};

const ATTENDANCE_TARGET = 75;

export default function StudentDashboard() {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/Attendance/my-attendance");
      const data = response.data;

      const attendanceRecords = Array.isArray(data.attendance)
        ? data.attendance
        : [];

      const overallSummary = data.summary || EMPTY_SUMMARY;

      setSummary({
        total: Number(overallSummary.total || 0),
        present: Number(overallSummary.present || 0),
        absent: Number(overallSummary.absent || 0),
        percentage: Number(overallSummary.percentage || 0),
      });

      // Calculate subject-wise attendance.
      const subjectMap = {};

      attendanceRecords.forEach((record) => {
        if (!record.subject?._id) return;

        const subjectId = record.subject._id;

        if (!subjectMap[subjectId]) {
          subjectMap[subjectId] = {
            id: subjectId,
            name: record.subject.name || "Unknown Subject",
            code: record.subject.code || "",
            total: 0,
            present: 0,
            absent: 0,
          };
        }

        subjectMap[subjectId].total += 1;

        if (record.status === "present") {
          subjectMap[subjectId].present += 1;
        } else if (record.status === "absent") {
          subjectMap[subjectId].absent += 1;
        }
      });

      const subjectList = Object.values(subjectMap).map((subject) => {
        const percentage =
          subject.total > 0
            ? Number(
                ((subject.present / subject.total) * 100).toFixed(2)
              )
            : 0;

        // Number of consecutive present classes needed to reach 75%.
        const requiredClasses =
          percentage >= ATTENDANCE_TARGET
            ? 0
            : Math.ceil(
                (0.75 * subject.total - subject.present) / 0.25
              );

        return {
          ...subject,
          percentage,
          requiredClasses,
          isBelowTarget: percentage < ATTENDANCE_TARGET,
        };
      });

      subjectList.sort((a, b) => a.percentage - b.percentage);

      setSubjects(subjectList);
    } catch (err) {
      console.error("Student dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your attendance details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return "text-emerald-600";
    if (percentage >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  const belowTargetSubjects = subjects.filter(
    (subject) => subject.isBelowTarget
  );

  const safePercentage = Math.min(
    Math.max(summary.percentage, 0),
    100
  );

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex min-h-96 items-center justify-center">
          <RefreshCw
            className="animate-spin text-violet-700"
            size={28}
          />
          <span className="ml-3 text-slate-500">
            Loading your dashboard...
          </span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-7">
        {/* Welcome Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track your attendance and academic progress.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAttendance}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Overall Attendance"
            value={`${summary.percentage.toFixed(2)}%`}
            icon={TrendingUp}
            color="violet"
          />

          <StatCard
            title="Total Classes"
            value={summary.total}
            icon={BookOpen}
            color="blue"
          />

          <StatCard
            title="Present Classes"
            value={summary.present}
            icon={CalendarCheck}
            color="green"
          />

          <StatCard
            title="Absent Classes"
            value={summary.absent}
            icon={CalendarX}
            color="rose"
          />
        </div>

        {/* Overall Attendance Progress */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Attendance Progress
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your overall attendance against the 75% target.
              </p>
            </div>

            <span
              className={`text-2xl font-bold ${getPercentageColor(
                summary.percentage
              )}`}
            >
              {summary.percentage.toFixed(2)}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${getProgressColor(
                summary.percentage
              )}`}
              style={{
                width: `${safePercentage}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>75% Target</span>
            <span>100%</span>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            {summary.total === 0 ? (
              <p className="text-sm text-slate-600">
                No attendance records available yet. Your progress will
                appear after faculty members mark attendance.
              </p>
            ) : summary.percentage >= ATTENDANCE_TARGET ? (
              <div className="flex items-start gap-2 text-emerald-700">
                <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                <p className="text-sm font-medium">
                  Great work! You have reached the 75% attendance target.
                  Keep maintaining your attendance.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-rose-700">
                <AlertTriangle size={19} className="mt-0.5 shrink-0" />
                <p className="text-sm font-medium">
                  Your overall attendance is below 75%. Attend the next{" "}
                  {Math.ceil(
                    (0.75 * summary.total - summary.present) / 0.25
                  )}{" "}
                  consecutive classes without missing any to reach the
                  target.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Low Attendance Warnings */}
        {belowTargetSubjects.length > 0 && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                <AlertTriangle size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-amber-900">
                  Low Attendance Warnings
                </h2>

                <p className="text-sm text-amber-700">
                  {belowTargetSubjects.length} subject
                  {belowTargetSubjects.length > 1 ? "s are" : " is"} below
                  the required 75% attendance.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {belowTargetSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-amber-200 bg-white p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {subject.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {subject.code || "Subject"} · {subject.present} present
                      · {subject.absent} absent
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-bold text-rose-600">
                      {subject.percentage.toFixed(2)}%
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Needs {subject.requiredClasses} consecutive present
                      classes to reach 75%.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Subject-wise Attendance */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Subject-wise Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View your attendance performance in each subject.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <BookOpen size={17} />
              {subjects.length} Subjects
            </div>
          </div>

          {subjects.length === 0 ? (
            <div className="py-10 text-center">
              <BookOpen
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 font-semibold text-slate-700">
                No subject attendance found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your subject attendance will appear here after faculty
                members mark attendance.
              </p>
            </div>
          ) : (
            <div className="space-y-7">
              {subjects.map((subject) => (
                <div key={subject.id}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {subject.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {subject.code || "Subject"} ·{" "}
                        {subject.total} total classes ·{" "}
                        {subject.present} present · {subject.absent} absent
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-lg font-bold ${getPercentageColor(
                          subject.percentage
                        )}`}
                      >
                        {subject.percentage.toFixed(2)}%
                      </span>

                      <p className="text-xs text-slate-400">
                        Attendance
                      </p>
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${getProgressColor(
                        subject.percentage
                      )}`}
                      style={{
                        width: `${Math.min(subject.percentage, 100)}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-slate-500">
                      {subject.requiredClasses === 0
                        ? "You have reached the 75% target."
                        : `Attend ${subject.requiredClasses} more consecutive classes without absence to reach 75%.`}
                    </p>

                    {subject.isBelowTarget ? (
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                        Below 75%
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Target reached
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Attendance Target Information */}
        <section className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <Target size={21} className="mt-0.5 shrink-0 text-blue-600" />

          <div>
            <h3 className="font-semibold text-blue-900">
              Attendance Target: 75%
            </h3>

            <p className="mt-1 text-sm text-blue-700">
              Keep track of your attendance regularly. The required class
              counts are estimates based on your currently recorded
              attendance and assume you attend every upcoming class.
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    violet: "bg-violet-100 text-violet-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
