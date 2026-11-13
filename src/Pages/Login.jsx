import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Users,
  ArrowRight,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { Alert, Button, Field } from "../components/Shared";

export default function Login() {
  const { login, selectWorkspace, user, logout, availableWorkspaces } =
    useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showWorkspaceSelection, setShowWorkspaceSelection] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (
      user &&
      location.state?.requiresWorkspaceSelection &&
      availableWorkspaces?.length > 1
    ) {
      setShowWorkspaceSelection(true);
    }
  }, [user, location.state, availableWorkspaces]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  // Navigate to the selected workspace.
  function navigateToWorkspace(workspace) {
    if (workspace === "faculty") {
      navigate("/faculty/dashboard", { replace: true });
    } else if (workspace === "admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }

  // Handle workspace selection.
  function handleWorkspaceSelect(workspace) {
    const result = selectWorkspace(workspace);

    if (!result.success) {
      setError(result.message || "You cannot access this workspace.");
      return;
    }

    navigateToWorkspace(workspace);
  }

  // Handle login.
  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await login(email, password);

      if (!result || !result.success) {
        setError(result?.message || "Invalid email or password.");
        return;
      }

      // Multiple workspaces require a selection.
      if (result.needsWorkspaceSelection) {
        setShowWorkspaceSelection(true);
        return;
      }

      // Single-workspace users go directly to their dashboard.
      const workspace = result.workspaces?.[0] || result.user?.role;

      navigateToWorkspace(workspace);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to log in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  // Workspace selection screen.
  if (showWorkspaceSelection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Users size={32} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Welcome back, {user?.name}!
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              You have multiple roles. Choose your workspace.
            </p>
          </div>

          {error && (
            <div className="mb-5">
              <Alert type="error" message={error} />
            </div>
          )}

          <div className="space-y-4">
            {/* Faculty workspace */}
            {availableWorkspaces?.includes("faculty") && (
              <button
                type="button"
                onClick={() => handleWorkspaceSelect("faculty")}
                className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 p-5 text-left transition hover:border-indigo-500 hover:bg-indigo-50"
              >
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <GraduationCap size={27} />
                </div>

                <div className="flex-1">
                  <h2 className="font-bold text-slate-900">
                    Faculty Dashboard
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage subjects, attendance and student reports.
                  </p>
                </div>

                <ArrowRight
                  size={20}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                />
              </button>
            )}

            {/* Student workspace */}
            {availableWorkspaces?.includes("student") && (
              <button
                type="button"
                onClick={() => handleWorkspaceSelect("student")}
                className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 p-5 text-left transition hover:border-indigo-500 hover:bg-indigo-50"
              >
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <GraduationCap size={27} />
                </div>

                <div className="flex-1">
                  <h2 className="font-bold text-slate-900">
                    Student Dashboard
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    View attendance and academic progress.
                  </p>
                </div>

                <ArrowRight
                  size={20}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                />
              </button>
            )}

            {/* Admin workspace */}
            {availableWorkspaces?.includes("admin") && (
  <button
    type="button"
    onClick={() => handleWorkspaceSelect("admin")}
              className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 p-5 text-left transition hover:border-indigo-500 hover:bg-indigo-50"
            >
              <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                <ShieldCheck size={27} />
              </div>

              <div className="flex-1">
                <h2 className="font-bold text-slate-900">Admin Dashboard</h2>

                <p className="mt-1 text-xs text-slate-500">
                  Access your administrative responsibilities.
                </p>
              </div>

              <ArrowRight
                size={20}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
              />
            </button>
            )}
          </div>

          <button
            type="button"
            onClick={async () => {
              await logout();
              setShowWorkspaceSelection(false);
              setFormData({ email: "", password: "" });
            }}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <LogOut size={17} />
            Sign out
          </button>

          <p className="mt-6 text-center text-xs text-slate-400">
            AttendWise · Workspace Selection
          </p>
        </div>
      </div>
    );
  }

  // Normal login screen.
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
        {/* Left branding panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-indigo-700 p-8 text-white md:flex lg:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/30" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-400/20" />

          <div className="relative z-10">
            <div className="mb-12 flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-3">
                <GraduationCap size={27} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-wide">AttendWise</h1>

                <p className="text-xs text-indigo-200">Attendance Management</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold leading-tight lg:text-4xl">
              Your attendance.
              <br />
              Your progress.
              <br />
              Your future.
            </h2>

            <p className="mt-5 max-w-xs text-sm leading-6 text-indigo-100">
              Manage attendance, track academic performance, and stay on top of
              your educational journey.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Track your attendance",
                "Monitor academic progress",
                "Stay organized every day",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-indigo-50"
                >
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-indigo-200"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 mt-10 text-xs text-indigo-200">
            Smart attendance. Better outcomes.
          </p>
        </div>

        {/* Login section */}
        <div className="flex items-center justify-center p-6 sm:p-9 lg:p-10">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="mb-7 flex items-center gap-3 md:hidden">
              <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
                <GraduationCap size={25} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">AttendWise</h1>

                <p className="text-xs text-slate-500">
                  Smart Attendance Management
                </p>
              </div>
            </div>

            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Welcome back
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Sign in
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your details to access your account.
              </p>
            </div>

            {error && (
              <div className="mb-5">
                <Alert type="error" message={error} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <LockKeyhole size={17} />
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
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-indigo-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full justify-center rounded-xl py-3 font-semibold shadow-sm transition hover:shadow-md"
              >
                {loading ? "Signing in..." : "Sign in to AttendWise"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs text-slate-400">NEW TO ATTENDWISE?</span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Student signup */}
            <p className="text-center text-sm text-slate-600">
              Don't have a student account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                Student Signup
              </Link>
            </p>

            {/* Faculty signup */}
            <p className="mt-3 text-center text-sm text-slate-600">
              Are you a faculty member?{" "}
              <Link
                to="/faculty-signup"
                className="font-semibold text-indigo-600 transition hover:text-indigo-800"
              >
                Faculty Signup
              </Link>
            </p>

            {/* Initial admin setup */}
            <p className="mt-3 text-center text-sm text-slate-600">
              Are you a Main Admin?{" "}
              <Link
                to="/initial-admin-setup"
                className="text-sm font-semibold text-indigo-600 hover:underline"
              >
                Initial Main Admin
              </Link>
            </p>

            <p className="mt-8 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} AttendWise. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
