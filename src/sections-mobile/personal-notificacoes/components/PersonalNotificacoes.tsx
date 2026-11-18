import { AlertTriangle, CalendarClock, CalendarPlus, CheckCircle2, MessageSquare, UserPlus, type LucideIcon } from 'lucide-react'
import type { Notificacao, PersonalNotificacoesProps, TipoNotificacao } from '@/../product-mobile/sections/personal-notificacoes/types'
import { IconTile, ListGroup, Screen, SectionLabel, type ChipTone } from '../../_personal/components/kit'

const TIPO: Record<TipoNotificacao, { Icon: LucideIcon; tone: ChipTone }> = {
  dor: { Icon: AlertTriangle, tone: 'danger' },
  treino: { Icon: CheckCircle2, tone: 'primary' },
  mensagem: { Icon: MessageSquare, tone: 'primary' },
  agendamento: { Icon: CalendarPlus, tone: 'info' },
  avaliacao: { Icon: CalendarClock, tone: 'warning' },
  convite: { Icon: UserPlus, tone: 'info' },
}

function Lista({ itens, onAbrir }: { itens: Notificacao[]; onAbrir?: (n: Notificacao) => void }) {
  return (
    <ListGroup>
      {itens.map((n) => (
        <li key={n.id}>
          <button onClick={() => onAbrir?.(n)} className="w-full flex items-start gap-3 px-4 py-3 text-left active:bg-[#111615]">
            <IconTile Icon={TIPO[n.tipo].Icon} tone={TIPO[n.tipo].tone} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[14px] truncate ${n.lida ? 'text-slate-300' : 'text-white font-medium'}`}>{n.titulo}</span>
                <span className="text-slate-500 text-[11px] font-mono shrink-0">{n.quando}</span>
              </div>
              <div className={`text-[12.5px] ${n.lida ? 'text-slate-500' : 'text-slate-300'}`}>{n.texto}</div>
            </div>
            {!n.lida && <span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}
          </button>
        </li>
      ))}
    </ListGroup>
  )
}

export function PersonalNotificacoes({ data, onAbrir, onMarcarTodas }: PersonalNotificacoesProps) {
  return (
    <Screen>
      <div className="px-5 pt-1 flex justify-end">
        <button onClick={onMarcarTodas} className="text-emerald-300 text-[12.5px] font-medium">
          Marcar todas como lidas
        </button>
      </div>
      <SectionLabel>Hoje</SectionLabel>
      <Lista itens={data.hoje} onAbrir={onAbrir} />
      <SectionLabel>Anteriores</SectionLabel>
      <Lista itens={data.anteriores} onAbrir={onAbrir} />
    </Screen>
  )
}
