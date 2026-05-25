import type {
  ConfiguracoesProps,
  SecaoConfiguracoes,
} from '@/../product/sections/configura-es/types'
import {
  BellRing,
  Plug,
  Sliders,
  ShieldCheck,
  Lock,
} from 'lucide-react'
import { NotificacoesPanel } from './NotificacoesPanel'
import { IntegracoesPanel } from './IntegracoesPanel'
import { InterfacePanel } from './InterfacePanel'
import { SegurancaPanel } from './SegurancaPanel'
import { PrivacidadePanel } from './PrivacidadePanel'

interface SecaoSpec {
  value: SecaoConfiguracoes
  label: string
  helper: string
  icon: React.ReactNode
}

const SECOES: SecaoSpec[] = [
  {
    value: 'notificacoes',
    label: 'Notificações',
    helper: 'Canais, eventos e horários',
    icon: <BellRing className="w-4 h-4" strokeWidth={1.75} />,
  },
  {
    value: 'integracoes',
    label: 'Integrações',
    helper: 'eSocial, GPTW, RH, Slack',
    icon: <Plug className="w-4 h-4" strokeWidth={1.75} />,
  },
  {
    value: 'interface',
    label: 'Interface',
    helper: 'Idioma, tema, densidade',
    icon: <Sliders className="w-4 h-4" strokeWidth={1.75} />,
  },
  {
    value: 'seguranca',
    label: 'Segurança',
    helper: 'Senha, 2FA, sessões',
    icon: <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />,
  },
  {
    value: 'privacidade',
    label: 'Privacidade & LGPD',
    helper: 'Logs, consentimentos, dados',
    icon: <Lock className="w-4 h-4" strokeWidth={1.75} />,
  },
]

export function ConfiguracoesPage(props: ConfiguracoesProps) {
  const {
    perfilContexto,
    tiposEventoOpcoes,
    configuracoes,
    secaoAtiva,
    onSecaoChange,
    onToggleCanal,
    onUpdateDnd,
    onUpdateDigest,
    onChangeOverrideEmpregador,
    onIntegracaoAction,
    onUpdateInterface,
    onChangePasswordIntent,
    onToggle2FA,
    onRevokeSession,
    onRevokeAllOtherSessions,
    onDownloadBackupCodes,
    onChangeRetencaoLogs,
    onToggleConsentimento,
    onRequestExport,
    onDeleteAccountIntent,
  } = props

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Conta · Preferências
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Configurações
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Personalize sua experiência e governe sua conta · {perfilContexto.nome}
          </p>
        </header>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <aside
            className="nymos-reveal opacity-0 lg:sticky lg:top-6 self-start"
            style={{ animationDelay: '120ms' }}
          >
            <nav
              className="
                flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible
                p-1.5 rounded-2xl
                bg-white/80 dark:bg-slate-900/40
                border border-slate-200/80 dark:border-slate-800
              "
              aria-label="Seções"
            >
              {SECOES.map((sec) => {
                const active = secaoAtiva === sec.value
                return (
                  <button
                    key={sec.value}
                    type="button"
                    onClick={() => onSecaoChange?.(sec.value)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition shrink-0
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                      ${
                        active
                          ? 'bg-teal-50 dark:bg-teal-950/40 ring-1 ring-teal-200/60 dark:ring-teal-900/60'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }
                    `}
                  >
                    <span
                      className={`
                        inline-flex w-7 h-7 items-center justify-center rounded-lg shrink-0
                        ${
                          active
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }
                      `}
                    >
                      {sec.icon}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-[13px] font-semibold ${
                          active
                            ? 'text-teal-800 dark:text-teal-200'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {sec.label}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-tight">
                        {sec.helper}
                      </p>
                    </div>
                  </button>
                )
              })}
            </nav>
          </aside>

          <main
            className="nymos-reveal opacity-0 min-w-0"
            style={{ animationDelay: '180ms' }}
          >
            {secaoAtiva === 'notificacoes' && (
              <NotificacoesPanel
                globais={configuracoes.notificacoesGlobais}
                overrides={configuracoes.overridesEmpregadores}
                tiposEvento={tiposEventoOpcoes}
                onToggleCanal={onToggleCanal}
                onUpdateDnd={onUpdateDnd}
                onUpdateDigest={onUpdateDigest}
                onChangeOverrideEmpregador={onChangeOverrideEmpregador}
              />
            )}
            {secaoAtiva === 'integracoes' && (
              <IntegracoesPanel
                integracoes={configuracoes.integracoes}
                onAction={onIntegracaoAction}
              />
            )}
            {secaoAtiva === 'interface' && (
              <InterfacePanel
                config={configuracoes.interface}
                onChange={onUpdateInterface}
              />
            )}
            {secaoAtiva === 'seguranca' && (
              <SegurancaPanel
                seguranca={configuracoes.seguranca}
                onChangePasswordIntent={onChangePasswordIntent}
                onToggle2FA={onToggle2FA}
                onRevokeSession={onRevokeSession}
                onRevokeAllOtherSessions={onRevokeAllOtherSessions}
                onDownloadBackupCodes={onDownloadBackupCodes}
              />
            )}
            {secaoAtiva === 'privacidade' && (
              <PrivacidadePanel
                privacidade={configuracoes.privacidade}
                onChangeRetencaoLogs={onChangeRetencaoLogs}
                onToggleConsentimento={onToggleConsentimento}
                onRequestExport={onRequestExport}
                onDeleteAccountIntent={onDeleteAccountIntent}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
