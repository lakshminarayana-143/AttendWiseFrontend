import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Building2,
  CalendarDays,
  GraduationCap,
  IdCard,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { Alert, Button } from "../components/Shared";

export default function Profile() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not log out.");
    } finally {
      setLoading(false);
    }
  };

  const details = [
    ["Full name", user?.name, UserRound],
    ["Email address", user?.email, Mail],
    ["Role", user?.role, ShieldCheck],
    ["Student ID", user?.studentId || "Not provided", IdCard],
    ["Department", user?.department || "Not provided", Building2],
    ["Year", user?.year ? `Year ${user.year}` : "Not provided", CalendarDays],
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-bold text-violet-700">ACCOUNT SETTINGS</p>

        <h1 className="mt-2 text-3xl font-extrabold">My profile</h1>

        <p className="mt-2 text-sm text-slate-500">
          Review your AttendWise account information.
        </p>
      </div>

      <section className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">
        <div className="flex items-center gap-5 bg-gradient-to-r from-violet-800 to-[#800020] p-7 text-white">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/15 text-3xl font-extrabold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-2xl font-extrabold">{user?.name}</h2>

            <p className="truncate text-sm text-white/75">{user?.email}</p>

            <span className="mt-2 inline-flex items-center gap-1 text-xs capitalize">
              <GraduationCap size={15} />
              {user?.role}
            </span>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
          {details.map(([label, value, Icon]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                <Icon size={16} className="text-violet-700" />
                {label}
              </p>

              <p className="mt-2 break-words text-sm font-semibold">
                {value || "—"}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t p-5 sm:px-8">
          <Alert>{error}</Alert>

          <Button
            kind="secondary"
            onClick={handleLogout}
            loading={loading}
            className="mt-3"
          >
            <LogOut size={17} />
            Sign out
          </Button>
        </div>
      </section>
    </div>
  );
}
