import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { ResultsDashboard } from './Dashboard'
import { SAMPLE_DATA } from '../utils/sampleData'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export default function Sample() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-[#0C0A09]">
      <Sidebar />

      <main className="flex-1 ml-64 p-6 lg:p-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F97316]/20 flex items-center justify-center text-[#F97316]">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[#FAFAF9] font-semibold text-sm">Demo Mode</p>
              <p className="text-[#A8A29E] text-xs">This is a sample report. Upload your own resume to see personalized results.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2 rounded-xl bg-[#F97316] text-white text-xs font-bold hover:bg-[#EA580C] transition-all"
          >
            Analyze My Resume
          </button>
        </motion.div>

        <ResultsDashboard 
          data={SAMPLE_DATA} 
          onReset={() => navigate('/dashboard')} 
        />
      </main>
    </div>
  )
}
