
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  const { user, logout } = useAuth();

  const menus = {
    student: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "My Attendance", path: "/attendance", icon: ClipboardCheck },
      { name: "My Subjects", path: "/subjects", icon: BookOpen },
      { name: "My Profile", path: "/profile", icon: UserCircle },
    ],

    faculty: [
      { name: "Dashboard", path: "/faculty/dashboard", icon: LayoutDashboard },
      { name: "My Subjects", path: "/subjects", icon: BookOpen },
      { name: "Mark Attendance", path: "/faculty/attendance", icon: ClipboardCheck },
      { name: "My Profile", path: "/profile", icon: UserCircle },
    ],

    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Faculty Approval", path: "/admin/dashboard", icon: Users },
      { name: "Admin Management", path: "/admin/dashboard", icon: ShieldCheck },
      { name: "My Profile", path: "/profile", icon: UserCircle },
    ],
  };

  const currentRole = role || user?.role;
  const navigationItems = menus[currentRole] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">

      {/* Mobile Header */}
      <header className="flex items-center justify-between bg-slate-950 p-4 text-white md:hidden">
        <h1 className="text-xl font-bold">
          Attend<span className="text-violet-400">Wise</span>
        </h1>

        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-950 text-white transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-800 p-6">
          <h1 className="text-2xl font-bold">
            Attend<span className="text-violet-400">Wise</span>
          </h1>

          <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
            {currentRole} Portal
          </p>
        </div>

        <nav className="space-y-2 p-4">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={`${item.name}-${index}`}
                to={item.path}
                end={item.path === "/dashboard" || item.path === "/admin/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-violet-700 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-800 p-4">
          <div className="mb-4">
            <p className="truncate text-sm font-semibold">
              {user?.name || "AttendWise User"}
            </p>
            <p className="text-xs capitalize text-slate-400">
              {currentRole}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-rose-400 hover:bg-slate-800"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            {currentRole === "student" ? (
              <GraduationCap className="text-violet-700" />
            ) : currentRole === "faculty" ? (
              <BookOpen className="text-violet-700" />
            ) : (
              <ShieldCheck className="text-violet-700" />
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
        </div>

        <div className="p-5 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
