import { useState } from "react";
import { Layers, ArrowDown, Info, Cpu, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ArchitectureDiagram() {
  const [selectedLayer, setSelectedLayer] = useState(0);

  const layers = [
    {
      id: 0,
      name: "Input Image Tensor",
      dimensions: "3 × 32 × 32 (RGB)",
      type: "Input Data",
      params: "0 params",
      summary: "3-channel color image normalized using CIFAR-10 channel statistics (mean and standard deviation).",
      purpose: "Zero-centers pixel distributions, ensuring smooth backpropagation dynamics without exploding gradients."
    },
    {
      id: 1,
      name: "Conv Block 1 (Low-Level Features)",
      dimensions: "32 channels · 16 × 16",
      type: "Conv2d + BatchNorm + ReLU + MaxPool",
      params: "10,240 params",
      summary: "Two 3x3 Conv2d layers with 32 filters, Batch Normalization, ReLU non-linearity, 2x2 MaxPool, and 0.25 Dropout.",
      purpose: "Extracts low-level edge gradients, color boundaries, and elementary texture orientations."
    },
    {
      id: 2,
      name: "Conv Block 2 (Mid-Level Patterns)",
      dimensions: "64 channels · 8 × 8",
      type: "Conv2d + BatchNorm + ReLU + MaxPool",
      params: "55,680 params",
      summary: "Two 3x3 Conv2d layers with 64 filters, Batch Normalization, ReLU, 2x2 MaxPool, and 0.25 Dropout.",
      purpose: "Composes low-level primitives into localized patterns, shapes, corners, curves, and surface textures."
    },
    {
      id: 3,
      name: "Conv Block 3 (High-Level Semantics)",
      dimensions: "128 channels · 4 × 4",
      type: "Conv2d + BatchNorm + ReLU + MaxPool",
      params: "73,984 params",
      summary: "One 3x3 Conv2d layer with 128 filters, Batch Normalization, ReLU, 2x2 MaxPool, and 0.25 Dropout.",
      purpose: "Captures semantic object parts (wheels, bird beaks, animal ears, ship hulls) with translation invariance."
    },
    {
      id: 4,
      name: "Dense Feature Classifier",
      dimensions: "2,048 → 512 Units",
      type: "Flatten + Linear + BatchNorm1d + Dropout",
      params: "1,050,112 params",
      summary: "Flattens 128x4x4 (2,048 features) into a 512-dimensional latent representation with 0.50 Dropout regularization.",
      purpose: "Integrates global spatial representations into non-linear decision boundaries for classification."
    },
    {
      id: 5,
      name: "Output Layer & Softmax",
      dimensions: "10 Class Logits",
      type: "Linear + CrossEntropyLoss / Softmax",
      params: "5,130 params",
      summary: "Projects 512 latent features into 10 unnormalized class logits. Softmax converts logits into probabilities during inference.",
      purpose: "Outputs probability distribution across the 10 mutually exclusive CIFAR-10 object categories."
    }
  ];

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-500" />
            <span>Interactive CNN Layer Explorer</span>
          </h3>
          <p className="text-xs text-slate-500">
            Click any layer block below to inspect its receptive field, parameters, and role
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 self-start sm:self-auto">
          Total: 1,196,522 Params
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Visual Layer Pipeline Column */}
        <div className="lg:col-span-6 space-y-2">
          {layers.map((layer, idx) => {
            const isSelected = selectedLayer === layer.id;
            return (
              <div key={layer.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                    isSelected
                      ? "border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-navy-850/40 hover:border-brand-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center ${
                      isSelected
                        ? "bg-brand-600 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {layer.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {layer.dimensions}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-semibold text-brand-600 dark:text-brand-400">
                    {layer.params}
                  </span>
                </button>

                {idx < layers.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Layer Details Card */}
        <div className="lg:col-span-6 sticky top-24">
          <motion.div
            key={selectedLayer}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/40 dark:from-navy-950 dark:to-brand-950/20 border border-brand-200/80 dark:border-brand-900/60 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Layer {selectedLayer + 1} Architecture Spec
              </span>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {layers[selectedLayer].type}
              </span>
            </div>

            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {layers[selectedLayer].name}
            </h4>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">Tensor Dimensions</div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {layers[selectedLayer].dimensions}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">Learnable Weights</div>
                <div className="font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                  {layers[selectedLayer].params}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                Implementation Details
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-navy-900/70 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {layers[selectedLayer].summary}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                Computer Vision Purpose
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-navy-900/70 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {layers[selectedLayer].purpose}
              </p>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
}
