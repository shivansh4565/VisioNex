import { Cpu, Zap, PieChart, Layers, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FeatureCard() {
  const features = [
    {
      title: "CNN Powered",
      description: "Deep 3-stage convolutional architecture with batch normalization and dropout, trained on CIFAR-10.",
      icon: Cpu,
      tag: "Deep Learning",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Real-Time Prediction",
      description: "Upload any custom photo or test sample and receive instantaneous class predictions and confidence scores.",
      icon: Zap,
      tag: "Low Latency",
      color: "from-brand-500 to-purple-600"
    },
    {
      title: "Confidence Analysis",
      description: "Examine Top-3 ranked classes and full 10-category softmax probability distributions in interactive charts.",
      icon: PieChart,
      tag: "Probability",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Pipeline Mechanics",
      description: "Understand the complete computer vision pipeline from 32×32 pixel tensor normalization to argmax decisions.",
      icon: Layers,
      tag: "Deep Learning",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50 dark:bg-navy-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Core Architecture & Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Computer Vision, Made Simple.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Everything you need to explore, test, and understand Convolutional Neural Networks on the CIFAR-10 image benchmark.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-brand-500/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:gap-2 transition-all"
                  >
                    <span>Explore in Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
