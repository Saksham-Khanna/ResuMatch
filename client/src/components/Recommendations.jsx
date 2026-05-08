import { useState } from 'react'
import { ChevronDown, ChevronRight, Lightbulb, ArrowUpCircle } from 'lucide-react'

const PRIORITY_CONFIG = {
  high: { label: 'High', bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]/80', border: 'border-[#EF4444]/20' },
  medium: { label: 'Medium', bg: 'bg-[#F97316]/10', text: 'text-[#F97316]/80', border: 'border-[#F97316]/20' },
  low: { label: 'Low', bg: 'bg-white/5', text: 'text-[#A8A29E]', border: 'border-white/10' },
}

function RecommendationRow({ rec, index, isOpen, onToggle }) {
  const config = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.low

  return (
    <div
      className={`rounded-xl border transition-all duration-300 overflow-hidden
        ${isOpen ? 'border-[#F97316]/30 bg-[#F97316]/5' : 'border-white/8 bg-transparent hover:border-white/15 hover:bg-white/[0.02]'}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left group"
      >
        {/* Number badge */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
          ${isOpen ? 'bg-[#F97316]/20 text-[#F97316]' : 'bg-white/5 text-[#A8A29E] group-hover:bg-[#F97316]/10 group-hover:text-[#F97316]'}
          transition-all`}
        >
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm transition-colors ${isOpen ? 'text-[#FAFAF9]' : 'text-[#E7E5E4] group-hover:text-[#FAFAF9]'}`}>
            {rec.title}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`chip text-[10px] font-semibold ${config.bg} ${config.text} border ${config.border}`}>
            {config.label}
          </span>
          {isOpen
            ? <ChevronDown size={15} className="text-[#F97316]" />
            : <ChevronRight size={15} className="text-[#A8A29E] group-hover:text-[#F97316] transition-colors" />
          }
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pl-[60px] animate-fade-in">
          <p className="text-[#E7E5E4] text-sm leading-relaxed">{rec.description}</p>
        </div>
      )}
    </div>
  )
}

export default function Recommendations({ recommendations = [] }) {
  const [openIndex, setOpenIndex] = useState(0) // open first by default

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i))

  return (
    <div className="card-static p-5 animate-slide-up">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center shrink-0">
          <Lightbulb size={15} className="text-[#F97316]" />
        </div>
        <div>
          <h3 className="text-[#FAFAF9] font-semibold text-sm">Recommendations</h3>
          <p className="text-[#A8A29E] text-xs">{recommendations.length} actionable steps</p>
        </div>
        <div className="ml-auto">
          <ArrowUpCircle size={16} className="text-[#F97316]/50" />
        </div>
      </div>

      <div className="space-y-2">
        {recommendations.length > 0 ? (
          recommendations.map((rec, i) => (
            <RecommendationRow
              key={i}
              rec={rec}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))
        ) : (
          <p className="text-[#A8A29E] text-sm text-center py-6">No recommendations available.</p>
        )}
      </div>
    </div>
  )
}
