import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Cpu, Layers, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-900 via-navy-950 to-slate-950 text-white">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-medium">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>PyTorch Deep Learning & Computer Vision</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              See Images. <br />
              <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Understand Them with AI.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              VisioNex uses a deep convolutional neural network to classify images across 10 CIFAR-10 categories and return real-time prediction probabilities.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Try Image Classifier</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all duration-200"
              >
                <span>How It Works</span>
              </Link>
            </div>

            {/* Mini trust points */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Trained on 50,000 CIFAR-10 Samples</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span>Zero Fake Metrics</span>
              </span>
            </div>
          </motion.div>

          {/* Right Hero Visual Pipeline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl p-6 bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 font-mono text-slate-400">visioncore_cnn.pth</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[11px] border border-emerald-500/20">
                  LIVE INFERENCE
                </span>
              </div>

              {/* Visual Pipeline Stages */}
              <div className="space-y-4">
                
                {/* Stage 1: Uploaded Image */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="w-12 h-12 rounded-lg bg-indigo-950 flex items-center justify-center text-2xl border border-indigo-700/50">
                    🐶
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-200">1. Input Image Stream</div>
                    <div className="text-[11px] font-mono text-slate-400 truncate">sample_cifar_dog.png · 32×32 RGB</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Tensor [3, 32, 32]
                  </span>
                </div>

                {/* Connector Arrow */}
                <div className="flex justify-center">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-brand-500 to-indigo-500"></div>
                </div>

                {/* Stage 2: CNN Feature Extraction */}
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <Layers className="w-3.5 h-3.5 text-brand-400" />
                      <span>2. Hierarchical CNN Feature Maps</span>
                    </div>
                    <span className="text-[10px] font-mono text-brand-400">3 Stages + BN</span>
                  </div>
                  
                  {/* Visual Filter Blocks */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      Conv 32 <br /><span className="text-slate-500">16×16</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      Conv 64 <br /><span className="text-slate-500">8×8</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      Conv 128 <br /><span className="text-slate-500">4×4</span>
                    </div>
                  </div>
                </div>

                {/* Connector Arrow */}
                <div className="flex justify-center">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-indigo-500 to-emerald-500"></div>
                </div>

                {/* Stage 3: Live Output Result */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">
                      3. Argmax Softmax Prediction
                    </span>
                    <span className="text-xs font-bold text-emerald-300">87.4% Conf</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">🐶</span>
                      <div>
                        <div className="text-lg font-extrabold text-white">DOG</div>
                        <div className="text-[11px] text-slate-400">Category: Animal / Canine</div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1 text-[11px] font-mono text-slate-400">
                      <div>#2 Cat <span className="text-slate-300">7.2%</span></div>
                      <div>#3 Horse <span className="text-slate-300">2.1%</span></div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
