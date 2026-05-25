import { useEffect, useState } from 'react'
import { ArrowLeft, FileDown, Printer, MoreHorizontal, Send } from 'lucide-react'
import type {
  ProntuarioProps,
  SecaoId,
} from '@/../product-clinico/sections/prontuario/types'
import { ProntuarioSidebar } from './ProntuarioSidebar'
import {
  SecaoIdentificacao,
  SecaoAnamnese,
  SecaoExameFisico,
  SecaoHipotesesPlano,
  SecaoEvolucoes,
  SecaoExames,
  SecaoPrescricoes,
} from './ProntuarioSecoes'

const SECAO_ORDER: SecaoId[] = [
  'identificacao',
  'anamnese',
  'exame-fisico',
  'hipoteses-plano',
  'evolucoes',
  'exames',
  'prescricoes',
]

export function Prontuario({
  paciente,
  anamnese,
  exameFisico,
  hipoteses,
  planoAtual,
  evolucoes,
  examesAnexados,
  prescricoesAtivas,
  onVoltar,
  onSalvarCampo,
  onAdicionarItem,
  onRemoverItem,
  onAbrirEvolucao,
  onAbrirExame,
  onAbrirPrescricao,
  onExportarPDF,
  onCompartilharTrecho,
}: ProntuarioProps) {
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoId>('identificacao')

  const navegar = (id: SecaoId) => {
    setSecaoAtiva(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          // pick the topmost
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          const id = visible[0].target.id as SecaoId
          if (SECAO_ORDER.includes(id)) {
            setSecaoAtiva(id)
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )

    SECAO_ORDER.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Keyboard shortcuts 1-7
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= SECAO_ORDER.length) {
        navegar(SECAO_ORDER[num - 1])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div
      data-clinico-prontuario
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      {/* Sticky topbar */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <button
            onClick={onVoltar}
            className="
              -ml-1 inline-flex items-center gap-1 rounded-md p-1.5 text-xs font-medium text-slate-500
              transition-colors hover:bg-slate-100 hover:text-slate-900
              dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
            "
          >
            <ArrowLeft className="size-3.5" />
            Paciente
          </button>

          <div className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-xs font-medium text-white shadow-sm">
              {paciente.iniciais}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                {paciente.nome}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Prontuário · {paciente.idade} anos · {paciente.condicoesCronicas.join(' · ')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ToolbarButton onClick={() => onCompartilharTrecho?.('')} icon={Send} label="Compartilhar" />
            <ToolbarButton onClick={() => onExportarPDF?.(true)} icon={FileDown} label="Exportar PDF" primary />
            <ToolbarButton onClick={() => window.print()} icon={Printer} label="Imprimir" />
            <button
              className="
                rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 transition-colors hover:bg-slate-50
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800
              "
              aria-label="Mais ações"
            >
              <MoreHorizontal className="size-3.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Sidebar */}
          <div
            className="w-full shrink-0 md:sticky md:top-[80px] md:w-[260px] md:overflow-y-auto md:pr-1"
            style={{ maxHeight: 'calc(100vh - 96px)' }}
          >
            <ProntuarioSidebar
              ativa={secaoAtiva}
              counts={{
                evolucoes: evolucoes.length,
                exames: examesAnexados.length,
                prescricoes: prescricoesAtivas.length,
              }}
              onNavegar={navegar}
              onExportarPDF={() => onExportarPDF?.(true)}
            />
          </div>

          {/* Conteúdo central */}
          <div className="min-w-0 flex-1 space-y-6">
            <SecaoIdentificacao paciente={paciente} />
            <SecaoAnamnese
              anamnese={anamnese}
              onSalvarCampo={onSalvarCampo}
              onAdicionarItem={onAdicionarItem}
              onRemoverItem={onRemoverItem}
            />
            <SecaoExameFisico exame={exameFisico} onSalvarCampo={onSalvarCampo} />
            <SecaoHipotesesPlano
              hipoteses={hipoteses}
              plano={planoAtual}
              onSalvarCampo={onSalvarCampo}
            />
            <SecaoEvolucoes evolucoes={evolucoes} onAbrirEvolucao={onAbrirEvolucao} />
            <SecaoExames exames={examesAnexados} onAbrirExame={onAbrirExame} />
            <SecaoPrescricoes
              prescricoes={prescricoesAtivas}
              onAbrirPrescricao={onAbrirPrescricao}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({
  onClick,
  icon: Icon,
  label,
  primary = false,
}: {
  onClick?: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
  primary?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors
        ${
          primary
            ? 'bg-teal-600 text-white shadow-sm hover:bg-teal-500'
            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }
      `}
    >
      <Icon className="size-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
