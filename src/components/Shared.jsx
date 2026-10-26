import { LoaderCircle } from "lucide-react";

export function Button({
  children,
  kind = "primary",
  loading = false,
  className = "",
  ...props
}) {
  const styles = {
    primary:
      "bg-violet-700 text-white hover:bg-violet-800 shadow-lg shadow-violet-100",
    secondary: "bg-[#800020] text-white hover:bg-[#65001a]",
    outline:
      "border border-violet-200 bg-white text-violet-800 hover:bg-violet-50",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition disabled:opacity-60 ${styles[kind]} ${className}`}
    >
      {loading && <LoaderCircle size={17} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Alert({ children, success = false }) {
  if (!children) return null;

  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-700"
      }`}
    >
      {children}
    </div>
  );
}

export function Field({ label, icon: Icon, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
        {Icon && <Icon size={18} className="text-violet-700" />}

        <input
          {...props}
          className="w-full min-w-0 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
        />
      </span>
    </label>
  );
}

export function Loader() {
  return (
    <div className="grid min-h-[50vh] place-items-center text-violet-800">
      <span className="flex items-center gap-2">
        <LoaderCircle className="animate-spin" />
        Loading AttendWise...
      </span>
    </div>
  );
}
