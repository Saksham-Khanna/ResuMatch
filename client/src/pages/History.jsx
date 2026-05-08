import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import { getHistory, deleteAnalysis } from '../utils/api'
import { History as HistoryIcon, Trash2, ExternalLink, Clock, FileText, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'

function ScoreBadge({ score }) {
  const color =
    score >= 85 ? '#22C55E' :
    score >= 70 ? '#F97316' :
    score >= 50 ? '#FB923C' : '#EF4444'
  const label =
    score >= 85 ? 'Excellent' :
    score >= 70 ? 'Good' :
    score >= 50 ? 'Fair' : 'Poor'

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative w-12 h-12">
        <svg viewBox="0 0 48 48" className="w-full h-full rotate-[-90deg]">
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle
            cx="24" cy="24" r="20" fill="none"
            stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 125.6} 125.6`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-[#FAFAF9]">{score}</span>
        </div>
      </div>
      <span className="text-[10px]" style={{ color }}>{label}</span>
    </div>
  )
}

function HistoryRow({ analysis, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!confirm('Delete this analysis?')) return
    setDeleting(true)
    try {
      await deleteAnalysis(analysis._id)
      onDelete(analysis._id)
    } catch (err) {
      console.error(err)
      setDeleting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="flex items-center gap-4 p-4 rounded-2xl bg-[#1C1917] border border-white/8 hover:border-white/15 hover:bg-[#292524] transition-all duration-200 group"
    >
      <ScoreBadge score={analysis.atsScore} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={13} className="text-[#F97316] shrink-0" />
          <p className="text-[#FAFAF9] text-sm font-medium truncate">{analysis.fileName || 'Resume'}</p>
          {analysis.jobTitle && (
            <span className="chip-muted text-[10px] shrink-0 hidden sm:inline-flex">{analysis.jobTitle}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-[#A8A29E]">
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span>{new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <span>·</span>
          <span>{analysis.keywords?.detected?.length || 0} keywords matched</span>
          {analysis.industry && (
            <>
              <span>·</span>
              <span>{analysis.industry}</span>
            </>
          )}
        </div>
      </div>

      {/* Keyword bar preview */}
      <div className="hidden md:block w-24">
        <div className="text-[10px] text-[#A8A29E] mb-1">Keywords</div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C]"
            style={{ width: `${analysis.scoreBreakdown?.keywordScore || 0}%` }}
          />
        </div>
        <div className="text-[10px] text-[#A8A29E] mt-0.5">{analysis.scoreBreakdown?.keywordScore || 0}%</div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-8 h-8 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444]/70 hover:bg-[#EF4444]/20 transition-all disabled:opacity-50"
          aria-label="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  )
}

export default function History() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const navigate = useNavigate()

  const [loadingMore, setLoadingMore] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px" // trigger earlier
  })

  const load = async (p = 1, append = false) => {
    if (append) setLoadingMore(true)
    else setLoading(true)
    
    setError(null)
    try {
      const data = await getHistory(p, 10)
      if (append) {
        setAnalyses(prev => [...prev, ...data.data])
      } else {
        setAnalyses(data.data)
      }
      setPagination(data.pagination)
      setPage(p)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => { load() }, [])

  // Infinite Scroll Trigger
  useEffect(() => {
    if (inView && pagination && page < pagination.pages && !loadingMore) {
      load(page + 1, true)
    }
  }, [inView, pagination, page, loadingMore])

  const handleDelete = (id) => {
    setAnalyses((prev) => prev.filter((a) => a._id !== id))
  }

  return (
    <div className="flex min-h-screen bg-[#0C0A09]">
      <Sidebar />

      <main className="flex-1 ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[#FAFAF9] font-display font-bold text-2xl mb-1">Analysis History</h1>
            <p className="text-[#A8A29E] text-sm">
              {pagination ? `${pagination.total} total analyses` : 'Your past resume analyses'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => load(page)} className="btn-ghost">
              <RefreshCw size={14} />
              Refresh
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              New Analysis
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#F97316]/20 border-t-[#F97316] animate-spin" />
            <p className="text-[#A8A29E] text-sm">Loading history...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center">
              <AlertCircle size={20} className="text-[#EF4444]/80" />
            </div>
            <p className="text-[#FAFAF9] font-medium">Failed to load history</p>
            <p className="text-[#A8A29E] text-sm">{error}</p>
            <button onClick={() => load()} className="btn-secondary">Retry</button>
          </div>
        ) : analyses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
              <HistoryIcon size={28} className="text-[#F97316]/60" />
            </div>
            <div className="text-center">
              <p className="text-[#FAFAF9] font-semibold mb-1">No analyses yet</p>
              <p className="text-[#A8A29E] text-sm">Upload your first resume to get started.</p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Analyze My Resume
            </button>
          </div>
        ) : (
          <>
            <motion.div layout className="space-y-3">
              <AnimatePresence>
                {analyses.map((analysis) => (
                  <HistoryRow key={analysis._id} analysis={analysis} onDelete={handleDelete} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Infinite Scroll Loader */}
            {pagination && page < pagination.pages && (
              <div ref={ref} className="flex justify-center py-8">
                {loadingMore ? (
                  <Loader2 size={24} className="text-[#F97316] animate-spin" />
                ) : (
                  <div className="h-6" /> // spacer for observer
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
