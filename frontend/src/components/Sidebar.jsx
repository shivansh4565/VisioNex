import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Zap, Home, Cpu, Sparkles, X } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard Overview",
      path: "/dashboard",
      exact: true,
      icon: LayoutDashboard
    },
    {
      name: "CNN Classifier",
      path: "/dashboard/classifier",
      icon: Zap
    }
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname === item.path;
  };

  const content = (
    <div className="flex flex-col justify-between h-full space-y-6">
      <div className="space-y-6">
        
        {/* Mobile Header with close button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              Visio<span className="text-brand-500">Nex</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold shadow-xs border border-brand-200/60 dark:border-brand-800/60"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-navy-850 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-brand-600 dark:text-brand-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Model Status Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Model Engine</span>
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">READY</span>
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-white">
            VisionCore-CNN (PyTorch)
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            10 Classes · 32×32 Input
          </div>
        </div>

      </div>

      {/* Footer Back Link */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Back to Landing Page</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (In-flow sticky) */}
      <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-24 self-start rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 min-h-[420px]">
        {content}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-navy-900 shadow-2xl p-5 z-50 flex flex-col justify-between">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
