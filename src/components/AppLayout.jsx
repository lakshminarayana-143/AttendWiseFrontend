import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["student", "faculty"],
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: CalendarCheck,
      roles: ["student", "faculty"],
    },
    {
      name: "Subjects",
      path: "/subjects",
      icon: BookOpen,
      roles: ["student", "faculty"],
    },
    {
      name: "Profile",
      path: "/profile",
      icon: UserRound,
      roles: ["student", "faculty"],
    },
  ];

  const visibleNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role)
  );

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await logout();
    } finally {
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <GraduationCap size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                AttendWise
              </h1>
              <p className="text-xs text-slate-500">
                Smart Attendance Management
              </p>
            </div>
          </NavLink>

          <div className="hidden items-center gap-4 md:flex">
            <div className="text-right">
              <p className="text-sm font-semibold">
                {user?.name || "User"}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {user?.role || "Member"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut size={17} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white p-4 md:hidden">
            <nav className="space-y-2">
              {visibleNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={linkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon size={18} />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="font-semibold">{user?.name}</p>
              <p className="mb-3 text-sm capitalize text-slate-500">
                {user?.role}
              </p>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 disabled:opacity-60"
              >
                <LogOut size={17} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Desktop sidebar and page content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 md:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden md:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-3">
            <p className="px-3 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            <nav className="space-y-1">
              {visibleNavigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={linkClass}
                  >
                    <Icon size={18} />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} AttendWise. Attendance made simpler.
      </footer>
    </div>
  );
}