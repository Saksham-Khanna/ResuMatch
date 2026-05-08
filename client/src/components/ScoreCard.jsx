import { useEffect, useRef } from 'react'
import { TrendingUp, Award } from 'lucide-react'

function getScoreLabel(score) {
  if (score >= 85) return { label: 'Excellent', color: '#22C55E' }
  if (score >= 70) return { label: 'Good', color: '#F97316' }
  if (score >= 50) return { label: 'Fair', color: '#FB923C' }
  return { label: 'Needs Work', color: '#EF4444' }
}

function AnimatedCircle({ score }) {
  const circleRef = useRef(null)
  const radius = 54
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    if (!circleRef.current) return
    const offset = circumference - (score / 100) * circumference
    circleRef.current.style.strokeDashoffset = circumference
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (circleRef.current) {
          circleRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
          circleRef.current.style.strokeDashoffset = offset
        }
      }, 100)
    })
  }, [score, circumference])

  const { color } = getScoreLabel(score)

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="rotate-[-90deg]">
      {/* Background track */}
      <circle
        cx="70" cy="70" r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Glow filter */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Progress arc */}
      <circle
        ref={circleRef}
        cx="70" cy="70" r={radius}
        fill="none"
        stroke="url(#scoreGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        filter="url(#glow)"
      />
      <defs>
        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function ScoreCard({ data, isJdMissing, selectedIndustryLabel, onOpenRoadmap }) {
  const { atsScore, scoreBreakdown, jobTitle, industry } = data
  const { label, color } = getScoreLabel(atsScore)

  const breakdown = [
    { 
      name: isJdMissing ? 'Industry Gap' : 'Keywords', 
      score: scoreBreakdown?.keywordScore ?? 0,
      hide: isJdMissing && scoreBreakdown?.keywordScore === 0
    },
    { name: 'Sections', score: scoreBreakdown?.sectionScore ?? 0 },
    { name: isJdMissing ? 'Clarity' : 'AI Fit', score: scoreBreakdown?.aiScore ?? 0 },
  ].filter(b => !b.hide)

  return (
    <div className="card-static p-6 flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#FAFAF9] font-display font-bold text-lg">
            {isJdMissing ? 'General Health' : 'ATS Score'}
          </h2>
          <p className="text-[#A8A29E] text-xs mt-0.5">
            {isJdMissing ? `Sector: ${selectedIndustryLabel}` : (jobTitle || 'Resume Analysis')}
          </p>
        </div>
        <div className="flex items-center gap-1.5 chip"
          style={{ background: `${color}15`, color, borderColor: `${color}30`, border: '1px solid' }}
        >
          <Award size={12} />
          <span className="text-xs font-semibold">{label}</span>
        </div>
      </div>

      {/* Circular Score */}
      <div className="flex flex-col items-center py-2">
        <div className="relative">
          <AnimatedCircle score={atsScore} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[#FAFAF9] font-display font-bold text-4xl leading-none">{atsScore}</p>
            <p className="text-[#A8A29E] text-xs font-medium mt-1">/ 100</p>
          </div>
          {/* Orange glow behind circle */}
          <div className="absolute inset-0 -z-10 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)' }}
          />
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-3">
        <p className="section-label">Score Breakdown</p>
        {breakdown.map(({ name, score }) => (
          <div key={name} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[#A8A29E] text-xs">{name}</span>
              <span className="text-[#FAFAF9] text-xs font-semibold">{score}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] transition-all duration-1000 ease-out"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Improve CTA */}
      <button 
        onClick={onOpenRoadmap}
        className="btn-primary w-full justify-center mt-1"
      >
        <TrendingUp size={15} />
        Improve My Resume
      </button>
    </div>
  )
}
