import { Link } from "react-router-dom";
import { ScanEye, ExternalLink, Cpu, Heart } from "lucide-react";
import GithubIcon from "./GithubIcon";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-100 dark:bg-navy-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                <ScanEye className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Visio<span className="text-brand-500">Nex</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Intelligent image classification platform powered by deep Convolutional Neural Networks trained on CIFAR-10.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 px-2 py-1 rounded bg-slate-200/60 dark:bg-slate-900">
                <Cpu className="w-3.5 h-3.5 text-brand-500" />
                <span>PyTorch 2.12+</span>
              </div>
            </div>
          </div>

          {/* Nav Col */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/dashboard/classifier" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  CNN Classifier
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  About VisioNex
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Col */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Technologies
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                <span>PyTorch & Torchvision</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                <span>Convolutional Neural Net</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                <span>CIFAR-10 Dataset (60k)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                <span>React 18 & Vite</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                <span>Tailwind CSS & Recharts</span>
              </li>
            </ul>
          </div>

          {/* Resources Col */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Resources & Docs
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://pytorch.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  <span>PyTorch Documentation</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cs.toronto.edu/~kriz/cifar.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  <span>CIFAR-10 Dataset Paper</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                >
                  CNN Pipeline Architecture
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 VisioNex. Built for Computer Vision learning and experimentation.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>using PyTorch & React</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
