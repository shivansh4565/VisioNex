import { MODEL_METRICS } from "../data/classes";
import ConfusionMatrix from "../components/ConfusionMatrix";
import { BarChart3, CheckCircle2, Award, Zap, TrendingUp } from "lucide-react";

export default function Analytics() {
  const comparisonData = [
    {
      metric: "Test Set Accuracy",
      ann: `${MODEL_METRICS.baselineAnnAccuracy}%`,
      cnn: `${MODEL_METRICS.overallAccuracy}%`,
      delta: `+${(MODEL_METRICS.overallAccuracy - MODEL_METRICS.baselineAnnAccuracy).toFixed(2)}%`,
      deltaPositive: true
    },
    {
      metric: "Macro F1-Score",
      ann: `${MODEL_METRICS.baselineAnnF1}%`,
      cnn: `${MODEL_METRICS.macroF1}%`,
      delta: `+${(MODEL_METRICS.macroF1 - MODEL_METRICS.baselineAnnF1).toFixed(2)}%`,
      deltaPositive: true
    },
    {
      metric: "Total Parameters",
      ann: "3,674,122",
      cnn: "1,196,522",
      delta: "-67.4% (3x More Efficient)",
      deltaPositive: true
    },
    {
      metric: "Spatial Topology Handling",
      ann: "Destroyed (1D Flatten 3,072)",
      cnn: "Preserved (2D Convolutions)",
      delta: "2D Feature Maps",
      deltaPositive: true
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 text-xs font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Empirical Model Benchmarking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Performance Analytics & Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Official test set metrics evaluated across 10,000 untouched CIFAR-10 images.
          </p>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Overall Test Accuracy
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {MODEL_METRICS.overallAccuracy}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            10,000 test samples evaluated
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Macro Precision
          </div>
          <div className="text-3xl font-black text-brand-600 dark:text-brand-400 font-mono">
            {MODEL_METRICS.macroPrecision}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Unweighted class average
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Macro Recall
          </div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {MODEL_METRICS.macroRecall}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Class coverage average
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Macro F1-Score
          </div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {MODEL_METRICS.macroF1}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Harmonic mean balance
          </div>
        </div>
      </div>

      {/* Empirical Comparison: Baseline ANN vs. VisionCore CNN */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Empirical Architecture Comparison: Baseline ANN vs. VisionCore CNN
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Trained on identical 80/20 splits to demonstrate the empirical superiority of 2D convolutional operations over fully connected layers for visual data.
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-400">
                <th className="py-2.5 px-3">Evaluation Metric</th>
                <th className="py-2.5 px-3">Baseline ANN (MLP)</th>
                <th className="py-2.5 px-3">VisionCore CNN</th>
                <th className="py-2.5 px-3">Empirical Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-navy-850">
                  <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                    {row.metric}
                  </td>
                  <td className="py-3 px-3 text-slate-500">{row.ann}</td>
                  <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400">{row.cnn}</td>
                  <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{row.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Interactive Confusion Matrix Component */}
      <ConfusionMatrix />

    </div>
  );
}
