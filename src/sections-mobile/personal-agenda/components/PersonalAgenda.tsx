import { useState } from 'react'
import { CalendarPlus, ChevronRight, Plus } from 'lucide-react'
import type { PersonalAgendaProps, StatusSessao } from '@/../product-mobile/sections/personal-agenda/types'
import { Avatar, Screen } from '../../_personal/components/kit'

const STATUS: Record<Exclude<StatusSessao, 'livre'>, { barra: string; label: string }> = {
  realizada: { barra: 'bg-emerald-500', label: 'Realizada' },
  confirmada: { barra: 'bg-amber-500', label: 'Confirmada' },
  agendada: { barra: 'bg-slate-500', label: 'Agendada' },
  faltou: { barra: 'bg-rose-500', label: 'Faltou' },
}

export function PersonalAgenda({ data, onSlotClick, onNovaSessao, onSolicitacoes }: PersonalAgendaProps) {
  const [dia, setDia] = useState(data.diaSelecionado)

  return (
    <Screen>
      <div className="px-4 pt-1 flex items-center justify-between">
        <span className="text-slate-300 text-[14px] font-medium">{data.mes}</span>
        <button
          onClick={onNovaSessao}
          className="w-9 h-9 rounded-full bg-emerald-500 text-[#0E1A17] flex items-center justify-center"
          aria-label="Nova sessão"
        >
          <Plus size={18} strokeWidth={2.4} />
        </button>
      </div>

      <div className="mx-4 mt-3 grid grid-cols-7 gap-1">
        {data.semana.map((d) => {
          const ativo = d.id === dia
          return (
            <button
              key={d.id}
              onClick={() => setDia(d.id)}
              className={`rounded-2xl py-2 flex flex-col items-center border ${
                ativo ? 'bg-emerald-500 border-emerald-500 text-[#0E1A17]' : 'bg-[#0A0E0D] border-[#2A3130] text-slate-300'
              }`}
            >
              <span className="text-[10.5px] font-medium">{d.sigla}</span>
              <span className={`text-[16px] font-semibold font-mono ${d.hoje && !ativo ? 'text-emerald-400' : ''}`}>{d.numero}</span>
              <span className="flex gap-0.5 h-1.5 mt-0.5">
                {Array.from({ length: Math.min(d.sessoes, 4) }).map((_, i) => (
                  <span key={i} className={`w-1 h-1 rounded-full ${ativo ? 'bg-[#0E1A17]' : 'bg-slate-500'}`} />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      {data.solicitacoesPendentes > 0 && (
        <button
          onClick={onSolicitacoes}
          className="mx-4 mt-3 w-[calc(100%-2rem)] rounded-2xl border border-teal-500/30 bg-teal-500/10 px-3.5 py-2.5 flex items-center gap-2.5 text-left"
        >
          <CalendarPlus size={16} className="text-teal-300" />
          <span className="flex-1 text-teal-50 text-[13px]">
            {data.solicitacoesPendentes} solicitações de agendamento esperando resposta
          </span>
          <ChevronRight size={15} className="text-teal-300/70" />
        </button>
      )}

      <ul className="mx-4 mt-4 space-y-2">
        {data.slots.map((s) => (
          <li key={s.id} className="flex gap-3">
            <div className="w-11 pt-2.5 text-right">
              <div className="text-slate-200 text-[13px] font-mono tabular-nums">{s.hora}</div>
              <div className="text-slate-600 text-[11px] font-mono tabular-nums">{s.fim}</div>
            </div>
            {s.status === 'livre' ? (
              <button
                onClick={() => onSlotClick?.(s)}
                className="flex-1 rounded-2xl border border-dashed border-[#2A3130] px-3 py-3 text-slate-500 text-[13px] text-left inline-flex items-center gap-2"
              >
                <Plus size={14} /> Horário livre · agendar
              </button>
            ) : (
              <button
                onClick={() => onSlotClick?.(s)}
                className={`flex-1 rounded-2xl bg-[#0A0E0D] border border-[#2A3130] overflow-hidden flex text-left ${
                  s.status === 'realizada' || s.status === 'faltou' ? 'opacity-60' : ''
                }`}
              >
                <span className={`w-1 shrink-0 self-stretch ${STATUS[s.status].barra}`} />
                <div className="flex-1 min-w-0 px-3 py-2.5 flex items-center gap-3">
                  <Avatar inicial={s.inicial ?? '?'} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-slate-100 text-[14px] truncate">{s.aluno}</div>
                    <div className="text-slate-400 text-[12px] truncate">
                      {s.tipo} · {s.modalidade === 'online' ? 'online' : s.local}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">{STATUS[s.status].label}</span>
                </div>
              </button>
            )}
          </li>
        ))}
      </ul>
    </Screen>
  )
}
