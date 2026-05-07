import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CounterAnimation from './ui/CounterAnimation'

const tabLabels = {
  problem: '문제정의',
  approach: 'ML접근',
  results: '결과지표',
}

export default function CaseCard({ study }) {
  const [activeTab, setActiveTab] = useState('problem')
  const [showFailures, setShowFailures] = useState(false)

  return (
    <div id={study.id} className="bg-gray-900 rounded-2xl p-6 md:p-8 scroll-mt-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{study.icon}</span>
        <div>
          <h3 className="text-xl md:text-2xl font-bold">{study.title}</h3>
          <p className="text-gray-400 text-sm">{study.subtitle} &middot; {study.period}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800 rounded-lg p-1 mb-6">
        {Object.entries(tabLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === key
                ? 'bg-accent text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="text-gray-300 leading-relaxed mb-8"
        >
          {study.tabs[activeTab]}
        </motion.div>
      </AnimatePresence>

      {/* Before → After Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {study.beforeAfter.map((metric) => (
          <div key={metric.label} className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-gray-400 text-xs mb-2">{metric.label}</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-500 text-lg">{metric.before}{metric.unit}</span>
              <span className="text-accent">→</span>
              <span className="text-2xl font-bold text-white">
                <CounterAnimation from={metric.before} to={metric.after} unit={metric.unit} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Failed Experiments Toggle */}
      <button
        onClick={() => setShowFailures(!showFailures)}
        className="flex items-center gap-2 text-gray-400 hover:text-accent text-sm transition-colors cursor-pointer"
      >
        <motion.span
          animate={{ rotate: showFailures ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▶
        </motion.span>
        실패한 실험 ({study.failedExperiments.length})
      </button>

      <AnimatePresence>
        {showFailures && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3">
              {study.failedExperiments.map((exp, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-red-400 mb-1">{exp.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
