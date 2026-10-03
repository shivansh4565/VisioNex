import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2, ShieldAlert, Cpu, Eye, Zap, Layers } from "lucide-react";
import Hero from "../components/Hero";
import StatsCard from "../components/StatsCard";
import FeatureCard from "../components/FeatureCard";
import { CIFAR10_CLASSES } from "../data/classes";

export default function Home() {
  return (
    <div className="space-y-0">
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Stats Row */}
      <StatsCard />

      {/* 3. Core Features Section */}
      <FeatureCard />

      {/* 4. Interactive Classes Preview Section */}
      <section className="py-20 bg-white dark:bg-navy-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                10 Target Categories
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Classes Recognized by VisioNex
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                Trained exclusively on 32×32 pixel images from the standard CIFAR-10 computer vision benchmark.
              </p>
            </div>

            <Link
              to="/dashboard/classifier"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/20 transition-all self-start md:self-auto"
            >
              <span>Test Live Classifier</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 10 Classes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CIFAR10_CLASSES.map((cls) => (
              <div
                key={cls.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {cls.emoji}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                    {cls.displayName}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {cls.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Test Acc:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{cls.accuracy.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Honest Domain Limitation Notice */}
          <div className="mt-12 p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <strong className="font-bold">Transparent Benchmark Notice: </strong>
              VisioNex is trained on 32×32 pixel CIFAR-10 images. High-resolution real-world photos are automatically resized to 32×32 before inference. Complex scenes with background clutter or multiple objects may not match CIFAR-10 distribution.
            </div>
          </div>

        </div>
      </section>

      {/* 5. CTA Banner Section */}
      <section className="py-16 bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to test the PyTorch CNN Classifier?
          </h2>
          <p className="text-sm sm:text-base text-brand-200 max-w-xl mx-auto">
            Upload your own images or test with preloaded CIFAR-10 test set samples in seconds.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard/classifier"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-slate-900 bg-white hover:bg-brand-50 shadow-xl hover:scale-105 transition-all duration-200"
            >
              <span>Launch VisioNex Classifier</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
