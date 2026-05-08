import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReactToPrint } from 'react-to-print'
import Sidebar from '../components/Sidebar'
import UploadZone from '../components/UploadZone'
import ScoreCard from '../components/ScoreCard'
import StrengthsWeaknesses from '../components/StrengthsWeaknesses'
import Recommendations from '../components/Recommendations'
import KeywordAnalysis from '../components/KeywordAnalysis'
import SkillGap from '../components/SkillGap'
import SectionAnalysis from '../components/SectionAnalysis'
import ResumeOptimizer from '../components/ResumeOptimizer'
import IndustrySelector from '../components/IndustrySelector'
import SuccessRoadmap from '../components/SuccessRoadmap'
import { INDUSTRIES, BENCHMARKS } from '../utils/industryBenchmarks'
import { analyzeResume } from '../utils/api'
import { Loader2, Zap, FileText, AlignLeft, X, AlertCircle, TrendingUp, Download } from 'lucide-react'

function LoadingOverlay({ progress }) {
  const steps = [
    { label: 'Uploading resume...', done: progress > 30 },
    { label: 'Extracting text...', done: progress > 50 },
    { label: 'Running ATS scoring...', done: progress > 70 },
    { label: 'AI analysis...', done: progress > 90 },
  ]

  return (
    <div className="fixed inset-0 bg-[#0C0A09]/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-sm w-full mx-4 text-center">
        {/* Spinning icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-[#F97316]/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-[#F97316] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap size={24} className="text-[#F97316] animate-pulse" />
          </div>
        </div>

        <h3 className="text-[#FAFAF9] font-display font-bold text-xl mb-2">Analyzing Resume</h3>
        <p className="text-[#A8A29E] text-sm mb-6">Our AI is reviewing your resume against the job description...</p>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-6">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2 text-left">
          {steps.map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border shrink-0 transition-all ${done ? 'bg-[#22C55E]/20 border-[#22C55E]/50' : 'border-white/10'}`}>
                {done && <div className="w-full h-full rounded-full bg-[#22C55E]/40 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                </div>}
              </div>
              <span className={`text-xs transition-colors ${done ? 'text-[#22C55E]/80' : 'text-[#A8A29E]'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AnalyzeForm({ onResult }) {
  const [file, setFile] = useState(null)
  const [jobDesc, setJobDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const simulate = (target, speed = 300) => {
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(current + Math.random() * 15, target)
      setProgress(Math.round(current))
      if (current >= target) clearInterval(interval)
    }, speed)
    return interval
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!file) { setError('Please upload a resume file.'); return }
    // if (jobDesc.trim().length < 50) { setError('Job description must be at least 50 characters.'); return }


    setLoading(true)
    setProgress(0)

    // simulate progress
    const step1 = simulate(30, 200)

    try {
      clearInterval(step1)
      const uploadInt = simulate(50, 100)

      const result = await analyzeResume(file, jobDesc, (pct) => {
        setProgress(Math.max(30, Math.min(55, pct)))
      })

      clearInterval(uploadInt)
      const finalInt = simulate(95, 80)

      setTimeout(() => {
        clearInterval(finalInt)
        setProgress(100)
        setTimeout(() => {
          setLoading(false)
          onResult(result)
        }, 400)
      }, 1500)

    } catch (err) {
      setLoading(false)
      setProgress(0)
      setError(err.message)
    }
  }

  return (
    <>
      {loading && <LoadingOverlay progress={progress} />}

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-[#FAFAF9] font-display font-bold text-2xl mb-1">ResuMatch Dashboard</h1>
          <p className="text-[#A8A29E] text-sm">Upload your resume and paste a job description to get your ATS score.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Upload */}
          <div className="card-static p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={15} className="text-[#F97316]" />
              <p className="text-[#FAFAF9] text-sm font-semibold">Resume</p>
            </div>
            <UploadZone file={file} onFileChange={setFile} />
          </div>

          {/* Job Description */}
          <div className="card-static p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlignLeft size={15} className="text-[#F97316]" />
                <p className="text-[#FAFAF9] text-sm font-semibold">Job Description (Optional)</p>
              </div>
              <span className={`text-xs ${jobDesc.length === 0 ? 'text-[#A8A29E]' : jobDesc.length < 50 ? 'text-[#F97316]/70' : 'text-[#22C55E]/70'}`}>
                {jobDesc.length} chars
              </span>
            </div>
            <textarea
              className="input-base resize-none"
              rows={8}
              placeholder="Paste the full job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]/90 text-sm animate-fade-in">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
            ) : (
              <><Zap size={18} /> Analyze Resume</>
            )}
          </button>
        </form>
      </div>
    </>
  )
}

export function ResultsDashboard({ data, onReset }) {
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0].id)
  const [roadmapOpen, setRoadmapOpen] = useState(false)
  const componentRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `ResuMatch_Report_${data.fileName?.split('.')[0] || 'Result'}`,
    onAfterPrint: () => console.log('Print success'),
  })
  
  const isJdMissing = !data.jobDescription || data.jobDescription.trim().length === 0
  const industryInfo = BENCHMARKS[selectedIndustry]
  const industryLabel = INDUSTRIES.find(i => i.id === selectedIndustry)?.label

  // Calculate a mock score increase based on industry keyword detection
  // This makes the "interactive" part feel real
  const industryMatchCount = industryInfo.keywords.filter(k => 
    data.resumeText?.toLowerCase().includes(k.toLowerCase())
  ).length
  
  const industryKeywordScore = Math.round((industryMatchCount / industryInfo.keywords.length) * 100)
  
  const displayData = {
    ...data,
    atsScore: isJdMissing 
      ? Math.round(data.scoreBreakdown.sectionScore * 0.7 + industryKeywordScore * 0.3)
      : data.atsScore,
    scoreBreakdown: {
      ...data.scoreBreakdown,
      keywordScore: isJdMissing ? industryKeywordScore : data.scoreBreakdown.keywordScore
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } }
  }
  
  const item = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Results header */}
      <motion.div variants={item} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#FAFAF9] font-display font-bold text-2xl mb-1">Analysis Results</h1>
          <p className="text-[#A8A29E] text-sm">{data.fileName} · {new Date(data.createdAt).toLocaleString()}</p>
        </div>
          <div className="flex items-center gap-3 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#FAFAF9] text-xs font-semibold flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95 shadow-lg"
            >
              <Download size={14} className="text-[#F97316]" />
              Download Report
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl bg-[#F97316] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#EA580C] transition-all active:scale-95 shadow-lg shadow-[#F97316]/20"
            >
              <Zap size={14} fill="currentColor" />
              New Analysis
            </button>
          </div>
      </motion.div>

      <div ref={componentRef} className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4 print:p-8 print:bg-[#0C0A09]">
        {/* Left col: Score + Sections + Industry Selector */}
        <div className="space-y-4">
          <motion.div variants={item}>
            <ScoreCard 
              data={displayData} 
              isJdMissing={isJdMissing} 
              selectedIndustryLabel={industryLabel} 
              onOpenRoadmap={() => setRoadmapOpen(true)}
            />
          </motion.div>
          
          {isJdMissing && (
            <motion.div variants={item} className="card-static p-5 bg-[#F97316]/5 border-[#F97316]/20">
              <IndustrySelector selectedId={selectedIndustry} onSelect={setSelectedIndustry} />
              <p className="text-[10px] text-[#A8A29E] mt-3">
                💡 Benchmarking your resume against standard **{industryLabel}** requirements.
              </p>
            </motion.div>
          )}

          <motion.div variants={item}><SectionAnalysis sections={data.sections} /></motion.div>
        </div>

        {/* Right col: everything else */}
        <div className="space-y-4">
          <motion.div variants={item}><StrengthsWeaknesses strengths={data.strengths} weaknesses={data.weaknesses} /></motion.div>
          
          <motion.div variants={item}>
            <KeywordAnalysis 
              keywords={data.keywords} 
              isJdMissing={isJdMissing}
              benchmarkKeywords={industryInfo.keywords}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div variants={item} className="h-full">
              <SkillGap 
                skillGaps={data.skillGaps} 
                isJdMissing={isJdMissing}
                benchmarkGaps={industryInfo.skillGaps}
              />
            </motion.div>
            <motion.div variants={item} className="h-full"><ResumeOptimizer optimizedBullets={data.optimizedBullets} /></motion.div>
          </div>
          <motion.div variants={item}><Recommendations recommendations={data.recommendations} /></motion.div>
        </div>
      </div>

      <SuccessRoadmap 
        isOpen={roadmapOpen} 
        onClose={() => setRoadmapOpen(false)} 
        roadmap={data.roadmap}
        industry={isJdMissing ? industryLabel : data.jobTitle}
      />
    </motion.div>
  )
}

export default function Dashboard() {
  const [result, setResult] = useState(null)

  return (
    <div className="flex min-h-screen bg-[#0C0A09]">
      <Sidebar />

      <main className="flex-1 ml-64 p-6 lg:p-8 min-h-screen">
        {result ? (
          <ResultsDashboard data={result} onReset={() => setResult(null)} />
        ) : (
          <AnalyzeForm onResult={setResult} />
        )}
      </main>
    </div>
  )
}
