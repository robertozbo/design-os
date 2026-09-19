import { Check, Dumbbell, Flame, Timer } from 'lucide-react'
import type { TreinoPreview } from '@/../product-mobile/sections/inicio/types'

interface Props {
  treino: TreinoPreview
  onClick?: () => void
  /** Botão do rodapé — abre a sessão de hoje pronta pra executar. */
  onIniciar?: () => void
}

export function TreinosCard({ treino, onClick, onIniciar }: Props) {
  // Sem plano: convite pro diretório, no mesmo formato do card de GLP-1.
  if (!treino.temPlano) {
    return (
      <button
        onClick={onClick}
        className="mx-4 mb-4 w-[calc(100%-2rem)] flex items-center gap-3 rounded-2xl bg-slate-900 border border-dashed border-slate-700 px-4 py-3.5 text-left active:scale-[0.99] transition-transform"
      >
        <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
          <Dumbbell size={16} strokeWidth={2.2} className="text-teal-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-slate-100 text-[13.5px] font-semibold">
            Monte seu plano de treino
          </div>
          <div className="text-slate-400 text-[11.5px] mt-0.5">
            Com um personal ou por conta própria
          </div>
        </div>
        <span className="shrink-0 rounded-lg bg-teal-500 px-3 py-1.5 text-[12px] font-semibold text-slate-950">
          Começar
        </span>
      </button>
    )
  }

  const descanso = treino.letra === null

  return (
    <div className="mx-4 mb-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 pt-4 pb-3 text-left active:bg-slate-800/40"
      >
        <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
          <Dumbbell size={16} strokeWidth={2.2} className="text-teal-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-100 font-semibold text-[14px]">Treinos</span>
            <span className="text-slate-500 text-[10.5px] font-mono uppercase tracking-wider">
              {treino.diaLabel}
            </span>
          </div>
          <div className="text-slate-400 text-[12px] truncate mt-0.5">
            {descanso ? (
              'Dia de descanso'
            ) : (
              <>
                <span className="font-mono text-teal-300">{treino.letra}</span>
                <span className="text-slate-100 font-medium"> · {treino.nome}</span>
              </>
            )}
          </div>
        </div>
        {!descanso && (
          <div className="shrink-0 flex items-center gap-2.5 text-[11px] text-slate-400">
            <span className="flex items-center gap-0.5">
              <Timer size={11} strokeWidth={2.2} className="text-slate-500" />
              <span className="font-mono tabular-nums">{treino.duracaoMin}</span>min
            </span>
            <span className="flex items-center gap-0.5">
              <Flame size={11} strokeWidth={2.2} className="text-slate-500" />
              <span className="font-mono tabular-nums">{treino.caloriasKcal}</span>
            </span>
          </div>
        )}
      </button>

      {/* Agenda da semana */}
      <div className="px-4 pb-3 flex items-center justify-between gap-1">
        {treino.semana.map((d) => {
          const vazio = d.letra === null
          return (
            <div key={d.diaCurto} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[11px] font-semibold border ${
                  d.concluido
                    ? 'bg-teal-500 border-teal-500 text-slate-950'
                    : d.hoje
                      ? 'border-teal-400 text-teal-300'
                      : vazio
                        ? 'border-slate-800 text-slate-700'
                        : 'border-slate-700 text-slate-400'
                }`}
              >
                {d.concluido ? <Check size={12} strokeWidth={3} /> : vazio ? '–' : d.letra}
              </div>
              <span
                className={`text-[9.5px] ${d.hoje ? 'text-teal-300 font-medium' : 'text-slate-500'}`}
              >
                {d.diaCurto}
              </span>
            </div>
          )
        })}
      </div>

      {/* Rodapé: volume do mês + CTA */}
      <div className="border-t border-slate-800 px-3 py-2.5 flex items-center gap-2">
        <div className="flex-1 min-w-0 pl-1">
          <div className="text-[9.5px] uppercase tracking-wider font-semibold text-slate-500">
            Este mês
          </div>
          <div className="mt-0.5 text-slate-300 text-[12px]">
            <span className="font-mono tabular-nums">{treino.totalMes}</span> treinos
            {treino.personalNome && (
              <span className="text-slate-500"> · {treino.personalNome}</span>
            )}
          </div>
        </div>
        {!descanso && (
          <button
            onClick={onIniciar ?? onClick}
            disabled={treino.concluido}
            className={`shrink-0 flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-transform ${
              treino.concluido
                ? 'bg-slate-800 text-slate-500'
                : 'bg-teal-500 text-slate-950 active:scale-[0.97]'
            }`}
          >
            {treino.concluido ? (
              <>
                <Check size={12} strokeWidth={2.6} />
                Feito hoje
              </>
            ) : (
              <>
                <Dumbbell size={12} strokeWidth={2.4} />
                Iniciar treino
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
