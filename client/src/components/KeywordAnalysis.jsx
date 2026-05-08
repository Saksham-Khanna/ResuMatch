import { useState } from 'react'
import { Tag, Search, X } from 'lucide-react'

function KeywordChip({ word, type, importance }) {
  const [hovered, setHovered] = useState(false)

  const styles = {
    detected: 'bg-[#F97316]/15 text-[#FB923C] border-[#F97316]/30 hover:bg-[#F97316]/25 hover:border-[#F97316]/60',
    missing: 'bg-[#EF4444]/8 text-[#EF4444]/70 border-[#EF4444]/15 hover:bg-[#EF4444]/15',
  }

  return (
    <span
      className={`chip border text-xs cursor-default transition-all duration-200 ${styles[type]}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {word}
      {importance === 'high' && (
        <span className="ml-1 text-[10px] opacity-60">●</span>
      )}
    </span>
  )
}

export default function KeywordAnalysis({ keywords, isJdMissing, benchmarkKeywords }) {
  const [filter, setFilter] = useState('')
  const [tab, setTab] = useState(isJdMissing ? 'industry' : 'detected')

  const detected = keywords?.detected || []
  const missing = keywords?.missing || []
  
  // Cross-reference benchmark keywords with what was actually detected in the resume
  const industry = benchmarkKeywords?.map(word => {
    const isDetected = detected.some(d => d.word.toLowerCase() === word.toLowerCase())
    return { 
      word, 
      importance: 'medium', 
      type: isDetected ? 'detected' : 'missing' 
    }
  }) || []

  const filtered = (list) =>
    filter
      ? list.filter((k) => k.word.toLowerCase().includes(filter.toLowerCase()))
      : list

  const tabs = isJdMissing 
    ? [
        { id: 'industry', label: 'Industry Standards', count: industry.length, color: 'text-[#F97316]' },
        { id: 'detected', label: 'In Resume', count: detected.length, color: 'text-[#22C55E]' },
      ]
    : [
        { id: 'detected', label: 'Detected', count: detected.length, color: 'text-[#22C55E]' },
        { id: 'missing', label: 'Missing', count: missing.length, color: 'text-[#EF4444]/70' },
      ]

  const currentList = tab === 'industry' ? filtered(industry) : tab === 'detected' ? filtered(detected) : filtered(missing)

  return (
    <div className="card-static p-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center shrink-0">
          <Tag size={15} className="text-[#F97316]" />
        </div>
        <div>
          <h3 className="text-[#FAFAF9] font-semibold text-sm">
            {isJdMissing ? 'Sector Excellence' : 'Keyword Analysis'}
          </h3>
          <p className="text-[#A8A29E] text-xs">
            {isJdMissing 
              ? `${industry.length} standard terms for your field`
              : `${detected.length} found · ${missing.length} missing`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[#0C0A09] border border-white/5 mb-4">
        {tabs.map(({ id, label, count, color }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200
              ${tab === id ? 'bg-[#1C1917] text-[#FAFAF9] shadow-sm border border-white/8' : 'text-[#A8A29E] hover:text-[#FAFAF9]'}`}
          >
            {label}
            <span className={`text-[10px] font-bold ${tab === id ? color : 'opacity-50'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
        <input
          type="text"
          placeholder="Filter keywords..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-base pl-9 py-2 text-xs"
        />
        {filter && (
          <button
            onClick={() => setFilter('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#FAFAF9]"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
        {currentList.length > 0 ? (
          currentList.map((kw, i) => (
            <KeywordChip key={i} word={kw.word} type={kw.type || tab} importance={kw.importance} />
          ))
        ) : (
          <p className="text-[#A8A29E] text-sm w-full text-center py-6">
            {filter ? 'No keywords match your search.' : 'No keywords in this category.'}
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#F97316]" />
          <span className="text-[#A8A29E] text-xs">Detected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#EF4444]/60" />
          <span className="text-[#A8A29E] text-xs">Missing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#A8A29E] text-[10px]">● = High priority</span>
        </div>
      </div>
    </div>
  )
}
