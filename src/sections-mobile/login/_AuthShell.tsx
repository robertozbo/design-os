import { type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { NymosMark } from '@/sections-mobile/_brand/NymosMark'

interface AuthShellProps {
  titulo: string
  subtitulo: string
  children: ReactNode
}

export function AuthShell({ titulo, subtitulo, children }: AuthShellProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div
        data-nymos-mobile="true"
        className="min-h-full bg-gradient-to-b from-slate-950 via-teal-500/5 to-slate-950 flex flex-col px-5 pt-10 pb-6"
      >
        <div className="flex flex-col items-center text-center mb-7">
          <div className="mb-4">
            <NymosMark size={56} variant="lockup" />
          </div>
          <h1 className="text-slate-50 font-bold text-[22px] tracking-tight">{titulo}</h1>
          <p className="text-slate-400 text-[12.5px] mt-1.5 max-w-[280px] leading-snug">{subtitulo}</p>
        </div>
        {children}
      </div>
    </>
  )
}

export interface FieldProps {
  icon: LucideIcon
  type?: 'text' | 'email' | 'password' | 'tel'
  placeholder: string
  value: string
  onChange: (v: string) => void
  error?: string
  rightSlot?: ReactNode
}

export function AuthField({ icon: Icon, type = 'text', placeholder, value, onChange, error, rightSlot }: FieldProps) {
  return (
    <div>
      <div
        className={`relative flex items-center h-12 px-3.5 rounded-2xl bg-slate-900 border ${
          error ? 'border-rose-500/50' : 'border-slate-800'
        } focus-within:border-slate-600 transition-colors`}
      >
        <Icon size={15} className="text-slate-500 shrink-0" strokeWidth={2.2} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 ml-2 bg-transparent text-slate-100 text-[13px] outline-none placeholder:text-slate-700"
        />
        {rightSlot}
      </div>
      {error && <div className="mt-1 text-rose-300 text-[10.5px] px-1">{error}</div>}
    </div>
  )
}

interface GoogleButtonProps {
  label?: string
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function GoogleButton({ label = 'Continuar com Google', loading, disabled, onClick }: GoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full h-12 rounded-2xl bg-white text-slate-900 font-semibold text-[13px] flex items-center justify-center gap-2.5 disabled:bg-slate-800 disabled:text-slate-600 active:scale-[0.99] transition-all"
    >
      {loading ? (
        <span className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      {loading ? 'Conectando...' : label}
    </button>
  )
}
