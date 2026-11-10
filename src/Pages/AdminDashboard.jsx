
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";

import {
  Users,
  UserCheck,
  ShieldCheck,
  Crown,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  Trash2,
  CalendarDays,
  Mail,
  Building2,
  GraduationCap,
  Shield,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "overview"
  );

  const [faculty, setFaculty] = useState([]);
  const [owner, setOwner] = useState(null);
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [temporaryAdmins, setTemporaryAdmins] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const allowedTabs = [
    "overview",
    "faculty",
    "admin-management",
    "ownership",
  ];

  const isOGAdmin =
    !!owner &&
    String(owner._id || owner.id) === String(user?.id || user?._id);

  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";

    setActiveTab(allowedTabs.includes(tab) ? tab : "overview");
  }, [searchParams]);

  const changeTab = (tab) => {
    setSearchParams(tab === "overview" ? {} : { tab });
    setMessage("");
    setError("");
  };

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

  const fetchTemporaryAdminData = async () => {
    try {
      const [usersResponse, adminsResponse] = await Promise.all([
        API.get("/AdminManagement/eligible-users"),
        API.get("/AdminManagement/temporary-admins"),
      ]);

      setEligibleUsers(usersResponse.data.users || []);
      setTemporaryAdmins(adminsResponse.data.admins || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load temporary admin data."
      );
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (isOGAdmin && activeTab === "admin-management") {
      fetchTemporaryAdminData();
    }
  }, [isOGAdmin, activeTab]);

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

  const handleAppointTemporaryAdmin = async (e) => {
    e.preventDefault();

    if (!selectedUser || !expiryDate) {
      setError("Select a user and expiry date.");
      return;
    }

    try {
      setActionLoading("appoint");
      setMessage("");
      setError("");

      await API.post("/AdminManagement/temporary-admins", {
        userId: selectedUser,
        expiresAt: new Date(expiryDate).toISOString(),
      });

      setMessage("Temporary admin appointed successfully.");
      setSelectedUser("");
      setExpiryDate("");

      await fetchTemporaryAdminData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to appoint temporary admin."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleRevokeTemporaryAdmin = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to revoke this temporary admin's access?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);
      setMessage("");
      setError("");

      await API.delete(`/AdminManagement/temporary-admins/${id}`);

      setMessage("Temporary admin access revoked successfully.");

      await fetchTemporaryAdminData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to revoke temporary admin access."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleRefresh = async () => {
    await fetchAdminData();

    if (isOGAdmin) {
      await fetchTemporaryAdminData();
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  const buttonPrimary =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-7xl space-y-7 pb-10">

        {/* Page Header */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-600">
              <Sparkles size={15} />
              AttendWise Control Center
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage users, faculty registrations and administrative access.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Data
          </button>
        </section>

        {/* Admin Identity */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-indigo-900 to-violet-900 p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -right-2 -top-10 h-44 w-44 rounded-full border border-white/10" />

          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                {isOGAdmin ? (
                  <Crown size={28} className="text-amber-300" />
                ) : (
                  <ShieldCheck size={28} className="text-indigo-200" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold">
                    {isOGAdmin ? "Original Administrator" : "Administrator"}
                  </h2>

                  {isOGAdmin && (
                    <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                      OG Owner
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-indigo-200">
                  {user?.name || "AttendWise Administrator"}
                </p>

                <p className="mt-1 text-xs text-indigo-300">
                  {isOGAdmin
                    ? "You have full ownership privileges."
                    : "You have administrative access."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-indigo-100 sm:self-auto">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Account Active
            </div>
          </div>
        </section>

        {/* Notifications */}
        {message && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle size={19} className="mt-0.5 shrink-0" />
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Navigation */}
        <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview", icon: ShieldCheck },
              { id: "faculty", label: "Faculty Approval", icon: UserCheck },
              ...(isOGAdmin
                ? [
                    {
                      id: "admin-management",
                      label: "Admin Management",
                      icon: Users,
                    },
                    {
                      id: "ownership",
                      label: "Ownership",
                      icon: Crown,
                    },
                  ]
                : []),
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => changeTab(item.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Pending Faculty"
                value={loading ? "..." : faculty.length}
                description="Awaiting approval"
                icon={Clock}
                theme="amber"
              />

              <StatCard
                title="Administrator Status"
                value="Active"
                description="Administrative access"
                icon={ShieldCheck}
                theme="indigo"
              />

              <StatCard
                title="Ownership"
                value={owner ? "Established" : "Not Found"}
                description="AttendWise ownership record"
                icon={Crown}
                theme="emerald"
              />
            </div>

            {/* Owner Details */}
            {owner && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Current OG Admin
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Registered owner of AttendWise.
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                    <Crown size={22} />
                  </div>
                </div>

                <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row sm:items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <Shield size={23} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900">
                      {owner.name}
                    </h3>
                    <p className="mt-1 break-all text-sm text-slate-500">
                      {owner.email}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:ml-auto">
                    Verified Owner
                  </span>
                </div>
              </section>
            )}

            {/* Quick Actions */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Quick Actions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Jump directly to important administration tasks.
                </p>
              </div>

              <button
                onClick={() => changeTab("faculty")}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50 sm:max-w-md"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <UserCheck size={21} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      Review Faculty Applications
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {faculty.length} applications pending
                    </p>
                  </div>
                </div>

                <ArrowUpRight
                  size={19}
                  className="text-slate-400 transition group-hover:text-indigo-600"
                />
              </button>
            </section>
          </div>
        )}

        {/* Faculty Approval */}
        {activeTab === "faculty" && (
          <section className="space-y-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Faculty Management
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review faculty registrations and approve eligible accounts.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                <Clock size={15} />
                {faculty.length} Pending
              </span>
            </div>

            {loading ? (
              <LoadingState text="Loading faculty registrations..." />
            ) : faculty.length === 0 ? (
              <EmptyState
                icon={UserCheck}
                title="All caught up!"
                description="There are no pending faculty registrations."
              />
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {faculty.map((item) => (
                  <article
                    key={item._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                        <GraduationCap size={24} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold text-slate-900">
                          {item.name}
                        </h3>

                        <p className="mt-1 flex items-center gap-2 break-all text-sm text-slate-500">
                          <Mail size={14} className="shrink-0" />
                          {item.email}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        Pending
                      </span>
                    </div>

                    <div className="my-5 grid grid-cols-2 gap-3">
                      <InfoItem
                        icon={UserCheck}
                        label="Faculty ID"
                        value={item.facultyId || "N/A"}
                      />

                      <InfoItem
                        icon={Building2}
                        label="Department"
                        value={item.department || "N/A"}
                      />
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                      <button
                        onClick={() => handleApprove(item._id)}
                        disabled={actionLoading === item._id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <CheckCircle size={17} />
                        {actionLoading === item._id
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        onClick={() => handleReject(item._id)}
                        disabled={actionLoading === item._id}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                      >
                        <XCircle size={17} />
                        Reject
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Admin Management */}
        {activeTab === "admin-management" && isOGAdmin && (
          <section className="space-y-6">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Temporary Admin Management
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Grant and manage temporary administrative permissions.
              </p>
            </div>

            {/* Appointment Form */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
                    <UserPlus size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Appoint Temporary Admin
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Select an existing student or approved faculty member.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleAppointTemporaryAdmin}
                className="space-y-5 p-6"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Select User
                    </label>

                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      required
                      className={inputClass}
                    >
                      <option value="">Choose a user</option>

                      {eligibleUsers.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name} — {item.role} ({item.email})
                        </option>
                      ))}
                    </select>

                    <p className="mt-2 text-xs text-slate-400">
                      {eligibleUsers.length} eligible users available
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Admin Access Expiry
                    </label>

                    <div className="relative">
                      <CalendarDays
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="datetime-local"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        min={new Date(
                          Date.now() -
                            new Date().getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .slice(0, 16)}
                        required
                        className={`${inputClass} pl-11`}
                      />
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Access will expire automatically when the account is next checked.
                    </p>
                  </div>
                </div>

                {eligibleUsers.length === 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    No eligible students or approved faculty members are available.
                  </div>
                )}

                <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                  <p className="text-xs text-slate-400">
                    Only the OG Admin can appoint temporary administrators.
                  </p>

                  <button
                    type="submit"
                    disabled={
                      actionLoading === "appoint" ||
                      eligibleUsers.length === 0
                    }
                    className={buttonPrimary}
                  >
                    <UserPlus size={17} />
                    {actionLoading === "appoint"
                      ? "Appointing..."
                      : "Appoint Temporary Admin"}
                  </button>
                </div>
              </form>
            </div>

            {/* Temporary Admin List */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Current Temporary Admins
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Review assigned access and revoke permissions.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                  {temporaryAdmins.length} Records
                </span>
              </div>

              {temporaryAdmins.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No temporary administrators"
                  description="Appointed temporary administrators will appear here."
                />
              ) : (
                <div className="divide-y divide-slate-100">
                  {temporaryAdmins.map((admin) => (
                    <div
                      key={admin._id}
                      className="flex flex-col justify-between gap-4 px-6 py-5 transition hover:bg-slate-50/70 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                          <ShieldCheck size={22} />
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900">
                            {admin.name}
                          </h4>

                          <p className="mt-1 break-all text-xs text-slate-500">
                            {admin.email}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700">
                              Temporary Admin
                            </span>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold capitalize text-slate-600">
                              Original Role: {admin.adminAccess?.previousRole || "N/A"}
                            </span>
                          </div>

                          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            <Clock size={14} />
                            Expires:{" "}
                            {admin.adminAccess?.expiresAt
                              ? new Date(
                                  admin.adminAccess.expiresAt
                                ).toLocaleString()
                              : "Not specified"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          handleRevokeTemporaryAdmin(admin._id)
                        }
                        disabled={actionLoading === admin._id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 sm:self-center"
                      >
                        <Trash2 size={16} />
                        {actionLoading === admin._id
                          ? "Revoking..."
                          : "Revoke Access"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Ownership */}
        {activeTab === "ownership" && isOGAdmin && (
          <section className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                OG Admin Ownership
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View the current ownership status of AttendWise.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-amber-50 p-4 text-amber-600">
                  <Crown size={30} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Current Original Admin
                  </h3>
                  <p className="mt-1 text-sm text-emerald-600">
                    Ownership established
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Registered Owner
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {owner?.name || user?.name}
                </p>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {owner?.email || user?.email}
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                Ownership transfer and successor management have not yet
                been connected to the backend. Your current ownership
                remains unchanged.
              </div>
            </div>
          </section>
        )}

      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, description, icon: Icon, theme }) {
  const themes = {
    amber: {
      icon: "bg-amber-50 text-amber-600",
      accent: "bg-amber-500",
    },
    indigo: {
      icon: "bg-indigo-50 text-indigo-600",
      accent: "bg-indigo-500",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      accent: "bg-emerald-500",
    },
  };

  const colors = themes[theme] || themes.indigo;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className={`absolute inset-x-0 top-0 h-1 ${colors.accent}`} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${colors.icon}`}>
          <Icon size={23} />
        </div>
      </div>
    </article>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
        <Icon size={14} />
        {label}
      </div>

      <p className="truncate text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
      <div className="rounded-2xl bg-slate-100 p-5 text-slate-400">
        <Icon size={32} />
      </div>

      <h3 className="mt-4 font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function LoadingState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
      <RefreshCw size={28} className="animate-spin text-indigo-600" />

      <p className="mt-4 text-sm font-medium text-slate-500">
        {text}
      </p>
    </div>
  );
}
