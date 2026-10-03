import { Link } from "react-router-dom";
import { Cpu, Code2, Layers, CheckCircle2, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import GithubIcon from "../components/GithubIcon";

export default function About() {
  return (
    <div className="py-12 sm:py-20 bg-slate-50 dark:bg-navy-950 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic & Portfolio Project</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About VisioNex
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Intelligent image classification powered by deep Convolutional Neural Networks on CIFAR-10.
          </p>
        </div>

        {/* Core Mission Statement Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-500" />
            <span>Project Motivation & Objectives</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            VisioNex is a computer vision project built to demonstrate how convolutional neural networks can learn visual patterns and perform multi-class image classification. Rather than using pre-packaged black-box APIs, the entire deep learning pipeline is built from scratch in <strong>PyTorch</strong>, complete with empirical baseline comparisons against traditional Artificial Neural Networks (ANN).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white font-bold mb-1">Empirical Benchmark</strong>
              <span className="text-slate-500">CNN (+28.5% accuracy) vs Baseline ANN on 10,000 test samples.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white font-bold mb-1">Standardized Pipeline</strong>
              <span className="text-slate-500">80/20 train/val split with fixed random seed 42 for reproducibility.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white font-bold mb-1">Zero Fake Metrics</strong>
              <span className="text-slate-500">All precision, recall, and confusion matrix data derived from actual test runs.</span>
            </div>
          </div>
        </div>

        {/* Separated Technology Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Frontend Stack */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5 text-brand-600 dark:text-brand-400 font-bold text-base">
              <Code2 className="w-5 h-5" />
              <h3>Frontend Technology Stack</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">React 18 & Vite</span>
                <span className="text-slate-500 font-mono">Modern SPA Engine</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Tailwind CSS</span>
                <span className="text-slate-500 font-mono">Design System & Dark Mode</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">React Router DOM</span>
                <span className="text-slate-500 font-mono">Client-side Routing</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Lucide React & Framer Motion</span>
                <span className="text-slate-500 font-mono">Icons & Smooth Micro-animations</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Recharts</span>
                <span className="text-slate-500 font-mono">Interactive Probability Charts</span>
              </li>
            </ul>
          </div>

          {/* Backend / ML Stack */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 font-bold text-base">
              <Cpu className="w-5 h-5" />
              <h3>Backend & Deep Learning Stack</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">PyTorch 2.12+</span>
                <span className="text-slate-500 font-mono">Core Tensor Framework</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Torchvision</span>
                <span className="text-slate-500 font-mono">Transforms & CIFAR-10 Dataset</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Scikit-Learn</span>
                <span className="text-slate-500 font-mono">Confusion Matrix & F1 Metrics</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">NumPy & Pillow (PIL)</span>
                <span className="text-slate-500 font-mono">Image Array Operations</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Streamlit & CLI Pipeline</span>
                <span className="text-slate-500 font-mono">Evaluation & Demo Dashboards</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Explore Project Action Row */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-navy-950 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Explore the Project</h3>
            <p className="text-xs text-slate-400 mt-1">
              Test live predictions with custom images or explore layer-by-layer CNN mechanics.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/how-it-works"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              View Architecture
            </Link>
            <Link
              to="/dashboard/classifier"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>Launch Classifier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
