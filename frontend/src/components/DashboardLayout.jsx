import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Menu, Zap, LayoutDashboard } from "lucide-react";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Mobile Top Sub-bar */}
        <div className="lg:hidden mb-6 flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-brand-600"
          >
            <Menu className="w-4 h-4" />
            <span>Dashboard Menu</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                location.pathname === "/dashboard"
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
                  : "text-slate-500"
              }`}
            >
              Overview
            </Link>
            <Link
              to="/dashboard/classifier"
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                location.pathname === "/dashboard/classifier"
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400"
                  : "text-slate-500"
              }`}
            >
              Classifier
            </Link>
          </div>
        </div>

        {/* Desktop Side-by-Side Container */}
        <div className="flex items-start gap-8">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Dashboard Pages Outlet */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}
