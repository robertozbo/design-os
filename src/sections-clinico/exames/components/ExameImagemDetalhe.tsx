import { useState } from 'react'
import {
  ArrowLeft,
  Bone,
  Brain,
  CheckCircle2,
  MoreHorizontal,
  Printer,
  Send,
  Sparkles,
  Stethoscope,
  Waves,
} from 'lucide-react'
import type {
  ExameImagemDetalhe as ExameImagemDetalheType,
  ExameImagemDetalheProps,
  ModalidadeImagem,
} from '@/../product-clinico/sections/exames/types'
import { LaudoImagemViewer } from './LaudoImagemViewer'
import { AchadosImagemPanel } from './AchadosImagemPanel'
import { IAApoioPanel } from './IAApoioPanel'
import { formatDataBR } from './helpers'

const MODALIDADE_ICONE: Record<ModalidadeImagem, React.ComponentType<{ className?: string }>> = {
  'raio-x': Bone,
  usg: Waves,
  rm: Brain,
  tc: Brain,
  cintilografia: Sparkles,
}

const MODALIDADE_LABEL: Record<ModalidadeImagem, string> = {
  'raio-x': 'Raio-X',
  usg: 'USG',
  rm: 'RM',
  tc: 'TC',
  cintilografia: 'Cintilografia',
}

export function ExameImagemDetalhe({
  exames,
  selectedId,
  onSelectExame,
  onVoltar,
  onMarcarRevisado,
  onCompartilharComPaciente,
  onImprimir,
  onAbrirDicomExterno,
  onAbrirPaciente,
  onAbrirAuditIA,
  onAbrirComparacao,
}: ExameImagemDetalheProps) {
  const exameId = selectedId ?? exames[0]?.id ?? ''
  const exame = exames.find((e) => e.id === exameId) ?? exames[0]
  const [observacao, setObservacao] = useState(exame?.observacaoMedico ?? '')

  if (!exame) {
    return (
      <div className="p-8 text-sm text-slate-500">Nenhum exame de imagem disponível.</div>
    )
  }

  const aRevisar = exame.statusRevisao === 'a-revisar'

  return (
    <div
      data-clinico-exame-imagem-detalhe
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-10">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              onClick={onVoltar}
              className="-ml-1 inline-flex items-center gap-1 rounded-md p-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <ArrowLeft className="size-3.5" />
              Exames
            </button>

            <div className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

            <button
              onClick={() => onAbrirPaciente?.(exame.pacienteId)}
              className="flex min-w-0 items-center gap-2.5 rounded-md p-1 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-xs font-medium text-white shadow-sm">
                {exame.iniciais}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {exame.pacienteNome}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {exame.idade} anos · {exame.condicoesCronicas.join(' · ')}
                </p>
              </div>
            </button>

            <div className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 lg:block" />

            <div className="hidden min-w-0 lg:block">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {exame.tipo}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {exame.laboratorio} · coletado {formatDataBR(exame.dataColeta)} · solicitado por{' '}
                {exame.medicoSolicitante}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {aRevisar ? (
              <button
                onClick={() => onMarcarRevisado?.(exame.id, observacao)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-teal-500"
              >
                <CheckCircle2 className="size-3.5" />
                Marcar como revisado
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="size-3" />
                Revisado{exame.revisadoEm ? ` · ${formatDataBR(exame.revisadoEm)}` : ''}
              </span>
            )}
            <ToolbarButton
              onClick={() =>
                onCompartilharComPaciente?.(exame.id, exame.iaAnalise.blocos[0]?.conteudo ?? '')
              }
              icon={Send}
              label="Compartilhar"
            />
            <ToolbarButton onClick={() => onImprimir?.(exame.id)} icon={Printer} label="Imprimir" />
            <button className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800">
              <MoreHorizontal className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Cenário picker */}
        {exames.length > 1 && (
          <div className="border-t border-slate-200/60 bg-slate-50/40 dark:border-slate-800/60 dark:bg-slate-900/40">
            <div className="mx-auto flex w-full max-w-[1600px] items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-10">
              <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Cenário
              </span>
              {exames.map((e) => {
                const ativo = e.id === exame.id
                const Icon = MODALIDADE_ICONE[e.modalidade] ?? Stethoscope
                return (
                  <button
                    key={e.id}
                    onClick={() => onSelectExame?.(e.id)}
                    className={`
                      group/cn inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all
                      ${
                        ativo
                          ? 'border-teal-300 bg-teal-50 text-teal-800 shadow-sm dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600'
                      }
                    `}
                  >
                    <Icon className="size-3" />
                    <span className="font-mono text-[9px] uppercase tracking-wider opacity-70">
                      {MODALIDADE_LABEL[e.modalidade]}
                    </span>
                    {e.tipo
                      .replace('Raio-X de tórax (PA + perfil)', 'Tórax PA+perfil')
                      .replace('USG de tireoide com Doppler', 'Tireoide')
                      .replace('USG de abdome total', 'Abdome total')
                      .replace('RM de sela turca / hipófise com contraste', 'Hipófise')}
                    <span className="text-[9px] text-slate-400 dark:text-slate-500">
                      · {e.iniciais}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-6 sm:px-6 lg:px-10">
        {/* Sintomas + medicação contextuais */}
        <div className="mb-5 grid gap-3 lg:grid-cols-2">
          <ContextoCard titulo="Queixa atual (anamnese)" items={exame.anamneseSintomas} />
          <ContextoCard
            titulo="Medicação em uso"
            items={exame.medicacaoAtiva.map((m) => `${m.nome} ${m.dose} · ${m.posologia}`)}
          />
        </div>

        {/* Grid 3 colunas */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          {/* Coluna 1 — Laudo + Imagens */}
          <div className="min-h-[640px] min-w-0 lg:flex-1">
            <LaudoImagemViewer
              imagens={exame.imagens}
              laudo={exame.laudoOriginal}
              laboratorio={exame.laboratorio}
              radiologistaResponsavel={exame.radiologistaResponsavel}
              dataResultado={exame.dataResultado}
              dicomDisponivel={exame.dicomDisponivel}
              pacienteNome={exame.pacienteNome}
              estudoTipo={exame.tipo}
              onAbrirDicomExterno={(serieId) => onAbrirDicomExterno?.(exame.id, serieId)}
            />
          </div>

          {/* Coluna 2 — Achados + Comparação */}
          <div className="w-full min-w-0 lg:w-[320px] lg:shrink-0">
            <AchadosImagemPanel
              indicacao={exame.indicacao}
              achados={exame.achados}
              comparacao={exame.comparacao}
              onAbrirComparacao={() => onAbrirComparacao?.(exame.id)}
            />
          </div>

          {/* Coluna 3 — IA */}
          <div className="w-full min-w-0 lg:w-[360px] lg:shrink-0">
            <IAApoioPanel
              analise={exame.iaAnalise}
              onAbrirAuditIA={() => onAbrirAuditIA?.(exame.id)}
            />
          </div>
        </div>

        {/* Observação do médico */}
        <section className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Sua observação no prontuário
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Texto livre que vai pra evolução do paciente. Salvo automaticamente ao marcar como
            revisado.
          </p>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            rows={3}
            placeholder={placeholderPorModalidade(exame)}
            className="mt-3 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-900"
          />
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
            <Sparkles className="size-3" />
            Dica IA: o bloco "Cruzamento com medicação" geralmente tem o ponto mais acionável pra
            sua conduta.
          </div>
        </section>
      </div>
    </div>
  )
}

function placeholderPorModalidade(exame: ExameImagemDetalheType) {
  switch (exame.modalidade) {
    case 'raio-x':
      return 'Ex: Solicitar ECG + ECO transtorácico, retorno em 30d.'
    case 'usg':
      return 'Ex: Manter Levotiroxina 75mcg, USG controle em 12 meses, TSH em 6 sem.'
    case 'rm':
      return 'Ex: Suspender Sertralina sob cobertura psiquiátrica, repetir prolactina em 72h.'
    default:
      return ''
  }
}

function ToolbarButton({
  onClick,
  icon: Icon,
  label,
}: {
  onClick?: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <Icon className="size-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function ContextoCard({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {titulo}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((s, i) => (
          <li
            key={i}
            className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}
