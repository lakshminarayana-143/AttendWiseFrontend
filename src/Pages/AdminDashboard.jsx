
import { useEffect, useState } from "react";
import { API } from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";

import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Crown,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [faculty, setFaculty] = useState([]);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isOGAdmin =
    owner &&
    String(owner._id || owner.id) === String(user?.id || user?._id);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [facultyResponse, ownerResponse] = await Promise.all([
        API.get("/Admin/pending-faculty"),
        API.get("/AdminOwnership/owner"),
      ]);

      setFaculty(facultyResponse.data.faculty || []);
      setOwner(ownerResponse.data.owner || null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load administration data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      setMessage("");
      setError("");

      await API.patch(`/Admin/approve-faculty/${id}`);

      setFaculty((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setMessage("Faculty approved successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to approve faculty."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this faculty registration?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);
      setMessage("");
      setError("");

      await API.delete(`/Admin/reject-faculty/${id}`);

      setFaculty((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setMessage("Faculty registration rejected.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reject faculty."
      );
    } finally {
      setActionLoading("");
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: ShieldCheck },
    { id: "faculty", label: "Faculty Approval", icon: UserCheck },
    ...(isOGAdmin
      ? [{ id: "ownership", label: "Ownership", icon: Crown }]
      : []),
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-7">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage AttendWise administration and faculty registrations.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Role Information */}
        <div className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
          {isOGAdmin ? (
            <Crown className="text-violet-700" size={25} />
          ) : (
            <ShieldCheck className="text-violet-700" size={25} />
          )}

          <div>
            <p className="font-semibold text-violet-900">
              {isOGAdmin ? "Original OG Admin" : "Administrator"}
            </p>
            <p className="text-sm text-violet-700">
              {isOGAdmin
                ? "You are the current AttendWise owner."
                : "You have administrative access to AttendWise."}
            </p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMessage("");
                  setError("");
                }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                  activeTab === item.id
                    ? "bg-violet-700 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Pending Faculty"
                value={loading ? "..." : faculty.length}
                icon={Clock}
                color="amber"
              />

              <StatCard
                title="Administrator Status"
                value="Active"
                icon={ShieldCheck}
                color="violet"
              />

              <StatCard
                title="Ownership"
                value={owner ? "Established" : "Not Found"}
                icon={Crown}
                color="green"
              />
            </div>

            {/* Owner Details */}
            {owner && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Current OG Admin
                </h2>

                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-violet-100 p-4 text-violet-700">
                    <Crown size={25} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {owner.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {owner.email}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Quick Actions */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-900">
                Administrative Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage pending faculty registrations.
              </p>

              <button
                onClick={() => setActiveTab("faculty")}
                className="mt-5 flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800"
              >
                <UserCheck size={18} />
                Review Faculty Applications
              </button>
            </section>
          </>
        )}

        {/* Faculty Approval */}
        {activeTab === "faculty" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Faculty Management
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review and manage faculty registrations.
                </p>
              </div>

              <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800">
                {faculty.length} Pending
              </span>
            </div>

            {loading ? (
              <p className="py-10 text-center text-slate-500">
                Loading faculty registrations...
              </p>
            ) : faculty.length === 0 ? (
              <div className="py-12 text-center">
                <UserCheck
                  size={42}
                  className="mx-auto text-slate-300"
                />
                <h3 className="mt-3 font-semibold text-slate-700">
                  No pending registrations
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  New faculty applications will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {faculty.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 p-5 md:flex-row md:items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.email}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                        <span className="rounded-lg bg-slate-100 px-3 py-1.5">
                          Faculty ID: {item.facultyId || "N/A"}
                        </span>

                        <span className="rounded-lg bg-slate-100 px-3 py-1.5">
                          Department: {item.department || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item._id)}
                        disabled={actionLoading === item._id}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <CheckCircle size={17} />
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(item._id)}
                        disabled={actionLoading === item._id}
                        className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                      >
                        <XCircle size={17} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Ownership */}
        {activeTab === "ownership" && isOGAdmin && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <Crown className="text-violet-700" size={28} />
              <h2 className="text-lg font-bold text-slate-900">
                OG Admin Ownership
              </h2>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              You are the current Original Admin of AttendWise.
              Ownership transfer and successor management will be
              connected after their backend APIs are implemented.
            </p>

            <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              Ownership transfer functionality is not available yet.
              Your current ownership remains unchanged.
            </div>
          </section>
        )}

      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    amber: "bg-amber-100 text-amber-700",
    violet: "bg-violet-100 text-violet-700",
    green: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
