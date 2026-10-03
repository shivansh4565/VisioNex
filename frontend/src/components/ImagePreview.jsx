import { Zap, Trash2, RefreshCw, Layers, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ImagePreview({ file, previewUrl, onClassify, onClear, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Image Preprocessing Preview</span>
          </h4>
          <p className="text-xs text-slate-500 font-mono">
            {file?.name || "Uploaded Image"} · {(file?.size ? (file.size / 1024).toFixed(1) : "0")} KB
          </p>
        </div>

        <button
          onClick={onClear}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove</span>
        </button>
      </div>

      {/* Dual Preview: Original vs 32x32 Tensor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Original */}
        <div className="space-y-2 text-center">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <span>Original Upload</span>
          </div>
          <div className="h-48 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden p-2">
            <img
              src={previewUrl}
              alt="Original Preview"
              className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
            />
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Source Resolution
          </div>
        </div>

        {/* 32x32 CNN View */}
        <div className="space-y-2 text-center">
          <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center justify-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>32 × 32 Input Tensor</span>
          </div>
          <div className="h-48 rounded-xl bg-slate-100 dark:bg-navy-950 border border-brand-300 dark:border-brand-800/80 flex items-center justify-center overflow-hidden p-2 relative">
            <img
              src={previewUrl}
              alt="32x32 Resized Preview"
              style={{ imageRendering: "pixelated" }}
              className="w-24 h-24 object-cover rounded shadow border border-brand-500/30"
            />
            <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-brand-600 text-white px-1.5 py-0.5 rounded">
              32×32 px
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Normalized with CIFAR-10 Mean & Std
          </div>
        </div>

      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={onClassify}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing Image with PyTorch CNN...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-white" />
              <span>Classify Image with VisionCore CNN</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>

    </motion.div>
  );
}
