
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  GraduationCap,
  Layers3,
  Building2,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  code: "",
  department: "",
  year: "1",
  description: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10";

export default function Subjects() {
  const { user } = useAuth();

  const role = user?.role;

  const isFaculty = role === "faculty";
  const isStudent = role === "student";
  const isAdmin = role === "admin";

  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Load subjects based on the logged-in role.
  const loadSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      if (isFaculty) {
        response = await API.get("/Subject/my-subjects");
      } else if (isStudent || isAdmin) {
        response = await API.get("/Subject/all");
      } else {
        setSubjects([]);
        setError("Your account does not have subject access.");
        return;
      }

      const data = response.data;

      const subjectList = Array.isArray(data)
        ? data
        : Array.isArray(data.subjects)
          ? data.subjects
          : [];

      setSubjects(subjectList);
    } catch (err) {
      console.error("Load subjects error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load subjects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [isFaculty, isStudent, isAdmin]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    if (!isFaculty) return;

    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  // Create or update subject.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFaculty) return;

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.code.trim() ||
      !form.department.trim() ||
      !form.year
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      department: form.department.trim().toUpperCase(),
      year: Number(form.year),
      description: form.description.trim(),
    };

    setSaving(true);

    try {
      if (editingId) {
        await API.put(`/Subject/${editingId}`, payload);
        setSuccess("Subject updated successfully.");
      } else {
        await API.post("/Subject/create", payload);
        setSuccess("Subject created successfully.");
      }

      closeForm();
      await loadSubjects();
    } catch (err) {
      console.error("Save subject error:", err);

      setError(
        err.response?.data?.message || "Unable to save subject."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (subject) => {
    if (!isFaculty) return;

    setForm({
      name: subject.name || "",
      code: subject.code || "",
      department: subject.department || "",
      year: String(subject.year || 1),
      description: subject.description || "",
    });

    setEditingId(subject._id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // Delete subject.
  const handleDelete = async (id) => {
    if (!isFaculty) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingId(id);

    try {
      await API.delete(`/Subject/${id}`);

      setSuccess("Subject deleted successfully.");
      await loadSubjects();
    } catch (err) {
      console.error("Delete subject error:", err);

      setError(
        err.response?.data?.message || "Unable to delete subject."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Search subjects.
  const filteredSubjects = subjects.filter((subject) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      subject.name?.toLowerCase().includes(query) ||
      subject.code?.toLowerCase().includes(query) ||
      subject.department?.toLowerCase().includes(query)
    );
  });

  const pageTitle = isFaculty
    ? "My Subjects"
    : isStudent
      ? "Available Subjects"
      : "Subject Directory";

  const pageDescription = isFaculty
    ? "Manage your subjects and assigned academic classes."
    : isStudent
      ? "View subjects assigned to your department and academic year."
      : "View all subjects registered in AttendWise.";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">

      {/* Page Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600">
            <GraduationCap size={16} />

            {isFaculty
              ? "Faculty Workspace"
              : isStudent
                ? "Student Workspace"
                : "Administration"}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {pageTitle}
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            {pageDescription}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadSubjects}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          {isFaculty && (
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              <Plus size={17} />
              Add Subject
            </button>
          )}
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={BookOpen}
          label="Total Subjects"
          value={subjects.length}
          color="violet"
        />

        <StatCard
          icon={Building2}
          label="Departments"
          value={
            new Set(
              subjects.map((subject) => subject.department).filter(Boolean)
            ).size
          }
          color="blue"
        />

        <StatCard
          icon={Layers3}
          label="Academic Years"
          value={
            new Set(
              subjects.map((subject) => subject.year).filter(Boolean)
            ).size
          }
          color="emerald"
        />
      </section>

      {/* Notifications */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700">
          <CheckCircle2 size={18} className="shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Create / Edit Form - Faculty Only */}
      {isFaculty && showForm && (
        <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? "Edit Subject" : "Create New Subject"}
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Enter the academic subject details below.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close form"
            >
              <X size={19} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Subject Name" required>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Data Structures"
                  className={inputClass}
                  maxLength={100}
                  required
                />
              </FormField>

              <FormField label="Subject Code" required>
                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="e.g. CS301"
                  className={inputClass}
                  maxLength={20}
                  required
                />
              </FormField>

              <FormField label="Department" required>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. CSE"
                  className={inputClass}
                  maxLength={50}
                  required
                />
              </FormField>

              <FormField label="Academic Year" required>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </select>
              </FormField>

              <div className="sm:col-span-2">
                <FormField label="Description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Add a short description about this subject..."
                    rows={3}
                    maxLength={500}
                    className={`${inputClass} resize-y`}
                  />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {form.description.length}/500
                  </p>
                </FormField>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <RefreshCw size={15} className="animate-spin" />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Subject"
                    : "Create Subject"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Subject Directory */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Subject Directory
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {subjects.length} subject
              {subjects.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subjects..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3">
            <RefreshCw
              size={25}
              className="animate-spin text-violet-600"
            />
            <p className="text-sm text-slate-500">
              Loading subjects...
            </p>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <BookOpen size={27} />
            </div>

            <h3 className="mt-4 font-bold text-slate-800">
              {search
                ? "No matching subjects"
                : "No subjects available"}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {search
                ? "Try searching with another subject name, code or department."
                : isFaculty
                  ? "Create your first subject to start managing your academic classes."
                  : "There are currently no subjects available for your account."}
            </p>

            {isFaculty && !search && (
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                <Plus size={16} />
                Create Subject
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Subject</th>
                    <th className="px-5 py-3.5">Code</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Academic Year</th>

                    {isFaculty && (
                      <th className="px-5 py-3.5 text-right">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredSubjects.map((subject) => (
                    <tr
                      key={subject._id}
                      className="transition hover:bg-violet-50/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <BookOpen size={17} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {subject.name}
                            </p>

                            {subject.description && (
                              <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                                {subject.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                          {subject.code}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {subject.department}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                          <CalendarDays
                            size={15}
                            className="text-slate-400"
                          />
                          Year {subject.year}
                        </span>
                      </td>

                      {isFaculty && (
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <ActionButton
                              label="Edit subject"
                              onClick={() => handleEdit(subject)}
                              icon={Pencil}
                              color="violet"
                            />

                            <ActionButton
                              label="Delete subject"
                              onClick={() =>
                                handleDelete(subject._id)
                              }
                              icon={Trash2}
                              color="rose"
                              disabled={deletingId === subject._id}
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-3 p-4 md:hidden">
              {filteredSubjects.map((subject) => (
                <article
                  key={subject._id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <BookOpen size={18} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {subject.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {subject.code}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                      {subject.department}
                    </span>

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                      Year {subject.year}
                    </span>
                  </div>

                  {subject.description && (
                    <p className="mt-3 text-sm text-slate-500">
                      {subject.description}
                    </p>
                  )}

                  {isFaculty && (
                    <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                      <ActionButton
                        label="Edit subject"
                        onClick={() => handleEdit(subject)}
                        icon={Pencil}
                        color="violet"
                      />

                      <ActionButton
                        label="Delete subject"
                        onClick={() => handleDelete(subject._id)}
                        icon={Trash2}
                        color="rose"
                        disabled={deletingId === subject._id}
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const styles = {
    violet: "bg-violet-50 text-violet-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles[color]}`}
      >
        <Icon size={21} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-rose-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  icon: Icon,
  color,
  disabled,
}) {
  const styles = {
    violet: "text-violet-600 hover:bg-violet-50",
    rose: "text-rose-600 hover:bg-rose-50",
  };

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg p-2 transition disabled:cursor-not-allowed disabled:opacity-40 ${styles[color]}`}
    >
      <Icon size={17} />
    </button>
  );
}
