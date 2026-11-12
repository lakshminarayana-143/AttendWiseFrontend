
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  RefreshCw,
  MessageSquareText,
} from "lucide-react";

import API from "../services/api";
import { Alert, Button } from "../components/Shared";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAttendance = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/Attendance/my-attendance");

      setRecords(response.data?.attendance || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load attendance history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const presentCount = records.filter(
    (record) => record.status === "present"
  ).length;

  const absentCount = records.filter(
    (record) => record.status === "absent"
  ).length;

  const percentage =
    records.length > 0
      ? ((presentCount / records.length) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-violet-700">
            ACADEMIC RECORDS
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            Attendance
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review your attendance history, status and faculty remarks.
          </p>
        </div>

        <Button
          kind="outline"
          onClick={loadAttendance}
          loading={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      <Alert>{error}</Alert>

      {!loading && records.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Total Classes"
            value={records.length}
          />

          <SummaryCard
            title="Present"
            value={presentCount}
          />

          <SummaryCard
            title="Attendance"
            value={`${percentage}%`}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5">
          <CalendarCheck className="text-violet-700" />

          <div>
            <h2 className="font-bold">Attendance history</h2>

            <p className="text-xs text-slate-500">
              {records.length} records loaded
            </p>
          </div>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-slate-500">
            Loading records...
          </p>
        ) : records.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarCheck
              size={34}
              className="mx-auto text-violet-300"
            />

            <p className="mt-3 font-bold">
              No records to display
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Attendance records will appear here when available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-violet-50 text-xs uppercase text-violet-900">
                <tr>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Session</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Faculty Remarks</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record._id}>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {record.date
                        ? new Date(record.date).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      {record.subject?.name ||
                        record.subjectName ||
                        "—"}
                    </td>

                    <td className="px-5 py-4">
                      {record.session || "Regular"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          record.status === "present"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {record.status || "Unknown"}
                      </span>
                    </td>

                    <td className="px-5 py-4 min-w-48">
                      <div className="flex items-start gap-2 text-slate-600">
                        <MessageSquareText
                          size={16}
                          className="mt-0.5 shrink-0 text-violet-500"
                        />

                        <span>
                          {record.remarks?.trim() || "No remarks"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
