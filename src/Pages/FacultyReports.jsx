
import { useEffect, useState } from "react";
import {
  ChartColumnIncreasing,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  CalendarDays,
  Download,
} from "lucide-react";

import { API } from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

export default function FacultyReports() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState("");
  const [showBelow75, setShowBelow75] = useState(false);

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      setError("");

      const response = await API.get("/Subject/my-subjects");

      const subjectList = response.data?.subjects || [];
      setSubjects(subjectList);

      if (
        selectedSubject &&
        !subjectList.some(
          (subject) => subject._id === selectedSubject
        )
      ) {
        setSelectedSubject("");
        setReport(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load subjects."
      );
    } finally {
      setLoadingSubjects(false);
    }
  };

  const loadReport = async () => {
    if (!selectedSubject) {
      setError("Please select a subject.");
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      setError("Start date cannot be after end date.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setReport(null);

      const response = await API.get(
        `/Attendance/report/${selectedSubject}`,
        {
          params: {
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          },
        }
      );

      setReport(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to generate attendance report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const exportCSV = () => {
    if (!report?.report?.length) return;

    const headers = [
      "Student Name",
      "Email",
      "Student ID",
      "Total Classes",
      "Present",
      "Absent",
      "Attendance Percentage",
    ];

    const rows = report.report.map((item) => [
      item.student.name,
      item.student.email,
      item.student.studentId || "",
      item.totalClasses,
      item.present,
      item.absent,
      `${item.percentage}%`,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "attendance-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };
  const displayedReport = report?.report.filter((item) =>
  showBelow75 ? item.percentage < 75 : true
) || [];

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-7">
        {/* Header */}
        <div>
          <p className="text-sm font-bold text-violet-700">
            FACULTY WORKSPACE
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Attendance Reports
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Analyze attendance performance for your subjects.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 font-bold text-slate-900">
            Report Filters
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Select Subject
              </label>

              <select
                value={selectedSubject}
                onChange={(event) => {
                  setSelectedSubject(event.target.value);
                  setReport(null);
                  setError("");
                }}
                disabled={loadingSubjects}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500"
              >
                <option value="">
                  {loadingSubjects
                    ? "Loading subjects..."
                    : "Choose a subject"}
                </option>

                {subjects.map((subject) => (
                  <option
                    key={subject._id}
                    value={subject._id}
                  >
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={loadReport}
              disabled={loading || loadingSubjects || !selectedSubject}
              className="flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw size={17} className="animate-spin" />
              ) : (
                <ChartColumnIncreasing size={17} />
              )}

              {loading ? "Generating..." : "Generate Report"}
            </button>

            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setReport(null);
                setError("");
              }}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear Dates
            </button>
          </div>
        </section>

        {/* Report Summary */}
        {report && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Students"
                value={report.summary.totalStudents}
                icon={Users}
              />

              <StatCard
                title="Present"
                value={report.summary.present}
                icon={CheckCircle2}
              />

              <StatCard
                title="Absent"
                value={report.summary.absent}
                icon={XCircle}
              />

              <StatCard
                title="Class Attendance"
                value={`${report.summary.percentage}%`}
                icon={ChartColumnIncreasing}
              />
            </div>

            {/* Report Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {report.subject.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {report.subject.code} ·{" "}
                    {report.subject.department} · Year{" "}
                    {report.subject.year}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {report.summary.studentsWithAttendance} of{" "}
                    {report.summary.totalStudents} students have attendance records.
                  </p>
                </div>

                <button
                  onClick={exportCSV}
                  disabled={!report.report.length}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <Download size={17} />
                  Export CSV
                </button>
              </div>
            </section>

            {/* Student Report Table */}
           
{/* Student Report Table */}
<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
    <div>
      <h2 className="font-bold text-slate-900">
        Student-wise Attendance
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {displayedReport.length} students displayed
      </p>
    </div>

    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setShowBelow75(false)}
        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
          !showBelow75
            ? "bg-violet-700 text-white"
            : "border border-slate-300 text-slate-700 hover:bg-slate-50"
        }`}
      >
        All Students
      </button>

      <button
        onClick={() => setShowBelow75(true)}
        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
          showBelow75
            ? "bg-rose-600 text-white"
            : "border border-rose-200 text-rose-700 hover:bg-rose-50"
        }`}
      >
        Below 75%
      </button>
    </div>
  </div>

  {displayedReport.length === 0 ? (
    <div className="p-10 text-center text-sm text-slate-500">
      {showBelow75
        ? "Great! No students are below 75% attendance."
        : "No matching students found."}
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-violet-50 text-xs uppercase text-violet-900">
          <tr>
            <th className="px-5 py-4">Student</th>
            <th className="px-5 py-4">Student ID</th>
            <th className="px-5 py-4">Total Classes</th>
            <th className="px-5 py-4">Present</th>
            <th className="px-5 py-4">Absent</th>
            <th className="px-5 py-4">Percentage</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {displayedReport.map((item) => (
            <tr key={item.student._id}>
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-800">
                  {item.student.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {item.student.email}
                </p>
              </td>

              <td className="px-5 py-4 text-slate-600">
                {item.student.studentId || "—"}
              </td>

              <td className="px-5 py-4">
                {item.totalClasses}
              </td>

              <td className="px-5 py-4 font-semibold text-emerald-700">
                {item.present}
              </td>

              <td className="px-5 py-4 font-semibold text-rose-700">
                {item.absent}
              </td>

              <td className="px-5 py-4">
                <Percentage value={item.percentage} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

          </>
        )}

        {!report && !loading && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <CalendarDays
              size={40}
              className="mx-auto text-violet-300"
            />

            <p className="mt-3 font-semibold text-slate-700">
              No report generated yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Select a subject and generate your attendance report.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Percentage({ value }) {
  const color =
    value >= 75
      ? "bg-emerald-100 text-emerald-700"
      : value >= 50
      ? "bg-amber-100 text-amber-700"
      : "bg-rose-100 text-rose-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${color}`}>
      {value}%
    </span>
  );
}
