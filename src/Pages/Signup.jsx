import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  GraduationCap,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  IdCard,
  Building2,
  CalendarDays,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { Alert, Button, Field } from "../components/Shared";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    department: "",
    year: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  // Validate and submit the registration form
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const studentId = formData.studentId.trim();
    const department = formData.department.trim();
    const password = formData.password;

    if (
      !name ||
      !email ||
      !password ||
      !studentId ||
      !department ||
      !formData.year
    ) {
      setError("Please fill in all the required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await signup({
        name,
        email,
        password,
        studentId,
        department,
        year: Number(formData.year),
        role: "student",
      });

      setSuccess(
        response?.message ||
          "Account created successfully! Redirecting to login..."
      );

      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { registered: true },
        });
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
        {/* Left information panel */}
        <div className="hidden flex-col justify-between bg-indigo-700 p-10 text-white md:flex">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-3">
                <GraduationCap size={30} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  AttendWise
                </h1>

                <p className="text-sm text-indigo-200">
                  Smart Attendance Management
                </p>
              </div>
            </div>

            <h2 className="mb-5 text-4xl font-bold leading-tight">
              Start tracking
              <br />
              your attendance.
            </h2>

            <p className="max-w-sm leading-7 text-indigo-100">
              Create your student account to monitor your
              attendance, view subject-wise records, and work
              toward your academic goals.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm leading-6 text-indigo-50">
              Stay informed about your attendance and take
              control of your academic progress.
            </p>
          </div>
        </div>

        {/* Registration form */}
        <div className="p-6 sm:p-10">
          {/* Mobile heading */}
          <div className="mb-7 md:hidden">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap size={28} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              AttendWise
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Smart Attendance Management
            </p>
          </div>

          <div className="mb-7">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Student registration
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your details to get started with AttendWise.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5">
              <Alert type="error" message={error} />
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-5">
              <Alert type="success" message={success} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <Field
              label="Full name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              icon={<UserRound size={18} />}
            />

            {/* Email */}
            <Field
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              icon={<Mail size={18} />}
            />

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <LockKeyhole size={18} />
                </div>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-indigo-600"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Use at least 8 characters.
              </p>
            </div>

            {/* Student ID */}
            <Field
              label="Student ID"
              name="studentId"
              type="text"
              placeholder="Enter your student ID"
              value={formData.studentId}
              onChange={handleChange}
              required
              icon={<IdCard size={18} />}
            />

            {/* Department */}
            <Field
              label="Department"
              name="department"
              type="text"
              placeholder="e.g. CSE"
              value={formData.department}
              onChange={handleChange}
              required
              icon={<Building2 size={18} />}
            />

            {/* Academic year dropdown */}
            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Academic year
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <CalendarDays size={18} />
                </div>

                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full appearance-auto rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="" disabled>
                    Select your academic year
                  </option>

                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full justify-center py-3"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </Button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} AttendWise
          </p>
        </div>
      </div>
    </div>
  );
}