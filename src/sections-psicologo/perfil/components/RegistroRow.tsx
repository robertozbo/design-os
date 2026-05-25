import type { RegistroProfissional } from '@/../product-psicologo/sections/perfil/types'
import { ShieldCheck, AlertTriangle, Clock, Star } from 'lucide-react'

interface RegistroRowProps {
  registro: RegistroProfissional
}

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const HOJE = new Date('2026-05-24T12:00:00')

function diasAteValidade(dataValidade: string): number {
  const validade = new Date(dataValidade + 'T12:00:00')
  return Math.ceil((validade.getTime() - HOJE.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso + 'T12:00:00'))
}

export function RegistroRow({ registro }: RegistroRowProps) {
  const dias = diasAteValidade(registro.dataValidade)
  const isVencido = dias < 0
  const isProximo = dias >= 0 && dias <= 90

  const validadeTone = isVencido
    ? 'text-rose-700 dark:text-rose-300'
    : isProximo
      ? 'text-amber-700 dark:text-amber-300'
      : 'text-emerald-700 dark:text-emerald-300'

  const validadeIcon = isVencido ? (
    <AlertTriangle className="w-3 h-3" strokeWidth={2} />
  ) : isProximo ? (
    <Clock className="w-3 h-3" strokeWidth={2} />
  ) : (
    <ShieldCheck className="w-3 h-3" strokeWidth={2} />
  )

  return (
    <div
      className={`
        rounded-xl ring-1 px-3 py-2.5
        ${
          registro.primario
            ? 'bg-violet-50/70 dark:bg-violet-950/30 ring-violet-200/60 dark:ring-violet-900/50'
            : 'bg-slate-50/70 dark:bg-slate-800/40 ring-slate-200/60 dark:ring-slate-800'
        }
      `}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`
              inline-flex items-center px-1.5 py-px rounded-md text-[10px] font-mono font-semibold tracking-wider
              ${
                registro.primario
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }
            `}
          >
            {registro.tipo}
          </span>
          <span className="text-[13px] font-mono font-semibold text-slate-900 dark:text-slate-50 truncate">
            {registro.numero}
          </span>
          {registro.primario && (
            <span
              title="Registro primário usado por padrão em prescrições e laudos"
              className="inline-flex items-center gap-0.5 px-1 py-px rounded-md bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[9px] font-medium uppercase tracking-wider"
            >
              <Star className="w-2.5 h-2.5 fill-current" strokeWidth={2} />
              Primário
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
          {registro.conselho}/{registro.uf}
        </span>
      </div>
      <div className={`inline-flex items-center gap-1 text-[11px] font-medium ${validadeTone}`}>
        {validadeIcon}
        <span>
          {isVencido
            ? `Vencido há ${Math.abs(dias)} dias`
            : isProximo
              ? `Vence em ${dias} dias`
              : `Válido até ${formatDate(registro.dataValidade)}`}
        </span>
      </div>
    </div>
  )
}
