import { LoaderCircle } from "lucide-react";

// Reusable Button
export function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-violet-700 text-white hover:bg-violet-800",
    secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
        variants[variant] || variants.primary
      } ${className}`}
      {...props}
    >
      {loading && (
        <LoaderCircle size={17} className="animate-spin" />
      )}

      {children}
    </button>
  );
}

// Reusable Alert
export function Alert({
  children,
  type = "error",
  className = "",
}) {
  if (!children) return null;

  const styles = {
    error: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm ${
        styles[type] || styles.error
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Reusable Input
export function Field({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>
      )}

      <input
        className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 ${
          error ? "border-rose-400" : "border-slate-300"
        }`}
        {...props}
      />

      {error && (
        <span className="text-xs text-rose-600">
          {error}
        </span>
      )}
    </label>
  );
}

// Reusable Select
export function SelectField({
  label,
  children,
  className = "",
  ...props
}) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>
      )}

      <select
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

// Loading Indicator
export function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-slate-500">
      <LoaderCircle
        className="animate-spin text-violet-700"
        size={22}
      />

      {label}
    </div>
  );
}

// Page Heading
export function PageHeading({
  title,
  description,
  action,
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}