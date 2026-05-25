import type {
  ConfiguracoesProps,
  Integracao,
  StatusIntegracao,
  TipoIntegracao,
} from '@/../product/sections/configura-es/types'
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Loader2,
  Building,
  BarChart3,
  Users2,
  MessageSquare,
  RefreshCw,
  Plug,
  Settings as SettingsIcon,
  Unplug,
} from 'lucide-react'

interface IntegracoesPanelProps {
  integracoes: Integracao[]
  onAction?: ConfiguracoesProps['onIntegracaoAction']
}

const STATUS_TONE: Record<
  StatusIntegracao,
  { label: string; pill: string; icon: React.ReactNode }
> = {
  conectado: {
    label: 'Conectado',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
    icon: <CheckCircle2 className="w-3 h-3" strokeWidth={2} />,
  },
  desconectado: {
    label: 'Desconectado',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200/60 dark:ring-slate-700',
    icon: <XCircle className="w-3 h-3" strokeWidth={2} />,
  },
  erro: {
    label: 'Com erro',
    pill: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50',
    icon: <AlertOctagon className="w-3 h-3" strokeWidth={2} />,
  },
  sincronizando: {
    label: 'Sincronizando',
    pill: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/50',
    icon: <Loader2 className="w-3 h-3 animate-spin" strokeWidth={2} />,
  },
}

const TIPO_ICON: Record<TipoIntegracao, React.ReactNode> = {
  governamental: <Building className="w-4 h-4" strokeWidth={1.75} />,
  pesquisa_clima: <BarChart3 className="w-4 h-4" strokeWidth={1.75} />,
  rh: <Users2 className="w-4 h-4" strokeWidth={1.75} />,
  comunicacao: <MessageSquare className="w-4 h-4" strokeWidth={1.75} />,
}

const TIPO_BG: Record<TipoIntegracao, string> = {
  governamental: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  pesquisa_clima: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  rh: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  comunicacao: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

const DATETIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDateTime(iso: string | null): string {
  if (!iso) return 'Nunca sincronizado'
  return DATETIME_FORMATTER.format(new Date(iso))
}

export function IntegracoesPanel({ integracoes, onAction }: IntegracoesPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {integracoes.map((int) => {
        const tone = STATUS_TONE[int.status]
        return (
          <div
            key={int.id}
            className="rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5 flex flex-col"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className={`inline-flex w-10 h-10 items-center justify-center rounded-xl shrink-0 ${TIPO_BG[int.tipo]}`}>
                  {TIPO_ICON[int.tipo]}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    {int.nome}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                    {int.descricao}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[10px] font-medium shrink-0 ${tone.pill}`}
              >
                {tone.icon}
                {tone.label}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 flex-1">
              {int.ultimaSincronizacao && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Última sync:</span>{' '}
                  <span className="font-mono">{formatDateTime(int.ultimaSincronizacao)}</span>
                </div>
              )}
              {int.escopoSincronizado && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-medium">Escopo:</span> {int.escopoSincronizado}
                </div>
              )}
              {int.erroMensagem && (
                <div className="mt-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 ring-1 ring-rose-200/60 dark:ring-rose-900/50 px-2.5 py-2">
                  <p className="text-[11px] text-rose-700 dark:text-rose-300 leading-snug">
                    {int.erroMensagem}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {int.status === 'desconectado' && (
                <button
                  type="button"
                  onClick={() => onAction?.(int.id, 'conectar')}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400
                    text-white font-medium text-[12px] transition
                  "
                >
                  <Plug className="w-3.5 h-3.5" strokeWidth={2} />
                  Conectar
                </button>
              )}
              {int.status === 'erro' && (
                <button
                  type="button"
                  onClick={() => onAction?.(int.id, 'reconectar')}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400
                    text-white font-medium text-[12px] transition
                  "
                >
                  <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
                  Reconectar
                </button>
              )}
              {(int.status === 'conectado' || int.status === 'sincronizando') && (
                <button
                  type="button"
                  onClick={() => onAction?.(int.id, 'sincronizar')}
                  disabled={int.status === 'sincronizando'}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    bg-white/80 dark:bg-slate-900/40
                    border border-slate-200 dark:border-slate-800
                    hover:bg-slate-50 dark:hover:bg-slate-800/60
                    text-slate-700 dark:text-slate-200 font-medium text-[12px]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition
                  "
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${int.status === 'sincronizando' ? 'animate-spin' : ''}`} strokeWidth={1.75} />
                  Sincronizar agora
                </button>
              )}
              {int.status === 'conectado' && (
                <>
                  <button
                    type="button"
                    onClick={() => onAction?.(int.id, 'configurar')}
                    title="Configurar"
                    aria-label="Configurar"
                    className="
                      inline-flex items-center justify-center w-8 h-8 rounded-lg
                      text-slate-500 dark:text-slate-400
                      hover:bg-slate-100 dark:hover:bg-slate-800
                      transition
                    "
                  >
                    <SettingsIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onAction?.(int.id, 'desconectar')}
                    title="Desconectar"
                    aria-label="Desconectar"
                    className="
                      inline-flex items-center justify-center w-8 h-8 rounded-lg
                      text-slate-500 dark:text-slate-400
                      hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300
                      transition
                    "
                  >
                    <Unplug className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
