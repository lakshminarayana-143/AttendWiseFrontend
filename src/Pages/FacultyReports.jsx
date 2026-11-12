
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
  Search,
} from "lucide-react";

import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function Percentage({ value }) {
  const percentage = Number(value || 0);

  const color =
    percentage >= 75
      ? "text-green-600"
      : percentage >= 50
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <span className={`font-semibold ${color}`}>
      {percentage.toFixed(2)}%
    </span>
  );
}

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
  const [studentSearch, setStudentSearch] = useState("");

  // Load faculty subjects
  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);
      setError("");

      const response = await API.get("/Subject/my-subjects");

      const subjectList = Array.isArray(response.data)
        ? response.data
        : response.data?.subjects || [];

      setSubjects(subjectList);
    } catch (err) {
      console.error("Load subjects error:", err);

      setError(
        err.response?.data?.message || "Unable to load subjects."
      );
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Generate attendance report
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

      const params = {};

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await API.get(
        `/Attendance/report/${selectedSubject}`,
        { params }
      );

      setReport(response.data);
    } catch (err) {
      console.error("Generate report error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to generate attendance report."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load subjects when component mounts
  useEffect(() => {
    loadSubjects();
  }, []);

  // Apply search and percentage filters
  const displayedReport =
    report?.report?.filter((item) => {
      const matchesPercentage = showBelow75
        ? item.percentage < 75
        : true;

      const search = studentSearch.trim().toLowerCase();

      const matchesSearch =
        item.student?.name?.toLowerCase().includes(search) ||
        item.student?.email?.toLowerCase().includes(search) ||
        item.student?.studentId?.toLowerCase().includes(search);

      return matchesPercentage && matchesSearch;
    }) || [];

  // Export currently displayed students to CSV
  const exportCSV = () => {
    if (!displayedReport.length) {
      setError("No student records available to export.");
      return;
    }

    const headers = [
      "Student Name",
      "Student ID",
      "Email",
      "Total Classes",
      "Present",
      "Absent",
      "Attendance Percentage",
    ];

    const rows = displayedReport.map((item) => [
      item.student?.name || "",
      item.student?.studentId || "",
      item.student?.email || "",
      item.totalClasses ?? 0,
      item.present ?? 0,
      item.absent ?? 0,
      `${Number(item.percentage || 0).toFixed(2)}%`,
    ]);

    const escapeCSV = (value) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "faculty-attendance-report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Reset report filters
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStudentSearch("");
    setShowBelow75(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Attendance Reports
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View and analyze student attendance performance.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSubjects}
            disabled={loadingSubjects}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loadingSubjects ? "animate-spin" : ""}
            />
            Refresh Subjects
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Report Filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Generate Report
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Subject Selection */}
            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Select Subject
              </label>

              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setReport(null);
                  setError("");
                }}
                disabled={loadingSubjects}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  {loadingSubjects
                    ? "Loading subjects..."
                    : "Choose a subject"}
                </option>

                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>

              <input
                id="startDate"
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                End Date
              </label>

              <input
                id="endDate"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={loadReport}
                disabled={loading || loadingSubjects || !selectedSubject}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ChartColumnIncreasing size={17} />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Report Results */}
        {report && (
          <>
            {/* Subject Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {report.subject?.name || "Attendance Report"}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Subject Code: {report.subject?.code || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays size={17} />

                  <span>
                    {startDate || "All dates"} – {endDate || "Present"}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total Students</p>
                  <Users className="text-blue-600" size={22} />
                </div>

                <p className="mt-3 text-2xl font-bold text-gray-800">
                  {report.summary?.totalStudents ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Present Records</p>
                  <CheckCircle2 className="text-green-600" size={22} />
                </div>

                <p className="mt-3 text-2xl font-bold text-gray-800">
                  {report.summary?.present ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Absent Records</p>
                  <XCircle className="text-red-600" size={22} />
                </div>

                <p className="mt-3 text-2xl font-bold text-gray-800">
                  {report.summary?.absent ?? 0}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Overall Attendance
                  </p>
                  <ChartColumnIncreasing
                    className="text-purple-600"
                    size={22}
                  />
                </div>

                <p className="mt-3 text-2xl font-bold text-gray-800">
                  <Percentage value={report.summary?.percentage} />
                </p>
              </div>
            </div>

            {/* Student Report Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-gray-200 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Student Attendance Details
                    </h2>

                    <p className="text-sm text-gray-500">
                      {displayedReport.length} of{" "}
                      {report.report?.length || 0} students shown
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={exportCSV}
                    disabled={displayedReport.length === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download size={17} />
                    Export CSV
                  </button>
                </div>

                {/* Search and Percentage Filter */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="relative w-full lg:max-w-sm">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Search by name, email or student ID..."
                      className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBelow75(false)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        !showBelow75
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      All Students
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowBelow75(true)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        showBelow75
                          ? "bg-red-600 text-white"
                          : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Below 75%
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              {displayedReport.length === 0 ? (
                <div className="p-10 text-center">
                  <Users
                    size={35}
                    className="mx-auto mb-3 text-gray-300"
                  />

                  <p className="font-medium text-gray-700">
                    No students found
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your search or attendance filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-5 py-4">Student</th>
                        <th className="px-5 py-4">Student ID</th>
                        <th className="px-5 py-4">Total Classes</th>
                        <th className="px-5 py-4">Present</th>
                        <th className="px-5 py-4">Absent</th>
                        <th className="px-5 py-4">Percentage</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {displayedReport.map((item) => (
                        <tr
                          key={item.student?._id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-800">
                              {item.student?.name || "N/A"}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {item.student?.email || "N/A"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {item.student?.studentId || "N/A"}
                          </td>

                          <td className="px-5 py-4 text-gray-600">
                            {item.totalClasses ?? 0}
                          </td>

                          <td className="px-5 py-4 font-medium text-green-600">
                            {item.present ?? 0}
                          </td>

                          <td className="px-5 py-4 font-medium text-red-600">
                            {item.absent ?? 0}
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
            </div>
          </>
        )}

        {/* Initial Empty State */}
        {!report && !loading && !error && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <ChartColumnIncreasing
              size={42}
              className="mx-auto mb-3 text-gray-300"
            />

            <h3 className="font-semibold text-gray-700">
              No Report Generated
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Select a subject and generate a report to view attendance
              details.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
