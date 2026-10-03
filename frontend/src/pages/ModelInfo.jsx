import { Cpu, Database, Layers, ShieldCheck, CheckCircle2 } from "lucide-react";
import { MODEL_METRICS, CIFAR10_CLASSES } from "../data/classes";
import ArchitectureDiagram from "../components/ArchitectureDiagram";

export default function ModelInfo() {
  const specs = [
    { label: "Model Name", value: "VisionCore CNN (PyTorch)" },
    { label: "Deep Learning Framework", value: "PyTorch 2.12+ / Torchvision" },
    { label: "Dataset Benchmark", value: "CIFAR-10 (Canadian Institute for Advanced Research)" },
    { label: "Input Tensor Shape", value: "3 × 32 × 32 (Channels, Height, Width)" },
    { label: "Number of Output Classes", value: "10 Mutually Exclusive Categories" },
    { label: "Total Learnable Parameters", value: "1,196,522 Parameters" },
    { label: "Training Loss Function", value: "torch.nn.CrossEntropyLoss()" },
    { label: "Optimization Algorithm", value: "Adam (lr=0.001, weight_decay=1e-4)" },
    { label: "Learning Rate Scheduling", value: "ReduceLROnPlateau (factor=0.5, patience=3)" },
    { label: "Regularization Techniques", value: "BatchNorm2d + Dropout2d(0.25) + Dropout(0.50)" }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Specifications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Model & Dataset Specifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Technical blueprint of the PyTorch convolutional neural network and CIFAR-10 configuration.
          </p>
        </div>
      </div>

      {/* Technical Specs Key-Value Grid */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-500" />
          <span>System Blueprint & Hyperparameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 font-mono text-xs">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
            >
              <span className="text-slate-500 font-sans font-medium">{item.label}</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Breakdown Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            CIFAR-10 Dataset Partitioning & Normalization
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900">
            <div className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">40,000</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Training Split (80%)</div>
            <div className="text-[11px] text-slate-500">With RandomCrop & Flip</div>
          </div>
          <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">10,000</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Validation Split (20%)</div>
            <div className="text-[11px] text-slate-500">Checkpoint Selection</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">10,000</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Test Split (Untouched)</div>
            <div className="text-[11px] text-slate-500">Final Metric Evaluation</div>
          </div>
        </div>

        {/* 10 Classes Grid */}
        <div className="pt-2 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Official 10 Classes Inventory
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {CIFAR10_CLASSES.map((c) => (
              <div
                key={c.id}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <span className="text-lg">{c.emoji}</span>
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 capitalize">{c.displayName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {c.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Layer Visualizer */}
      <ArchitectureDiagram />

    </div>
  );
}
