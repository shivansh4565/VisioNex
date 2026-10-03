import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle } from "lucide-react";
import { CIFAR10_CLASSES } from "../data/classes";

export default function UploadBox({ onSelectFile, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onSelectFile(e.target.files[0]);
    }
  };

  // Helper to generate a dummy synthetic image blob for instant 1-click test
  const handleSelectSample = (sampleClass) => {
    // Create a 32x32 canvas with emoji and color for testing
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    
    // Fill background with class specific soft tint
    ctx.fillStyle = sampleClass.color;
    ctx.fillRect(0, 0, 32, 32);

    // Render Emoji in center
    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(sampleClass.emoji, 16, 17);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `${sampleClass.name}_cifar10_sample.png`, { type: "image/png" });
        onSelectFile(file);
      }
    }, "image/png");
  };

  return (
    <div className="space-y-6">
      
      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragging
            ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900/60 hover:border-brand-400 hover:bg-slate-50/50 dark:hover:bg-navy-850/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm">
            <UploadCloud className="w-8 h-8 animate-bounce-subtle" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Upload Image for CNN Classification
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Drag & drop your image here, or{" "}
              <span className="text-brand-600 dark:text-brand-400 font-semibold underline underline-offset-2">
                browse files
              </span>
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-slate-400 font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Supports PNG, JPG, JPEG, WEBP (Max 10MB)</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Test Samples Bar */}
      <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Or test with a preloaded CIFAR-10 sample class:</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">1-Click Test</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CIFAR10_CLASSES.map((cls) => (
            <button
              key={cls.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectSample(cls);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 shadow-sm transition-all duration-150"
            >
              <span>{cls.emoji}</span>
              <span>{cls.displayName}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
