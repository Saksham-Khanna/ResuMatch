import { useState } from 'react'
import { Wand2, ChevronRight, Check, Copy, ArrowRight } from 'lucide-react'

function BulletCompare({ original, improved, index }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(improved)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden
      ${expanded ? 'border-[#F97316]/30 bg-[#F97316]/5' : 'border-white/8 hover:border-white/15'}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left group"
      >
        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0
          ${expanded ? 'bg-[#F97316]/20 text-[#F97316]' : 'bg-white/5 text-[#A8A29E]'}`}>
          {index + 1}
        </div>
        <p className={`flex-1 text-sm truncate transition-colors ${expanded ? 'text-[#FAFAF9]' : 'text-[#A8A29E] group-hover:text-[#E7E5E4]'}`}>
          {original}
        </p>
        <ChevronRight size={14} className={`shrink-0 transition-transform ${expanded ? 'rotate-90 text-[#F97316]' : 'text-[#A8A29E]'}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          {/* Original */}
          <div className="p-3 rounded-lg bg-[#EF4444]/5 border border-[#EF4444]/15">
            <p className="text-[#A8A29E] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Original</p>
            <p className="text-[#E7E5E4] text-sm leading-relaxed">{original}</p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight size={16} className="text-[#F97316]/60" />
          </div>

          {/* Improved */}
          <div className="p-3 rounded-lg bg-[#F97316]/10 border border-[#F97316]/25 relative">
            <p className="text-[#F97316] text-[10px] font-semibold uppercase tracking-wider mb-1.5">AI Improved</p>
            <p className="text-[#FAFAF9] text-sm leading-relaxed">{improved}</p>
            <button
              onClick={copy}
              className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-[#F97316]/20 flex items-center justify-center hover:bg-[#F97316]/30 transition-all text-[#F97316]"
              title="Copy improved bullet"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ResumeOptimizer({ optimizedBullets = [] }) {
  if (optimizedBullets.length === 0) {
    return (
      <div className="card-static p-5 animate-slide-up">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center shrink-0">
            <Wand2 size={15} className="text-[#F97316]" />
          </div>
          <h3 className="text-[#FAFAF9] font-semibold text-sm">Resume Optimizer</h3>
        </div>
        <div className="p-4 rounded-xl bg-[#F97316]/5 border border-[#F97316]/15">
          <p className="text-[#A8A29E] text-sm text-center">
            Add an OpenAI API key to enable AI-powered bullet point optimization.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card-static p-5 animate-slide-up">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center shrink-0">
          <Wand2 size={15} className="text-[#F97316]" />
        </div>
        <div>
          <h3 className="text-[#FAFAF9] font-semibold text-sm">AI Resume Optimizer</h3>
          <p className="text-[#A8A29E] text-xs">{optimizedBullets.length} bullet points improved</p>
        </div>
      </div>

      <div className="space-y-2">
        {optimizedBullets.map((bullet, i) => (
          <BulletCompare
            key={i}
            original={bullet.original}
            improved={bullet.improved}
            index={i}
          />
        ))}
      </div>

      <p className="text-[#A8A29E] text-xs mt-4 text-center">
        Click each row to see the AI improvement. Copy with the button.
      </p>
    </div>
  )
}
