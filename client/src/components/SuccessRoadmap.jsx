import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, GraduationCap, Briefcase, ChevronRight, ExternalLink, Zap } from 'lucide-react'

export default function SuccessRoadmap({ isOpen, onClose, roadmap, industry }) {
  if (!isOpen) return null

  const projects = roadmap?.projects || []
  const certifications = roadmap?.certifications || []

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0C0A09]/80 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#1C1917] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[#F97316]/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F97316] flex items-center justify-center shadow-lg shadow-[#F97316]/20">
                <Trophy size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-[#FAFAF9] font-display font-bold text-xl uppercase tracking-tight">Success Roadmap</h2>
                <p className="text-[#A8A29E] text-xs">AI-Powered Career Optimization for {industry || 'your field'}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-[#A8A29E] transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
            {/* Learning Path */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={18} className="text-[#F97316]" />
                <h3 className="text-[#FAFAF9] font-semibold">Learning Path & Certifications</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.length > 0 ? certifications.map((cert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#F97316]/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider">{cert.provider}</span>
                      <a href={cert.link} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={12} className="text-[#A8A29E] hover:text-[#FAFAF9]" />
                      </a>
                    </div>
                    <h4 className="text-[#FAFAF9] text-sm font-semibold mb-1">{cert.title}</h4>
                    <p className="text-[#A8A29E] text-[10px] leading-relaxed">Recognized by industry leaders for {industry} expertise.</p>
                  </motion.div>
                )) : (
                   <p className="text-[#A8A29E] text-sm col-span-2 italic">Custom roadmap will be available for new analyses. Here are some industry standard paths for {industry}.</p>
                )}
              </div>
            </section>

            {/* Portfolio Builders */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={18} className="text-[#F97316]" />
                <h3 className="text-[#FAFAF9] font-semibold">Portfolio Builders (Projects)</h3>
              </div>
              <div className="space-y-4">
                {projects.length > 0 ? projects.map((project, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex gap-4 items-start"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center shrink-0 text-[#F97316] font-bold text-xs ring-1 ring-[#F97316]/20">
                      {i + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-[#FAFAF9] text-sm font-bold">{project.title}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-[#A8A29E]">{project.difficulty}</span>
                      </div>
                      <p className="text-[#A8A29E] text-xs leading-relaxed">{project.description}</p>
                    </div>
                  </motion.div>
                )) : (
                   <p className="text-[#A8A29E] text-sm italic">Analyze a new resume to get custom project ideas tailored to your skill gaps.</p>
                )}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#A8A29E] text-xs">
              <Zap size={14} className="text-[#F97316]" />
              <span>Complete these to boost your score to **90+**</span>
            </div>
            <button
               onClick={onClose}
               className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#FAFAF9] text-xs font-semibold transition-all border border-white/10"
            >
              Close Roadmap
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
