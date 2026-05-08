import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Target, Wand2, ChevronRight, CheckCircle2, AlertCircle, TrendingUp, ArrowRight, FileText, Search, LayoutTemplate, LogIn } from 'lucide-react'
import Magnetic from '../components/Magnetic'

export default function Landing() {
  const navigate = useNavigate()
  const [hoveredBtn, setHoveredBtn] = useState(null)

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0C0A09] font-sans selection:bg-[#F97316]/30"
    >
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto border-b border-white/[0.04]">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-[#FAFAF9] font-medium text-lg tracking-tight">ResuMatch</span>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm font-medium text-[#FAFAF9] bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-5 py-2.5 rounded-full transition-colors hidden sm:block"
        >
          Check my score
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-full text-[#A8A29E] text-xs font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]"></span>
              </span>
              Analyze against any job description
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-display font-medium text-[#FAFAF9] leading-[1.15] mb-6 tracking-tight">
              See exactly why your resume gets <span className="text-[#F97316] italic pr-2">rejected.</span>
            </h1>
            
            <p className="text-[#A8A29E] text-lg mb-10 leading-relaxed">
              Stop guessing what hiring managers want. We compare your resume line-by-line against the job description to find the exact missing skills, formatting errors, and keyword gaps blocking your interviews.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {['find', 'login'].map((id) => {
                const isFind = id === 'find';
                const label = isFind ? "Find what's missing" : "Login to save history";
                const Icon = isFind ? ArrowRight : LogIn;
                const path = isFind ? '/dashboard' : '/login';
                
                return (
                  <Magnetic strength={0.3} key={id}>
                    <button
                      onMouseEnter={() => setHoveredBtn(id)}
                      onMouseLeave={() => setHoveredBtn(null)}
                      onClick={() => navigate(path)}
                      className={`relative px-8 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 z-10 w-full sm:w-auto active:scale-95 group
                        ${(hoveredBtn === id || (hoveredBtn === null && isFind)) ? 'text-white' : 'text-[#A8A29E] hover:text-[#FAFAF9]'}`}
                    >
                      <Magnetic strength={0.15}>
                        <span className="flex items-center gap-2">
                          {label}
                          <Icon size={18} className={isFind ? "group-hover:translate-x-1 transition-transform" : "opacity-60 group-hover:opacity-100 transition-opacity"} />
                        </span>
                      </Magnetic>
                      
                      {(hoveredBtn === id || (hoveredBtn === null && isFind)) && (
                        <motion.div
                          layoutId="primaryPill"
                          className="absolute inset-0 bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-xl -z-10 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                          transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                    </button>
                  </Magnetic>
                )
              })}
            </div>
          </div>

          {/* Right: Product UI Preview */}
          <div className="relative lg:ml-8 mt-10 lg:mt-0">
            {/* Subtle backlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#F97316]/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative rounded-2xl bg-[#1C1917]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl p-6 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Window Controls */}
              <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/[0.06]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                <span className="ml-3 text-xs font-medium text-[#A8A29E]">Analysis Results · Senior Frontend Engineer</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start gap-8 mb-8">
                {/* Score Circle */}
                <div className="w-24 h-24 rounded-full border-[3px] border-[#EF4444]/20 flex items-center justify-center relative shrink-0">
                  <div className="absolute inset-0 border-[3px] border-[#F97316] rounded-full border-t-transparent border-r-transparent -rotate-12"></div>
                  <div className="text-center">
                    <span className="text-3xl font-display font-bold text-white tracking-tighter">42</span>
                    <span className="text-[10px] text-[#A8A29E] block uppercase tracking-wide mt-0.5">Score</span>
                  </div>
                </div>
                 
                <div className="flex-1 w-full">
                  <h3 className="text-sm font-medium text-white mb-3">Critical Issues Found</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5 text-sm text-[#A8A29E]">
                      <AlertCircle size={16} className="text-[#EF4444] shrink-0 mt-0.5" />
                      <span>Missing required skill: <span className="text-[#EAB308] border border-[#EAB308]/30 bg-[#EAB308]/10 px-1.5 py-0.5 rounded text-xs ml-1 font-mono">React.js</span></span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-[#A8A29E]">
                      <AlertCircle size={16} className="text-[#EF4444] shrink-0 mt-0.5" />
                      <span>Action verbs missing in 3 experience bullets</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-[#A8A29E]">
                       <Target size={16} className="text-[#F97316] shrink-0 mt-0.5" />
                       <span>Formatting may break Workday ATS parser</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Fix Suggestion Box */}
              <div className="bg-[#0C0A09]/60 rounded-xl p-4 border border-white/[0.04]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-[#FAFAF9]">Recommended Fix</span>
                  <span className="text-[10px] font-medium text-[#F97316] uppercase tracking-wider bg-[#F97316]/10 px-2 py-1 rounded">High Impact</span>
                </div>
                <div className="space-y-2.5 font-mono text-[11px] leading-relaxed">
                  <p className="text-[#EF4444]/80 line-through opacity-80 decoration-[#EF4444]/50">
                    - Worked on optimizing frontend performance and load times
                  </p>
                  <p className="text-[#22C55E]">
                    + Improved React load times by 40% via code splitting, lazy loading, and memoization
                  </p>
                </div>
              </div>
            </div>
            
            {/* Pop-out element */}
            <div className="absolute -bottom-6 -left-4 lg:-bottom-8 lg:-left-10 rounded-xl bg-[#292524] border border-white/[0.08] shadow-2xl p-4 transform lg:-rotate-3 translate-y-2 animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center shrink-0">
                  <TrendingUp size={18} className="text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Score Increased</p>
                  <p className="text-xs text-[#A8A29E]">After applying 1 fix</p>
                </div>
                <p className="text-xl font-bold text-[#22C55E] ml-2">+12</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Section - Skill Gap Visualization */}
      <section className="relative z-10 py-24 bg-[#141210] border-y border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-display font-medium text-[#FAFAF9] mb-4 tracking-tight">
              Stop guessing what they're looking for.
            </h2>
            <p className="text-[#A8A29E] text-lg leading-relaxed">
              We extract the exact requirements from the job description and map them against your resume, giving you a clear roadmap of what to fix before you apply.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left: Visualization */}
            <div className="lg:col-span-2 rounded-2xl bg-[#0C0A09] border border-white/[0.04] p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316]/5 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-medium text-white uppercase tracking-wider">Skill Gap Match Rate</h3>
                <span className="text-xs font-mono text-[#A8A29E]">4 Requirements Found</span>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-28 text-sm text-[#FAFAF9] font-medium">TypeScript</div>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                    <div className="h-full w-full bg-[#22C55E] rounded-full"></div>
                  </div>
                  <div className="w-16 text-right text-xs font-medium text-[#22C55E]">Found</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-28 text-sm text-[#FAFAF9] font-medium">System Design</div>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                     <div className="h-full w-[40%] bg-[#EAB308] rounded-full"></div>
                  </div>
                  <div className="w-16 text-right text-xs font-medium text-[#EAB308]">Partial</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-28 text-sm text-[#FAFAF9] font-medium">GraphQL</div>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                    <div className="h-full w-0 bg-[#EF4444] rounded-full"></div>
                  </div>
                  <div className="w-16 text-right text-xs font-medium text-[#EF4444]">Missing</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-28 text-sm text-[#FAFAF9] font-medium">CI/CD</div>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                    <div className="h-full w-0 bg-[#EF4444] rounded-full"></div>
                  </div>
                  <div className="w-16 text-right text-xs font-medium text-[#EF4444]">Missing</div>
                </div>
              </div>
            </div>
            
            {/* Right: Context */}
            <div className="flex flex-col justify-center space-y-10">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                  <Search size={18} className="text-[#F97316]" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-[#FAFAF9] mb-2">Requirement Extraction</h4>
                  <p className="text-[#A8A29E] text-sm leading-relaxed">We break down the job posting to find the exact hard skills, soft skills, and experiences the hiring manager cares about.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                  <FileText size={18} className="text-[#F97316]" />
                </div>
                <div>
                  <h4 className="text-base font-medium text-[#FAFAF9] mb-2">Contextual Matching</h4>
                  <p className="text-[#A8A29E] text-sm leading-relaxed">Simply repeating words isn't enough. We check if your bullet points actually demonstrate the required skills effectively.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetrical Features */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            
            {/* Large Feature */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="lg:col-span-2 rounded-2xl bg-[#1C1917]/40 border border-white/[0.04] p-8 lg:p-10 flex flex-col justify-between hover:bg-[#1C1917]/60 transition-colors group"
            >
              <div className="mb-10 lg:pr-12">
                 <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:bg-[#F97316]/10 group-hover:border-[#F97316]/20 transition-colors">
                   <Wand2 size={24} className="text-[#F97316]" />
                 </div>
                 <h3 className="text-2xl font-medium text-[#FAFAF9] mb-3">Actionable Rewrites</h3>
                 <p className="text-[#A8A29E] text-base leading-relaxed">Your experience is great, but how you write it matters. We suggest impactful verbs, metric structures, and clearer phrasing to make your achievements stand out to recruiters.</p>
              </div>
              <div className="bg-[#0C0A09] rounded-xl p-5 border border-white/[0.03]">
                <div className="flex items-start gap-3 mb-4 opacity-50">
                   <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0"></div>
                   <p className="text-sm font-mono text-white/70">Managed a team of developers to build features.</p>
                </div>
                <div className="flex items-start gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-2 shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                   <p className="text-sm font-mono text-[#22C55E]">Led a 5-person engineering team to deliver 3 core product features, increasing user retention by 20%.</p>
                </div>
              </div>
            </motion.div>
            
            {/* Small Feature */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="rounded-2xl bg-[#1C1917]/40 border border-white/[0.04] p-8 lg:p-10 hover:bg-[#1C1917]/60 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:bg-[#F97316]/10 group-hover:border-[#F97316]/20 transition-colors">
                <LayoutTemplate size={24} className="text-[#F97316]" />
              </div>
              <h3 className="text-xl font-medium text-[#FAFAF9] mb-3">Format Checker</h3>
              <p className="text-[#A8A29E] text-sm leading-relaxed mb-8">Invisible tables, multiple columns, and complex headers break ATS parsers. We identify layout issues before you click submit.</p>
              
              <div className="space-y-3 mt-auto">
                 <div className="flex items-center gap-3 text-sm text-[#A8A29E] bg-[#0C0A09]/50 rounded-lg px-4 py-3 border border-white/[0.02]">
                   <CheckCircle2 size={16} className="text-[#22C55E]" /> Clean Text Extraction
                 </div>
                 <div className="flex items-center gap-3 text-sm text-[#A8A29E] bg-[#0C0A09]/50 rounded-lg px-4 py-3 border border-white/[0.02] border-l-2 border-l-[#EAB308]">
                   <AlertCircle size={16} className="text-[#EAB308]" /> 2-Column Layout Detected
                 </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 border-t border-white/[0.03] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#F97316]/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-display font-medium text-[#FAFAF9] mb-6 tracking-tight">
            Stop guessing. Start optimizing.
          </h2>
          <p className="text-[#A8A29E] text-lg mb-10 max-w-xl mx-auto">
            Find out exactly what your resume is missing in seconds. Free to start, no credit card required.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 rounded-xl font-medium text-white
              bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#FB923C] hover:to-[#F97316] 
              transition-all inline-flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(249,115,22,0.25)]"
          >
            Check my resume score
            <Zap size={18} className="ml-1" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/[0.03] text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded overflow-hidden bg-[#F97316] flex items-center justify-center">
              <Zap size={10} className="text-white" />
            </div>
            <span className="text-[#FAFAF9] font-medium text-sm">ResuMatch</span>
          </div>
          <p className="text-[#A8A29E] text-sm">
            © {new Date().getFullYear()} · Built for modern professionals
          </p>
        </div>
      </footer>
    </motion.div>
  )
}
