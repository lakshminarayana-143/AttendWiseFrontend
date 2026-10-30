import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

import API from "../services/api";
import { Alert, Button, Field } from "../components/Shared";

const FacultySignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    facultyId: "",
    department: "",
    invitationCode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.facultyId.trim() ||
      !formData.department.trim() ||
      !formData.invitationCode
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/Auth/FacultySignUp", {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        facultyId: formData.facultyId.trim(),
        department: formData.department.trim(),
      });

      setSuccess(
        response.data.message ||
          "Registration submitted successfully."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        facultyId: "",
        department: "",
        invitationCode: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to register. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
            <GraduationCap size={30} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Faculty Registration
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create your AttendWise faculty account.
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        {success && <Alert type="success" message={success} />}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <Field
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="faculty@example.com"
            required
          />

          <Field
            label="Faculty ID"
            name="facultyId"
            value={formData.facultyId}
            onChange={handleChange}
            placeholder="Enter your faculty ID"
            required
          />

          <Field
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g. Computer Science"
            required
          />

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Field
            label="Faculty Invitation Code"
            name="invitationCode"
            type="password"
            value={formData.invitationCode}
            onChange={handleChange}
            placeholder="Enter your invitation code"
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Register as Faculty"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Log in
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-slate-500">
          Are you a student?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Student registration
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FacultySignup;