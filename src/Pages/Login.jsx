import { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "./context/AuthContext";

import { Alert, Button, Field } from "./components/Shared";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
      const user = await login({
        email: form.email.trim(),
        password: form.password,
      });

      const previousPath = location.state?.from?.pathname;

      if (previousPath && previousPath !== "/login") {
        navigate(previousPath, { replace: true });
      } else if (user.role === "faculty") {
        navigate("/faculty/dashboard", {
          replace: true,
        });
      } else if (user.role === "student") {
        navigate("/student/dashboard", {
          replace: true,
        });
      } else {
        navigate("/profile", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[#faf9ff] lg:grid-cols-2">
      {/* Left panel */}
      <section className="hidden flex-col justify-between bg-gradient-to-br from-[#4c1d95] via-violet-800 to-[#800020] p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-white/15 p-3">
            <GraduationCap size={30} />
          </span>

          <h1 className="text-2xl font-extrabold">AttendWise</h1>
        </div>

        <div>
          <h2 className="text-5xl font-extrabold leading-tight">
            Attendance clarity.
            <br />
            <span className="text-violet-200">Academic confidence.</span>
          </h2>

          <p className="mt-6 max-w-md leading-7 text-white/75">
            Track attendance, understand your progress, and stay focused on your
            academic goals.
          </p>

          <div className="mt-9 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
            <ShieldCheck size={24} />

            <span className="text-sm">
              A focused workspace for students and faculty.
            </span>
          </div>
        </div>

        <p className="text-xs text-white/50">
          AttendWise · Attendance management made simpler
        </p>
      </section>

      {/* Login form */}
      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <GraduationCap size={30} className="text-violet-700" />

            <h1 className="text-xl font-extrabold">
              Attend
              <span className="text-violet-700">Wise</span>
            </h1>
          </div>

          <p className="text-sm font-bold uppercase tracking-widest text-violet-700">
            Welcome back
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
            Sign in to your account
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Use your registered email and password.
          </p>

          <div className="mt-5 space-y-3">
            <Alert success>{location.state?.message}</Alert>

            <Alert>{error}</Alert>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <Field
              label="Email address"
              icon={Mail}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@college.edu"
              autoComplete="email"
              required
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </span>

              <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
                <LockKeyhole size={18} className="text-violet-700" />

                <input
                  className="w-full bg-transparent py-3 text-sm outline-none"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-violet-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <Button type="submit" loading={loading} className="w-full py-3.5">
              {loading ? "Signing in..." : "Sign in to AttendWise"}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            New to AttendWise?{" "}
            <Link
              to="/signup"
              className="font-bold text-[#800020] hover:underline"
            >
              Create a student account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
