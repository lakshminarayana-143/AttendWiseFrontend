import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { Alert, Button, Field } from "../components/Shared";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const user = await login({
        email,
        password,
      });

      // Return the user to the page they originally requested,
      // or send them to the dashboard after login.
      const requestedPath = location.state?.from?.pathname;

      if (requestedPath && requestedPath !== "/login") {
        navigate(requestedPath, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
        {/* Left panel */}
        <div className="hidden flex-col justify-between bg-indigo-700 p-10 text-white md:flex">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-3">
                <GraduationCap size={30} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">AttendWise</h1>
                <p className="text-sm text-indigo-200">
                  Smart Attendance Management
                </p>
              </div>
            </div>

            <h2 className="mb-5 text-4xl font-bold leading-tight">
              Manage attendance.
              <br />
              Improve your future.
            </h2>

            <p className="max-w-sm leading-7 text-indigo-100">
              Track attendance, review subject-wise records, and stay
              informed about your academic progress with AttendWise.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm leading-6 text-indigo-50">
              "Every class counts. Stay consistent, track your progress,
              and work toward your academic goals."
            </p>
          </div>
        </div>

        {/* Login form */}
        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 md:hidden">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap size={28} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              AttendWise
            </h1>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Welcome back
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your registered email and password to continue.
            </p>
          </div>

          {error && (
            <div className="mb-5">
              <Alert type="error" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
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
            </div>

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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
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
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full justify-center py-3"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Create an account
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} AttendWise
          </p>
        </div>
      </div>
    </div>
  );
}