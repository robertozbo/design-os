import { Mail, MessageSquare, Smartphone } from 'lucide-react'
import type {
  CanalNotificacao,
  NotificacaoCategoria,
  NotificacoesConfig,
} from '@/../product-personal/sections/configuracoes/types'
import { Panel } from './PerfilPanel'

interface NotificacoesPanelProps {
  notificacoes: NotificacoesConfig
  onToggle?: (
    categoriaId: string,
    canal: CanalNotificacao,
    valor: boolean,
  ) => void
}

const CANAIS: {
  id: CanalNotificacao
  label: string
  icon: React.ElementType
  desc: string
}[] = [
  { id: 'email', label: 'Email', icon: Mail, desc: 'Caixa de entrada' },
  {
    id: 'push',
    label: 'Push',
    icon: Smartphone,
    desc: 'Notificações no app',
  },
  { id: 'sms', label: 'SMS', icon: MessageSquare, desc: 'Mensagem de texto' },
]

export function NotificacoesPanel({
  notificacoes,
  onToggle,
}: NotificacoesPanelProps) {
  return (
    <Panel
      title="Notificações"
      description="Escolha por onde receber cada tipo de aviso. Categorias críticas (dor, adesão baixa) são recomendadas em todos os canais."
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Header da tabela */}
        <div className="grid grid-cols-[1fr_60px_60px_60px] gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/60">
          <div />
          {CANAIS.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.id} className="flex flex-col items-center text-center">
                <Icon
                  size={12}
                  className="text-slate-400 dark:text-slate-500"
                />
                <p className="mt-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {c.label}
                </p>
              </div>
            )
          })}
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {notificacoes.categorias.map((cat) => (
            <NotifRow
              key={cat.id}
              categoria={cat}
              onToggle={(canal, v) => onToggle?.(cat.id, canal, v)}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-900/60">
        <p className="text-[12px] text-slate-600 dark:text-slate-400">
          <strong className="text-slate-900 dark:text-slate-50">Dica</strong>:
          deixe Email e Push ativos pra eventos críticos (dor, adesão baixa) e
          desligue SMS pra eventos não-urgentes (custos extras de mensagem).
        </p>
      </div>
    </Panel>
  )
}

function NotifRow({
  categoria,
  onToggle,
}: {
  categoria: NotificacaoCategoria
  onToggle: (canal: CanalNotificacao, v: boolean) => void
}) {
  return (
    <div className="grid grid-cols-[1fr_60px_60px_60px] items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
          {categoria.label}
        </p>
        {categoria.descricao && (
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {categoria.descricao}
          </p>
        )}
      </div>
      <div className="flex justify-center">
        <Toggle
          checked={categoria.email}
          onChange={(v) => onToggle('email', v)}
        />
      </div>
      <div className="flex justify-center">
        <Toggle
          checked={categoria.push}
          onChange={(v) => onToggle('push', v)}
        />
      </div>
      <div className="flex justify-center">
        <Toggle
          checked={categoria.sms}
          onChange={(v) => onToggle('sms', v)}
        />
      </div>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        checked
          ? 'bg-teal-600 dark:bg-teal-500'
          : 'bg-slate-200 dark:bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
