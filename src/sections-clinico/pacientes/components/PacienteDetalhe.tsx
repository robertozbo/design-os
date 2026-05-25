import { useState } from 'react'
import {
  ClipboardList,
  Activity,
  FlaskConical,
  Pill,
  Syringe,
} from 'lucide-react'
import type {
  PacienteDetalheProps,
  TabDetalhe,
} from '@/../product-clinico/sections/pacientes/types'
import { PacienteHeader } from './PacienteHeader'
import { VisaoGeralTab } from './VisaoGeralTab'
import { AtendimentosTab } from './AtendimentosTab'
import { ExamesTab } from './ExamesTab'
import { PrescricoesTab } from './PrescricoesTab'
import { GLP1Tab, findGLP1 } from './GLP1Tab'

type TabDetalheExt = TabDetalhe | 'glp1'

const TABS_BASE: { id: TabDetalheExt; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'visao-geral', label: 'Visão geral', icon: Activity },
  { id: 'glp1', label: 'GLP-1', icon: Syringe },
  { id: 'atendimentos', label: 'Atendimentos', icon: ClipboardList },
  { id: 'exames', label: 'Exames', icon: FlaskConical },
  { id: 'prescricoes', label: 'Prescrições', icon: Pill },
]

export function PacienteDetalhe({
  paciente,
  tabAtiva: tabExterna,
  onTrocarTab,
  onVoltar,
  onIniciarConsulta,
  onAbrirMensagemClinica,
  onAgendar,
  onExportarPDF,
  onAbrirAtendimento,
  onAbrirExame,
  onAbrirMemed,
  onAbrirProntuario,
}: PacienteDetalheProps) {
  const [tabAtiva, setTabAtiva] = useState<TabDetalheExt>(tabExterna || 'visao-geral')

  const trocar = (t: TabDetalheExt) => {
    setTabAtiva(t)
    if (t !== 'glp1') onTrocarTab?.(t)
  }

  const temGLP1 = findGLP1(paciente.medicacaoAtiva) !== null
  const TABS = TABS_BASE.filter((t) => t.id !== 'glp1' || temGLP1)

  return (
    <div
      data-clinico-paciente-detalhe
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      <PacienteHeader
        paciente={paciente}
        onVoltar={onVoltar}
        onAbrirMensagemClinica={onAbrirMensagemClinica}
        onAgendar={onAgendar}
        onExportarPDF={onExportarPDF}
        onIniciarConsulta={onIniciarConsulta}
        onAbrirProntuario={onAbrirProntuario}
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-2 sm:px-6 lg:px-10">
        {/* Tabs */}
        <div
          className="
            sticky top-[140px] z-[5] -mx-4 mb-6 flex flex-wrap items-center gap-1 border-b border-slate-200/80
            bg-gradient-to-b from-slate-50/95 to-slate-50/60 px-4 backdrop-blur-md
            sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10
            dark:border-slate-800/80 dark:from-slate-950/95 dark:to-slate-950/60
          "
          role="tablist"
        >
          {TABS.map((t) => {
            const ativo = tabAtiva === t.id
            const Icon = t.icon
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={ativo}
                onClick={() => trocar(t.id)}
                className={`
                  relative inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors
                  ${
                    ativo
                      ? 'text-teal-700 dark:text-teal-300'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }
                `}
              >
                <Icon className="size-4" />
                {t.label}
                {ativo && (
                  <span
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-teal-600 dark:bg-teal-400"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div role="tabpanel">
          {tabAtiva === 'visao-geral' && (
            <VisaoGeralTab
              paciente={paciente}
              onIniciarConsulta={onIniciarConsulta}
              onAbrirAtendimento={onAbrirAtendimento}
            />
          )}
          {tabAtiva === 'glp1' && temGLP1 && (
            <GLP1Tab
              paciente={paciente}
              onAjustarDose={(nome) =>
                onAbrirMemed?.({ medicacaoNome: nome, modo: 'ajustar' } as never)
              }
              onMensagemClinica={onAbrirMensagemClinica}
              onPausarTitulacao={(nome) => console.log('[GLP-1] pausar', nome)}
            />
          )}
          {tabAtiva === 'atendimentos' && (
            <AtendimentosTab
              atendimentos={paciente.atendimentos}
              onAbrirAtendimento={onAbrirAtendimento}
            />
          )}
          {tabAtiva === 'exames' && (
            <ExamesTab exames={paciente.examesRecentes} onAbrirExame={onAbrirExame} />
          )}
          {tabAtiva === 'prescricoes' && (
            <PrescricoesTab
              medicacaoAtiva={paciente.medicacaoAtiva}
              prescricoes={paciente.prescricoes}
              onAbrirMemed={onAbrirMemed}
            />
          )}
        </div>
      </div>
    </div>
  )
}
