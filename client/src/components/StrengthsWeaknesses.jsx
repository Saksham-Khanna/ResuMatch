import { CheckCircle2, XCircle } from 'lucide-react'

export default function StrengthsWeaknesses({ strengths = [], weaknesses = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
      {/* Strengths */}
      <div className="card-static p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={15} className="text-[#22C55E]/80" />
          </div>
          <div>
            <h3 className="text-[#FAFAF9] font-semibold text-sm">Strengths</h3>
            <p className="text-[#A8A29E] text-xs">{strengths.length} identified</p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {strengths.length > 0 ? (
            strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 group">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]/60 mt-1.5 shrink-0 group-hover:bg-[#22C55E] transition-colors" />
                <p className="text-[#E7E5E4] text-sm leading-relaxed">{s}</p>
              </li>
            ))
          ) : (
            <li className="text-[#A8A29E] text-sm">No strengths identified</li>
          )}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="card-static p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center shrink-0">
            <XCircle size={15} className="text-[#EF4444]/80" />
          </div>
          <div>
            <h3 className="text-[#FAFAF9] font-semibold text-sm">Areas to Improve</h3>
            <p className="text-[#A8A29E] text-xs">{weaknesses.length} found</p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {weaknesses.length > 0 ? (
            weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2.5 group">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]/60 mt-1.5 shrink-0 group-hover:bg-[#EF4444] transition-colors" />
                <p className="text-[#E7E5E4] text-sm leading-relaxed">{w}</p>
              </li>
            ))
          ) : (
            <li className="text-[#A8A29E] text-sm">No weaknesses identified</li>
          )}
        </ul>
      </div>
    </div>
  )
}
