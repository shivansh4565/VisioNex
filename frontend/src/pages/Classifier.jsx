import { usePrediction } from "../hooks/usePrediction";
import UploadBox from "../components/UploadBox";
import ImagePreview from "../components/ImagePreview";
import PredictionCard from "../components/PredictionCard";
import ProbabilityChart from "../components/ProbabilityChart";
import PredictionHistory from "../components/PredictionHistory";
import { Zap, ShieldAlert, Sparkles } from "lucide-react";

export default function Classifier() {
  const {
    selectedFile,
    previewUrl,
    isLoading,
    error,
    predictionResult,
    history,
    handleSelectFile,
    clearSelection,
    classify,
    clearHistory
  } = usePrediction();

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive PyTorch CNN Inference</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            CNN Image Classifier
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload an image to predict its category across the 10 CIFAR-10 classes in real-time.
          </p>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload or Preview */}
        <div className="lg:col-span-6 space-y-6">
          {!previewUrl ? (
            <UploadBox onSelectFile={handleSelectFile} error={error} />
          ) : (
            <ImagePreview
              file={selectedFile}
              previewUrl={previewUrl}
              onClassify={classify}
              onClear={clearSelection}
              isLoading={isLoading}
            />
          )}

          {/* Domain Limitation Notice */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Input Resolution Note</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Images are automatically downscaled to 32×32 pixels and normalized with CIFAR-10 channel statistics. Real-world photographs with complex backgrounds may yield lower confidence.
            </p>
          </div>
        </div>

        {/* Right Column: Prediction Results or Placeholder */}
        <div className="lg:col-span-6 space-y-6">
          {predictionResult ? (
            <>
              <PredictionCard result={predictionResult} />
              <ProbabilityChart
                allProbabilities={predictionResult.all_probabilities}
                predictedClass={predictionResult.predicted_class}
              />
            </>
          ) : (
            <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                <Sparkles className="w-7 h-7 text-brand-400 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Awaiting Image Classification
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Select an image on the left and click <strong>"Classify Image"</strong> to run the PyTorch CNN model and view confidence scores.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Prediction History Section */}
      <div className="pt-4">
        <PredictionHistory history={history} onClearHistory={clearHistory} />
      </div>

    </div>
  );
}
