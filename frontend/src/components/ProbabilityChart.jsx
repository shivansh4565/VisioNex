import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { CIFAR10_CLASSES } from "../data/classes";

export default function ProbabilityChart({ allProbabilities, predictedClass }) {
  if (!allProbabilities) return null;

  // Format chart data sorted from highest probability to lowest
  const chartData = CIFAR10_CLASSES.map((cls) => {
    const rawVal = allProbabilities[cls.name] ?? 0;
    const pct = Number((rawVal * 100).toFixed(2));
    return {
      name: `${cls.emoji} ${cls.displayName}`,
      shortName: cls.displayName,
      className: cls.name,
      percentage: pct,
      raw: rawVal,
      isWinner: cls.name === predictedClass
    };
  }).sort((a, b) => b.percentage - a.percentage); // Sort descending

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-xl bg-slate-900 text-white text-xs border border-slate-700 shadow-xl space-y-1">
          <div className="font-bold text-sm text-brand-300">{data.name}</div>
          <div className="font-mono text-emerald-400 font-semibold">{data.percentage}% Confidence</div>
          <div className="text-[10px] text-slate-400">Softmax Score: {data.raw.toFixed(4)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            10-Class Probability Spectrum
          </h4>
          <p className="text-xs text-slate-500">
            Softmax output vector ranked by predicted confidence
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
          Ranked Softmax
        </span>
      </div>

      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 35, left: 25, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              stroke="#94a3b8"
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              width={125}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99, 102, 241, 0.05)" }} />
            <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={16}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isWinner ? "#4f46e5" : "#94a3b8"}
                  opacity={entry.isWinner ? 1 : 0.4}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
