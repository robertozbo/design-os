import {
  Calendar,
  Check,
  Clock,
  DoorOpen,
  MapPin,
  Pencil,
  RefreshCw,
  Stethoscope,
  User,
  Video,
  X,
} from 'lucide-react'
import type {
  Agendamento,
  MedicoAgenda,
  ModeloCobranca,
  SalaAgenda,
  StatusConsulta,
} from '@/../product-clinic/sections/agenda/types'
import { AVATAR_COR, BADGE_COR, STATUS_META, dataCurta } from './helpers'

const MODELO_LABEL: Record<ModeloCobranca, string> = {
  sessao: 'Por sessão',
  mensal: 'Mensal',
  pacote: 'Pacote total',
}

const brl = (n: number) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

interface Props {
  agendamento: Agendamento | null
  medicos: MedicoAgenda[]
  salas: SalaAgenda[]
  onClose: () => void
  onStatus: (id: string, status: StatusConsulta) => void
  onEntrarVideo: () => void
  onEditar: (a: Agendamento) => void
}

export function AgendamentoDrawer({
  agendamento,
  medicos,
  salas,
  onClose,
  onStatus,
  onEntrarVideo,
  onEditar,
}: Props) {
  if (!agendamento) return null
  const a = agendamento
  const medico = medicos.find((m) => m.id === a.medicoId)
  const sala = salas.find((s) => s.id === a.salaId)
  const st = STATUS_META[a.status]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Detalhe da consulta
          </h2>
          <div className="flex items-center gap-1">
            {a.status !== 'realizado' && a.status !== 'cancelado' && (
              <button
                onClick={() => onEditar(a)}
                title="Editar agendamento"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-slate-800"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              aria-label="Fechar"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {/* Paciente */}
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white ${AVATAR_COR[a.cor]}`}>
              {a.pacienteIniciais}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {a.pacienteNome}
              </div>
              <span className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${BADGE_COR[a.cor]}`}>
                {a.especialidade}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${st.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
              {st.label}
            </span>
          </div>

          {/* Infos */}
          <div className="space-y-2.5 rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800">
            <Info icon={Calendar} texto={`${a.inicio} – ${a.fim}`} />
            <Info icon={Stethoscope} texto={medico?.nome ?? a.medicoId} />
            <Info
              icon={a.modalidade === 'tele' ? Video : DoorOpen}
              texto={a.modalidade === 'tele' ? 'Teleconsulta' : sala?.nome ?? a.salaId}
            />
            {sala && <Info icon={MapPin} texto={sala.local} />}
            {a.observacao && <Info icon={User} texto={a.observacao} />}
            {a.retornoDe && <Info icon={Clock} texto="Retorno de cortesia · sem cobrança" />}
            {a.serieId && (
              <Info
                icon={RefreshCw}
                texto={a.serieId === a.id ? 'Série recorrente · 1ª consulta' : 'Série recorrente'}
              />
            )}
          </div>

          {/* Cobrança combinada no agendamento — o que vira Contas a Receber. */}
          {a.financeiro && (
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Cobrança
                </span>
                <span className="text-sm font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                  R$ {brl(a.financeiro.valor)}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {MODELO_LABEL[a.financeiro.modeloCobranca]} · {a.financeiro.parcelas}x ·{' '}
                {a.financeiro.formaPagamento}
              </p>
              <ul className="mt-2 space-y-1">
                {a.financeiro.contas.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-baseline justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300"
                  >
                    <span className="shrink-0 font-mono tabular-nums text-slate-400">
                      {dataCurta(c.vencimento)}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{c.descricao}</span>
                    <span className="shrink-0 tabular-nums">R$ {brl(c.valor)}</span>
                    {c.pago && (
                      <span className="shrink-0 rounded bg-emerald-100 px-1 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        pago
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {a.modalidade === 'tele' && a.status !== 'realizado' && a.status !== 'cancelado' && (
            <button
              onClick={onEntrarVideo}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
            >
              <Video className="h-4 w-4" /> Entrar na sala de vídeo
            </button>
          )}
        </div>

        {/* Ações de status */}
        <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-2">
            <AcaoBtn
              onClick={() => onStatus(a.id, 'confirmado')}
              cls="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Check className="h-3.5 w-3.5" /> Confirmar
            </AcaoBtn>
            <AcaoBtn
              onClick={() => onStatus(a.id, 'realizado')}
              cls="border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Realizado
            </AcaoBtn>
            <AcaoBtn
              onClick={() => onStatus(a.id, 'faltou')}
              cls="border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Faltou
            </AcaoBtn>
            <AcaoBtn
              onClick={() => onStatus(a.id, 'cancelado')}
              cls="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Cancelar
            </AcaoBtn>
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({ icon: Icon, texto }: { icon: typeof Calendar; texto: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="text-sm">{texto}</span>
    </div>
  )
}

function AcaoBtn({
  onClick,
  cls,
  children,
}: {
  onClick: () => void
  cls: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${cls}`}
    >
      {children}
    </button>
  )
}
