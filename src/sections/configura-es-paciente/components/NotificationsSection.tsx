import {
  Mail,
  Smartphone,
  MessageSquare,
  Tag,
  Bell,
  Sparkles,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import type {
  NotificationSettings,
  UpdateNotificationsPayload,
} from '@/../product/sections/configura-es-paciente/types'
import { Toggle } from './Toggle'

interface NotificationsSectionProps {
  settings: NotificationSettings
  onChange: (payload: UpdateNotificationsPayload) => void
}

interface ToggleRowProps {
  icon: LucideIcon
  title: string
  description: string
  checked: boolean
  badge?: string
  onChange: (next: boolean) => void
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  badge,
  onChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
          checked
            ? 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </p>
          {badge && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <div className="pt-1">
        <Toggle checked={checked} onChange={onChange} label={title} />
      </div>
    </div>
  )
}

export function NotificationsSection({
  settings,
  onChange,
}: NotificationsSectionProps) {
  const allChannelsOff = !settings.email && !settings.push && !settings.sms

  return (
    <div className="space-y-6">
      {allChannelsOff && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            <strong className="font-semibold">
              Você desativou todos os canais.
            </strong>{' '}
            Algumas ações importantes podem passar despercebidas. Considere
            ativar pelo menos email.
          </p>
        </div>
      )}

      {/* Canais */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Canais
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Onde você quer ser notificado
          </p>
        </header>
        <div className="divide-y divide-slate-100 px-6 dark:divide-slate-800">
          <ToggleRow
            icon={Mail}
            title="Email"
            description="Confirmações, recibos e comunicações importantes"
            checked={settings.email}
            onChange={(email) => onChange({ email })}
          />
          <ToggleRow
            icon={Smartphone}
            title="Push no celular"
            description="Notificações em tempo real no app mobile"
            checked={settings.push}
            onChange={(push) => onChange({ push })}
          />
          <ToggleRow
            icon={MessageSquare}
            title="SMS"
            description="Alertas críticos via mensagem de texto"
            badge="Pode ter custo"
            checked={settings.sms}
            onChange={(sms) => onChange({ sms })}
          />
        </div>
      </section>

      {/* Tipos de conteúdo */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Tipos de conteúdo
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            O que você quer receber
          </p>
        </header>
        <div className="divide-y divide-slate-100 px-6 dark:divide-slate-800">
          <ToggleRow
            icon={Tag}
            title="Marketing e promoções"
            description="Ofertas, dicas e novidades sobre o Nymos"
            checked={settings.marketing}
            onChange={(marketing) => onChange({ marketing })}
          />
          <ToggleRow
            icon={Bell}
            title="Lembretes de saúde"
            description="Hora de medir, consulta agendada, registrar refeição"
            checked={settings.reminders}
            onChange={(reminders) => onChange({ reminders })}
          />
          <ToggleRow
            icon={Sparkles}
            title="Atualizações do produto"
            description="Novidades de features e mudanças importantes"
            checked={settings.updates}
            onChange={(updates) => onChange({ updates })}
          />
        </div>
      </section>
    </div>
  )
}
