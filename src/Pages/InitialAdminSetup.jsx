import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";

import API from "../services/api";

export default function InitialAdminSetup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    setupSecret: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [available, setAvailable] = useState(false);
  const [error, setError] = useState("");

  // Check whether initial OG Admin setup is available
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await API.get("/AdminOwnership/status");

        setAvailable(response.data.setupRequired === true);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to check initial setup status."
        );
      } finally {
        setChecking(false);
      }
    };

    checkSetup();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.setupSecret.trim()) {
      setError("Setup verification secret is required.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/AdminOwnership/setup", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        setupSecret: form.setupSecret,
      });

      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create OG Admin account."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!available) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-5">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <ShieldCheck
            size={45}
            className="mx-auto text-green-600"
          />

          <h1 className="mt-4 text-2xl font-bold">
            Initial Setup Unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            An OG Admin has already been established or setup status
            could not be verified.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
            <ShieldCheck size={34} />
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
            AttendWise Initial Setup
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create the first and only OG Admin account.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">
              Admin Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-500"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Setup Verification Secret
            </label>

            <input
              type="password"
              name="setupSecret"
              value={form.setupSecret}
              onChange={handleChange}
              required
              placeholder="Enter setup secret"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />

            <p className="mt-1 text-xs text-slate-500">
              This must match ADMIN_SETUP_SECRET configured by the
              application operator.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Creating account..." : "Create Main Admin Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          AttendWise · Secure Initial Configuration
        </p>
      </div>
    </div>
  );
}