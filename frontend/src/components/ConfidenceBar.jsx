import { motion } from "framer-motion";

export default function ConfidenceBar({ rank, classNameText, emoji, percentage, confidence, isTop = false }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            isTop
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}>
            #{rank}
          </span>
          <span className="text-base">{emoji}</span>
          <span className="capitalize font-semibold">{classNameText}</span>
        </div>
        <span className={`font-mono text-xs font-bold ${
          isTop ? "text-brand-600 dark:text-brand-400 text-sm" : "text-slate-600 dark:text-slate-400"
        }`}>
          {percentage}
        </span>
      </div>

      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-navy-950 overflow-hidden border border-slate-200/80 dark:border-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(confidence * 100, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isTop
              ? "bg-gradient-to-r from-brand-500 to-indigo-600 shadow-sm"
              : "bg-slate-400 dark:bg-slate-600"
          }`}
        />
      </div>
    </div>
  );
}
