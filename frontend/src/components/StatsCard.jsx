import { Image as ImageIcon, Grid, Maximize2, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCard() {
  const stats = [
    {
      value: "60,000+",
      label: "CIFAR-10 Images",
      subtext: "50k train / 10k test split",
      icon: ImageIcon,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/40"
    },
    {
      value: "10",
      label: "Object Categories",
      subtext: "Mutually exclusive classes",
      icon: Grid,
      color: "text-brand-500",
      bgColor: "bg-brand-50 dark:bg-brand-950/40"
    },
    {
      value: "32 × 32",
      label: "Input Resolution",
      subtext: "3-channel RGB tensors",
      icon: Maximize2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40"
    },
    {
      value: "1.19M",
      label: "CNN Parameters",
      subtext: "PyTorch 3-stage architecture",
      icon: Cpu,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/40"
    }
  ];

  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-brand-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${item.bgColor}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  BENCHMARK
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {item.value}
              </div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                {item.label}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {item.subtext}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
