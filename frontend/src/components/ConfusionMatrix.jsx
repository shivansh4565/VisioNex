import { useState } from "react";
import { CONFUSION_MATRIX_DATA, CIFAR10_CLASSES } from "../data/classes";

export default function ConfusionMatrix() {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Calculate maximum cell value for dynamic heat color scaling
  const maxVal = 1000; // 1,000 samples per class in test set

  const getHeatmapColor = (val, isDiagonal) => {
    if (isDiagonal) {
      // Emerald / Indigo intensity for diagonal
      const opacity = Math.min(Math.max(val / maxVal, 0.2), 0.95);
      return `rgba(79, 70, 229, ${opacity})`;
    }
    // Subtle red/slate for misclassifications
    if (val === 0) return "transparent";
    const opacity = Math.min(val / 200, 0.7);
    return `rgba(244, 63, 94, ${opacity})`;
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Official 10,000-Image Test Set Confusion Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Rows represent Ground Truth categories; Columns represent Model Predictions
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span>
            <span className="text-slate-600 dark:text-slate-400">Correct (Diagonal)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>
            <span className="text-slate-600 dark:text-slate-400">Confused</span>
          </div>
        </div>
      </div>

      {/* Interactive 10x10 Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[580px]">
          {/* Header Row: Predicted Labels */}
          <div className="grid grid-cols-11 gap-1 text-[10px] font-mono text-center mb-1 text-slate-400 font-semibold">
            <div className="text-left font-bold text-slate-500">Actual \ Pred</div>
            {CIFAR10_CLASSES.map((c) => (
              <div key={c.id} className="truncate p-1" title={c.displayName}>
                {c.emoji}
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          {CONFUSION_MATRIX_DATA.map((row, rowIdx) => {
            const actualClass = CIFAR10_CLASSES[rowIdx];
            return (
              <div key={rowIdx} className="grid grid-cols-11 gap-1 mb-1 items-center">
                {/* Row Header */}
                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate pr-1 flex items-center gap-1">
                  <span>{actualClass.emoji}</span>
                  <span className="truncate">{actualClass.displayName}</span>
                </div>

                {/* 10 Columns for this row */}
                {row.map((val, colIdx) => {
                  const isDiagonal = rowIdx === colIdx;
                  const predClass = CIFAR10_CLASSES[colIdx];
                  const bg = getHeatmapColor(val, isDiagonal);

                  return (
                    <div
                      key={colIdx}
                      onMouseEnter={() =>
                        setHoveredCell({
                          actual: actualClass.displayName,
                          pred: predClass.displayName,
                          count: val,
                          pct: ((val / 1000) * 100).toFixed(1)
                        })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{ backgroundColor: bg }}
                      className={`h-9 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                        isDiagonal
                          ? "border-indigo-400/50 text-white font-extrabold shadow-sm"
                          : val > 20
                          ? "border-rose-400/40 text-rose-800 dark:text-rose-200"
                          : "border-slate-100 dark:border-slate-800/40 text-slate-500"
                      }`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Cell Inspector */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs font-mono flex items-center justify-between min-h-[44px]">
        {hoveredCell ? (
          <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
            <span>
              Actual: <strong className="text-indigo-600 dark:text-indigo-400">{hoveredCell.actual}</strong>
            </span>
            <span>→</span>
            <span>
              Predicted: <strong className="text-indigo-600 dark:text-indigo-400">{hoveredCell.pred}</strong>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Count: {hoveredCell.count} ({hoveredCell.pct}% of class)
            </span>
          </div>
        ) : (
          <span className="text-slate-400 italic">
            Hover over any cell in the 10×10 matrix to inspect classification counts and error rates.
          </span>
        )}
      </div>

      {/* Per-Class Metrics Table */}
      <div className="pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Per-Class Detailed Evaluation Metrics
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-400">
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Precision</th>
                <th className="py-2.5 px-3">Recall (Acc)</th>
                <th className="py-2.5 px-3">F1-Score</th>
                <th className="py-2.5 px-3">Test Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {CIFAR10_CLASSES.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50 dark:hover:bg-navy-850">
                  <td className="py-2 px-3 font-sans font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{cls.emoji}</span>
                    <span>{cls.displayName}</span>
                  </td>
                  <td className="py-2 px-3 text-slate-500 font-sans">{cls.category}</td>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{(cls.precision * 100).toFixed(1)}%</td>
                  <td className="py-2 px-3 font-bold text-emerald-600 dark:text-emerald-400">{cls.accuracy.toFixed(1)}%</td>
                  <td className="py-2 px-3 text-brand-600 dark:text-brand-400 font-semibold">{cls.f1.toFixed(4)}</td>
                  <td className="py-2 px-3 text-slate-400">1,000</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
