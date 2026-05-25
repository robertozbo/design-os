import type {
  ConfigSeguranca,
  ConfiguracoesProps,
} from '@/../product/sections/configura-es/types'
import {
  KeyRound,
  ShieldCheck,
  Smartphone,
  ScrollText,
  Pencil,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Monitor,
} from 'lucide-react'

interface SegurancaPanelProps {
  seguranca: ConfigSeguranca
  onChangePasswordIntent?: ConfiguracoesProps['onChangePasswordIntent']
  onToggle2FA?: ConfiguracoesProps['onToggle2FA']
  onRevokeSession?: ConfiguracoesProps['onRevokeSession']
  onRevokeAllOtherSessions?: ConfiguracoesProps['onRevokeAllOtherSessions']
  onDownloadBackupCodes?: ConfiguracoesProps['onDownloadBackupCodes']
}

const DATETIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatDateTime(iso: string): string {
  return DATETIME_FORMATTER.format(new Date(iso))
}

function formatDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso + 'T12:00:00'))
}

export function SegurancaPanel({
  seguranca,
  onChangePasswordIntent,
  onToggle2FA,
  onRevokeSession,
  onRevokeAllOtherSessions,
  onDownloadBackupCodes,
}: SegurancaPanelProps) {
  const otherSessions = seguranca.sessoesAtivas.filter((s) => !s.atual)

  return (
    <div className="space-y-3">
      <Card title="Senha" description="Alteração periódica da senha aumenta a segurança da conta." icon={<KeyRound className="w-3.5 h-3.5" strokeWidth={1.75} />}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] text-slate-600 dark:text-slate-400">
              Última alteração:{' '}
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {formatDate(seguranca.senha.ultimaAlteracao)}
              </span>
            </p>
            <span
              className={`mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[11px] font-medium ${
                seguranca.senha.forcaEstimada === 'forte'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50'
                  : seguranca.senha.forcaEstimada === 'media'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50'
              }`}
            >
              <ShieldCheck className="w-3 h-3" strokeWidth={2} />
              Força {seguranca.senha.forcaEstimada}
            </span>
          </div>
          <button
            type="button"
            onClick={onChangePasswordIntent}
            className="
              inline-flex items-center gap-1.5 px-3 py-2 rounded-xl
              bg-white/80 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              hover:bg-slate-50 dark:hover:bg-slate-800/60
              text-slate-700 dark:text-slate-200 font-medium text-sm
              transition
            "
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
            Alterar senha
          </button>
        </div>
      </Card>

      <Card
        title="Autenticação em dois fatores (2FA)"
        description="Camada extra de segurança via app autenticador ou SMS."
        icon={<Smartphone className="w-3.5 h-3.5" strokeWidth={1.75} />}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[11px] font-medium ${
                seguranca.doisFatores.habilitado
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200/60 dark:ring-slate-700'
              }`}
            >
              {seguranca.doisFatores.habilitado ? (
                <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
              ) : (
                <XCircle className="w-3 h-3" strokeWidth={2} />
              )}
              {seguranca.doisFatores.habilitado ? 'Habilitado' : 'Desabilitado'}
            </span>
            {seguranca.doisFatores.habilitado && seguranca.doisFatores.habilitadoEm && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                desde <span className="font-mono">{formatDate(seguranca.doisFatores.habilitadoEm)}</span>
              </span>
            )}
          </div>
          <Toggle
            checked={seguranca.doisFatores.habilitado}
            onChange={(v) => onToggle2FA?.(v)}
          />
        </div>

        {seguranca.doisFatores.habilitado && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-violet-50/60 dark:bg-violet-950/20 ring-1 ring-violet-200/60 dark:ring-violet-900/40 px-3.5 py-3">
              <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-violet-700 dark:text-violet-300">
                Métodos ativos
              </span>
              <div className="mt-1.5 space-y-1">
                {seguranca.doisFatores.metodoPrincipal && (
                  <p className="text-[12px] text-violet-800 dark:text-violet-200 font-medium">
                    {seguranca.doisFatores.metodoPrincipal === 'autenticador'
                      ? 'App autenticador'
                      : 'SMS'}{' '}
                    <span className="text-[10px] font-mono uppercase tracking-wider">primário</span>
                  </p>
                )}
                {seguranca.doisFatores.metodoSecundario && (
                  <p className="text-[12px] text-violet-700 dark:text-violet-300">
                    {seguranca.doisFatores.metodoSecundario === 'autenticador'
                      ? 'App autenticador'
                      : 'SMS'}{' '}
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-70">backup</span>
                  </p>
                )}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3.5 py-3 flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
                Códigos de backup
              </span>
              <p className="mt-1 text-[16px] font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                {seguranca.doisFatores.codigosBackupRestantes}{' '}
                <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                  restantes
                </span>
              </p>
              <button
                type="button"
                onClick={onDownloadBackupCodes}
                className="
                  mt-2 inline-flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-300
                  hover:underline underline-offset-2 self-start
                "
              >
                <Download className="w-3 h-3" strokeWidth={2} />
                Baixar códigos
              </button>
            </div>
          </div>
        )}
      </Card>

      <Card
        title="Sessões ativas"
        description={`${seguranca.sessoesAtivas.length} dispositivos com acesso à sua conta.`}
        icon={<Monitor className="w-3.5 h-3.5" strokeWidth={1.75} />}
      >
        <div className="space-y-2">
          {seguranca.sessoesAtivas.map((sess) => (
            <div
              key={sess.id}
              className={`
                rounded-xl ring-1 px-4 py-3 flex items-center justify-between gap-3
                ${
                  sess.atual
                    ? 'bg-teal-50/60 dark:bg-teal-950/20 ring-teal-200/60 dark:ring-teal-900/40'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 ring-slate-200/60 dark:ring-slate-800'
                }
              `}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                    {sess.dispositivo}
                  </p>
                  {sess.atual && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-[10px] font-medium uppercase tracking-wider">
                      Atual
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {sess.navegador} · {sess.localizacao} ·{' '}
                  <span className="font-mono">{sess.ip}</span>
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  Última atividade: {formatDateTime(sess.ultimaAtividade)}
                </p>
              </div>
              {!sess.atual && (
                <button
                  type="button"
                  onClick={() => onRevokeSession?.(sess.id)}
                  title="Revogar sessão"
                  aria-label="Revogar sessão"
                  className="
                    inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0
                    text-slate-500 dark:text-slate-400
                    hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300
                    transition
                  "
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              )}
            </div>
          ))}
        </div>

        {otherSessions.length > 0 && (
          <button
            type="button"
            onClick={onRevokeAllOtherSessions}
            className="
              mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60
              text-rose-700 dark:text-rose-300 text-[12px] font-medium transition
            "
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            Revogar todas exceto a atual ({otherSessions.length})
          </button>
        )}
      </Card>

      <Card
        title="Histórico de login"
        description="Últimas 30 entradas — verifique acessos suspeitos."
        icon={<ScrollText className="w-3.5 h-3.5" strokeWidth={1.75} />}
      >
        <div className="rounded-xl ring-1 ring-slate-200/80 dark:ring-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2 text-left">Quando</th>
                <th className="px-3 py-2 text-left">Dispositivo</th>
                <th className="px-3 py-2 text-left">Localização</th>
                <th className="px-3 py-2 text-right pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {seguranca.historicoLogin.map((login) => (
                <tr key={login.id}>
                  <td className="px-3 py-2.5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    {formatDateTime(login.ocorridoEm)}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-slate-700 dark:text-slate-300">
                    {login.dispositivo}
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      {login.ip}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-slate-600 dark:text-slate-400">
                    {login.localizacao}
                  </td>
                  <td className="px-3 py-2.5 text-right pr-4">
                    {login.status === 'sucesso' ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200/60 dark:ring-emerald-900/50 text-[10px] font-medium">
                        <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                        Sucesso
                      </span>
                    ) : (
                      <span
                        title={login.motivoFalha}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-1 ring-rose-200/60 dark:ring-rose-900/50 text-[10px] font-medium"
                      >
                        <XCircle className="w-3 h-3" strokeWidth={2} />
                        Falhou
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
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

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange?.(!checked)}
      className={`
        relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
        ${checked ? 'bg-teal-600 dark:bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}
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
