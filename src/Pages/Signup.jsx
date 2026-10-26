import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Building2,
  CalendarDays,
  GraduationCap,
  IdCard,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { Alert, Button, Field } from "../components/Shared";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    department: "",
    year: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signup({
        ...form,
        email: form.email.trim().toLowerCase(),
        role: "student",
        year: form.year ? Number(form.year) : undefined,
      });

      navigate("/login", {
        replace: true,
        state: {
          message: "Account created. Please sign in.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Signup failed. Check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/login"
          className="mb-7 inline-flex items-center gap-2 text-xl font-extrabold"
        >
          <GraduationCap className="text-violet-700" />
          AttendWise
        </Link>

        <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-xl sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-700">
            Get started
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            Create your student account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter your details to join AttendWise.
          </p>

          <div className="mt-5">
            <Alert>{error}</Alert>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 sm:grid-cols-2"
          >
            <Field
              label="Full name"
              icon={UserRound}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />

            <Field
              label="Email address"
              icon={Mail}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@college.edu"
              required
            />

            <Field
              label="Student ID"
              icon={IdCard}
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              placeholder="e.g. CSE2026"
              required
            />

            <Field
              label="Department"
              icon={Building2}
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g. CSE"
            />

            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Year of study
              </span>

              <span className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5">
                <CalendarDays size={18} className="text-violet-700" />

                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full bg-transparent py-3 text-sm outline-none"
                >
                  <option value="">Select year</option>
                  <option value="1">First year</option>
                  <option value="2">Second year</option>
                  <option value="3">Third year</option>
                  <option value="4">Fourth year</option>
                </select>
              </span>
            </label>

            <Field
              label="Password (minimum 8 characters)"
              icon={LockKeyhole}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              placeholder="Create a password"
              required
            />

            <div className="sm:col-span-2">
              <Button type="submit" loading={loading} className="w-full">
                {loading ? "Creating account..." : "Create student account"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-bold text-[#800020] hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-slate-400">
            Faculty accounts must be created by an authorized administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
