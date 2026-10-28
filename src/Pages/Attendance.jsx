import { useEffect, useState } from "react";
import { CalendarCheck, RefreshCw } from "lucide-react";

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
      const response = await API.get("/api/attendance/me");

      const data = response.data;

      setRecords(
        Array.isArray(data) ? data : data.attendance || data.records || [],
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Attendance endpoint is not connected. Update the API path to match your backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-violet-700">ACADEMIC RECORDS</p>

          <h1 className="mt-2 text-3xl font-extrabold">Attendance</h1>

          <p className="mt-2 text-sm text-slate-500">
            Review your attendance history and status.
          </p>
        </div>

        <Button kind="outline" onClick={loadAttendance} loading={loading}>
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      <Alert>{error}</Alert>

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
            <CalendarCheck size={34} className="mx-auto text-violet-300" />

            <p className="mt-3 font-bold">No records to display</p>

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
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {records.map((record, index) => (
                  <tr key={record._id || index}>
                    <td className="px-5 py-4">
                      {record.date
                        ? new Date(record.date).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      {record.subject?.name || record.subjectName || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          String(record.status).toLowerCase() === "present"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {record.status || "Unknown"}
                      </span>
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
