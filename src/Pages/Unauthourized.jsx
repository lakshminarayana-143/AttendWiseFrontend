import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#faf9ff] p-5">
      <div className="max-w-md rounded-3xl border border-violet-100 bg-white p-10 text-center shadow-xl">
        <ShieldAlert size={44} className="mx-auto text-[#800020]" />

        <h1 className="mt-5 text-2xl font-extrabold">Access denied</h1>

        <p className="mt-2 text-sm text-slate-500">
          Your account does not have permission to view this page.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white hover:bg-violet-800"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
