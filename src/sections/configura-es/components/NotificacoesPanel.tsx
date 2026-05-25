import type {
  CanalNotificacao,
  ConfiguracoesProps,
  Digest,
  DiaSemana,
  ModoOverride,
  NotificacoesGlobais,
  OverrideEmpregador,
  TipoEventoOpcao,
} from '@/../product/sections/configura-es/types'
import {
  Mail,
  Smartphone,
  BellRing,
  Moon,
  CalendarClock,
  Building2,
  AlertTriangle,
  Volume2,
  VolumeX,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'

interface NotificacoesPanelProps {
  globais: NotificacoesGlobais
  overrides: OverrideEmpregador[]
  tiposEvento: TipoEventoOpcao[]
  onToggleCanal?: ConfiguracoesProps['onToggleCanal']
  onUpdateDnd?: ConfiguracoesProps['onUpdateDnd']
  onUpdateDigest?: ConfiguracoesProps['onUpdateDigest']
  onChangeOverrideEmpregador?: ConfiguracoesProps['onChangeOverrideEmpregador']
}

const CANAIS: { value: CanalNotificacao; label: string; icon: React.ReactNode }[] = [
  { value: 'email', label: 'E-mail', icon: <Mail className="w-3 h-3" strokeWidth={1.75} /> },
  { value: 'push', label: 'Push', icon: <Smartphone className="w-3 h-3" strokeWidth={1.75} /> },
  { value: 'inApp', label: 'In-app', icon: <BellRing className="w-3 h-3" strokeWidth={1.75} /> },
]

const DIAS: { value: DiaSemana; label: string }[] = [
  { value: 'domingo', label: 'D' },
  { value: 'segunda', label: 'S' },
  { value: 'terca', label: 'T' },
  { value: 'quarta', label: 'Q' },
  { value: 'quinta', label: 'Q' },
  { value: 'sexta', label: 'S' },
  { value: 'sabado', label: 'S' },
]

const MODO_OVERRIDE_LABEL: Record<ModoOverride, { label: string; pill: string; icon: React.ReactNode }> = {
  global: {
    label: 'Seguindo configuração global',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200/60 dark:ring-slate-700',
    icon: <Volume2 className="w-3 h-3" strokeWidth={1.75} />,
  },
  silenciado: {
    label: 'Silenciado',
    pill: 'bg-slate-200/70 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300 ring-slate-300/60 dark:ring-slate-600',
    icon: <VolumeX className="w-3 h-3" strokeWidth={1.75} />,
  },
  push_apenas: {
    label: 'Push apenas',
    pill: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/50',
    icon: <Smartphone className="w-3 h-3" strokeWidth={1.75} />,
  },
  criticos_apenas: {
    label: 'Críticos apenas',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    icon: <AlertTriangle className="w-3 h-3" strokeWidth={1.75} />,
  },
}

export function NotificacoesPanel({
  globais,
  overrides,
  tiposEvento,
  onToggleCanal,
  onUpdateDnd,
  onUpdateDigest,
  onChangeOverrideEmpregador,
}: NotificacoesPanelProps) {
  const [expandedEmpregador, setExpandedEmpregador] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      <Card title="Canais e tipos de evento" description="Defina por onde quer ser avisado de cada tipo de evento." icon={<BellRing className="w-3.5 h-3.5" strokeWidth={1.75} />}>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr>
                <th className="text-left text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 pb-3 pl-1">
                  Tipo de evento
                </th>
                {CANAIS.map((c) => (
                  <th
                    key={c.value}
                    className="text-center text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 pb-3 px-2 w-[90px]"
                  >
                    <span className="inline-flex items-center gap-1 justify-center">
                      {c.icon}
                      {c.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tiposEvento.map((evento) => {
                const canais = globais.matriz[evento.value]
                return (
                  <tr key={evento.value}>
                    <td className="py-3 pl-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-slate-800 dark:text-slate-200">
                          {evento.label}
                        </span>
                        {evento.critico && (
                          <span className="inline-flex items-center gap-0.5 px-1 py-px rounded bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-200/60 dark:ring-rose-900/50 text-[9px] font-medium text-rose-700 dark:text-rose-300">
                            <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2} />
                            Crítico
                          </span>
                        )}
                      </div>
                    </td>
                    {CANAIS.map((c) => (
                      <td key={c.value} className="py-3 px-2 text-center">
                        <Toggle
                          checked={canais[c.value]}
                          onChange={(v) => onToggleCanal?.(evento.value, c.value, v)}
                        />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Horários silenciosos" description="Eventos críticos sempre passam, mesmo no modo silencioso." icon={<Moon className="w-3.5 h-3.5" strokeWidth={1.75} />}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-[13px] text-slate-700 dark:text-slate-200">
            Ativar Não Perturbe
          </span>
          <Toggle
            checked={globais.doNotDisturb.habilitado}
            onChange={(v) =>
              onUpdateDnd?.({ ...globais.doNotDisturb, habilitado: v })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FieldLabel label="Início">
            <input
              type="time"
              value={globais.doNotDisturb.horaInicio}
              disabled={!globais.doNotDisturb.habilitado}
              onChange={(e) =>
                onUpdateDnd?.({ ...globais.doNotDisturb, horaInicio: e.target.value })
              }
              className={fieldInput}
            />
          </FieldLabel>
          <FieldLabel label="Fim">
            <input
              type="time"
              value={globais.doNotDisturb.horaFim}
              disabled={!globais.doNotDisturb.habilitado}
              onChange={(e) =>
                onUpdateDnd?.({ ...globais.doNotDisturb, horaFim: e.target.value })
              }
              className={fieldInput}
            />
          </FieldLabel>
        </div>

        <div className="mt-3">
          <span className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Dias da semana
          </span>
          <div className="flex gap-1">
            {DIAS.map((dia) => {
              const active = globais.doNotDisturb.diasSemana.includes(dia.value)
              return (
                <button
                  key={dia.value}
                  type="button"
                  disabled={!globais.doNotDisturb.habilitado}
                  onClick={() => {
                    const next = active
                      ? globais.doNotDisturb.diasSemana.filter((d) => d !== dia.value)
                      : [...globais.doNotDisturb.diasSemana, dia.value]
                    onUpdateDnd?.({ ...globais.doNotDisturb, diasSemana: next })
                  }}
                  className={`
                    flex-1 max-w-[48px] py-1.5 rounded-lg text-[12px] font-medium transition
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      active
                        ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 ring-1 ring-teal-200/60 dark:ring-teal-900/60'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                    }
                  `}
                  title={dia.value}
                >
                  {dia.label}
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      <Card title="Resumo periódico" description="Receba um digest por e-mail consolidando os eventos da carteira." icon={<CalendarClock className="w-3.5 h-3.5" strokeWidth={1.75} />}>
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-[13px] text-slate-700 dark:text-slate-200">
            Enviar resumo
          </span>
          <Toggle
            checked={globais.digest.habilitado}
            onChange={(v) => onUpdateDigest?.({ ...globais.digest, habilitado: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FieldLabel label="Frequência">
            <select
              value={globais.digest.frequencia}
              disabled={!globais.digest.habilitado}
              onChange={(e) =>
                onUpdateDigest?.({
                  ...globais.digest,
                  frequencia: e.target.value as Digest['frequencia'],
                })
              }
              className={fieldInput}
            >
              <option value="diario">Diário</option>
              <option value="semanal">Semanal · às segundas</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Hora">
            <select
              value={globais.digest.hora}
              disabled={!globais.digest.habilitado}
              onChange={(e) =>
                onUpdateDigest?.({ ...globais.digest, hora: e.target.value })
              }
              className={fieldInput}
            >
              <option value="08:00">Manhã · 08:00</option>
              <option value="12:00">Meio-dia · 12:00</option>
              <option value="18:00">Final do dia · 18:00</option>
            </select>
          </FieldLabel>
        </div>
      </Card>

      <Card title="Por empregador" description="Sobrescreva preferências para empregadores específicos." icon={<Building2 className="w-3.5 h-3.5" strokeWidth={1.75} />}>
        <div className="space-y-2">
          {overrides.map((emp) => {
            const tone = MODO_OVERRIDE_LABEL[emp.modo]
            const expanded = expandedEmpregador === emp.empregadorId
            return (
              <div
                key={emp.empregadorId}
                className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedEmpregador(expanded ? null : emp.empregadorId)
                  }
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <span className="text-[13px] font-medium text-slate-800 dark:text-slate-200">
                    {emp.empregadorNome}
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[10px] font-medium ${tone.pill}`}
                    >
                      {tone.icon}
                      {tone.label}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition ${expanded ? 'rotate-180' : ''}`}
                      strokeWidth={1.75}
                    />
                  </span>
                </button>
                {expanded && (
                  <div className="px-4 pb-3 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {(Object.keys(MODO_OVERRIDE_LABEL) as ModoOverride[]).map((modo) => {
                        const t = MODO_OVERRIDE_LABEL[modo]
                        const active = emp.modo === modo
                        return (
                          <button
                            key={modo}
                            type="button"
                            onClick={() =>
                              onChangeOverrideEmpregador?.(emp.empregadorId, modo)
                            }
                            className={`
                              flex items-center gap-2 px-3 py-2 rounded-lg ring-1 text-left text-[12px] font-medium transition
                              ${
                                active
                                  ? 'bg-teal-50 ring-teal-200/60 text-teal-800 dark:bg-teal-950/40 dark:ring-teal-900/60 dark:text-teal-200'
                                  : 'bg-white/60 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                              }
                            `}
                          >
                            {t.icon}
                            {t.label}
                          </button>
                        )
                      })}
                    </div>
                    {emp.descricao && (
                      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
                        {emp.descricao}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`
        relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          checked
            ? 'bg-teal-600 dark:bg-teal-500'
            : 'bg-slate-200 dark:bg-slate-700'
        }
      `}
    >
      <span
        className={`
          inline-block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-150
          ${checked ? 'translate-x-[18px]' : 'translate-x-[3px]'}
        `}
      />
    </button>
  )
}

function Card({
  title,
  description,
  icon,
  children,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5">
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          {icon && <span className="text-slate-500">{icon}</span>}
          <h3 className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h3>
        </div>
        {description && (
          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

const fieldInput = `
  w-full px-3 py-2 rounded-xl
  bg-white/80 dark:bg-slate-900/40
  border border-slate-200 dark:border-slate-800
  text-sm text-slate-800 dark:text-slate-200
  focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
  disabled:opacity-50 disabled:cursor-not-allowed
  transition
`

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
        {label}
      </span>
      {children}
    </div>
  )
}
