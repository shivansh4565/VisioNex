import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ScanEye, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import GithubIcon from "./GithubIcon";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Classifier", path: "/dashboard/classifier" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/90 dark:bg-navy-950/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800/80"
          : "bg-white/60 dark:bg-navy-950/60 backdrop-blur-sm border-b border-slate-100 dark:border-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <ScanEye className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Visio<span className="text-brand-500">Nex</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                  CNN AI
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  isActive(link.path)
                    ? "text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/50 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="w-5 h-5" />
            </a>

            <Link
              to="/dashboard/classifier"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-600/25 hover:shadow-brand-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
            >
              <span>Launch Classifier</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                isActive(link.path)
                  ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <Link
              to="/dashboard/classifier"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md"
            >
              <span>Launch Classifier</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
