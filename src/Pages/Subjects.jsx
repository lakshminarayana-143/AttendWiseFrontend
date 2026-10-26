import { useEffect, useState } from "react";
import { BookOpen, RefreshCw, Users } from "lucide-react";

import API from "../services/api";

import { Alert, Button } from "../components/Shared";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadSubjects = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/api/subjects/my");

      const data = response.data;

      setSubjects(Array.isArray(data) ? data : data.subjects || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Subjects endpoint is not connected. Update the API path to match your backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-violet-700">FACULTY WORKSPACE</p>

          <h1 className="mt-2 text-3xl font-extrabold">My subjects</h1>

          <p className="mt-2 text-sm text-slate-500">
            Subjects assigned to your account.
          </p>
        </div>

        <Button kind="outline" onClick={loadSubjects} loading={loading}>
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      <Alert>{error}</Alert>

      {loading ? (
        <p className="p-8 text-center text-sm text-slate-500">
          Loading subjects...
        </p>
      ) : subjects.length === 0 ? (
        <div className="rounded-2xl border border-violet-100 bg-white p-12 text-center">
          <BookOpen size={34} className="mx-auto text-violet-300" />

          <p className="mt-3 font-bold">No subjects found</p>

          <p className="mt-1 text-sm text-slate-500">
            Subjects will appear when the backend returns them.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => (
            <article
              key={subject._id}
              className="rounded-2xl border border-violet-100 bg-white p-5"
            >
              <div className="flex justify-between">
                <BookOpen className="text-violet-700" />

                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#800020]">
                  {subject.code || "SUBJECT"}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-bold">{subject.name}</h2>

              <p className="mt-1 text-sm text-slate-500">
                {subject.department || "Department not specified"}
              </p>

              <p className="mt-5 flex items-center gap-2 text-sm text-slate-600">
                <Users size={16} />
                {subject.students?.length ?? 0} enrolled students
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
