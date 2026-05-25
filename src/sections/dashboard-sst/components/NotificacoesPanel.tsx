import type { NotificacaoSst, Urgencia } from '@/../product/sections/dashboard-sst/types'
import { Bell, Sparkles } from 'lucide-react'
import { NotificacaoItem } from './NotificacaoItem'

interface NotificacoesPanelProps {
  notificacoes: NotificacaoSst[]
  onAbrirNotificacao?: (notificacaoId: string) => void
}

const URGENCIA_ORDER: Urgencia[] = ['alta', 'media', 'baixa']

const URGENCIA_LABEL: Record<Urgencia, string> = {
  alta: 'Alta urgência',
  media: 'Média urgência',
  baixa: 'Baixa urgência',
}

export function NotificacoesPanel({ notificacoes, onAbrirNotificacao }: NotificacoesPanelProps) {
  const grupos = URGENCIA_ORDER.map((urg) => ({
    urgencia: urg,
    items: notificacoes.filter((n) => n.urgencia === urg),
  })).filter((g) => g.items.length > 0)

  const totalAlta = notificacoes.filter((n) => n.urgencia === 'alta').length

  return (
    <aside
      style={{ animationDelay: '480ms' }}
      className="
        nymos-reveal opacity-0
        rounded-2xl
        bg-white/95 dark:bg-slate-900/70
        border border-slate-200/80 dark:border-slate-800
        overflow-hidden
        sticky top-6
      "
    >
      <header className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="
            w-8 h-8 rounded-lg flex items-center justify-center
            bg-violet-50 dark:bg-violet-950/40 ring-1 ring-violet-200 dark:ring-violet-900/60
          ">
            <Bell className="w-4 h-4 text-violet-600 dark:text-violet-400" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Notificações SST
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">
              {notificacoes.length} {notificacoes.length === 1 ? 'item' : 'itens'}
              {totalAlta > 0 && (
                <>
                  {' · '}
                  <span className="text-rose-600 dark:text-rose-400 font-medium tabular-nums">
                    {totalAlta} de alta urgência
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </header>

      {notificacoes.length === 0 ? (
        <div className="px-5 py-10 flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/40 ring-1 ring-teal-200 dark:ring-teal-900/60 flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Tudo em ordem
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-[220px]">
            Nenhuma notificação ativa na carteira. Continue acompanhando os planos em execução.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {grupos.map((grupo) => (
            <section key={grupo.urgencia} className="px-3 py-3">
              <div className="px-2 mb-1">
                <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-400 dark:text-slate-500">
                  {URGENCIA_LABEL[grupo.urgencia]}
                </span>
              </div>
              <div className="space-y-0.5">
                {grupo.items.map((n) => (
                  <NotificacaoItem
                    key={n.id}
                    notificacao={n}
                    onAbrir={() => onAbrirNotificacao?.(n.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </aside>
  )
}
