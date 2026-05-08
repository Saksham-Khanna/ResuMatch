import { AlertTriangle, Target } from 'lucide-react'
import Tilt from 'react-parallax-tilt'

const CATEGORY_COLORS = {
  'Programming Languages': { bg: 'bg-[#F97316]/15', text: 'text-[#FB923C]', border: 'border-[#F97316]/30' },
  'Frameworks & Libraries': { bg: 'bg-[#EA580C]/15', text: 'text-[#EA580C]', border: 'border-[#EA580C]/30' },
  'Databases': { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]/80', border: 'border-[#EF4444]/20' },
  'Cloud & DevOps': { bg: 'bg-[#22C55E]/8', text: 'text-[#22C55E]/70', border: 'border-[#22C55E]/20' },
  'Soft Skills': { bg: 'bg-white/5', text: 'text-[#A8A29E]', border: 'border-white/10' },
  'Other Skills': { bg: 'bg-white/5', text: 'text-[#A8A29E]', border: 'border-white/10' },
}

export default function SkillGap({ skillGaps = [], isJdMissing, benchmarkGaps = [] }) {
  const displayGaps = isJdMissing ? benchmarkGaps : skillGaps;

  if (displayGaps.length === 0) {
    return (
      <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500} className="h-full">
        <div className="card-static p-5 animate-slide-up h-full">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
              <Target size={15} className="text-[#22C55E]/80" />
            </div>
            <h3 className="text-[#FAFAF9] font-semibold text-sm">Skill Gap Analysis</h3>
          </div>
          <p className="text-[#22C55E]/80 text-sm">🎉 No significant skill gaps detected!</p>
        </div>
      </Tilt>
    )
  }

  // Group by category
  const grouped = displayGaps.reduce((acc, gap) => {
    const cat = gap.category || 'Other Skills'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(gap)
    return acc
  }, {})

  return (
    <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} transitionSpeed={2000} className="h-full">
      <div className="card-static p-5 animate-slide-up h-full">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center shrink-0">
            {isJdMissing ? <Target size={15} className="text-[#F97316]" /> : <AlertTriangle size={15} className="text-[#EF4444]/80" />}
          </div>
          <div>
            <h3 className="text-[#FAFAF9] font-semibold text-sm">
              {isJdMissing ? 'Industry Benchmarks' : 'Skill Gaps'}
            </h3>
            <p className="text-[#A8A29E] text-xs">
              {isJdMissing 
                ? `Core skills for ${displayGaps.length} areas` 
                : `${displayGaps.length} skills to acquire`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(grouped).map(([category, skills]) => {
            const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['Other Skills']
            return (
              <div key={category}>
                <p className="text-[#A8A29E] text-xs font-semibold uppercase tracking-wider mb-2">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((gap, i) => (
                    <span
                      key={i}
                      className={`chip border text-xs ${colors.bg} ${colors.text} ${colors.border} hover:scale-105 transition-transform cursor-default`}
                    >
                      {gap.skill}
                      {gap.importance === 'high' && (
                        <span className="ml-1 text-[10px] opacity-60">!</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[#A8A29E] text-xs">
            💡 Focus on high-priority (!) gaps first — they have the most impact on your match rate.
          </p>
        </div>
      </div>
    </Tilt>
  )
}
