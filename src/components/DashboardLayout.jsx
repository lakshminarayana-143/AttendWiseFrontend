
import { useState } from "react";
import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  UserCircle,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children, role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const currentRole = role || user?.role;

  const menus = {
    student: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "My Attendance",
        path: "/attendance",
        icon: ClipboardCheck,
      },
      {
        name: "My Subjects",
        path: "/subjects",
        icon: BookOpen,
      },
      {
        name: "My Profile",
        path: "/profile",
        icon: UserCircle,
      },
    ],

    faculty: [
      {
        name: "Dashboard",
        path: "/faculty/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "My Subjects",
        path: "/subjects",
        icon: BookOpen,
      },
      {
        name: "Mark Attendance",
        path: "/faculty/attendance",
        icon: ClipboardCheck,
      },
      {
        name: "My Profile",
        path: "/profile",
        icon: UserCircle,
      },
    ],

    admin: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        tab: "overview",
        icon: LayoutDashboard,
      },
      {
        name: "Faculty Approval",
        path: "/admin/dashboard",
        tab: "faculty",
        icon: Users,
      },
      {
        name: "Admin Management",
        path: "/admin/dashboard",
        tab: "admin-management",
        icon: ShieldCheck,
      },
      {
        name: "My Profile",
        path: "/profile",
        icon: UserCircle,
      },
    ],
  };

  const navigationItems = menus[currentRole] || [];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigation = (item) => {
    setSidebarOpen(false);

    if (currentRole === "admin" && item.tab) {
      window.dispatchEvent(
        new CustomEvent("admin-dashboard-tab", {
          detail: item.tab,
        })
      );
    }
  };

  const getNavLinkClass = (item, isActive) => {
    const currentTab =
      new URLSearchParams(location.search).get("tab") || "overview";

    const isSelected =
      item.tab
        ? location.pathname === item.path &&
          currentTab === item.tab
        : isActive;

    return `
      flex w-full flex-row items-center justify-start
      gap-3 rounded-xl px-4 py-3
      text-sm font-medium
      transition-all duration-200
      ${
        isSelected
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/20"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }
    `;
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-4 text-white md:hidden">

        <h1 className="text-xl font-bold tracking-tight">
          Attend<span className="text-violet-400">Wise</span>
        </h1>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-slate-800"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-screen w-64 shrink-0 flex-col
          border-r border-slate-800
          bg-slate-950 text-white
          transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:z-20 md:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Logo */}
        <div className="flex h-[104px] shrink-0 flex-col justify-center border-b border-slate-800 px-6">

          <h1 className="text-2xl font-bold tracking-tight">
            Attend<span className="text-violet-400">Wise</span>
          </h1>

          <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-slate-400">
            {currentRole} Portal
          </p>

        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Main Menu
          </p>

          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={
                  item.tab && item.tab !== "overview"
                    ? `${item.path}?tab=${item.tab}`
                    : item.path
                }
                end={item.path === "/admin/dashboard"}
                onClick={() => handleNavigation(item)}
                className={({ isActive }) =>
                  getNavLinkClass(item, isActive)
                }
              >

                <Icon
                  size={20}
                  strokeWidth={2}
                  className="block h-5 w-5 shrink-0"
                />

                <span className="block flex-1 whitespace-nowrap">
                  {item.name}
                </span>

              </NavLink>
            );
          })}

        </nav>

        {/* User Profile and Logout */}
        <div className="mt-auto shrink-0 border-t border-slate-800 p-4">

          <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-900 p-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "AttendWise User"}
              </p>

              <p className="text-xs capitalize text-slate-400">
                {currentRole}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full flex-row items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut size={19} className="shrink-0" />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">

        {/* Desktop Top Header */}
        <header className="hidden h-[73px] items-center border-b border-slate-200 bg-white px-8 md:flex">

          <div className="flex items-center gap-3">

            {currentRole === "student" ? (
              <GraduationCap size={22} className="text-indigo-600" />
            ) : currentRole === "faculty" ? (
              <BookOpen size={22} className="text-indigo-600" />
            ) : (
              <ShieldCheck size={22} className="text-indigo-600" />
            )}

            <div>
              <p className="text-sm font-semibold capitalize text-slate-800">
                {currentRole} Dashboard
              </p>

              <p className="text-xs text-slate-500">
                Attendance Management System
              </p>
            </div>

          </div>

        </header>

        {/* Page Content */}
        <div className="w-full p-5 md:p-8">
          {children}
        </div>

      </main>

    </div>
  );
}
