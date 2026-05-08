import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Mail, Lock, Loader2, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { login, register } from '../utils/api'
import ProgressButton from '../components/ProgressButton'

export default function Auth({ mode = 'login' }) {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const simulateProgress = (target, duration, onComplete) => {
    let current = 0
    const interval = 50 // ms
    const step = (target / (duration / interval))
    
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setProgress(target)
        clearInterval(timer)
        onComplete?.()
      } else {
        setProgress(current)
      }
    }, interval)
    return timer
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setProgress(0)

    const runAuth = async () => {
      try {
        if (isLogin) {
          await login(email, password)
          setProgress(100)
          setTimeout(() => navigate('/dashboard'), 500)
        } else {
          await register(email, password)
          setProgress(100)
          setTimeout(() => {
            setSuccess(true)
            setTimeout(() => {
              setIsLogin(true)
              setSuccess(false)
              setLoading(false)
              setProgress(0)
            }, 2000)
          }, 500)
        }
      } catch (err) {
        setError(err.message)
        setLoading(false)
        setProgress(0)
      }
    }

    simulateProgress(90, 1500, runAuth)
  }

  return (
    <div className="min-h-screen bg-[#0C0A09] flex flex-col justify-center items-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F97316]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F97316]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-[#FAFAF9] font-bold text-xl tracking-tight">ResuMatch</span>
          </Link>
          <h2 className="text-[#FAFAF9] text-3xl font-display font-bold">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-[#A8A29E] mt-2">
            {isLogin ? 'Sign in to access your analyses' : 'Start optimizing your resume for free'}
          </p>
        </div>

        <div className="card-static p-8">
          {success ? (
            <div className="text-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-[#22C55E]" />
              </div>
              <h3 className="text-[#FAFAF9] font-bold text-xl mb-1">Registration Successful!</h3>
              <p className="text-[#A8A29E] text-sm">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[#E7E5E4] text-xs font-semibold uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E] group-focus-within:text-[#F97316] transition-colors" />
                    <input
                      type="email"
                      required
                      className="input-base pl-11"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[#E7E5E4] text-xs font-semibold uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E] group-focus-within:text-[#F97316] transition-colors" />
                    <input
                      type="password"
                      required
                      className="input-base pl-11"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]/90 text-sm animate-shake">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <ProgressButton
                isLoading={loading}
                progress={progress}
                icon={<ArrowRight size={18} />}
                className="w-full"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </ProgressButton>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-[#A8A29E] text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#F97316] font-bold ml-2 hover:underline transition-all"
              >
                {isLogin ? 'Create one now' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-[#57534E] text-[10px] text-center mt-8 uppercase tracking-[0.2em]">
          Securely encrypted · Private AI analysis
        </p>
      </div>
    </div>
  )
}
