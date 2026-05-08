import { CheckCircle2, Circle, LayoutList } from 'lucide-react'

const SECTION_ICONS = {
  contact: '📧',
  summary: '✨',
  experience: '💼',
  education: '🎓',
  skills: '🛠️',
  projects: '🚀',
  certifications: '🏆',
  achievements: '⭐',
}

export default function SectionAnalysis({ sections = [] }) {
  const present = sections.filter((s) => s.present)
  const missing = sections.filter((s) => !s.present)
  const score = sections.length > 0
    ? Math.round((present.length / sections.length) * 100)
    : 0

  return (
    <div className="card-static p-5 animate-slide-up">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center shrink-0">
          <LayoutList size={15} className="text-[#F97316]" />
        </div>
        <div className="flex-1">
          <h3 className="text-[#FAFAF9] font-semibold text-sm">Section Analysis</h3>
          <p className="text-[#A8A29E] text-xs">{present.length}/{sections.length} sections detected</p>
        </div>
        <span className="text-[#FAFAF9] font-bold text-lg">{score}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-all duration-1000"
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sections.map((section) => (
          <div
            key={section.name}
            className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all
              ${section.present
                ? 'bg-[#22C55E]/5 border border-[#22C55E]/15'
                : 'bg-white/[0.02] border border-white/5'
              }`}
          >
            <span className="text-base shrink-0">{SECTION_ICONS[section.name] || '📄'}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium capitalize ${section.present ? 'text-[#FAFAF9]' : 'text-[#A8A29E]'}`}>
                {section.name}
              </p>
            </div>
            {section.present ? (
              <CheckCircle2 size={13} className="text-[#22C55E]/80 shrink-0" />
            ) : (
              <Circle size={13} className="text-[#A8A29E]/30 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {missing.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-[#EF4444]/5 border border-[#EF4444]/15">
          <p className="text-[#EF4444]/80 text-xs font-medium mb-1">Missing Sections:</p>
          <p className="text-[#A8A29E] text-xs">
            {missing.map((s) => s.name).join(', ')} — Add these to improve your ATS score.
          </p>
        </div>
      )}
    </div>
  )
}
