
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardCheck,
  RefreshCw,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { API } from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function FacultyAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState(getToday());
  const [session, setSession] = useState("Regular");

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch faculty subjects
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
        setStudents([]);
        setAttendance([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your subjects."
      );
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Fetch students and existing attendance for selected subject
  const loadStudents = async () => {
    if (!selectedSubject || !date) {
      setStudents([]);
      setAttendance([]);
      return;
    }

    try {
      setLoadingStudents(true);
      setError("");
      setSuccess("");

      const [studentResponse, attendanceResponse] =
        await Promise.all([
          API.get(`/Subject/${selectedSubject}/students`),
          API.get(
            `/Attendance/subject/${selectedSubject}`,
            {
              params: { date },
            }
          ),
        ]);

      const studentList =
        studentResponse.data?.students || [];

      const existingRecords =
        attendanceResponse.data?.attendance || [];

      // Keep records for the selected session.
      const sessionRecords = existingRecords.filter(
        (record) =>
          (record.session || "Regular") === session.trim()
      );

      const existingMap = new Map(
        sessionRecords.map((record) => [
          String(record.student?._id || record.student),
          record,
        ])
      );

      const updatedStudents = studentList.map((student) => {
        const existingRecord = existingMap.get(
          String(student._id)
        );

        return {
          ...student,
          status: existingRecord?.status || "present",
          remarks: existingRecord?.remarks || "",
        };
      });

      setStudents(updatedStudents);
      setAttendance(sessionRecords);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load students or existing attendance."
      );

      setStudents([]);
      setAttendance([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [selectedSubject, date, session]);

  // Change individual student attendance
  const updateStatus = (studentId, status) => {
    setStudents((previousStudents) =>
      previousStudents.map((student) =>
        student._id === studentId
          ? { ...student, status }
          : student
      )
    );
  };

  // Change student remarks
  const updateRemarks = (studentId, remarks) => {
    setStudents((previousStudents) =>
      previousStudents.map((student) =>
        student._id === studentId
          ? { ...student, remarks }
          : student
      )
    );
  };

  // Mark everyone present
  const markAllPresent = () => {
    setStudents((previousStudents) =>
      previousStudents.map((student) => ({
        ...student,
        status: "present",
      }))
    );
  };

  // Mark everyone absent
  const markAllAbsent = () => {
    setStudents((previousStudents) =>
      previousStudents.map((student) => ({
        ...student,
        status: "absent",
      }))
    );
  };

  // Save attendance
  const saveAttendance = async () => {
    if (!selectedSubject) {
      setError("Please select a subject.");
      return;
    }

    if (!date) {
      setError("Please select an attendance date.");
      return;
    }

    if (!students.length) {
      setError("No students available to mark attendance.");
      return;
    }

    if (!session.trim()) {
      setError("Please enter a session name.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const records = students.map((student) => ({
        studentId: student._id,
        status: student.status,
        remarks: student.remarks || "",
      }));

      const response = await API.post("/Attendance/mark", {
        subjectId: selectedSubject,
        date,
        session: session.trim(),
        records,
      });

      setSuccess(
        response.data?.message ||
          "Attendance marked successfully."
      );

      await loadStudents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter(
    (student) => student.status === "present"
  ).length;

  const absentCount = students.filter(
    (student) => student.status === "absent"
  ).length;

  const selectedSubjectDetails = subjects.find(
    (subject) => subject._id === selectedSubject
  );

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-7">
        {/* Header */}
        <div>
          <p className="text-sm font-bold text-violet-700">
            FACULTY WORKSPACE
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Mark Attendance
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Select a subject and record student attendance.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {/* Attendance Selection */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 font-bold text-slate-900">
            Attendance Details
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Subject */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Select Subject
              </label>

              <select
                value={selectedSubject}
                onChange={(event) =>
                  setSelectedSubject(event.target.value)
                }
                disabled={loadingSubjects}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
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

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Attendance Date
              </label>

              <input
                type="date"
                value={date}
                max={getToday()}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            {/* Session */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Session
              </label>

              <input
                type="text"
                value={session}
                onChange={(event) =>
                  setSession(event.target.value)
                }
                placeholder="Example: Morning"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          {selectedSubjectDetails && (
            <div className="mt-5 rounded-xl bg-violet-50 p-4 text-sm text-violet-900">
              <p>
                <strong>Department:</strong>{" "}
                {selectedSubjectDetails.department}
              </p>

              <p className="mt-1">
                <strong>Academic Year:</strong>{" "}
                {selectedSubjectDetails.year}
              </p>
            </div>
          )}
        </section>

        {/* Statistics */}
        {selectedSubject && !loadingStudents && (
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Students"
              value={students.length}
              icon={Users}
            />

            <StatCard
              title="Present"
              value={presentCount}
              icon={CheckCircle2}
            />

            <StatCard
              title="Absent"
              value={absentCount}
              icon={XCircle}
            />
          </div>
        )}

        {/* Student Attendance List */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold text-slate-900">
                Student Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {students.length} students found
              </p>
            </div>

            {selectedSubject && (
              <button
                onClick={loadStudents}
                disabled={loadingStudents}
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    loadingStudents ? "animate-spin" : ""
                  }
                />
                Refresh
              </button>
            )}
          </div>

          {!selectedSubject ? (
            <div className="p-12 text-center">
              <ClipboardCheck
                size={38}
                className="mx-auto text-violet-300"
              />

              <p className="mt-3 font-semibold text-slate-700">
                Select a subject to continue
              </p>
            </div>
          ) : loadingStudents ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading students...
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center">
              <Users
                size={38}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 font-semibold text-slate-700">
                No students found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                No approved students match this subject's department and year.
              </p>
            </div>
          ) : (
            <>
              {/* Bulk Actions */}
              <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
                <button
                  onClick={markAllPresent}
                  className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  Mark All Present
                </button>

                <button
                  onClick={markAllAbsent}
                  className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                >
                  Mark All Absent
                </button>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-violet-50 text-xs uppercase text-violet-900">
                    <tr>
                      <th className="px-5 py-4">Student</th>
                      <th className="px-5 py-4">Student ID</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Remarks</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {student.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {student.email}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {student.studentId || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={student.status}
                            onChange={(event) =>
                              updateStatus(
                                student._id,
                                event.target.value
                              )
                            }
                            className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none ${
                              student.status === "present"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-rose-200 bg-rose-50 text-rose-700"
                            }`}
                          >
                            <option value="present">
                              Present
                            </option>

                            <option value="absent">
                              Absent
                            </option>
                          </select>
                        </td>

                        <td className="px-5 py-4">
                          <input
                            type="text"
                            value={student.remarks}
                            onChange={(event) =>
                              updateRemarks(
                                student._id,
                                event.target.value
                              )
                            }
                            placeholder="Optional"
                            className="w-40 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Save */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 p-5">
                <p className="text-sm text-slate-500">
                  {presentCount} Present · {absentCount} Absent
                </p>

                <button
                  onClick={saveAttendance}
                  disabled={saving || loadingStudents}
                  className="flex items-center gap-2 rounded-xl bg-violet-700 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ClipboardCheck size={18} />

                  {saving
                    ? "Saving..."
                    : "Save Attendance"}
                </button>
              </div>
            </>
          )}
        </section>
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
    