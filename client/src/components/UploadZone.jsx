import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react'

const MAX_SIZE_MB = 10
const ACCEPTED = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
}

export default function UploadZone({ file, onFileChange }) {
  const [error, setError] = useState(null)

  const onDrop = useCallback(
    (accepted, rejected) => {
      setError(null)
      if (rejected.length > 0) {
        const err = rejected[0].errors[0]
        if (err.code === 'file-too-large') {
          setError(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`)
        } else if (err.code === 'file-invalid-type') {
          setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.')
        } else {
          setError(err.message)
        }
        return
      }
      if (accepted[0]) {
        onFileChange(accepted[0])
      }
    },
    [onFileChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    maxFiles: 1,
    multiple: false,
  })

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (file) {
    return (
      <div className="relative flex items-center gap-4 p-4 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/30 transition-all">
        <div className="w-10 h-10 rounded-xl bg-[#F97316]/20 flex items-center justify-center shrink-0">
          <FileText size={20} className="text-[#F97316]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#FAFAF9] text-sm font-medium truncate">{file.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <CheckCircle2 size={12} className="text-[#22C55E]" />
            <p className="text-[#A8A29E] text-xs">{formatSize(file.size)} · Ready to analyze</p>
          </div>
        </div>
        <button
          onClick={() => { onFileChange(null); setError(null) }}
          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-[#EF4444] transition-all text-[#A8A29E]"
          aria-label="Remove file"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-300 group
          ${isDragActive
            ? 'border-[#F97316] bg-[#F97316]/10 scale-[1.01]'
            : 'border-white/10 bg-[#0C0A09]/50 hover:border-[#F97316]/50 hover:bg-[#F97316]/5'
          }`}
      >
        <input {...getInputProps()} />

        {/* Upload icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
          ${isDragActive ? 'bg-[#F97316]/20 scale-110' : 'bg-white/5 group-hover:bg-[#F97316]/10'}`}
        >
          <Upload
            size={24}
            className={`transition-all duration-300 ${isDragActive ? 'text-[#F97316]' : 'text-[#A8A29E] group-hover:text-[#F97316]'}`}
          />
        </div>

        <div className="text-center">
          <p className={`font-semibold text-sm transition-colors ${isDragActive ? 'text-[#F97316]' : 'text-[#FAFAF9]'}`}>
            {isDragActive ? 'Drop your resume here' : 'Drop your resume here'}
          </p>
          <p className="text-[#A8A29E] text-xs mt-1">
            or{' '}
            <span className="text-[#F97316] underline underline-offset-2">browse files</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['PDF', 'DOCX', 'TXT'].map((type) => (
            <span key={type} className="chip-muted">
              {type}
            </span>
          ))}
          <span className="text-[#A8A29E] text-xs">· Max {MAX_SIZE_MB}MB</span>
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-[#EF4444]">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
