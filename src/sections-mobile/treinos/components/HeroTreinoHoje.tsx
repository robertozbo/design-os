import { Play, Clock, Dumbbell, User } from 'lucide-react'
import type { SessaoUI } from '@/../product-mobile/sections/treinos/types'
import { COR_BG, COR_TEXT, COR_GRADIENT } from './_shared'

interface HeroTreinoHojeProps {
  sessao: SessaoUI | null
  personalName: string | null
  personalId: string | null
  onIniciarClick?: (sessaoId: string) => void
  onDetalheClick?: (sessaoId: string) => void
  onOpenPersonalDetail?: (personalId: string) => void
}

export function HeroTreinoHoje({
  sessao,
  personalName,
  personalId,
  onIniciarClick,
  onDetalheClick,
  onOpenPersonalDetail,
}: HeroTreinoHojeProps) {
  if (!sessao) {
    return (
      <div className="mx-4 mt-3 mb-4 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-5 text-center">
        <div className="text-slate-300 text-[14px] font-semibold">Dia de descanso</div>
        <div className="text-slate-500 text-[11.5px] mt-1 leading-snug">
          Sem treino prescrito hoje. Aproveita pra recuperação ativa, alongamento ou caminhada
          leve.
        </div>
      </div>
    )
  }

  const bg = COR_BG[sessao.cor]
  const text = COR_TEXT[sessao.cor]
  const gradient = COR_GRADIENT[sessao.cor]
  const totalEx = sessao.session.exercises.length

  return (
    <div
      className={`mx-4 mt-3 mb-4 rounded-2xl bg-gradient-to-br ${gradient} border border-slate-800 overflow-hidden`}
    >
      {personalName && (
        <button
          onClick={() => personalId && onOpenPersonalDetail?.(personalId)}
          className="w-full px-4 pt-3 flex items-center gap-2 text-left"
        >
          <div className="w-5 h-5 rounded-full bg-slate-800/80 flex items-center justify-center shrink-0">
            <User size={10} className="text-slate-300" strokeWidth={2.4} />
          </div>
          <span className="text-slate-300 text-[10.5px]">
            por <span className="font-semibold text-slate-100">{personalName}</span>
            <span className="text-slate-500"> · seu Personal</span>
          </span>
        </button>
      )}

      <button
        onClick={() => onDetalheClick?.(sessao.session.id)}
        className="w-full px-4 pt-3 pb-3 flex items-start gap-3 text-left"
      >
        <div
          className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center ${text} font-bold text-[28px] font-mono tabular-nums shrink-0`}
        >
          {sessao.letra}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
              Treino de hoje
            </span>
            {sessao.diaSemanaLabel && (
              <span className="text-slate-600 text-[10px]">· {sessao.diaSemanaLabel}</span>
            )}
          </div>
          <div className="text-slate-100 font-semibold text-[18px] mt-0.5 truncate">
            {sessao.session.name}
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {sessao.gruposPrincipais.map((g) => (
              <span
                key={g}
                className={`px-2 py-0.5 rounded-full ${bg} ${text} text-[10.5px] font-medium`}
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </button>

      <div className="px-4 pb-3 grid grid-cols-2 gap-2 text-center">
        <Stat icon="exercicios" valor={`${totalEx}`} label={totalEx === 1 ? 'exercício' : 'exercícios'} />
        <Stat icon="duracao" valor={`${sessao.duracaoEstimadaMin}min`} label="duração" />
      </div>

      <div className="px-3 pb-3">
        <button
          onClick={() => onIniciarClick?.(sessao.session.id)}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold text-[14px] flex items-center justify-center gap-2 active:scale-[0.99] transition-transform shadow-lg shadow-teal-500/20"
        >
          <Play size={15} strokeWidth={2.6} fill="currentColor" />
          Iniciar treino
        </button>
      </div>
    </div>
  )
}

interface StatProps {
  icon: 'exercicios' | 'duracao'
  valor: string
  label: string
}

function Stat({ icon, valor, label }: StatProps) {
  const Icon = icon === 'duracao' ? Clock : Dumbbell
  return (
    <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 px-2 py-2">
      <div className="flex items-center justify-center gap-1 text-slate-100 font-semibold text-[13px] font-mono tabular-nums">
        <Icon size={11} className="text-slate-500" strokeWidth={2.2} />
        {valor}
      </div>
      <div className="text-slate-500 text-[9.5px] uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  )
}
