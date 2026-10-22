import { CalendarPlus, Info, MessageCircle, X } from 'lucide-react'
import type { Consulta } from '@/../product-mobile/sections/consultas/types'
import { dataPorExtenso, horaFim } from './formato'
import { AcaoDoDia, Avatar, Modalidade, SeloStatus, SeloTipo } from './Consultas'

interface Props {
  consulta: Consulta
  ehHoje: boolean
  agora: string
  onFechar: () => void
  onCheckIn: () => void
  onEntrar: () => void
  onAdicionarCalendario: () => void
  onConversar: () => void
}

export function ConsultaDetalhe({
  consulta,
  ehHoje,
  agora,
  onFechar,
  onCheckIn,
  onEntrar,
  onAdicionarCalendario,
  onConversar,
}: Props) {
  const prof = consulta.profissional
  const encerrada = ['completed', 'cancelled', 'no_show'].includes(consulta.status)

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button aria-label="Fechar" onClick={onFechar} className="absolute inset-0 bg-black/60" />

      <div className="relative bg-slate-950 border-t border-slate-800 rounded-t-3xl max-h-[88%] overflow-y-auto no-scrollbar">
        <div className="sticky top-0 bg-slate-950 pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto" />
        </div>

        <div className="px-5 pb-6">
          <div className="flex items-start justify-between gap-3 mt-2">
            <div>
              <div className="text-slate-400 text-[11.5px] first-letter:uppercase">{dataPorExtenso(consulta.data)}</div>
              <div className="text-slate-50 font-mono tabular-nums text-[24px] font-semibold mt-0.5">
                {consulta.hora}
                <span className="text-slate-500 text-[13px] font-normal"> – {horaFim(consulta)}</span>
              </div>
            </div>
            <button
              onClick={onFechar}
              className="w-9 h-9 rounded-full bg-slate-800/70 flex items-center justify-center text-slate-300"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-2">
            <SeloStatus consulta={consulta} />
          </div>

          <div className="mt-5 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
            <Avatar nome={prof.nome} tipo={prof.tipo} />
            <div className="min-w-0 flex-1">
              <div className="text-slate-100 font-semibold text-[13px] truncate">{prof.nome}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <SeloTipo tipo={prof.tipo} />
                <span className="text-slate-500 text-[10.5px] truncate">{prof.especialidade}</span>
              </div>
            </div>
          </div>

          <dl className="mt-3 bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 text-[12px]">
            <Linha rotulo="Serviço">{consulta.servico ?? '—'}</Linha>
            <Linha rotulo="Duração">
              <span className="font-mono tabular-nums">{consulta.duracaoMin} min</span>
            </Linha>
            <Linha rotulo="Onde">
              <Modalidade consulta={consulta} />
            </Linha>
            {consulta.local?.endereco && <Linha rotulo="Endereço">{consulta.local.endereco}</Linha>}
          </dl>

          {consulta.orientacao && !encerrada && (
            <div className="mt-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 p-3.5 flex gap-2.5">
              <Info size={14} className="text-teal-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-teal-200 text-[11px] font-semibold">Orientação do profissional</div>
                <p className="text-slate-200 text-[12px] mt-0.5 leading-relaxed">{consulta.orientacao}</p>
              </div>
            </div>
          )}

          {consulta.status === 'cancelled' && (
            <div className="mt-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5">
              <div className="text-rose-200 text-[11px] font-semibold">
                Cancelada {consulta.canceladaPor === 'professional' ? 'pelo profissional' : consulta.canceladaPor === 'user' ? 'por você' : ''}
              </div>
              {consulta.motivoCancelamento && (
                <p className="text-slate-300 text-[12px] mt-0.5 leading-relaxed">{consulta.motivoCancelamento}</p>
              )}
            </div>
          )}

          {consulta.cancelamentoPedido && consulta.status !== 'cancelled' && (
            <div className="mt-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-[12px] text-amber-100 leading-relaxed">
              Você pediu o cancelamento. A consulta segue marcada até o profissional confirmar.
            </div>
          )}

          <div className="mt-5 space-y-2">
            {ehHoje && !encerrada && (
              <AcaoDoDia consulta={consulta} agora={agora} onCheckIn={onCheckIn} onEntrar={onEntrar} />
            )}
            {!encerrada && (
              <BotaoSecundario icon={CalendarPlus} onClick={onAdicionarCalendario}>
                Adicionar ao calendário
              </BotaoSecundario>
            )}
            <BotaoSecundario icon={MessageCircle} onClick={onConversar}>
              Conversar com o profissional
            </BotaoSecundario>
          </div>
        </div>
      </div>
    </div>
  )
}

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="px-3.5 py-2.5 flex items-center justify-between gap-4">
      <dt className="text-slate-500 shrink-0">{rotulo}</dt>
      <dd className="text-slate-200 text-right min-w-0 truncate">{children}</dd>
    </div>
  )
}

function BotaoSecundario({
  icon: Icon,
  onClick,
  children,
}: {
  icon: typeof X
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="w-full h-11 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 text-[12.5px] font-medium flex items-center justify-center gap-2"
    >
      <Icon size={14} />
      {children}
    </button>
  )
}
