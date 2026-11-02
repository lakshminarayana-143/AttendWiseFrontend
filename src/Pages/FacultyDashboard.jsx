
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  Plus,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

export default function FacultyDashboard() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/Subject/my-subjects");

      setSubjects(response.data.subjects || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your subjects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <DashboardLayout role="faculty">
      <div className="space-y-7">

        {/* Welcome Section */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Faculty Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your subjects and student attendance.
            </p>
          </div>

          <button
            onClick={fetchSubjects}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
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

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <StatCard
            title="My Subjects"
            value={loading ? "..." : subjects.length}
            icon={BookOpen}
            color="violet"
          />

          <StatCard
            title="Departments"
            value={
              loading
                ? "..."
                : new Set(subjects.map((subject) => subject.department)).size
            }
            icon={GraduationCap}
            color="blue"
          />

          <StatCard
            title="Assigned Classes"
            value={
              loading
                ? "..."
                : new Set(
                    subjects.map(
                      (subject) =>
                        `${subject.department}-${subject.year}`
                    )
                  ).size
            }
            icon={Users}
            color="green"
          />

        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">

            <ActionCard
              icon={Plus}
              title="Manage Subjects"
              description="Create, update and manage your subjects."
              buttonText="Open Subjects"
              onClick={() => navigate("/subjects")}
            />

            <ActionCard
              icon={ClipboardCheck}
              title="Mark Attendance"
              description="Record attendance for your assigned subjects."
              buttonText="Mark Attendance"
              onClick={() => navigate("/faculty/attendance")}
            />

          </div>
        </section>

        {/* My Subjects */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                My Subjects
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Subjects assigned to your faculty account.
              </p>
            </div>

            <button
              onClick={() => navigate("/subjects")}
              className="flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
            >
              Manage Subjects
              <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="py-10 text-center text-slate-500">
              Loading subjects...
            </div>
          ) : subjects.length === 0 ? (
            <div className="py-10 text-center">
              <BookOpen
                size={42}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-3 font-semibold text-slate-700">
                No subjects assigned yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create your first subject to get started.
              </p>

              <button
                onClick={() => navigate("/subjects")}
                className="mt-5 rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"
              >
                Create Subject
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">

              {subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="rounded-xl border border-slate-200 p-5 transition hover:border-violet-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {subject.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {subject.code}
                      </p>
                    </div>

                    <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
                      <BookOpen size={20} />
                    </div>

                  </div>

                  <div className="mt-5 space-y-2 text-sm text-slate-600">
                    <p>
                      Department: {subject.department}
                    </p>

                    <p>
                      Academic Year: {subject.year}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/faculty/attendance")}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-100"
                  >
                    <ClipboardCheck size={17} />
                    Mark Attendance
                  </button>
                </div>
              ))}

            </div>
          )}

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
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

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

function ActionCard({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
          <Icon size={22} />
        </div>

        <h3 className="font-bold text-slate-900">
          {title}
        </h3>
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {description}
      </p>

      <button
        onClick={onClick}
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
      >
        {buttonText}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
