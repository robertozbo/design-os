import { useState } from 'react'
import {
  ClipboardList,
  Sparkles,
  FileText,
  FlaskConical,
  ScanSearch,
  ChevronDown,
} from 'lucide-react'
import type {
  ConsultaProps,
  TabAtiva,
} from '@/../product-clinico/sections/consulta/types'
import { ConsultaHeader } from './ConsultaHeader'
import { AnamneseView } from './AnamneseView'
import { SoapEditor } from './SoapEditor'
import { TranscricaoStream } from './TranscricaoStream'
import { PrescricaoTab } from './PrescricaoTab'
import { ImagensTab } from './ImagensTab'
import { LaboratorioTab } from './LaboratorioTab'
import { ContextPanel } from './ContextPanel'
import { PostConsultaModal } from './PostConsultaModal'

const TABS: { id: TabAtiva; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'anamnese', label: 'Anamnese', icon: ClipboardList },
  { id: 'soap', label: 'SOAP', icon: Sparkles },
  { id: 'prescricao', label: 'Prescrição', icon: FileText },
  { id: 'laboratorio', label: 'Laboratório', icon: FlaskConical },
  { id: 'imagens', label: 'Imagens', icon: ScanSearch },
]

export function Consulta({
  consulta,
  paciente,
  anamneseEntrada,
  soapBlocos,
  transcricaoTrechos,
  medicacaoAtiva,
  examesRecentes,
  imagensRecentes,
  evolucoesAnteriores,
  acoesPosConsulta,
  onIniciarGravacao,
  onPausarGravacao,
  onRetomarGravacao,
  onEncerrarGravacao,
  onTrocarTab,
  onEditarSoapBloco,
  onAlterarAnamnese,
  onAbrirMemed,
  onAssinarEFechar,
  onConfirmarAcoesPosConsulta,
  onEntrarSalaTele,
  onAbrirExameDetalhe,
  onAbrirImagemDetalhe,
  onCarregarImagem,
  onSalvarAnaliseImagem,
  analisesSalvasPorImagem,
  getExameImagemDetalhe,
  getExameLabDetalhe,
  onAbrirEvolucaoAnterior,
}: ConsultaProps) {
  const [tabAtiva, setTabAtiva] = useState<TabAtiva>(consulta.tabAtiva)
  const [transcricaoAberta, setTranscricaoAberta] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)

  const trocar = (t: TabAtiva) => {
    setTabAtiva(t)
    onTrocarTab?.(t)
  }

  const novoSOAP =
    soapBlocos.some((b) => b.geradoPorIA && !b.editadoPeloMedico) &&
    consulta.gravacaoStatus === 'gravando'

  return (
    <div
      data-clinico-consulta
      className="
        relative min-h-screen
        bg-gradient-to-b from-slate-50 via-white to-slate-100/60
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100
      "
    >
      <ConsultaHeader
        consulta={consulta}
        paciente={paciente}
        onIniciarGravacao={onIniciarGravacao}
        onPausarGravacao={onPausarGravacao}
        onRetomarGravacao={onRetomarGravacao}
        onEncerrarGravacao={onEncerrarGravacao}
        onEntrarSalaTele={onEntrarSalaTele}
      />

      <div className="mx-auto w-full max-w-[1600px] px-4 pb-24 pt-6 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
          {/* Main panel */}
          <div className="flex min-w-0 flex-col gap-4">
            {/* Tabs */}
            <div
              className="
                inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/80
                bg-white p-1 shadow-sm
                dark:border-slate-800 dark:bg-slate-900
              "
              role="tablist"
              aria-label="Seções da consulta"
            >
              {TABS.map((t) => {
                const ativo = tabAtiva === t.id
                const showBadge = t.id === 'soap' && novoSOAP && !ativo
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={ativo}
                    onClick={() => trocar(t.id)}
                    className={`
                      relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium
                      transition-colors
                      ${
                        ativo
                          ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                      }
                    `}
                  >
                    <Icon className="size-3.5" />
                    {t.label}
                    {showBadge && (
                      <span
                        className="inline-flex size-1.5 animate-pulse rounded-full bg-emerald-500"
                        aria-label="Novo conteúdo"
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            <div role="tabpanel" className="flex flex-col gap-4">
              {tabAtiva === 'anamnese' && (
                <Card>
                  <AnamneseView anamnese={anamneseEntrada} onAlterar={onAlterarAnamnese} />
                </Card>
              )}

              {tabAtiva === 'soap' && (
                <>
                  {/* Transcription card (collapsible) */}
                  <Card padding="tight">
                    <button
                      onClick={() => setTranscricaoAberta((v) => !v)}
                      className="
                        flex w-full items-center justify-between gap-2 rounded-md px-1 py-1
                        text-left text-xs font-semibold uppercase tracking-wider text-slate-500
                        transition-colors hover:text-slate-900
                        focus:outline-none focus:ring-2 focus:ring-slate-300
                        dark:text-slate-400 dark:hover:text-slate-100 dark:focus:ring-slate-600
                      "
                      aria-expanded={transcricaoAberta}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                        </span>
                        Transcrição em tempo real
                        <span className="font-mono text-[10px] tabular-nums text-slate-400">
                          ({transcricaoTrechos.length} trechos)
                        </span>
                      </span>
                      <ChevronDown
                        className={`size-4 transition-transform ${
                          transcricaoAberta ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {transcricaoAberta && (
                      <div className="mt-3 max-h-64 overflow-y-auto rounded-md border border-slate-200/60 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                        <TranscricaoStream trechos={transcricaoTrechos} />
                      </div>
                    )}
                  </Card>

                  {/* SOAP blocks */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                          Evolução estruturada
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          Gerada por {consulta.modeloIA} a partir da consulta · revise e edite cada bloco
                        </p>
                      </div>
                    </div>
                    <SoapEditor
                      blocos={soapBlocos}
                      modeloIA={consulta.modeloIA}
                      onEditarBloco={onEditarSoapBloco}
                    />
                  </div>

                  {/* Sign action */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Pronto pra finalizar?
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Ao assinar, a evolução vira parte do prontuário e o paciente é notificado
                        conforme as ações escolhidas.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onAssinarEFechar?.()
                        setModalAberto(true)
                      }}
                      className="
                        inline-flex shrink-0 items-center gap-2 rounded-lg
                        bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm
                        transition-all hover:bg-teal-500
                        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                        dark:focus:ring-offset-slate-950
                      "
                    >
                      Assinar e fechar
                    </button>
                  </div>
                </>
              )}

              {tabAtiva === 'prescricao' && (
                <Card>
                  <PrescricaoTab onAbrirMemed={onAbrirMemed} />
                </Card>
              )}

              {tabAtiva === 'laboratorio' && (
                <Card>
                  <LaboratorioTab
                    exames={examesRecentes}
                    getExameLabDetalhe={getExameLabDetalhe as never}
                    onAbrirExameDetalhe={onAbrirExameDetalhe}
                  />
                </Card>
              )}

              {tabAtiva === 'imagens' && (
                <Card>
                  <ImagensTab
                    imagens={imagensRecentes}
                    pacienteNomeAtual={paciente.nome}
                    pacienteIniciaisAtual={paciente.nome
                      .split(' ')
                      .map((s) => s[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                    getExameImagemDetalhe={
                      getExameImagemDetalhe as never
                    }
                    onAbrirImagem={onAbrirImagemDetalhe}
                    onCarregarImagem={onCarregarImagem}
                    onSalvarAnaliseImagem={onSalvarAnaliseImagem}
                    analisesSalvasPorImagem={analisesSalvasPorImagem}
                  />
                </Card>
              )}
            </div>
          </div>

          {/* Context panel (right) */}
          <div className="lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-104px)] lg:overflow-y-auto">
            <ContextPanel
              paciente={paciente}
              medicacaoAtiva={medicacaoAtiva}
              examesRecentes={examesRecentes}
              imagensRecentes={imagensRecentes}
              evolucoesAnteriores={evolucoesAnteriores}
              onAbrirImagem={onAbrirImagemDetalhe}
              onAbrirExame={onAbrirExameDetalhe}
              onAbrirEvolucao={onAbrirEvolucaoAnterior}
            />
          </div>
        </div>
      </div>

      {modalAberto && (
        <PostConsultaModal
          acoes={acoesPosConsulta}
          modeloIA={consulta.modeloIA}
          onConfirmar={(ids) => {
            onConfirmarAcoesPosConsulta?.(ids)
            setModalAberto(false)
          }}
          onCancelar={() => setModalAberto(false)}
        />
      )}
    </div>
  )
}

function Card({
  children,
  padding = 'normal',
}: {
  children: React.ReactNode
  padding?: 'tight' | 'normal'
}) {
  return (
    <section
      className={`
        rounded-xl border border-slate-200/80 bg-white shadow-sm
        dark:border-slate-800 dark:bg-slate-900
        ${padding === 'tight' ? 'p-4' : 'p-6'}
      `}
    >
      {children}
    </section>
  )
}
