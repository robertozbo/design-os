import {
  User,
  CalendarClock,
  CalendarCheck,
  ListChecks,
  ShieldCheck,
  Ruler,
  Settings,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type {
  ConfiguracoesNutriProps,
  SubPaginaId,
} from '@/../product/sections/configura-es-nutri/types'
import { PerfilPanel } from './PerfilPanel'
import { DisponibilidadePanel } from './DisponibilidadePanel'
import { GoogleCalendarPanel } from './GoogleCalendarPanel'
import { PerguntasPanel } from './PerguntasPanel'
import { PredefinicoesPacientePanel } from './PredefinicoesPacientePanel'
import { PreferenciasMedicoesPanel } from './PreferenciasMedicoesPanel'
import { PreferenciasPanel } from './PreferenciasPanel'

const ICONS: Record<SubPaginaId, ReactNode> = {
  perfil: <User className="w-4 h-4" strokeWidth={1.75} />,
  disponibilidade: <CalendarClock className="w-4 h-4" strokeWidth={1.75} />,
  'google-calendar': <CalendarCheck className="w-4 h-4" strokeWidth={1.75} />,
  perguntas: <ListChecks className="w-4 h-4" strokeWidth={1.75} />,
  'predefinicoes-paciente': <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />,
  'preferencias-medicoes': <Ruler className="w-4 h-4" strokeWidth={1.75} />,
  preferencias: <Settings className="w-4 h-4" strokeWidth={1.75} />,
}

export function ConfiguracoesNutriPage(props: ConfiguracoesNutriProps) {
  const {
    perfilContexto,
    subPaginas,
    configuracoes,
    opcoes,
    activeSubPagina = 'perfil',
    onSubPaginaChange,
    onSavePerfil,
    onRemoveFoto,
    onRemoveAssinatura,
    onSaveDisponibilidade,
    onAddIntervalo,
    onRemoveIntervalo,
    onConnectGoogleCalendar,
    onDisconnectGoogleCalendar,
    onSyncNowGoogleCalendar,
    onReconnectGoogleCalendar,
    onToggleBloquearHorariosOcupados,
    onCreatePergunta,
    onEditPergunta,
    onDeletePergunta,
    onTogglePerguntaHabilitada,
    onChangePredefinicoes,
    onChangePreferenciasMedicoes,
    onChangeIdioma,
    onChangeUnidades,
    onChangeLembretes,
  } = props

  return (
    <div
      data-nymos-config-nutri="true"
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header className="nymos-reveal opacity-0">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Conta · Preferências
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Configurações
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Personalize seu consultório e seu fluxo de trabalho · {perfilContexto.nome}
          </p>
        </header>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside
            className="nymos-reveal opacity-0 lg:sticky lg:top-6 self-start"
            style={{ animationDelay: '120ms' }}
          >
            <nav
              aria-label="Sub-páginas das configurações"
              className="
                flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible
                p-1.5 rounded-2xl
                bg-white/80 dark:bg-slate-900/40
                border border-slate-200/80 dark:border-slate-800
              "
            >
              {subPaginas.map((sub) => {
                const active = activeSubPagina === sub.id
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => onSubPaginaChange?.(sub.id)}
                    className={`
                      flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                      ${active
                        ? 'bg-teal-50 dark:bg-teal-950/40 ring-1 ring-teal-200/60 dark:ring-teal-900/60'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'}
                    `}
                  >
                    <span
                      className={`
                        inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                        ${active
                          ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}
                      `}
                    >
                      {ICONS[sub.id]}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-[13px] font-semibold ${
                          active
                            ? 'text-teal-800 dark:text-teal-200'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {sub.label}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-tight">
                        {sub.descritor}
                      </p>
                    </div>
                  </button>
                )
              })}
            </nav>
          </aside>

          <main
            className="nymos-reveal min-w-0 opacity-0"
            style={{ animationDelay: '180ms' }}
          >
            {activeSubPagina === 'perfil' && (
              <PerfilPanel
                perfil={configuracoes.perfil}
                ufs={opcoes.ufs}
                onSave={onSavePerfil}
                onRemoveFoto={onRemoveFoto}
                onRemoveAssinatura={onRemoveAssinatura}
              />
            )}

            {activeSubPagina === 'disponibilidade' && (
              <DisponibilidadePanel
                disponibilidade={configuracoes.disponibilidade}
                duracoesSlot={opcoes.duracoesSlot}
                onSave={onSaveDisponibilidade}
                onAddIntervalo={onAddIntervalo}
                onRemoveIntervalo={onRemoveIntervalo}
              />
            )}

            {activeSubPagina === 'google-calendar' && (
              <GoogleCalendarPanel
                googleCalendar={configuracoes.googleCalendar}
                onConnect={onConnectGoogleCalendar}
                onDisconnect={onDisconnectGoogleCalendar}
                onSyncNow={onSyncNowGoogleCalendar}
                onReconnect={onReconnectGoogleCalendar}
                onToggleBloquearHorariosOcupados={onToggleBloquearHorariosOcupados}
              />
            )}

            {activeSubPagina === 'perguntas' && (
              <PerguntasPanel
                catalogo={configuracoes.perguntas}
                onCreate={() =>
                  onCreatePergunta?.({
                    enunciado: '',
                    categoria: 'personalizadas',
                    tipo: 'texto-curto',
                    obrigatoria: false,
                    habilitada: true,
                    ordem: configuracoes.perguntas.itens.length + 1,
                  })
                }
                onEdit={onEditPergunta}
                onDelete={onDeletePergunta}
                onToggleHabilitada={onTogglePerguntaHabilitada}
              />
            )}

            {activeSubPagina === 'predefinicoes-paciente' && (
              <PredefinicoesPacientePanel
                predefinicoes={configuracoes.predefinicoesPaciente}
                onChange={onChangePredefinicoes}
              />
            )}

            {activeSubPagina === 'preferencias-medicoes' && (
              <PreferenciasMedicoesPanel
                preferenciasMedicoes={configuracoes.preferenciasMedicoes}
                onChange={onChangePreferenciasMedicoes}
              />
            )}

            {activeSubPagina === 'preferencias' && (
              <PreferenciasPanel
                preferencias={configuracoes.preferencias}
                idiomas={opcoes.idiomas}
                antecedenciaOpcoes={opcoes.antecedenciaConsulta}
                onChangeIdioma={onChangeIdioma}
                onChangeUnidades={onChangeUnidades}
                onChangeLembretes={onChangeLembretes}
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
