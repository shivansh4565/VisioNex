import { CheckCircle2, Cpu, Award } from "lucide-react";
import { motion } from "framer-motion";
import ConfidenceBar from "./ConfidenceBar";

export default function PredictionCard({ result }) {
  if (!result) return null;

  const {
    predicted_class,
    displayName,
    emoji,
    confidence_percentage,
    confidence,
    top_predictions,
    inference_device,
    is_mock
  } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6"
    >
      {/* Top Tag & Status */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            CNN Prediction Output
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
          <Cpu className="w-3.5 h-3.5 text-brand-500" />
          <span>{inference_device || "PyTorch CNN (v1.0)"}</span>
        </div>
      </div>

      {/* Hero Prediction Display */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-br from-brand-50/60 via-slate-50 to-indigo-50/40 dark:from-brand-950/40 dark:via-navy-950 dark:to-indigo-950/30 border border-brand-200/60 dark:border-brand-900/40">
        
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-navy-900 shadow-md border border-brand-200 dark:border-brand-800 flex items-center justify-center text-5xl">
            {emoji}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Highest Probability Class
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {displayName || predicted_class}
            </h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              CIFAR-10 Standard Category
            </div>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Confidence Score
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {confidence_percentage}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {is_mock ? "High-Fidelity Simulated Softmax" : "PyTorch Softmax Output"}
          </div>
        </div>

      </div>

      {/* Top 3 Predictions */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-500" />
            <span>Top-3 Ranked Predictions</span>
          </h4>
          <span className="text-xs text-slate-500">Softmax Probabilities</span>
        </div>

        <div className="space-y-3">
          {top_predictions?.map((pred, idx) => (
            <ConfidenceBar
              key={idx}
              rank={pred.rank || idx + 1}
              classNameText={pred.displayName || pred.class}
              emoji={pred.emoji}
              percentage={pred.percentage}
              confidence={pred.confidence}
              isTop={idx === 0}
            />
          ))}
        </div>
      </div>

    </motion.div>
  );
}
