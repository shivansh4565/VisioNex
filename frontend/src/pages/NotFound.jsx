import { Link } from "react-router-dom";
import { Home, ArrowLeft, ScanEye } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 mx-auto shadow-sm">
          <ScanEye className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black text-brand-600 dark:text-brand-400 font-mono">
            404
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            The neural map coordinate you requested does not exist in the VisioNex router.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
