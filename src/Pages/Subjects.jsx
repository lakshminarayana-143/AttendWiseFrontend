import { useEffect, useState } from "react";
import {
  BookOpen,
  RefreshCw,
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import API from "../services/api";
import { Alert, Button } from "../components/Shared";

const initialForm = {
  name: "",
  code: "",
  department: "",
  year: "1",
  description: "",
};

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSubjects = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/Subject/my-subjects");

      const data = response.data;

      setSubjects(
        Array.isArray(data)
          ? data
          : data.subjects || [],
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load subjects. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setSaving(true);

    try {
      const payload = {
        ...form,
        year: Number(form.year),
      };

      if (editingId) {
        await API.put(`/Subject/${editingId}`, payload);
        setSuccess("Subject updated successfully.");
      } else {
        await API.post("/Subject/create", payload);
        setSuccess("Subject created successfully.");
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);

      await loadSubjects();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save subject.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (subject) => {
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

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subject?",
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await API.delete(`/Subject/${id}`);
      setSuccess("Subject deleted successfully.");
      await loadSubjects();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete subject.",
      );
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-violet-700">
            FACULTY WORKSPACE
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            My Subjects
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create and manage your subjects.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            kind="outline"
            onClick={loadSubjects}
            loading={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>

          <Button
            onClick={() => {
              setForm(initialForm);
              setEditingId(null);
              setShowForm(true);
              setError("");
              setSuccess("");
            }}
          >
            <Plus size={16} />
            Add Subject
          </Button>
        </div>
      </div>

      {error && <Alert>{error}</Alert>}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {editingId ? "Edit Subject" : "Create Subject"}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Subject Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Data Structures"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Subject Code *
                </label>

                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="Example: CS301"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Department *
                </label>

                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Example: CSE"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Academic Year *
                </label>

                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                  required
                >
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter subject description..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" loading={saving}>
                {editingId ? "Update Subject" : "Create Subject"}
              </Button>

              <Button
                type="button"
                kind="outline"
                onClick={closeForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
          Loading subjects...
        </p>
      ) : subjects.length === 0 ? (
        <div className="rounded-2xl border border-violet-100 bg-white p-12 text-center">
          <BookOpen
            size={36}
            className="mx-auto text-violet-300"
          />

          <p className="mt-3 font-bold">
            No subjects found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Create your first subject to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => (
            <article
              key={subject._id}
              className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <BookOpen className="text-violet-700" />

                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                  {subject.code}
                </span>
              </div>

              <h2 className="mt-4 text-lg font-bold">
                {subject.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {subject.department} · Year {subject.year}
              </p>

              {subject.description && (
                <p className="mt-3 text-sm text-slate-600">
                  {subject.description}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="flex items-center gap-2 text-xs text-slate-500">
                  <Users size={15} />
                  Subject
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(subject)}
                    className="rounded-lg p-2 text-violet-700 hover:bg-violet-50"
                    title="Edit subject"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(subject._id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    title="Delete subject"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}