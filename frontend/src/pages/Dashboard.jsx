import { Link } from "react-router-dom";
import { Zap, BarChart3, Info, ArrowRight, Sparkles, CheckCircle2, Layers, Cpu, Database, Eye } from "lucide-react";
import { MODEL_METRICS, CIFAR10_CLASSES } from "../data/classes";

export default function Dashboard() {
  const metricCards = [
    {
      title: "Model Architecture",
      value: "VisionCore CNN",
      subtext: "3-Stage ConvNet + BN + Dropout",
      icon: Cpu,
      color: "text-brand-500",
      bgColor: "bg-brand-50 dark:bg-brand-950/60"
    },
    {
      title: "Benchmark Dataset",
      value: "CIFAR-10",
      subtext: "50,000 Train / 10,000 Test",
      icon: Database,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/60"
    },
    {
      title: "Target Categories",
      value: "10 Classes",
      subtext: "Mutually exclusive classes",
      icon: Layers,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/60"
    },
    {
      title: "Test Set Accuracy",
      value: `${MODEL_METRICS.overallAccuracy}%`,
      subtext: `+28.5% over ANN (${MODEL_METRICS.baselineAnnAccuracy}%)`,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/60"
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-navy-950 to-indigo-950 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Classification Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Analyze Images with VisioNex CNN
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Upload custom photographs or test with preloaded CIFAR-10 benchmark images to evaluate real-time PyTorch CNN inference.
          </p>
        </div>

        <Link
          to="/dashboard/classifier"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all self-start md:self-auto flex-shrink-0"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Open Image Classifier</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metricCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${item.bgColor}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  METRIC
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {item.value}
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {item.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Focus: Quick Launch into Classifier */}
      <div className="p-8 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              CNN Image Classifier Workspace
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Upload custom images or test with 1-click preloaded CIFAR-10 samples. The model performs real-time preprocessing, feeds the 3×32×32 tensor through the convolutional layers, and returns the top predicted categories with confidence percentages.
            </p>
          </div>

          <Link
            to="/dashboard/classifier"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex-shrink-0"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Launch Classifier</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
