import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  Anexo,
  NovoEventoFormProps,
  StepIndex,
  TipoAnexo,
  ValidacaoXsd,
} from '@/../product/sections/eventos-esocial/types'
import {
  ChevronRight,
  ChevronLeft,
  Send,
  Save,
  X,
  Sparkles,
  CloudCheck,
  Loader2,
} from 'lucide-react'
import { TipoEventoBadge } from './TipoEventoBadge'
import { AmbienteBadge } from './AmbienteBadge'
import { StepperHeader } from './StepperHeader'
import { Step1Trabalhador } from './Step1Trabalhador'
import { Step2Dados, getRequiredFieldsForTipo } from './Step2Dados'
import { Step3Anexos } from './Step3Anexos'
import { Step4Revisao } from './Step4Revisao'

const TITLE_BY_STEP: Record<StepIndex, { titulo: string; sub: string }> = {
  0: {
    titulo: 'Selecione o trabalhador',
    sub: 'Quem é o sujeito do evento. Use o cascade ou busca para encontrar.',
  },
  1: {
    titulo: 'Preencha os dados específicos',
    sub: 'Campos exigidos pelo schema oficial do eSocial para este tipo de evento.',
  },
  2: {
    titulo: 'Anexe os documentos comprobatórios',
    sub: 'Laudos, LTCAT, certificados — anexos opcionais mas recomendados.',
  },
  3: {
    titulo: 'Revise e valide',
    sub: 'Confira o resumo e rode a validação XSD antes de enviar para a fila.',
  },
}

export function NovoEventoForm({
  tipo,
  empregadorContexto,
  estabelecimentos,
  setores,
  trabalhadores,
  sugestao,
  onCancelar,
  onSalvarRascunho,
  onValidarXsd,
  onEnviarParaFila,
}: NovoEventoFormProps) {
  const [step, setStep] = useState<StepIndex>(0)
  const [completed, setCompleted] = useState<Set<StepIndex>>(new Set())

  const [estabelecimentoId, setEstabelecimentoId] = useState<string | null>(null)
  const [setorId, setSetorId] = useState<string | null>(null)
  const [trabalhadorId, setTrabalhadorId] = useState<string | null>(
    sugestao?.trabalhadorId ?? null,
  )
  const [dados, setDados] = useState<Record<string, string>>(sugestao?.dadosPrefilled ?? {})
  const [anexos, setAnexos] = useState<Anexo[]>([])
  const [validacao, setValidacao] = useState<ValidacaoXsd | null>(null)
  const [rascunhoSalvoEm, setRascunhoSalvoEm] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)
  const autoSaveTimer = useRef<number | undefined>(undefined)

  // Inicializa estab/setor a partir do trabalhador da sugestão
  useEffect(() => {
    if (!sugestao?.trabalhadorId) return
    const t = trabalhadores.find((x) => x.id === sugestao.trabalhadorId)
    if (t) {
      setEstabelecimentoId(t.estabelecimentoId)
      setSetorId(t.setorId)
      setCompleted((prev) => new Set(prev).add(0))
    }
  }, [sugestao, trabalhadores])

  // Auto-save debounced
  useEffect(() => {
    if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = window.setTimeout(() => {
      if (!trabalhadorId && Object.keys(dados).length === 0 && anexos.length === 0) return
      setSalvando(true)
      window.setTimeout(() => {
        const now = new Date().toISOString()
        setRascunhoSalvoEm(now)
        setSalvando(false)
        onSalvarRascunho?.({ tipo, trabalhadorId, dados, anexos })
      }, 280)
    }, 600)
    return () => {
      if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current)
    }
  }, [trabalhadorId, dados, anexos, tipo, onSalvarRascunho])

  const trabalhador = useMemo(
    () => trabalhadores.find((t) => t.id === trabalhadorId) ?? null,
    [trabalhadorId, trabalhadores],
  )

  const requiredFields = getRequiredFieldsForTipo(tipo)
  const camposObrigatoriosPreenchidos = requiredFields.every(
    (campo) => (dados[campo] ?? '').trim() !== '',
  )

  const podeAvancar: Record<StepIndex, boolean> = {
    0: trabalhadorId !== null,
    1: camposObrigatoriosPreenchidos,
    2: true,
    3: validacao !== null && validacao.erros.length === 0,
  }

  const handleSetStep = (next: StepIndex) => {
    if (next > step) {
      // Validar steps anteriores
      for (let i = step; i < next; i++) {
        if (!podeAvancar[i as StepIndex]) return
      }
      setCompleted((prev) => {
        const out = new Set(prev)
        for (let i = step; i < next; i++) out.add(i as StepIndex)
        return out
      })
    }
    setStep(next)
  }

  const handleAvancar = () => {
    if (!podeAvancar[step]) return
    setCompleted((prev) => new Set(prev).add(step))
    if (step < 3) setStep((step + 1) as StepIndex)
  }

  const handleVoltar = () => {
    if (step > 0) setStep((step - 1) as StepIndex)
  }

  const handleAddAnexo = (file: { nome: string; tamanhoKb: number; tipo: TipoAnexo }) => {
    setAnexos((prev) => [
      ...prev,
      {
        id: `anx-tmp-${Date.now()}`,
        nome: file.nome,
        tamanhoKb: file.tamanhoKb,
        tipo: file.tipo,
        uploadedAt: new Date().toISOString(),
      },
    ])
  }

  const handleValidar = () => {
    onValidarXsd?.({ tipo, trabalhadorId, dados, anexos })
    // Simulação determinística baseada em obrigatórios
    if (!camposObrigatoriosPreenchidos) {
      const faltando = requiredFields.filter((c) => (dados[c] ?? '').trim() === '')
      setValidacao({
        valido: false,
        erros: faltando.map((c) => ({
          campo: c,
          path: `/eSocial/${tipo}/.../${c}`,
          mensagem: `Campo obrigatório não preenchido.`,
          sugestaoCorrecao: 'Volte para o passo "Dados específicos" e preencha o campo.',
        })),
        avisos: [],
      })
    } else {
      setValidacao({
        valido: true,
        erros: [],
        avisos:
          anexos.length === 0
            ? [
                {
                  campo: 'anexos',
                  mensagem: 'Recomendado anexar laudo/certificado comprobatório.',
                  severidade: 'warning',
                },
              ]
            : [],
      })
    }
  }

  const handleEnviar = () => {
    if (!podeAvancar[3]) return
    onEnviarParaFila?.({ tipo, trabalhadorId, dados, anexos })
  }

  const stepInfo = TITLE_BY_STEP[step]

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Breadcrumb */}
        <div
          className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap"
          aria-label="Trilha"
        >
          <button type="button" onClick={onCancelar} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
            Empregadores
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">
            {empregadorContexto.nomeFantasia}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <button type="button" onClick={onCancelar} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
            Eventos eSocial
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400">Novo evento</span>
        </div>

        {/* Header */}
        <header className="nymos-reveal opacity-0 mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Novo evento eSocial
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <TipoEventoBadge tipo={tipo} />
                <AmbienteBadge ambiente={empregadorContexto.ambienteCorrente} size="md" />
                {sugestao && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 ring-1 ring-sky-200 dark:ring-sky-900">
                    <Sparkles className="w-2.5 h-2.5" strokeWidth={2.25} />
                    Sugerido
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Novo evento {tipo}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {sugestao
                  ? `Criando a partir de: ${sugestao.referenciaLabel}`
                  : `Empregador ${empregadorContexto.nomeFantasia} · CNPJ `}
                {!sugestao && <span className="font-mono">{empregadorContexto.cnpj}</span>}
              </p>
            </div>

            {/* Auto-save status */}
            <SaveIndicator salvando={salvando} salvoEm={rascunhoSalvoEm} />
          </div>
        </header>

        {/* Stepper */}
        <StepperHeader current={step} completed={completed} onJump={handleSetStep} />

        {/* Step title */}
        <div
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-6 mb-4"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {stepInfo.titulo}
          </h2>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{stepInfo.sub}</p>
        </div>

        {/* Step body */}
        <section
          key={step}
          style={{ animationDelay: '180ms' }}
          className="nymos-reveal opacity-0 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 px-5 sm:px-6 py-5"
        >
          {step === 0 && (
            <Step1Trabalhador
              estabelecimentos={estabelecimentos}
              setores={setores}
              trabalhadores={trabalhadores}
              estabelecimentoId={estabelecimentoId}
              setorId={setorId}
              trabalhadorId={trabalhadorId}
              onChange={(next) => {
                setEstabelecimentoId(next.estabelecimentoId)
                setSetorId(next.setorId)
                setTrabalhadorId(next.trabalhadorId)
              }}
            />
          )}
          {step === 1 && (
            <Step2Dados
              tipo={tipo}
              valores={dados}
              onChange={(c, v) => setDados((prev) => ({ ...prev, [c]: v }))}
            />
          )}
          {step === 2 && (
            <Step3Anexos
              tipo={tipo}
              anexos={anexos}
              onAdd={handleAddAnexo}
              onRemover={(id) => setAnexos((prev) => prev.filter((a) => a.id !== id))}
            />
          )}
          {step === 3 && (
            <Step4Revisao
              tipo={tipo}
              trabalhador={trabalhador}
              dados={dados}
              anexos={anexos}
              validacao={validacao}
              onRevalidar={handleValidar}
              onVoltarParaPasso={(p) => setStep(p)}
            />
          )}
        </section>

        {/* Footer actions */}
        <div
          style={{ animationDelay: '260ms' }}
          className="nymos-reveal opacity-0 mt-5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancelar}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onSalvarRascunho?.({ tipo, trabalhadorId, dados, anexos })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
            >
              <Save className="w-3.5 h-3.5" strokeWidth={1.75} />
              Salvar rascunho
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleVoltar}
              disabled={step === 0}
              className="
                inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium
                text-slate-700 dark:text-slate-200
                bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800
                hover:bg-slate-50 dark:hover:bg-slate-800/60
                disabled:opacity-40 disabled:cursor-not-allowed
                transition
              "
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
              Voltar
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={handleAvancar}
                disabled={!podeAvancar[step]}
                className={`
                  inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-medium transition
                  ${
                    podeAvancar[step]
                      ? 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }
                `}
              >
                Avançar
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.25} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEnviar}
                disabled={!podeAvancar[3]}
                className={`
                  inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition
                  ${
                    podeAvancar[3]
                      ? 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }
                `}
              >
                <Send className="w-3.5 h-3.5" strokeWidth={2.25} />
                Enviar para fila
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SaveIndicator({ salvando, salvoEm }: { salvando: boolean; salvoEm: string | null }) {
  if (salvando) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <Loader2 className="w-3 h-3 animate-spin" strokeWidth={2} />
        Salvando rascunho…
      </span>
    )
  }
  if (salvoEm) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
        <CloudCheck className="w-3 h-3" strokeWidth={2} />
        Rascunho salvo {formatRelative(salvoEm)}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
      <CloudCheck className="w-3 h-3" strokeWidth={2} />
      Auto-save ativo
    </span>
  )
}

function formatRelative(iso: string): string {
  try {
    const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
    if (diffSec < 5) return 'agora'
    if (diffSec < 60) return `há ${diffSec}s`
    if (diffSec < 3600) return `há ${Math.floor(diffSec / 60)}min`
    return 'há mais de 1h'
  } catch {
    return ''
  }
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
