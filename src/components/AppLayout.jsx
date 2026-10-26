import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  BookOpen,
  CalendarCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";

import { useAuth } from "./context/AuthContext";
import { Button } from "./Shared";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const faculty = user?.role === "faculty";

  const links = [
    {
      to: faculty ? "/faculty/dashboard" : "/student/dashboard",
      label: "Dashboard",
      Icon: LayoutDashboard,
    },
    {
      to: "/attendance",
      label: "Attendance",
      Icon: CalendarCheck,
    },
    ...(faculty
      ? [
          {
            to: "/subjects",
            label: "My subjects",
            Icon: BookOpen,
          },
        ]
      : []),
    {
      to: "/profile",
      label: "Profile",
      Icon: UserRound,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-violet-100 bg-white md:flex">
        <div className="flex items-center gap-3 p-6">
          <span className="rounded-xl bg-violet-700 p-2 text-white">
            <GraduationCap />
          </span>

          <h1 className="text-xl font-extrabold">
            Attend
            <span className="text-violet-700">Wise</span>
          </h1>
        </div>

        <div className="mx-4 mb-5 rounded-2xl bg-gradient-to-br from-violet-800 to-[#800020] p-4 text-white">
          <p className="font-bold">{user?.name}</p>
          <p className="mt-1 truncate text-xs text-white/70">{user?.email}</p>
          <p className="mt-2 text-xs capitalize">{user?.role} workspace</p>
        </div>

        <nav className="space-y-1 px-3">
          {links.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                  isActive
                    ? "bg-violet-100 text-violet-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <Button kind="outline" className="w-full" onClick={handleLogout}>
            <LogOut size={17} />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-violet-100 bg-white px-5 py-4 md:px-8">
          <span className="text-sm text-slate-500">
            Your academic progress at a glance
          </span>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-100 font-bold text-violet-800">
              {user?.name?.[0]?.toUpperCase()}
            </span>

            <span className="text-sm font-semibold">{user?.name}</span>
          </button>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-7">
          <div className="mb-5 flex gap-2 overflow-x-auto md:hidden">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="whitespace-nowrap rounded-xl bg-white px-3 py-2 text-sm text-violet-800 shadow-sm"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
