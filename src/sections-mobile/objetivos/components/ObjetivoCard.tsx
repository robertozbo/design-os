import type { ObjetivoViewModel } from '@/../product-mobile/sections/objetivos/types'
import { MoreVertical, Sparkles, CheckCircle2, Clock } from 'lucide-react'
import { getIcon, hexFromCor, gradientFromTone, textFromTone } from './_shared'
import { ProgressRing } from './ProgressRing'
import { ProgressBar } from './ProgressBar'

interface ObjetivoCardProps {
  objetivo: ObjetivoViewModel
  onClick?: (o: ObjetivoViewModel) => void
}

export function ObjetivoCard({ objetivo, onClick }: ObjetivoCardProps) {
  const Icon = getIcon(objetivo.iconeNome)
  const iconColor = hexFromCor(objetivo.iconeCor)
  const gradient = gradientFromTone(objetivo.tone)
  const toneText = textFromTone(objetivo.tone)
  const { goal, tipo } = objetivo
  const unit = tipo.unit ?? ''
  const isDone = objetivo.tone === 'done'
  const isLate = objetivo.tone === 'late'

  const initialFmt = goal.initialValue?.toLocaleString('pt-BR') ?? '—'
  const currentFmt = goal.currentValue?.toLocaleString('pt-BR') ?? '—'
  const targetFmt = goal.targetValue.toLocaleString('pt-BR')

  return (
    <button
      onClick={() => onClick?.(objetivo)}
      className="w-[calc(100%-32px)] mx-4 mb-3 rounded-2xl bg-slate-900 border border-slate-800 p-4 active:scale-[0.99] transition-transform text-left block hover:bg-slate-800/40"
    >
      {/* Top row: ícone + nome + status + menu */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${objetivo.iconeBg} flex items-center justify-center shrink-0`}>
          <Icon size={18} strokeWidth={2.2} style={{ color: iconColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-slate-100 font-semibold text-[14.5px] truncate flex-1">
              {tipo.label}
            </h3>
            {isDone && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[9.5px] font-semibold uppercase tracking-wide">
                <CheckCircle2 size={9} strokeWidth={2.4} />
                Feito
              </span>
            )}
            {isLate && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 text-[9.5px] font-semibold uppercase tracking-wide">
                <Clock size={9} strokeWidth={2.4} />
                Atrasado
              </span>
            )}
          </div>
          <p className="text-slate-400 text-[12px] mt-0.5 line-clamp-2">{goal.description}</p>
        </div>
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800/70 shrink-0"
          aria-label="Mais ações"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={15} />
        </button>
      </div>

      {/* Progress visual */}
      <div className="flex items-center gap-4 my-3">
        {objetivo.visual === 'ring' ? (
          <>
            <ProgressRing
              pct={objetivo.progressPct}
              gradient={gradient}
              centerLabel={`${Math.round(objetivo.progressPct)}%`}
              centerSubLabel={isDone ? 'feito' : 'atual'}
            />
            <div className="flex-1 min-w-0">
              <div className="text-slate-400 text-[10.5px] uppercase tracking-wide font-semibold">
                Faixa
              </div>
              <div className="font-mono text-[15px] text-slate-50 tabular-nums mt-1">
                {initialFmt}
                <span className="text-slate-500 mx-1">→</span>
                <span className={toneText}>{currentFmt}</span>
                <span className="text-slate-500 mx-1">→</span>
                {targetFmt}
                <span className="text-slate-400 text-[10.5px] ml-1">{unit}</span>
              </div>
              <div className={`text-[11px] mt-1.5 ${toneText} font-mono tabular-nums`}>
                {objetivo.tempoLabel}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1">
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="font-mono text-[15px] text-slate-50 tabular-nums">
                <span className={toneText}>{currentFmt}</span>
                <span className="text-slate-500 text-[10.5px] mx-1">/</span>
                <span className="text-slate-300">{targetFmt}</span>
                <span className="text-slate-400 text-[10.5px] ml-1">{unit}</span>
              </div>
              <span className={`font-mono text-[11px] tabular-nums ${toneText}`}>
                {Math.round(objetivo.progressPct)}%
              </span>
            </div>
            <ProgressBar pct={objetivo.progressPct} gradient={gradient} />
            <div className="flex items-center justify-between mt-2">
              <span className="text-slate-500 text-[10.5px] font-mono tabular-nums">
                Início: {initialFmt} {unit}
              </span>
              <span className={`text-[11px] ${toneText} font-mono tabular-nums`}>
                {objetivo.tempoLabel}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sugestão IA */}
      {objetivo.sugestaoIA && !isDone && (
        <div className="pt-2.5 border-t border-slate-800 flex items-start gap-1.5">
          <Sparkles size={11} className="text-sky-400 shrink-0 mt-0.5" strokeWidth={2.4} />
          <span className="text-slate-300 text-[11.5px] leading-snug">
            <span className="text-sky-300 font-semibold">IA · </span>
            {objetivo.sugestaoIA}
          </span>
        </div>
      )}
    </button>
  )
}
