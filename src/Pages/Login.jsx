import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/Auth/Login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const user = response.data.user;

      if (!user) {
        setError("Login succeeded, but user information was not returned.");
        return;
      }

      // Redirect according to the logged-in user's role.
      if (user.role === "faculty") {
        navigate("/faculty/dashboard");
      } else if (user.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to log in. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF9FF] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">

        {/* Left section */}
        <div className="flex flex-col justify-center bg-gradient-to-br from-[#4C1D95] to-[#800020] p-10 text-white md:p-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <GraduationCap size={32} />
            </div>

            <h1 className="text-3xl font-bold">AttendWise</h1>
          </div>

          <h2 className="mb-5 text-3xl font-bold leading-tight md:text-4xl">
            Welcome Back!
          </h2>

          <p className="text-base leading-7 text-purple-100">
            Manage your attendance, track your progress, and stay connected
            with your academic journey — all in one place.
          </p>

          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-5">
            <p className="text-sm leading-6 text-purple-50">
              Your attendance. Your progress. Your future.
            </p>
          </div>
        </div>

        {/* Right section */}
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Sign In
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Enter your credentials to access AttendWise.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-[#6D28D9] focus-within:ring-2 focus-within:ring-purple-100">
                <Mail size={20} className="text-[#6D28D9]" />

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full py-3.5 text-sm outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 transition focus-within:border-[#6D28D9] focus-within:ring-2 focus-within:ring-purple-100">
                <Lock size={20} className="text-[#6D28D9]" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full py-3.5 text-sm outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-[#6D28D9]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#6D28D9] py-3.5 font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-[#4C1D95] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs leading-5 text-gray-500">
            Secure attendance management with AttendWise.
          </p>

          <p className="mt-4 text-center text-sm text-gray-600">
            New to AttendWise?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#800020] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;