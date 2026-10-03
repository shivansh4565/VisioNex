import { UploadCloud, Layers, Cpu, Activity, Minimize2, CheckCircle2, Award, Sparkles } from "lucide-react";
import ArchitectureDiagram from "../components/ArchitectureDiagram";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Upload an Image",
      icon: UploadCloud,
      subtitle: "Client Ingestion",
      color: "from-blue-500 to-indigo-600",
      description: "The user uploads an image via the web dashboard or selects a benchmark sample. Supported formats include PNG, JPG, JPEG, and WEBP."
    },
    {
      step: 2,
      title: "Preprocessing & Normalization",
      icon: Layers,
      subtitle: "Pixel Standardization",
      color: "from-indigo-500 to-brand-600",
      description: "The image is downscaled to 32×32 resolution and converted to a 3-channel (C, H, W) PyTorch tensor. It is normalized using CIFAR-10 channel mean [0.4914, 0.4822, 0.4465] and std [0.2470, 0.2435, 0.2616]."
    },
    {
      step: 3,
      title: "2D Convolution Operations",
      icon: Cpu,
      subtitle: "Spatial Feature Extraction",
      color: "from-brand-500 to-purple-600",
      description: "Learnable 3×3 convolution filters slide across the image, computing dot products to detect elementary patterns (edges, color gradients, and textures) while sharing weights."
    },
    {
      step: 4,
      title: "ReLU Activation",
      icon: Activity,
      subtitle: "Non-Linear Transformation",
      color: "from-purple-500 to-pink-600",
      description: "Rectified Linear Unit (ReLU: max(0, x)) introduces non-linearity without saturating positive values, allowing the network to learn complex mathematical representations."
    },
    {
      step: 5,
      title: "Max Pooling & Regularization",
      icon: Minimize2,
      subtitle: "Dimension Reduction & Invariance",
      color: "from-pink-500 to-rose-600",
      description: "2×2 Max Pooling halves spatial dimensions (32→16→8→4), boosting translation invariance and reducing parameter load. Dropout (0.25) prevents overfitting."
    },
    {
      step: 6,
      title: "Dense Classification & Softmax",
      icon: Layers,
      subtitle: "Probability Distribution",
      color: "from-amber-500 to-orange-600",
      description: "Extracted feature maps are flattened into 2,048 dimensions, passed through a 512-unit dense layer, and projected into 10 class logits. Softmax converts logits into normalized probabilities."
    },
    {
      step: 7,
      title: "Final Prediction & Confidence",
      icon: Award,
      subtitle: "Argmax Decision",
      color: "from-emerald-500 to-teal-600",
      description: "The system identifies the highest probability category via torch.argmax() and presents the winning class, confidence score, and Top-3 ranked results to the user."
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-slate-50 dark:bg-navy-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>End-to-End Deep Learning Pipeline</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How VisioNex Works
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            From pixels to predictions — understand the complete CNN pipeline.
          </p>
        </div>

        {/* 7-Step Pipeline Walkthrough */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-sm font-bold text-sm`}>
                      {item.step}
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {item.subtitle}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-brand-500" />
                    <span>{item.title}</span>
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sample Output UI Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white to-brand-50/40 dark:from-navy-900 dark:to-navy-950 border border-brand-200/80 dark:border-brand-900/60 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Sample Classification Result
              </span>
              <div className="flex items-center gap-3">
                <span className="text-4xl">🐶</span>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">DOG</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">87.4% Confidence Score</div>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-64 p-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase pb-1 border-b border-slate-100 dark:border-slate-800">
                Top Predictions
              </div>
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                <span>1. Dog</span>
                <span className="text-brand-600 dark:text-brand-400">87.4%</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>2. Cat</span>
                <span>7.2%</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>3. Horse</span>
                <span>2.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Architecture Component */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              VisioNex CNN Layer Architecture
            </h2>
            <p className="text-xs text-slate-500">
              Explore how each layer processes tensors from 3×32×32 input to 10 class probabilities.
            </p>
          </div>
          <ArchitectureDiagram />
        </div>

      </div>
    </div>
  );
}
