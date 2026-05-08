import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  History,
  Upload,
  Zap,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Settings,
  Star,
  LogOut,
  User as UserIcon,
  LogIn,
} from 'lucide-react'
import { getMe, logout } from '../utils/api'
import axios from 'axios'
import { useEffect, useState } from 'react'
import ProfileSettingsModal from './ProfileSettingsModal'

const nav = [
  { label: 'Analyzer', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'History', icon: History, path: '/history' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [user, setUser] = useState(null)
  const [loadingPro, setLoadingPro] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe()
        setUser(data)
      } catch (err) {
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    setIsSettingsOpen(false)
    navigate('/')
  }

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setLoadingPro(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/payment/create-checkout-session', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.url) {
        window.location.href = response.data.url
      }
    } catch (err) {
      console.error('Upgrade failed', err)
      alert('Failed to initiate upgrade. Please try again.')
    } finally {
      setLoadingPro(false)
    }
  }


  return (
    <aside className="fixed inset-y-0 left-0 w-64 flex flex-col bg-[#120F0E] border-r border-white/[0.06] z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-orange-sm">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[#FAFAF9] font-display font-bold text-sm leading-tight">ResuMatch</p>
            <p className="text-[#A8A29E] text-[10px]">AI-Powered</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="section-label px-3 mb-3">Navigation</p>

        {nav.map(({ label, icon: Icon, path }) => {
          const active = pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-95 group
                ${active
                  ? 'text-[#F97316]'
                  : 'text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-white/5'
                }`}
            >
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-6 bg-[#F97316] rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}

              <Icon size={16} className={`relative z-10 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10 flex-1 text-left">{label}</span>
              {active && <ChevronRight size={14} className="opacity-40" />}
            </button>
          )
        })}

        <div className="my-4 border-t border-white/[0.06]" />

        <p className="section-label px-3 mb-3">Quick Tips</p>

        {[
          { label: 'Tailor for each job', icon: TrendingUp },
          { label: 'Use action verbs', icon: BookOpen },
        ].map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#A8A29E] text-xs cursor-default"
          >
            <Icon size={14} className="text-[#F97316]/60 shrink-0" />
            <span>{label}</span>
          </div>
        ))}
      </nav>

      {/* Pro CTA card */}
      <div className="p-3">
        <div className="rounded-2xl bg-gradient-to-br from-[#F97316]/20 to-[#EA580C]/10 border border-[#F97316]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star size={14} className="text-[#F97316]" />
            <p className="text-[#FAFAF9] text-xs font-semibold">Upgrade to Pro</p>
          </div>
          <p className="text-[#A8A29E] text-[11px] leading-relaxed mb-3">
            {user?.isPro ? 'You have access to all premium features!' : 'Unlock unlimited analyses, bulk comparison, and priority AI.'}
          </p>
          {!user?.isPro && (
            <button 
              onClick={handleUpgrade}
              disabled={loadingPro}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white text-xs font-semibold hover:from-[#FB923C] hover:to-[#F97316] transition-all disabled:opacity-50"
            >
              {loadingPro ? 'Redirecting...' : 'Get Pro — Free Trial'}
            </button>
          )}
        </div>

        {user ? (
          <>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-full mt-2 p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 hover:bg-white/10 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#F97316]/20 flex items-center justify-center text-[#F97316] shrink-0">
                <UserIcon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#FAFAF9] text-[10px] font-bold truncate">{user.email}</p>
                <p className="text-[#F97316] text-[8px] uppercase tracking-wider font-bold">
                  {user.isPro ? 'Pro Member' : 'Free Member'}
                </p>
              </div>
              <Settings size={14} className="text-[#A8A29E]" />
            </button>
            <ProfileSettingsModal 
              isOpen={isSettingsOpen} 
              onClose={() => setIsSettingsOpen(false)} 
              user={user} 
              onLogout={handleLogout} 
            />
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 mt-2 rounded-xl bg-white/5 border border-white/5 text-[#FAFAF9] hover:bg-white/10 transition-all text-xs font-semibold"
          >
            <LogIn size={14} />
            Sign In to save progress
          </button>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-[#A8A29E] hover:text-[#FAFAF9] hover:bg-white/5 transition-all text-xs"
        >
          <TrendingUp size={14} className="rotate-90 opacity-40" />
          Back to Home
        </button>
      </div>

    </aside>
  )
}
