import { useEffect, useState } from 'react'
import {
  User,
  Activity,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  Check,
  Loader2,
  type LucideIcon,
} from 'lucide-react'

const STEPS: { label: string; icon: LucideIcon }[] = [
  { label: 'Salvando seu perfil', icon: User },
  { label: 'Configurando métricas', icon: Activity },
  { label: 'Criando linha de base de saúde', icon: HeartPulse },
  { label: 'Preparando recomendações IA', icon: Sparkles },
  { label: 'Finalizando', icon: CheckCircle2 },
]

type Fase = 'migrando' | 'celebrando'

export default function OnboardingCompletoPreview() {
  const [fase, setFase] = useState<Fase>('migrando')
  const [step, setStep] = useState(0)
  const [primeiroNome, setPrimeiroNome] = useState('Roberto')

  // Pega o nome do sessionStorage se vier do chat
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('nymos:onboarding-respostas')
      if (stored) {
        const r = JSON.parse(stored)
        if (r.nome?.display) setPrimeiroNome(r.nome.display.split(' ')[0])
      }
    } catch {
      /* ignore */
    }
  }, [])

  // Animação dos steps
  useEffect(() => {
    if (fase !== 'migrando') return
    if (step >= STEPS.length) {
      const t = setTimeout(() => setFase('celebrando'), 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStep((s) => s + 1), 900)
    return () => clearTimeout(t)
  }, [fase, step])

  // Auto-redirect ao concluir celebração
  useEffect(() => {
    if (fase !== 'celebrando') return
    const t = setTimeout(() => {
      window.location.href = '/mobile/sections/inicio'
    }, 2200)
    return () => clearTimeout(t)
  }, [fase])

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
        className="min-h-full bg-gradient-to-b from-slate-950 via-teal-500/5 to-slate-950 flex flex-col items-center justify-center px-6 text-center"
      >
        {fase === 'migrando' && <MigrationView step={step} />}
        {fase === 'celebrando' && <CelebracaoView primeiroNome={primeiroNome} />}
      </div>
    </>
  )
}

function MigrationView({ step }: { step: number }) {
  return (
    <>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center mb-5">
        <Sparkles size={28} className="text-white animate-pulse" strokeWidth={2.4} />
      </div>
      <div className="text-slate-100 font-bold text-[16px]">Organizando seu perfil</div>
      <div className="text-slate-500 text-[11.5px] mt-1">Vai levar uns segundos...</div>

      <div className="mt-8 w-full max-w-[280px] space-y-2">
        {STEPS.map((s, i) => {
          const isDone = i < step
          const isLoading = i === step
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
                isDone || isLoading ? 'bg-slate-900 border border-slate-800' : 'opacity-30'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isDone
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : isLoading
                      ? 'bg-teal-500/15 text-teal-300'
                      : 'bg-slate-800 text-slate-600'
                }`}
              >
                {isDone ? (
                  <Check size={13} strokeWidth={3} />
                ) : isLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Icon size={13} strokeWidth={2.2} />
                )}
              </div>
              <span
                className={`text-[12px] flex-1 text-left ${
                  isDone ? 'text-slate-300' : isLoading ? 'text-slate-100 font-semibold' : 'text-slate-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}

function CelebracaoView({ primeiroNome }: { primeiroNome: string }) {
  return (
    <>
      <div className="text-[72px] mb-2 animate-in zoom-in duration-500">🎉</div>
      <div className="text-slate-50 font-bold text-[22px]">Tudo pronto, {primeiroNome}!</div>
      <p className="text-slate-400 text-[12.5px] mt-2 leading-snug max-w-[280px]">
        Seu perfil tá montado. Levando você pra dashboard...
      </p>
      <div className="mt-6 flex items-center gap-2 text-slate-500 text-[11px]">
        <Loader2 size={12} className="animate-spin text-teal-400" />
        Abrindo
      </div>
    </>
  )
}
