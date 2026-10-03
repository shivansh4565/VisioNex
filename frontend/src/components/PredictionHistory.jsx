import { History, Trash2, Clock, Inbox } from "lucide-react";

export default function PredictionHistory({ history = [], onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
          <Inbox className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          No predictions yet.
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Upload an image in the Classifier to start exploring what the VisioNex CNN can recognize.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-brand-500" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent Predictions History
          </h4>
          <span className="text-xs font-mono text-slate-400">({history.length})</span>
        </div>

        <button
          onClick={onClearHistory}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
              <th className="py-2.5 px-3">Thumbnail</th>
              <th className="py-2.5 px-3">Filename</th>
              <th className="py-2.5 px-3">Prediction</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-navy-850 transition-colors">
                <td className="py-2 px-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                    {item.preview ? (
                      <img src={item.preview} alt="Thumb" className="w-full h-full object-cover" />
                    ) : (
                      <span>{item.emoji || "🖼️"}</span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-3 font-mono font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                  {item.filename}
                </td>
                <td className="py-2 px-3">
                  <span className="inline-flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <span>{item.emoji}</span>
                    <span className="capitalize">{item.displayName || item.predicted_class}</span>
                  </span>
                </td>
                <td className="py-2 px-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {item.confidence_percentage}
                </td>
                <td className="py-2 px-3 text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.timestamp}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
