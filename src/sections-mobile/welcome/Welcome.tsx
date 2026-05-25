import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { NymosMark } from '@/sections-mobile/_brand/NymosMark'

export default function WelcomePreview() {
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.href = '/mobile/sections/onboarding'
    }, 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
      <div
        data-nymos-mobile="true"
        className="min-h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-teal-500/10 to-slate-950 px-8 text-center"
      >
        <div className="mb-5 animate-in fade-in zoom-in duration-500">
          <NymosMark size={80} />
        </div>
        <div className="text-slate-50 font-bold text-[28px] tracking-tight lowercase">nymos</div>
        <div className="text-slate-300 text-[13px] mt-2 max-w-[280px] leading-snug">
          Plataforma de saúde integrada
        </div>

        <div className="mt-12 flex items-center gap-2 text-slate-500 text-[11.5px]">
          <Loader2 size={13} className="animate-spin text-teal-400" />
          Preparando sua experiência...
        </div>
      </div>
    </>
  )
}
