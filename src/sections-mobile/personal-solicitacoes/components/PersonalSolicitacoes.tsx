import { CalendarClock, Check, X } from 'lucide-react'
import type { PersonalSolicitacoesProps } from '@/../product-mobile/sections/personal-solicitacoes/types'
import { Avatar, Card, Chip, ListGroup, Row, Screen, SectionLabel } from '../../_personal/components/kit'

export function PersonalSolicitacoes({ data, onAceitar, onSugerir, onRecusar }: PersonalSolicitacoesProps) {
  return (
    <Screen>
      <SectionLabel>Pendentes · {data.pendentes.length}</SectionLabel>
      {data.pendentes.map((r) => (
        <Card key={r.id} className="!mt-2">
          <div className="flex items-center gap-3">
            <Avatar inicial={r.inicial} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-100 text-[14.5px] font-medium truncate">{r.aluno}</span>
                {r.novo && <Chip tone="info">Novo aluno</Chip>}
              </div>
              <div className="text-slate-400 text-[12px]">
                {r.pedido} · {r.recebida}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-slate-100 text-[13.5px]">
            <CalendarClock size={15} className="text-emerald-400" />
            <span className="font-mono tabular-nums">{r.horario}</span>
          </div>
          {r.mensagem && (
            <p className="mt-2 rounded-xl bg-[#111615] px-3 py-2 text-slate-300 text-[13px] leading-snug">"{r.mensagem}"</p>
          )}
          <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
            <button onClick={() => onAceitar?.(r.id)} className="rounded-xl bg-emerald-500 text-[#0E1A17] font-semibold text-[13.5px] py-2 inline-flex items-center justify-center gap-1.5">
              <Check size={15} /> Aceitar
            </button>
            <button onClick={() => onSugerir?.(r.id)} className="rounded-xl border border-[#2A3130] bg-[#1B2120] text-slate-100 text-[13px] px-3">
              Sugerir horário
            </button>
            <button onClick={() => onRecusar?.(r.id)} aria-label="Recusar" className="rounded-xl border border-rose-500/30 text-rose-400 px-3">
              <X size={15} />
            </button>
          </div>
        </Card>
      ))}

      <SectionLabel>Respondidas</SectionLabel>
      <ListGroup>
        {data.respondidas.map((r) => (
          <Row
            key={r.id}
            chevron={false}
            leading={<Avatar inicial={r.inicial} size="sm" />}
            titulo={r.aluno}
            subtitulo={`${r.pedido} · ${r.horario}`}
            trailing={<Chip tone={r.resposta === 'aceita' ? 'primary' : 'danger'}>{r.resposta === 'aceita' ? 'Aceita' : 'Recusada'}</Chip>}
          />
        ))}
      </ListGroup>
    </Screen>
  )
}
