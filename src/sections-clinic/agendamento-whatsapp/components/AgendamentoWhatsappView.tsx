import { MessageCircle, ShieldAlert, Sparkles } from 'lucide-react'
import type {
  AgendamentoWhatsappData,
  ConfigBot,
  Lead,
  OpcaoPasso,
  Passo,
  PreAgendamento,
  ServicoExposto,
} from '@/../product-clinic/sections/agendamento-whatsapp/types'
import { ChatSimulador } from './ChatSimulador'
import { ConfigBloco } from './ConfigBloco'
import { FilaDoBot } from './FilaDoBot'
import { type Bolha, CORES_SEVERIDADE, ROTULO_SEVERIDADE } from './helpers'

interface Props {
  dados: AgendamentoWhatsappData
  config: ConfigBot
  servicos: ServicoExposto[]
  preAgendamentos: PreAgendamento[]
  leads: Lead[]
  bolhas: Bolha[]
  /** Passo corrente do simulador. */
  passo?: Passo
  onEscolherOpcao: (opcao: OpcaoPasso) => void
  onEnviarTexto: (texto: string) => void
  onReiniciarSimulacao: () => void
  onSalvarConfig: (config: ConfigBot) => void
  onAlternarServicoExposto: (servicoId: string) => void
  onConfirmarPreAgendamento: (id: string) => void
  onRecusarPreAgendamento: (id: string, motivo: string) => void
  onCadastrarLead: (id: string) => void
  onIaIndisponivel: () => void
}

const ROTULO_CANAL: Record<AgendamentoWhatsappData['statusCanal'], string> = {
  conectado: 'Canal conectado',
  mock: 'Protótipo · canal simulado',
  desconectado: 'Canal desconectado',
}

const CORES_CANAL: Record<AgendamentoWhatsappData['statusCanal'], string> = {
  conectado:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60',
  mock: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60',
  desconectado:
    'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60',
}

export function AgendamentoWhatsappView({
  dados,
  config,
  servicos,
  preAgendamentos,
  leads,
  bolhas,
  passo,
  onEscolherOpcao,
  onEnviarTexto,
  onReiniciarSimulacao,
  onSalvarConfig,
  onAlternarServicoExposto,
  onConfirmarPreAgendamento,
  onRecusarPreAgendamento,
  onCadastrarLead,
  onIaIndisponivel,
}: Props) {
  const pendentes = preAgendamentos.filter((p) => p.status === 'pendente').length

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
            <MessageCircle className="h-6 w-6 text-teal-600" />
            Agendamento por WhatsApp
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {dados.clinica} · {dados.telefoneClinica} · {pendentes} na fila
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${CORES_CANAL[dados.statusCanal]}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {ROTULO_CANAL[dados.statusCanal]}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        {/* Esquerda — simulador */}
        <ChatSimulador
          clinica={dados.clinica}
          telefone={dados.telefoneClinica}
          bolhas={bolhas}
          passo={passo}
          onEscolher={onEscolherOpcao}
          onEnviarTexto={onEnviarTexto}
          onReiniciar={onReiniciarSimulacao}
        />

        {/* Direita — trabalho da recepção e ajustes do admin */}
        <div className="min-w-0 space-y-4">
          <FilaDoBot
            preAgendamentos={preAgendamentos}
            leads={leads}
            onConfirmar={onConfirmarPreAgendamento}
            onRecusar={onRecusarPreAgendamento}
            onCadastrarLead={onCadastrarLead}
          />

          <ConfigBloco
            config={config}
            servicos={servicos}
            onSalvar={onSalvarConfig}
            onAlternarServico={onAlternarServicoExposto}
          />

          {/* Limites */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <header className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
              <ShieldAlert className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">O que o bot nunca faz</h2>
              <span className="ml-auto text-[11px] text-slate-400">WhatsApp é canal admin</span>
            </header>
            <ul className="space-y-2 bg-white px-4 py-3 dark:bg-slate-900">
              {dados.regras.map((r) => (
                <li key={r.id} className={`rounded-xl border px-3 py-2.5 ${CORES_SEVERIDADE[r.severidade]}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{r.gatilho}</span>
                    <span className="rounded-md bg-white/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-black/30 dark:text-slate-300">
                      {ROTULO_SEVERIDADE[r.severidade]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{r.acao}</p>
                  <p className="mt-1.5 border-l-2 border-slate-300 pl-2 text-xs italic text-slate-500 dark:border-slate-600 dark:text-slate-400">
                    {r.exemplo}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* IA — V2 */}
          <section className="overflow-hidden rounded-2xl border border-dashed border-slate-300 opacity-70 dark:border-slate-700">
            <header className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
              <Sparkles className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300">IA no atendimento</h2>
              <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                V2
              </span>
              <button
                onClick={onIaIndisponivel}
                aria-disabled
                className="relative ml-auto h-5 w-9 shrink-0 cursor-not-allowed rounded-full bg-slate-300 dark:bg-slate-700"
                aria-label="IA no atendimento (indisponível na V1)"
              >
                <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
              </button>
            </header>
            <div className="bg-white px-4 py-3 dark:bg-slate-900">
              <ul className="space-y-2">
                {dados.usosIa.map((u) => (
                  <li key={u.id} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950/60">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{u.titulo}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{u.descricao}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Ela nunca entra no meio do agendamento: horário e preço saem da agenda e do cadastro de
                Serviços, não do modelo.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
