import { useState } from 'react'
import { Check, Clock, Inbox, UserPlus, X } from 'lucide-react'
import type { Lead, PreAgendamento } from '@/../product-clinic/sections/agendamento-whatsapp/types'
import { CORES_STATUS, ROTULO_STATUS } from './helpers'

interface Props {
  preAgendamentos: PreAgendamento[]
  leads: Lead[]
  onConfirmar: (id: string) => void
  onRecusar: (id: string, motivo: string) => void
  onCadastrarLead: (id: string) => void
}

export function FilaDoBot({ preAgendamentos, leads, onConfirmar, onRecusar, onCadastrarLead }: Props) {
  const [recusando, setRecusando] = useState<string | null>(null)
  const [motivo, setMotivo] = useState('')

  const pendentes = preAgendamentos.filter((p) => p.status === 'pendente')

  const fecharRecusa = () => {
    setRecusando(null)
    setMotivo('')
  }

  return (
    <div className="space-y-4">
      {/* Pré-agendamentos */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <header className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
          <Inbox className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Pré-agendamentos</h2>
          <Contador n={pendentes.length} />
          <span className="ml-auto text-[11px] text-slate-400">o bot nunca confirma sozinho</span>
        </header>

        {preAgendamentos.length === 0 ? (
          <Vazio texto="Nada na fila. Tudo que o bot criou já foi tratado." />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {preAgendamentos.map((p) => (
              <li key={p.id} className="bg-white px-4 py-3 dark:bg-slate-900">
                <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{p.paciente}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${CORES_STATUS[p.status]}`}
                  >
                    {ROTULO_STATUS[p.status]}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="h-3 w-3" /> {p.criadoEm}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {p.servico} · {p.profissional}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {p.data}, {p.hora}
                  </span>{' '}
                  · {p.telefone}
                </p>

                {p.status === 'pendente' &&
                  (recusando === p.id ? (
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                      <input
                        autoFocus
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Motivo da recusa…"
                        className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            onRecusar(p.id, motivo.trim() || 'Sem motivo informado')
                            fecharRecusa()
                          }}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
                        >
                          Recusar
                        </button>
                        <button
                          onClick={fecharRecusa}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => onConfirmar(p.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
                      >
                        <Check className="h-3.5 w-3.5" /> Confirmar
                      </button>
                      <button
                        onClick={() => setRecusando(p.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-900/60 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                      >
                        <X className="h-3.5 w-3.5" /> Recusar
                      </button>
                    </div>
                  ))}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Leads */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <header className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
          <UserPlus className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Leads</h2>
          <Contador n={leads.length} />
          <span className="ml-auto text-[11px] text-slate-400">não agendaram — o bot parou aqui</span>
        </header>

        {leads.length === 0 ? (
          <Vazio texto="Nenhum contato novo aguardando cadastro." />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {leads.map((l) => (
              <li key={l.id} className="flex flex-wrap items-start gap-3 bg-white px-4 py-3 dark:bg-slate-900">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{l.nome}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {l.telefone} · nasc. {l.nascimento} · {l.recebidoEm}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{l.pedido}</p>
                </div>
                <button
                  onClick={() => onCadastrarLead(l.id)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-950/70"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Cadastrar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Contador({ n }: { n: number }) {
  return (
    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
      {n}
    </span>
  )
}

function Vazio({ texto }: { texto: string }) {
  return (
    <div className="bg-white px-4 py-8 text-center text-xs text-slate-400 dark:bg-slate-900 dark:text-slate-500">
      {texto}
    </div>
  )
}
