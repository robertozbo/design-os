import {
  Bell,
  CalendarClock,
  CreditCard,
  Database,
  Plug,
  User,
} from 'lucide-react'
import type {
  ConfiguracoesProps,
  SecaoId,
} from '@/../product-personal/sections/configuracoes/types'
import { PerfilPanel } from './PerfilPanel'
import { AgendaPanel } from './AgendaPanel'
import { PlanoPanel } from './PlanoPanel'
import { NotificacoesPanel } from './NotificacoesPanel'
import { IntegracoesPanel } from './IntegracoesPanel'
import { DadosPanel } from './DadosPanel'

const SECOES: { id: SecaoId; label: string; icon: React.ElementType; descricao: string }[] = [
  { id: 'perfil', label: 'Perfil', icon: User, descricao: 'Foto, CREF, especialidades' },
  { id: 'agenda', label: 'Agenda e disponibilidade', icon: CalendarClock, descricao: 'Horários, locais, valores' },
  { id: 'plano', label: 'Plano e cobrança', icon: CreditCard, descricao: 'Assinatura e pagamentos' },
  { id: 'notificacoes', label: 'Notificações', icon: Bell, descricao: 'Email, push, SMS' },
  { id: 'integracoes', label: 'Integrações', icon: Plug, descricao: 'Apple Health, Garmin, Stripe' },
  { id: 'dados', label: 'Dados e privacidade', icon: Database, descricao: 'Idioma, tema, LGPD' },
]

export function ConfiguracoesPage({
  data,
  selectedSecao,
  onSecaoChange,
  onSavePerfil,
  onSaveAgenda,
  onTrocarPlano,
  onAddMetodoPagamento,
  onRemoveMetodo,
  onMakeMetodoPrincipal,
  onToggleNotificacao,
  onConectarIntegracao,
  onDesconectarIntegracao,
  onChangeIdioma,
  onChangeTema,
  onExportarDados,
  onExcluirConta,
  onUploadAvatar,
}: ConfiguracoesProps) {
  return (
    <div
      data-nymos-configuracoes
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header
          style={{ animationDelay: '0ms' }}
          className="nymos-reveal opacity-0"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Personal · Nymos
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Configurações
          </h1>
        </header>

        {/* Layout split */}
        <div
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]"
        >
          {/* Internal nav */}
          <nav className="space-y-1">
            {SECOES.map((s) => {
              const Icon = s.icon
              const active = selectedSecao === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSecaoChange?.(s.id)}
                  className={`
                    group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors
                    ${
                      active
                        ? 'bg-white shadow-sm ring-1 ring-inset ring-teal-200 dark:bg-slate-900 dark:ring-teal-800'
                        : 'hover:bg-white/60 dark:hover:bg-slate-900/40'
                    }
                  `}
                >
                  <span
                    className={`
                      mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                      ${
                        active
                          ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }
                    `}
                  >
                    <Icon size={13} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[13px] font-semibold leading-tight ${
                        active
                          ? 'text-slate-900 dark:text-slate-50'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                      {s.descricao}
                    </p>
                  </div>
                </button>
              )
            })}
          </nav>

          {/* Panel content */}
          <div className="min-w-0">
            {selectedSecao === 'perfil' && (
              <PerfilPanel
                perfil={data.perfil}
                onSave={onSavePerfil}
                onUploadAvatar={onUploadAvatar}
              />
            )}
            {selectedSecao === 'agenda' && (
              <AgendaPanel agenda={data.agenda} onSave={onSaveAgenda} />
            )}
            {selectedSecao === 'plano' && (
              <PlanoPanel
                plano={data.plano}
                onTrocarPlano={onTrocarPlano}
                onAddMetodoPagamento={onAddMetodoPagamento}
                onRemoveMetodo={onRemoveMetodo}
                onMakeMetodoPrincipal={onMakeMetodoPrincipal}
              />
            )}
            {selectedSecao === 'notificacoes' && (
              <NotificacoesPanel
                notificacoes={data.notificacoes}
                onToggle={onToggleNotificacao}
              />
            )}
            {selectedSecao === 'integracoes' && (
              <IntegracoesPanel
                integracoes={data.integracoes}
                planoAtual={data.plano.atual}
                onConectar={onConectarIntegracao}
                onDesconectar={onDesconectarIntegracao}
              />
            )}
            {selectedSecao === 'dados' && (
              <DadosPanel
                dados={data.dados}
                onChangeIdioma={onChangeIdioma}
                onChangeTema={onChangeTema}
                onExportar={onExportarDados}
                onExcluirConta={onExcluirConta}
              />
            )}
          </div>
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
      [data-nymos-configuracoes] .nymos-reveal {
        animation: nymos-reveal-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-configuracoes] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
