import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, ChevronDown, Check } from 'lucide-react'
import { INDUSTRIES } from '../utils/industryBenchmarks'

export default function IndustrySelector({ selectedId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedIndustry = INDUSTRIES.find(i => i.id === selectedId) || INDUSTRIES[0]

  return (
    <div className="relative z-20">
      <div className="flex items-center gap-2 mb-2">
        <Briefcase size={13} className="text-[#F97316]" />
        <span className="text-[#A8A29E] text-xs font-semibold uppercase tracking-wider">Target Field</span>
      </div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#1C1917] border transition-all duration-300
          ${isOpen ? 'border-[#F97316] ring-4 ring-[#F97316]/10 shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]' : 'border-white/5 hover:border-white/10 hover:bg-[#292524]'}`}
      >
        <span className="text-[#FAFAF9] text-sm font-medium">{selectedIndustry.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-[#A8A29E]"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 right-0 z-20 mt-1 p-1 rounded-xl bg-[#1C1917] border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto">
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry.id}
                    onClick={() => {
                      onSelect(industry.id)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors group
                      ${selectedId === industry.id ? 'bg-[#F97316]/10 text-[#F97316]' : 'text-[#A8A29E] hover:bg-white/5 hover:text-[#FAFAF9]'}`}
                  >
                    {industry.label}
                    {selectedId === industry.id && (
                      <Check size={14} className="text-[#F97316]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
