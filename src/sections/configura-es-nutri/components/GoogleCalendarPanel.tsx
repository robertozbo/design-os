import { RefreshCw, Link2, Unlink, AlertCircle, Calendar as CalendarIcon } from 'lucide-react'
import type { GoogleCalendar } from '@/../product/sections/configura-es-nutri/types'
import { Card, PanelHeader, StatusBadge, ToggleRow } from './_shared'

interface GoogleCalendarPanelProps {
  googleCalendar: GoogleCalendar
  onConnect?: () => void
  onDisconnect?: () => void
  onSyncNow?: () => void
  onReconnect?: () => void
  onToggleBloquearHorariosOcupados?: (next: boolean) => void
}

export function GoogleCalendarPanel({
  googleCalendar,
  onConnect,
  onDisconnect,
  onSyncNow,
  onReconnect,
  onToggleBloquearHorariosOcupados,
}: GoogleCalendarPanelProps) {
  const status = googleCalendar.status
  const conectado = status === 'conectado'
  const erro = status === 'erro'
  const sincronizando = status === 'sincronizando'

  return (
    <div>
      <PanelHeader
        eyebrow="Google Calendar"
        title="Integração com sua agenda externa"
        description="Sincronize automaticamente sua disponibilidade entre o Nymos e o Google Calendar."
      />

      <Card
        title="Google Calendar"
        description={
          conectado
            ? 'Conectado · suas consultas aparecem na sua agenda do Google.'
            : erro
            ? 'Houve um problema na sincronização. Reconecte para tentar novamente.'
            : sincronizando
            ? 'Sincronizando…'
            : 'Conecte sua conta Google para espelhar suas consultas no calendário.'
        }
        trailing={
          conectado ? (
            <StatusBadge tone="emerald">Conectado</StatusBadge>
          ) : erro ? (
            <StatusBadge tone="rose">Erro</StatusBadge>
          ) : sincronizando ? (
            <StatusBadge tone="teal" pulse>
              Sincronizando
            </StatusBadge>
          ) : (
            <StatusBadge tone="slate">Desconectado</StatusBadge>
          )
        }
      >
        <div className="space-y-5">
          {/* Header row with logo */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 via-emerald-50 to-amber-50 ring-1 ring-slate-200 dark:from-blue-950/40 dark:via-emerald-950/40 dark:to-amber-950/40 dark:ring-slate-800">
              <CalendarIcon className="text-emerald-600 dark:text-emerald-400" size={28} strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Google Calendar
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Importa horários ocupados e cria eventos automaticamente para cada consulta agendada no Nymos.
              </p>
            </div>
          </div>

          {/* Detail rows when connected */}
          {conectado && googleCalendar.emailVinculado && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
              <dl className="grid gap-3 sm:grid-cols-2">
                <Detail label="Conta vinculada" value={googleCalendar.emailVinculado} mono />
                <Detail label="Calendário" value={googleCalendar.calendarioNome ?? '—'} />
                <Detail
                  label="Escopo"
                  value={googleCalendar.escopo === 'leitura_escrita' ? 'Leitura e escrita' : 'Apenas leitura'}
                />
                <Detail
                  label="Última sincronização"
                  value={formatDate(googleCalendar.ultimaSincronizacaoIso)}
                  mono
                />
              </dl>
            </div>
          )}

          {/* Toggle */}
          {conectado && (
            <div className="rounded-xl border border-slate-200 px-4 dark:border-slate-800">
              <ToggleRow
                label="Bloquear horários ocupados no Google"
                description="Eventos pessoais marcados como 'ocupado' no Google somem dos slots disponíveis na Agenda."
                checked={googleCalendar.bloquearHorariosOcupados}
                onChange={onToggleBloquearHorariosOcupados}
              />
            </div>
          )}

          {/* Error banner */}
          {erro && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50/60 px-4 py-3 dark:border-rose-900/60 dark:bg-rose-950/30">
              <AlertCircle className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400" size={16} />
              <div className="text-xs">
                <p className="font-medium text-rose-700 dark:text-rose-300">Token expirado</p>
                <p className="text-rose-600/80 dark:text-rose-400/80">
                  Reconecte sua conta Google para retomar a sincronização automática.
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            {conectado && (
              <>
                <button
                  type="button"
                  onClick={onSyncNow}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
                >
                  <RefreshCw size={12} /> Sincronizar agora
                </button>
                <button
                  type="button"
                  onClick={onReconnect}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Link2 size={12} /> Reconectar
                </button>
                <button
                  type="button"
                  onClick={onDisconnect}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <Unlink size={12} /> Desconectar
                </button>
              </>
            )}

            {erro && (
              <button
                type="button"
                onClick={onReconnect}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
              >
                <Link2 size={12} /> Reconectar Google
              </button>
            )}

            {!conectado && !erro && !sincronizando && (
              <button
                type="button"
                onClick={onConnect}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
              >
                <Link2 size={12} /> Conectar Google Calendar
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
        {label}
      </dt>
      <dd className={`mt-0.5 text-xs text-slate-700 dark:text-slate-300 ${mono ? 'font-mono' : ''}`}>
        {value}
      </dd>
    </div>
  )
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${date} · ${time}`
}
