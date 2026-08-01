import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowLeft,
  CheckCircle2,
  CloudUpload,
  ExternalLink,
  FileImage,
  FileText,
  Info,
  Loader2,
  Lock,
  MessageSquare,
  Pill,
  Plus,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react'
import type {
  ImagemSerie,
  LaudoOriginal,
  ModalidadeImagem,
} from '@/../product-doctor/sections/exames/types'
import { ImagemMedicaMock } from './ImagemMedicaMock'
import { LaudoViewer } from './LaudoViewer'

export interface UploadFile {
  id: string
  nome: string
  tamanhoKb: number
  tipo: 'pdf' | 'imagem' | 'dicom'
}

export interface ExameUploadForm {
  pacienteNome: string
  tipo: string
  modalidade: ModalidadeImagem
  dataColeta: string
  laboratorio: string
  observacao: string
  /** Queixas selecionadas via chips no passo de análise IA. */
  queixas: string[]
  /** Queixa em texto livre ("Outro"). */
  queixaOutro: string
}

type Stage = 'form' | 'saved' | 'analyzing' | 'analyzed'

interface UploadImagemSectionProps {
  /**
   * Pré-preenche e TRAVA o paciente quando vem de um contexto onde ele já está
   * resolvido (Consulta · Detalhe do Paciente). Upload nunca nasce sem contexto.
   */
  pacienteNome?: string
  onVoltar?: () => void
  onSalvo?: (form: ExameUploadForm, files: UploadFile[]) => void
  onAnalisadoComIA?: (form: ExameUploadForm, files: UploadFile[]) => void
  onVerDetalhe?: () => void
}

const MODALIDADES: { id: ModalidadeImagem; label: string }[] = [
  { id: 'raio-x', label: 'Raio-X' },
  { id: 'usg', label: 'USG' },
  { id: 'rm', label: 'RM' },
  { id: 'tc', label: 'TC' },
  { id: 'cintilografia', label: 'Cintilografia' },
]

const TIPOS_SUGERIDOS: Record<ModalidadeImagem, string[]> = {
  'raio-x': ['Raio-X de tórax', 'Raio-X de mão', 'Raio-X de coluna lombar'],
  usg: ['USG de tireoide com Doppler', 'USG de abdome total', 'USG transvaginal'],
  rm: ['RM de sela turca / hipófise', 'RM de encéfalo', 'RM de coluna'],
  tc: ['TC de tórax', 'TC de abdome', 'TC de crânio'],
  cintilografia: ['Cintilografia tireoidiana', 'PAAF tireoide com cintilo'],
}

/** Sintomas comuns no contexto endócrino — tooltip explica a relevância clínica. */
const QUEIXAS_PRESET: { label: string; tooltip: string }[] = [
  { label: 'Febre', tooltip: 'Processo infeccioso/inflamatório — relevante pra tireoidite subaguda' },
  { label: 'Tontura', tooltip: 'Pode indicar hipoglicemia, hipotensão postural ou descompensação' },
  { label: 'Vômitos', tooltip: 'Atenção a cetoacidose diabética e intolerância a GLP-1' },
  { label: 'Cansaço físico', tooltip: 'Sugestivo de hipotireoidismo, anemia ou descompensação glicêmica' },
  { label: 'Dor abdominal', tooltip: 'Atenção a pancreatite (GLP-1) e cetoacidose' },
  { label: 'Palpitações', tooltip: 'Sugestivo de hipertireoidismo ou hipoglicemia' },
  { label: 'Perda de peso', tooltip: 'Sugestivo de hipertireoidismo ou DM descompensado' },
  { label: 'Ganho de peso', tooltip: 'Sugestivo de hipotireoidismo ou efeito de medicação' },
]

const MOCK_FILES: Record<UploadFile['tipo'], string[]> = {
  pdf: ['laudo-radiologista.pdf'],
  imagem: ['rxtorax-pa.jpg', 'rxtorax-perfil.jpg'],
  dicom: ['estudo-completo.dcm.zip'],
}

export function UploadImagemSection({
  pacienteNome,
  onVoltar,
  onSalvo,
  onAnalisadoComIA,
  onVerDetalhe,
}: UploadImagemSectionProps) {
  const [stage, setStage] = useState<Stage>('form')
  const [files, setFiles] = useState<UploadFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [form, setForm] = useState<ExameUploadForm>({
    pacienteNome: pacienteNome ?? '',
    tipo: '',
    modalidade: 'raio-x',
    dataColeta: new Date().toISOString().slice(0, 10),
    laboratorio: '',
    observacao: '',
    queixas: [],
    queixaOutro: '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  /** Etapa 2 — drawer de análise IA (queixas + miniatura + confirmar). */
  const [drawerIAAberto, setDrawerIAAberto] = useState(false)

  useEffect(() => {
    setForm((f) => ({ ...f, pacienteNome: pacienteNome ?? f.pacienteNome }))
  }, [pacienteNome])

  const addMockFiles = (tipo: UploadFile['tipo']) => {
    const novos: UploadFile[] = MOCK_FILES[tipo].map((nome, i) => ({
      id: `f-${Date.now()}-${i}`,
      nome,
      tamanhoKb: tipo === 'dicom' ? 28400 : tipo === 'imagem' ? 1240 : 380,
      tipo,
    }))
    setFiles((prev) => [...prev, ...novos])
  }

  const removerFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))

  const valido =
    files.length > 0 &&
    form.pacienteNome.trim() &&
    form.tipo.trim() &&
    form.dataColeta.trim() &&
    form.laboratorio.trim()

  const salvar = () => {
    if (!valido) return
    onSalvo?.(form, files)
    setStage('saved')
  }

  const analisar = () => {
    setDrawerIAAberto(false)
    setStage('analyzing')
    setTimeout(() => {
      setStage('analyzed')
      onAnalisadoComIA?.(form, files)
    }, 5000)
  }

  const novoUpload = () => {
    setFiles([])
    setStage('form')
    setForm({
      pacienteNome: pacienteNome ?? '',
      tipo: '',
      modalidade: 'raio-x',
      dataColeta: new Date().toISOString().slice(0, 10),
      laboratorio: '',
      observacao: '',
      queixas: [],
      queixaOutro: '',
    })
  }

  const tiposSugeridos = TIPOS_SUGERIDOS[form.modalidade]

  return (
    <div data-doctor-upload-imagem-section>
      {/* Cabeçalho da section */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <button
            onClick={onVoltar}
            className="-ml-1 mt-0.5 inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Carregar exame de imagem
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Raio-X, USG, RM ou TC. Salve e o exame entra na lista do paciente — análise por IA
              é opcional, direto no exame.
            </p>
          </div>
        </div>
      </div>

      {stage === 'form' && (
        <FormStage
          files={files}
          form={form}
          pacienteTravado={!!pacienteNome}
          dragOver={dragOver}
          tiposSugeridos={tiposSugeridos}
          fileInputRef={fileInputRef}
          valido={!!valido}
          setDragOver={setDragOver}
          setForm={setForm}
          addMockFiles={addMockFiles}
          removerFile={removerFile}
          onSalvar={salvar}
          onCancelar={onVoltar}
        />
      )}

      {stage === 'saved' && (
        <SavedStage
          form={form}
          files={files}
          onAnalisar={() => setDrawerIAAberto(true)}
          onVoltarLista={onVoltar}
          onCarregarOutra={novoUpload}
        />
      )}

      {stage === 'analyzing' && <AnalyzingStage form={form} />}

      {stage === 'analyzed' && (
        <AnalyzedStage
          form={form}
          onVerDetalhe={onVerDetalhe ?? onVoltar}
          onVoltarLista={onVoltar}
          onReanalisar={() => {
            console.log('[IA audit] re-analise', {
              form,
              files: files.length,
              em: new Date().toISOString(),
            })
            setDrawerIAAberto(true)
          }}
        />
      )}

      {drawerIAAberto && (
        <AnalisarIADrawer
          form={form}
          files={files}
          setForm={setForm}
          onAnalisar={analisar}
          onClose={() => setDrawerIAAberto(false)}
        />
      )}
    </div>
  )
}

// ─── Stages ────────────────────────────────────────────────────────────────

function FormStage({
  files,
  form,
  pacienteTravado,
  dragOver,
  tiposSugeridos,
  fileInputRef,
  valido,
  setDragOver,
  setForm,
  addMockFiles,
  removerFile,
  onSalvar,
  onCancelar,
}: {
  files: UploadFile[]
  form: ExameUploadForm
  pacienteTravado: boolean
  dragOver: boolean
  tiposSugeridos: string[]
  fileInputRef: React.RefObject<HTMLInputElement | null>
  valido: boolean
  setDragOver: (v: boolean) => void
  setForm: (v: ExameUploadForm) => void
  addMockFiles: (t: UploadFile['tipo']) => void
  removerFile: (id: string) => void
  onSalvar: () => void
  onCancelar?: () => void
}) {
  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          addMockFiles('imagem')
        }}
        className={`
          rounded-xl border-2 border-dashed p-8 text-center transition-colors
          ${
            dragOver
              ? 'border-teal-400 bg-teal-50/60 dark:border-teal-600 dark:bg-teal-950/30'
              : 'border-slate-300 bg-slate-50/40 dark:border-slate-700 dark:bg-slate-900/40'
          }
        `}
      >
        <CloudUpload className="mx-auto size-10 text-slate-400" />
        <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">
          Arraste arquivos aqui
        </p>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          PDF do laudo + JPG/PNG das imagens, ou ZIP/DICOM completo
        </p>
        <input ref={fileInputRef} type="file" multiple className="hidden" />
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => addMockFiles('pdf')}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <FileText className="size-3" />
            Adicionar PDF
          </button>
          <button
            type="button"
            onClick={() => addMockFiles('imagem')}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <FileImage className="size-3" />
            Adicionar imagens
          </button>
          <button
            type="button"
            onClick={() => addMockFiles('dicom')}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <FileImage className="size-3" />
            DICOM (.zip)
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
            >
              <span
                className={`
                  flex size-7 shrink-0 items-center justify-center rounded-md
                  ${
                    f.tipo === 'pdf'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      : f.tipo === 'dicom'
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
                        : 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                  }
                `}
              >
                {f.tipo === 'pdf' ? (
                  <FileText className="size-3.5" />
                ) : (
                  <FileImage className="size-3.5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900 dark:text-slate-100">{f.nome}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {(f.tamanhoKb / 1024).toFixed(1)} MB · {f.tipo.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => removerFile(f.id)}
                className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                aria-label={`Remover ${f.nome}`}
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Form fields */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Identificação do exame
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Paciente" required>
            {pacienteTravado ? (
              <div className="flex w-full items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <Lock className="size-3.5 shrink-0 text-slate-400" aria-hidden />
                <span className="truncate font-medium">{form.pacienteNome}</span>
              </div>
            ) : (
              <input
                type="text"
                value={form.pacienteNome}
                onChange={(e) => setForm({ ...form, pacienteNome: e.target.value })}
                placeholder="Buscar paciente…"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-950"
              />
            )}
          </Field>

          <Field label="Modalidade" required>
            <select
              value={form.modalidade}
              onChange={(e) =>
                setForm({ ...form, modalidade: e.target.value as ModalidadeImagem, tipo: '' })
              }
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-950"
            >
              {MODALIDADES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tipo de exame" required hint="Sugestões abaixo">
            <input
              type="text"
              list="tipos-sugeridos-section"
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              placeholder="ex: Raio-X de tórax PA + perfil"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-950"
            />
            <datalist id="tipos-sugeridos-section">
              {tiposSugeridos.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>

          <Field label="Data de coleta" required>
            <input
              type="date"
              value={form.dataColeta}
              onChange={(e) => setForm({ ...form, dataColeta: e.target.value })}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-950"
            />
          </Field>

          <Field label="Laboratório / Serviço" required>
            <input
              type="text"
              value={form.laboratorio}
              onChange={(e) => setForm({ ...form, laboratorio: e.target.value })}
              placeholder="ex: Fleury, CDB, Hermes Pardini"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-950"
            />
          </Field>
        </div>

      </div>

      {/* CTA */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
          <Info className="size-3.5 shrink-0 text-slate-400" />
          Ao salvar, o exame entra como <strong>"a revisar"</strong> na lista. Análise por IA é
          opcional, direto no exame salvo.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSalvar}
            disabled={!valido}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors
              hover:bg-teal-500
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
              disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-teal-600
            "
          >
            <CheckCircle2 className="size-3.5" />
            Salvar exame
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Drawer "Analisar exame" — a análise é DO PROFISSIONAL.
 * IA entra como auxílio opcional ("Insights com IA"): gera uma sugestão a partir
 * do laudo + queixas; o profissional decide se insere no campo da própria análise.
 * IA é apoio à interpretação — NUNCA diagnóstico (não-SaMD).
 */
export function AnalisarIADrawer({
  form,
  files,
  laudo,
  setForm,
  onAnalisar,
  onClose,
}: {
  form: ExameUploadForm
  files: UploadFile[]
  /** Laudo original do laboratório — quando presente, a lateral mostra o documento (estilo ExameDetalhe). */
  laudo?: LaudoOriginal
  setForm: (v: ExameUploadForm) => void
  /** Chamado ao salvar a análise do profissional. */
  onAnalisar: () => void
  onClose: () => void
}) {
  const mockImagem = mockImagemPorModalidade(form.modalidade, form.tipo)
  const [insightStage, setInsightStage] = useState<'idle' | 'gerando' | 'pronto'>('idle')
  const [insightTexto, setInsightTexto] = useState('')
  const [insightInserido, setInsightInserido] = useState(false)
  /** Snapshot do contexto usado na geração — transparência sobre o que a IA analisou. */
  const [insightContexto, setInsightContexto] = useState<{
    queixas: string[]
    outro: string
  } | null>(null)

  const toggleQueixa = (q: string) =>
    setForm({
      ...form,
      queixas: form.queixas.includes(q)
        ? form.queixas.filter((x) => x !== q)
        : [...form.queixas, q],
    })

  const gerarInsights = () => {
    setInsightStage('gerando')
    setInsightInserido(false)
    setInsightContexto({ queixas: [...form.queixas], outro: form.queixaOutro.trim() })
    console.log('[IA audit] insights gerados', { tipo: form.tipo, em: new Date().toISOString() })
    setTimeout(() => {
      const queixasTxt = [...form.queixas, form.queixaOutro.trim()]
        .filter(Boolean)
        .join(', ')
        .toLowerCase()
      setInsightTexto(
        `${form.tipo} (${form.laboratorio}): em comparação com o histórico do paciente, os valores indicam tendência de alteração discreta, sem sinal de alarme identificado.` +
          (queixasTxt
            ? ` As queixas relatadas (${queixasTxt}) são compatíveis com os achados e merecem correlação clínica.`
            : '') +
          ' Sugere-se reavaliação no próximo retorno.',
      )
      setInsightStage('pronto')
    }, 1800)
  }

  const inserirNaAnalise = () => {
    setForm({
      ...form,
      observacao: form.observacao.trim()
        ? `${form.observacao.trim()}\n\n[Insight IA — revisado pelo profissional] ${insightTexto}`
        : `[Insight IA — revisado pelo profissional] ${insightTexto}`,
    })
    setInsightInserido(true)
  }

  // Esc fecha o drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analisar-ia-title"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-slate-950/70"
      />

      {/* Largura limitada pra manter a sidebar de navegação do app visível */}
      <aside className="relative ml-auto flex h-full w-full max-w-[min(72rem,calc(100vw-340px))] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 max-lg:max-w-full">
        {/* Header — voltar à esquerda, mesma estratégia do detalhe do laudo */}
        <header className="flex shrink-0 items-center gap-3 border-b border-slate-200/80 bg-gradient-to-r from-teal-50/60 to-white px-5 py-4 dark:border-slate-800/80 dark:from-teal-950/30 dark:to-slate-950">
          <button
            onClick={onClose}
            className="
              -ml-1 inline-flex items-center gap-1 rounded-md p-1.5 text-xs font-medium text-slate-500
              transition-colors hover:bg-slate-100 hover:text-slate-900
              dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
            "
          >
            <ArrowLeft className="size-3.5" />
            Exames
          </button>

          <div className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0">
              <h2
                id="analisar-ia-title"
                className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50"
              >
                Analisar exame
              </h2>
              <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                {form.tipo} · {form.pacienteNome}
              </p>
            </div>
          </div>
        </header>

        {/* Conteúdo scrollável — 3 colunas: laudo · análise do profissional · IA */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid gap-5 lg:grid-cols-[300px_1fr_320px] lg:items-start">
          {/* Coluna lateral — laudo original ou miniatura da imagem (sticky) */}
          <section className="lg:sticky lg:top-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Exame a analisar
            </p>
            {laudo ? (
              /* Laboratorial — documento do laudo, mesmo viewer do ExameDetalhe */
              <div className="mt-2 h-[26rem]">
                <LaudoViewer
                  laudo={laudo}
                  laboratorio={form.laboratorio}
                  dataResultado={form.dataColeta}
                />
              </div>
            ) : (
              /* Imagem — miniatura + arquivos */
              <div className="mt-2 overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800">
                {files.some((f) => f.tipo !== 'pdf') && <ImagemMedicaMock imagem={mockImagem} />}
                <ul className="divide-y divide-slate-100 border-t border-slate-100 first:border-t-0 dark:divide-slate-800 dark:border-slate-800">
                  {files.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-600 dark:text-slate-300"
                    >
                      {f.tipo === 'pdf' ? (
                        <FileText className="size-3.5 shrink-0 text-slate-400" />
                      ) : (
                        <FileImage className="size-3.5 shrink-0 text-slate-400" />
                      )}
                      <span className="truncate font-mono">{f.nome}</span>
                      <span className="ml-auto shrink-0 font-mono text-[10px] tabular-nums text-slate-400">
                        {f.tamanhoKb >= 1000
                          ? `${(f.tamanhoKb / 1000).toFixed(1)} MB`
                          : `${f.tamanhoKb} KB`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-2 px-1 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
              {form.laboratorio} · coletado{' '}
              {new Date(form.dataColeta + 'T12:00:00').toLocaleDateString('pt-BR')}
            </p>
          </section>

          {/* Coluna principal — queixas + análise do profissional + IA */}
          <div className="min-w-0 space-y-4">
          {/* Queixas pré-definidas */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Queixas atuais do paciente
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Opcional — a IA cruza os sintomas com os achados do exame.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {QUEIXAS_PRESET.map((q) => {
                const ativo = form.queixas.includes(q.label)
                return (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => toggleQueixa(q.label)}
                    title={q.tooltip}
                    aria-pressed={ativo}
                    className={`
                      rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors
                      ${
                        ativo
                          ? 'border-teal-600 bg-teal-600 text-white dark:border-teal-500 dark:bg-teal-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-300'
                      }
                    `}
                  >
                    {q.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Preenchimento manual */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Outras queixas — texto livre
            </p>
            <textarea
              value={form.queixaOutro}
              onChange={(e) => setForm({ ...form, queixaOutro: e.target.value })}
              placeholder="ex: Tosse seca há 2 semanas, pior à noite…"
              maxLength={400}
              rows={5}
              className="
                mt-2 w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed
                placeholder:text-slate-400
                focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-500
              "
            />
          </section>

          {/* Sua análise — o registro é do profissional */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sua análise <span className="text-rose-500">*</span>
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Interpretação e conduta — registro oficial do profissional.
            </p>
            <textarea
              value={form.observacao}
              onChange={(e) => setForm({ ...form, observacao: e.target.value })}
              placeholder="ex: TSH em elevação progressiva com T4 livre limítrofe. Manter Levotiroxina 50mcg e repetir perfil em 8 semanas…"
              maxLength={1000}
              rows={5}
              className="
                mt-2 w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed
                placeholder:text-slate-400
                focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                dark:border-slate-700 dark:bg-slate-950 dark:placeholder:text-slate-500
              "
            />
            <p className="mt-1 text-right font-mono text-[10px] tabular-nums text-slate-400">
              {form.observacao.length}/1000
            </p>
          </section>

          </div>

          {/* Coluna direita — Insights com IA (auxílio opcional, nunca diagnóstico) */}
          <section className="rounded-xl border border-teal-200/60 bg-gradient-to-b from-teal-50/40 to-white p-4 dark:border-teal-900/40 dark:from-teal-950/20 dark:to-slate-950 lg:sticky lg:top-0">
            <div className="flex items-start gap-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                <Sparkles className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                  Insights com IA
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  <strong>Auxílio à interpretação — não é diagnóstico.</strong> A IA resume o
                  laudo, compara com o histórico e cruza com as queixas. Se achar correto, você
                  insere na sua análise.
                </p>
              </div>
            </div>

            {insightStage === 'idle' && (
              <button
                onClick={gerarInsights}
                className="
                  mt-3 inline-flex items-center gap-1.5 rounded-lg border border-teal-300/70 bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-sm transition-colors
                  hover:bg-teal-50
                  dark:border-teal-800/60 dark:bg-slate-900 dark:text-teal-300 dark:hover:bg-teal-950/40
                "
              >
                <Sparkles className="size-3.5" />
                Gerar insights com IA
              </button>
            )}

            {insightStage === 'gerando' && (
              <p className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <Loader2 className="size-3.5 animate-spin text-teal-600 dark:text-teal-400" />
                Lendo laudo, comparando histórico e cruzando queixas…
              </p>
            )}

            {insightStage === 'pronto' && (
              <div className="mt-3">
                {/* O que foi analisado — transparência do contexto enviado à IA */}
                <div className="mb-2.5 rounded-lg bg-white/60 p-2.5 dark:bg-slate-900/40">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    O que foi analisado
                  </p>
                  <ul className="mt-1.5 space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-px size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        Laudo: <strong>{form.tipo}</strong> ({form.laboratorio})
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-px size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>Histórico de exames do paciente</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-px size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="min-w-0">
                        Queixas:{' '}
                        {insightContexto &&
                        (insightContexto.queixas.length > 0 || insightContexto.outro) ? (
                          <span className="inline-flex flex-wrap gap-1 align-middle">
                            {insightContexto.queixas.map((q) => (
                              <span
                                key={q}
                                className="rounded-full border border-teal-300/60 bg-teal-50 px-1.5 py-px text-[10px] font-medium text-teal-800 dark:border-teal-800/60 dark:bg-teal-950/40 dark:text-teal-300"
                              >
                                {q}
                              </span>
                            ))}
                            {insightContexto.outro && (
                              <span className="rounded-full border border-teal-300/60 bg-teal-50 px-1.5 py-px text-[10px] italic text-teal-800 dark:border-teal-800/60 dark:bg-teal-950/40 dark:text-teal-300">
                                "{insightContexto.outro}"
                              </span>
                            )}
                          </span>
                        ) : (
                          <em className="text-slate-400">nenhuma informada</em>
                        )}
                      </span>
                    </li>
                  </ul>
                </div>

                <blockquote className="rounded-lg border-l-2 border-teal-500 bg-white/80 p-3 text-[11px] leading-relaxed text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                  {insightTexto}
                  <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-wider text-slate-400">
                    claude-opus-4-7 · sugestão de IA · decisão clínica é sua
                  </span>
                </blockquote>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={inserirNaAnalise}
                    disabled={insightInserido}
                    className="
                      inline-flex items-center gap-1 rounded-md bg-teal-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm transition-colors
                      hover:bg-teal-500 disabled:cursor-default disabled:bg-emerald-600
                    "
                  >
                    {insightInserido ? (
                      <>
                        <CheckCircle2 className="size-3" />
                        Inserido na análise
                      </>
                    ) : (
                      <>
                        <Plus className="size-3" />
                        Inserir na minha análise
                      </>
                    )}
                  </button>
                  <button
                    onClick={gerarInsights}
                    className="rounded-md px-2.5 py-1 text-[11px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  >
                    Re-gerar
                  </button>
                  <button
                    onClick={() => {
                      setInsightStage('idle')
                      setInsightTexto('')
                    }}
                    className="rounded-md px-2.5 py-1 text-[11px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  >
                    Descartar
                  </button>
                </div>
              </div>
            )}

            <p className="mt-3 flex items-start gap-1.5 border-t border-teal-200/40 pt-2.5 text-[10px] leading-relaxed text-slate-400 dark:border-teal-900/30">
              <Info className="mt-px size-3 shrink-0" />
              Inferência registrada no audit log (LGPD). O insight só entra no prontuário se o
              profissional inserir na análise.
            </p>
          </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200/80 bg-slate-50/60 px-5 py-3.5 dark:border-slate-800/80 dark:bg-slate-900/40">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={onAnalisar}
            disabled={!form.observacao.trim()}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors
              hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-40
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
            "
          >
            <CheckCircle2 className="size-3.5" />
            Salvar análise
          </button>
        </footer>
      </aside>
    </div>,
    document.body,
  )
}

function SavedStage({
  form,
  files,
  onAnalisar,
  onVoltarLista,
  onCarregarOutra,
}: {
  form: ExameUploadForm
  files: UploadFile[]
  onAnalisar: () => void
  onVoltarLista?: () => void
  onCarregarOutra: () => void
}) {
  return (
    <div className="space-y-5">
      {/* Sucesso */}
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <CheckCircle2 className="size-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
            Exame salvo
          </p>
          <p className="mt-0.5 text-xs text-emerald-800 dark:text-emerald-200">
            {files.length} arquivo{files.length === 1 ? '' : 's'} · {form.tipo} · paciente{' '}
            <strong>{form.pacienteNome}</strong>. Marcado como <strong>"a revisar"</strong> na
            lista de exames.
          </p>
        </div>
      </div>

      {/* IA opcional */}
      <div className="rounded-xl border border-teal-200/70 bg-gradient-to-br from-teal-50/60 via-emerald-50/40 to-white p-5 shadow-sm dark:border-teal-900/40 dark:from-teal-950/30 dark:via-emerald-950/20 dark:to-slate-900">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
            <Sparkles className="size-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Analisar com IA?
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              A IA extrai achados estruturados do laudo, compara com exames anteriores do
              paciente e cruza com queixa atual + medicação ativa. Leva ~30-90 segundos.
              Inferência registrada no audit log (LGPD).{' '}
              <strong>Não substitui interpretação médica.</strong>
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={onAnalisar}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors
              hover:bg-teal-500
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
            "
          >
            <Sparkles className="size-3.5" />
            Analisar com IA
          </button>
          <button
            onClick={onVoltarLista}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Sem IA agora — voltar
          </button>
          <button
            onClick={onCarregarOutra}
            className="ml-auto inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <Plus className="size-3.5" />
            Carregar outra imagem
          </button>
        </div>
      </div>
    </div>
  )
}

function AnalyzingStage({ form }: { form: ExameUploadForm }) {
  const mockImagem = mockImagemPorModalidade(form.modalidade, form.tipo)
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <header className="mb-4 text-center">
        <p className="text-base font-semibold text-slate-900 dark:text-slate-50">
          Analisando com IA
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {form.tipo} · Extraindo achados, comparando histórico e cruzando com medicação
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px] lg:items-start">
        {/* Imagem carregada + varredura IA por cima */}
        <div className="relative overflow-hidden rounded-xl">
          <ImagemMedicaMock imagem={mockImagem} />
          <IAScanOverlay />
        </div>

        {/* 4 passos progressivos */}
        <div className="rounded-xl border border-slate-200/60 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Loader2 className="size-3 animate-spin text-teal-600 dark:text-teal-400" />
            Pipeline da IA
          </p>
          <ul className="mt-3 space-y-2 text-left text-[11px]">
            <ProcessingStep label="Lendo PDF do laudo" done />
            <ProcessingStep label="Identificando achados estruturados" done />
            <ProcessingStep label="Buscando histórico do paciente" running />
            <ProcessingStep label="Cruzando com medicação ativa" />
          </ul>
        </div>
      </div>
    </div>
  )
}

function mockImagemPorModalidade(
  modalidade: ModalidadeImagem,
  tipo: string,
): ImagemSerie {
  const visual: ImagemSerie['mockVisual'] =
    modalidade === 'raio-x'
      ? 'torax-pa'
      : modalidade === 'usg'
        ? 'tireoide-long'
        : modalidade === 'rm'
          ? 'crânio-sagital-t1'
          : modalidade === 'tc'
            ? 'crânio-coronal-t1'
            : 'tireoide-long'
  const rotulo: Record<ModalidadeImagem, string> = {
    'raio-x': 'Raio-X',
    usg: 'USG',
    rm: 'RM',
    tc: 'TC',
    cintilografia: 'Cintilo',
  }
  return {
    id: 'upload-preview',
    rotulo: rotulo[modalidade],
    descricao: tipo || 'Exame carregado',
    mockVisual: visual,
  }
}

function IAScanOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-xl">
      {/* Dim + grid teal */}
      <div
        className="absolute inset-0 bg-slate-950"
        style={{ animation: 'ia-dim-pulse 2.4s ease-in-out infinite', opacity: 0.4 }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(45,212,191,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,212,191,0.55) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          animation: 'ia-grid-fade 2.4s ease-in-out infinite',
        }}
      />
      {/* Trail glow */}
      <div
        className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-teal-400/30 to-teal-400/60"
        style={{ animation: 'ia-trail-y 2.4s ease-in-out infinite' }}
      />
      {/* Scanlines */}
      <div
        className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_32px_8px_rgba(94,234,212,0.85)]"
        style={{ animation: 'ia-scan-y 2.4s ease-in-out infinite', top: 0 }}
      />
      <div
        className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-teal-300/80 to-transparent shadow-[0_0_20px_6px_rgba(45,212,191,0.6)]"
        style={{ animation: 'ia-scan-x 3.6s ease-in-out infinite', left: 0 }}
      />
      {/* Blips */}
      <span
        className="absolute size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(94,234,212,0.9)]"
        style={{ left: '24%', top: '36%', animation: 'ia-blip 1.8s ease-in-out infinite' }}
      />
      <span
        className="absolute size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(94,234,212,0.9)]"
        style={{ left: '66%', top: '54%', animation: 'ia-blip 1.8s ease-in-out infinite 0.4s' }}
      />
      <span
        className="absolute size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(94,234,212,0.9)]"
        style={{ left: '46%', top: '72%', animation: 'ia-blip 1.8s ease-in-out infinite 0.9s' }}
      />
      {/* Corner brackets */}
      <span
        className="absolute left-3 top-3 size-6 border-l-2 border-t-2 border-cyan-300"
        style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite' }}
      />
      <span
        className="absolute right-3 top-3 size-6 border-r-2 border-t-2 border-cyan-300"
        style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite 0.3s' }}
      />
      <span
        className="absolute bottom-3 left-3 size-6 border-b-2 border-l-2 border-cyan-300"
        style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite 0.6s' }}
      />
      <span
        className="absolute bottom-3 right-3 size-6 border-b-2 border-r-2 border-cyan-300"
        style={{ animation: 'ia-corner-pulse 1.2s ease-in-out infinite 0.9s' }}
      />
      {/* HUD inferior */}
      <div className="absolute bottom-12 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-md border border-cyan-400/60 bg-slate-950/95 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-200 shadow-[0_0_24px_4px_rgba(94,234,212,0.3)] backdrop-blur-md">
        <Loader2 className="size-3 animate-spin" />
        Varredura IA · {Math.round(Math.random() * 30 + 60)}%
      </div>
    </div>
  )
}

function AnalyzedStage({
  form,
  onVerDetalhe,
  onVoltarLista,
  onReanalisar,
}: {
  form: ExameUploadForm
  onVerDetalhe?: () => void
  onVoltarLista?: () => void
  onReanalisar?: () => void
}) {
  const mockImagem = mockImagemPorModalidade(form.modalidade, form.tipo)
  const blocos = mockIABlocosPorTipo(form.tipo, form.modalidade)
  return (
    <div className="space-y-5">
      {/* Banner de conclusão */}
      <header className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/60 px-5 py-4 dark:border-emerald-900/40 dark:bg-emerald-950/30">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Análise pronta
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            IA produziu {blocos.length} blocos pra <strong>{form.tipo}</strong> · revise abaixo
            antes de salvar no prontuário
          </p>
          {(form.queixas.length > 0 || form.queixaOutro.trim()) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Queixas cruzadas:
              </span>
              {form.queixas.map((q) => (
                <span
                  key={q}
                  className="rounded-full border border-emerald-300/60 bg-white px-2 py-px text-[10px] font-medium text-emerald-800 dark:border-emerald-800/60 dark:bg-slate-900 dark:text-emerald-300"
                >
                  {q}
                </span>
              ))}
              {form.queixaOutro.trim() && (
                <span className="rounded-full border border-emerald-300/60 bg-white px-2 py-px text-[10px] italic text-emerald-800 dark:border-emerald-800/60 dark:bg-slate-900 dark:text-emerald-300">
                  "{form.queixaOutro.trim()}"
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onReanalisar}
            className="
              inline-flex items-center gap-1.5 rounded-lg border border-emerald-300/70 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-sm transition-colors
              hover:bg-emerald-50
              focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-slate-950
              dark:border-emerald-800/60 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40
            "
            title="Re-roda a IA com o contexto atual · cada chamada é registrada no audit log (LGPD)"
          >
            <RotateCcw className="size-3.5" />
            Re-analisar com IA
          </button>
          <button
            onClick={onVerDetalhe}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors
              hover:bg-teal-500
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
            "
          >
            <ExternalLink className="size-3.5" />
            Abrir no detalhe
          </button>
          <button
            onClick={onVoltarLista}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Voltar pra lista
          </button>
        </div>
      </header>

      {/* Imagem + cards lado a lado (lg) ou empilhados (mobile) */}
      <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* Coluna esquerda — imagem (mantida visível) */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
          <ImagemMedicaMock imagem={mockImagem} />
          <div className="border-t border-slate-100 px-3 py-2 text-[10px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            {form.tipo} · {form.laboratorio} · coletado{' '}
            {new Date(form.dataColeta + 'T12:00:00').toLocaleDateString('pt-BR')}
          </div>
        </div>

        {/* Coluna direita — cards de análise IA */}
        <section className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-b from-emerald-50/40 via-white to-white shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900">
          <header className="flex items-center justify-between gap-2 border-b border-emerald-200/60 bg-emerald-50/40 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Sparkles className="size-3.5" />
              </span>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800 dark:text-emerald-300">
                  Apoio à interpretação · IA
                </h2>
                <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                  claude-opus-4-7 · gerado agora
                </p>
              </div>
            </div>
          </header>

          <div className="space-y-3 p-4">
            {blocos.map((b) => (
              <MockBlocoCard key={b.tipo} bloco={b} />
            ))}
          </div>

          <footer className="flex items-start gap-2 border-t border-emerald-200/60 bg-emerald-50/30 px-4 py-3 text-[11px] leading-relaxed text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
            <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-emerald-700 dark:text-emerald-400" />
            <p>
              <strong className="font-semibold">Sugestão de IA — decisão clínica é sua.</strong>{' '}
              A IA não substitui interpretação médica.
            </p>
          </footer>
        </section>
      </div>
    </div>
  )
}

interface MockIABloco {
  tipo: 'resumo-laudo' | 'comparacao-historica' | 'cruzamento-queixa' | 'cruzamento-medicacao'
  titulo: string
  conteudo: string
  fonte: string
}

const BLOCO_ICON: Record<MockIABloco['tipo'], typeof FileText> = {
  'resumo-laudo': FileText,
  'comparacao-historica': TrendingUp,
  'cruzamento-queixa': MessageSquare,
  'cruzamento-medicacao': Pill,
}

const BLOCO_TOM: Record<MockIABloco['tipo'], { accent: string; iconBg: string; iconText: string }> = {
  'resumo-laudo': {
    accent: 'border-l-teal-400',
    iconBg: 'bg-teal-100 dark:bg-teal-950/60',
    iconText: 'text-teal-700 dark:text-teal-300',
  },
  'comparacao-historica': {
    accent: 'border-l-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-950/60',
    iconText: 'text-amber-700 dark:text-amber-300',
  },
  'cruzamento-queixa': {
    accent: 'border-l-violet-400',
    iconBg: 'bg-violet-100 dark:bg-violet-950/60',
    iconText: 'text-violet-700 dark:text-violet-300',
  },
  'cruzamento-medicacao': {
    accent: 'border-l-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    iconText: 'text-emerald-700 dark:text-emerald-300',
  },
}

function MockBlocoCard({ bloco }: { bloco: MockIABloco }) {
  const Icon = BLOCO_ICON[bloco.tipo]
  const tom = BLOCO_TOM[bloco.tipo]
  return (
    <article
      className={`
        rounded-xl border-l-4 ${tom.accent}
        border border-y-slate-200/60 border-r-slate-200/60 bg-white p-3 shadow-sm
        dark:border-y-slate-800 dark:border-r-slate-800 dark:bg-slate-900
      `}
    >
      <header className="flex items-start gap-2">
        <span
          className={`
            mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md
            ${tom.iconBg} ${tom.iconText}
          `}
        >
          <Icon className="size-3.5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {bloco.titulo}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{bloco.fonte}</p>
        </div>
      </header>
      <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        {bloco.conteudo}
      </p>
    </article>
  )
}

function mockIABlocosPorTipo(tipo: string, modalidade: ModalidadeImagem): MockIABloco[] {
  const tipoLower = tipo.toLowerCase()
  // USG tireoide — mock alinhado com o caso da Maria
  if (modalidade === 'usg' && tipoLower.includes('tireoide')) {
    return [
      {
        tipo: 'resumo-laudo',
        titulo: 'Resumo do laudo',
        conteudo:
          'Tireoide tópica, contornos regulares. Lobo direito com **nódulo sólido isoecogênico de 8mm — TI-RADS 3** (baixo risco). Lobo esquerdo sem alterações. Vascularização periférica preservada ao Doppler.',
        fonte: `Laudo ${' '}· extraído por IA`,
      },
      {
        tipo: 'comparacao-historica',
        titulo: 'Comparação histórica',
        conteudo:
          'Sem USG prévia disponível pra este paciente. Recomenda-se **reavaliação em 12 meses** se TI-RADS 3 confirmado, ou conforme protocolo institucional.',
        fonte: 'Histórico de exames do paciente',
      },
      {
        tipo: 'cruzamento-queixa',
        titulo: 'Cruzamento com queixa atual',
        conteudo:
          'Paciente relatou cansaço persistente e ganho ponderal. **Achado nodular não justifica o quadro clínico** — investigar função tireoidiana (TSH/T4) em paralelo.',
        fonte: 'Anamnese pré-consulta',
      },
      {
        tipo: 'cruzamento-medicacao',
        titulo: 'Cruzamento com medicação em uso',
        conteudo:
          'Em uso de Levotiroxina 50 mcg. Nódulo **não contraindica** terapia atual. Considerar PAAF se houver crescimento em controle subsequente.',
        fonte: 'Prescrição Memed',
      },
    ]
  }
  // Raio-X tórax
  if (modalidade === 'raio-x' && tipoLower.includes('torax')) {
    return [
      {
        tipo: 'resumo-laudo',
        titulo: 'Resumo do laudo',
        conteudo:
          'Campos pulmonares **transparentes, sem opacidades focais**. Silhueta cardíaca dentro dos limites normais (ICT 0,48). Seios costofrênicos livres. Arcos costais íntegros.',
        fonte: 'Análise da imagem por IA',
      },
      {
        tipo: 'comparacao-historica',
        titulo: 'Comparação histórica',
        conteudo:
          'Sem RX prévio disponível pra comparação. Padrão atual considerado **dentro da normalidade** pra idade.',
        fonte: 'Histórico de exames',
      },
      {
        tipo: 'cruzamento-queixa',
        titulo: 'Cruzamento com queixa atual',
        conteudo:
          'Sem sinais radiológicos que justifiquem queixas respiratórias. Se sintoma persistir, considerar **tomografia de tórax** ou avaliação funcional.',
        fonte: 'Anamnese pré-consulta',
      },
      {
        tipo: 'cruzamento-medicacao',
        titulo: 'Cruzamento com medicação em uso',
        conteudo: 'Nenhuma medicação em uso com impacto pulmonar conhecido. Manter conduta.',
        fonte: 'Prescrição Memed',
      },
    ]
  }
  // RM hipófise / encéfalo
  if (modalidade === 'rm') {
    return [
      {
        tipo: 'resumo-laudo',
        titulo: 'Resumo do laudo',
        conteudo:
          '**Microadenoma hipofisário de 5mm em região central da sela**, com sinal heterogêneo em T1 e captação tardia. Estruturas adjacentes preservadas. Sem desvio de quiasma óptico.',
        fonte: 'Análise multimodal da IA',
      },
      {
        tipo: 'comparacao-historica',
        titulo: 'Comparação histórica',
        conteudo:
          'Sem RM prévia pra comparar — primeira avaliação. **Controle em 6 meses** recomendado pra avaliar estabilidade.',
        fonte: 'Histórico de imagens',
      },
      {
        tipo: 'cruzamento-queixa',
        titulo: 'Cruzamento com queixa atual',
        conteudo:
          'Solicitar **dosagem hormonal completa** (prolactina, ACTH, GH, TSH) pra caracterizar atividade do adenoma.',
        fonte: 'Anamnese pré-consulta',
      },
      {
        tipo: 'cruzamento-medicacao',
        titulo: 'Cruzamento com medicação em uso',
        conteudo:
          'Sem cabergolina ou bromocriptina em uso. Conduta dependerá do perfil hormonal.',
        fonte: 'Prescrição Memed',
      },
    ]
  }
  // Genérico — fallback pra outras modalidades
  return [
    {
      tipo: 'resumo-laudo',
      titulo: 'Resumo do laudo',
      conteudo: `Análise do exame ${tipo} concluída. **Sem achados de alarme** identificados pela IA. Padrão dentro do esperado pra perfil do paciente.`,
      fonte: 'Análise da imagem por IA',
    },
    {
      tipo: 'comparacao-historica',
      titulo: 'Comparação histórica',
      conteudo:
        'Sem exames prévios da mesma modalidade pra comparação. Estabelecer baseline pra acompanhamento futuro.',
      fonte: 'Histórico de exames',
    },
    {
      tipo: 'cruzamento-queixa',
      titulo: 'Cruzamento com queixa atual',
      conteudo:
        'Achados são **compatíveis com normalidade** dada a queixa principal. Reavaliar conforme evolução.',
      fonte: 'Anamnese pré-consulta',
    },
    {
      tipo: 'cruzamento-medicacao',
      titulo: 'Cruzamento com medicação em uso',
      conteudo: 'Sem interações relevantes com o uso atual de medicação. Manter conduta.',
      fonte: 'Prescrição Memed',
    },
  ]
}

// ─── Sub-components ───────────────────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-slate-700 dark:text-slate-200">
        {label}
        {required && <span className="ml-0.5 text-rose-600">*</span>}
        {hint && (
          <span className="ml-1.5 text-[10px] font-normal text-slate-500 dark:text-slate-400">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  )
}

function ProcessingStep({
  label,
  done,
  running,
}: {
  label: string
  done?: boolean
  running?: boolean
}) {
  return (
    <li className="flex items-center gap-2">
      {done ? (
        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
      ) : running ? (
        <Loader2 className="size-3.5 shrink-0 animate-spin text-teal-600 dark:text-teal-400" />
      ) : (
        <span className="size-3.5 shrink-0 rounded-full border border-slate-300 dark:border-slate-700" />
      )}
      <span
        className={
          done
            ? 'text-slate-700 dark:text-slate-200'
            : running
              ? 'font-medium text-slate-900 dark:text-slate-100'
              : 'text-slate-400 dark:text-slate-500'
        }
      >
        {label}
      </span>
    </li>
  )
}
