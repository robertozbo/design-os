import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, Lightbulb, Syringe, X } from 'lucide-react'
import {
  SITIO_LABELS,
  type MedicacaoAtiva,
  type RegistroInjecao,
  type SitioAplicacao,
} from '@/../product/sections/medication/types'
import { SitesMap } from './SitesMap'

interface Props {
  medicacao: MedicacaoAtiva
  historico: RegistroInjecao[]
  open: boolean
  onClose: () => void
  onConfirmar: (payload: { sitio: SitioAplicacao; dor: number }) => void
}

type Step = 'sitio' | 'dor' | 'confirmar'

function dorLabel(n: number): string {
  if (n <= 2) return 'Sem dor / leve'
  if (n <= 5) return 'Moderada'
  if (n <= 8) return 'Forte'
  return 'Insuportável'
}

function dorTone(n: number): string {
  if (n <= 2) return 'text-emerald-600 dark:text-emerald-300'
  if (n <= 5) return 'text-amber-600 dark:text-amber-300'
  if (n <= 8) return 'text-orange-600 dark:text-orange-300'
  return 'text-rose-600 dark:text-rose-300'
}

const STEP_NUM: Record<Step, number> = { sitio: 1, dor: 2, confirmar: 3 }
const STEP_LABEL: Record<Step, string> = {
  sitio: 'Sítio',
  dor: 'Dor',
  confirmar: 'Confirmar',
}

export function RegisterInjectionModal({
  medicacao,
  historico,
  open,
  onClose,
  onConfirmar,
}: Props) {
  const [step, setStep] = useState<Step>('sitio')
  const [sitio, setSitio] = useState<SitioAplicacao | null>(null)
  const [dor, setDor] = useState<number>(2)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const sitiosRecentes = useMemo(
    () =>
      historico
        .filter((i) => i.medicacaoId === medicacao.id)
        .slice(0, 2)
        .map((i) => i.sitio),
    [historico, medicacao.id],
  )

  const sitioSaturado = useMemo(() => {
    const ult3 = historico
      .filter((i) => i.medicacaoId === medicacao.id)
      .slice(0, 3)
      .map((i) => i.sitio)
    if (ult3.length < 3) return null
    return ult3.every((s) => s === ult3[0]) ? ult3[0] : null
  }, [historico, medicacao.id])

  if (!open) return null

  const podeAvancar =
    (step === 'sitio' && !!sitio) || step === 'dor' || step === 'confirmar'

  const handleAvancar = () => {
    if (step === 'sitio') setStep('dor')
    else if (step === 'dor') setStep('confirmar')
    else if (step === 'confirmar' && sitio !== null) {
      onConfirmar({ sitio, dor })
      setStep('sitio')
      setSitio(null)
      setDor(2)
    }
  }

  const handleVoltar = () => {
    if (step === 'dor') setStep('sitio')
    else if (step === 'confirmar') setStep('dor')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Aplicar ${medicacao.nome}`}
        className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl dark:bg-slate-900 md:max-w-2xl"
      >
        {/* Header */}
        <header className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-5 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <button
                onClick={step === 'sitio' ? onClose : handleVoltar}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                aria-label={step === 'sitio' ? 'Fechar' : 'Voltar'}
              >
                {step === 'sitio' ? <X size={18} /> : <ChevronLeft size={18} />}
              </button>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">
                  Aplicar dose · {STEP_NUM[step]} de 3 · {STEP_LABEL[step]}
                </p>
                <h2 className="mt-1 text-[18px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
                  {medicacao.nome}{' '}
                  <span className="font-mono text-[14px] text-slate-500 dark:text-slate-400">
                    {medicacao.dose}
                  </span>
                </h2>
                <p className="mt-0.5 text-[12.5px] text-slate-500 dark:text-slate-400">
                  {medicacao.posologia}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Fechar"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full bg-teal-500 transition-all dark:bg-teal-400"
              style={{ width: `${(STEP_NUM[step] / 3) * 100}%` }}
            />
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 'sitio' && (
            <>
              <p className="mb-5 text-[13px] leading-snug text-slate-600 dark:text-slate-400">
                Selecione onde vai aplicar. Girar o sítio reduz risco de lipodistrofia.
              </p>
              <SitesMap
                selecionado={sitio}
                sitiosRecentes={sitiosRecentes}
                sitioSaturado={sitioSaturado}
                onChange={setSitio}
              />
            </>
          )}

          {step === 'dor' && (
            <>
              <p className="mb-5 text-[13px] leading-snug text-slate-600 dark:text-slate-400">
                Qual o nível de dor da aplicação?
              </p>
              <div className="mb-6 text-center">
                <div
                  className={`font-mono text-[72px] font-bold leading-none tabular-nums ${dorTone(dor)}`}
                >
                  {dor}
                </div>
                <div className={`mt-1 text-[14px] ${dorTone(dor)}`}>
                  {dorLabel(dor)}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-500">
                  de 0 a 10
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={dor}
                onChange={(e) => setDor(Number(e.target.value))}
                className="w-full accent-teal-600 dark:accent-teal-400"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-500 dark:text-slate-500">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>

              {dor >= 7 && (
                <div className="mt-6 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
                  <Lightbulb
                    size={15}
                    className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300"
                  />
                  <div>
                    <p className="mb-1 text-[13px] font-medium text-amber-900 dark:text-amber-200">
                      Dor acima do esperado
                    </p>
                    <ul className="list-disc space-y-1 pl-4 text-[12px] text-amber-800/90 dark:text-amber-100/80">
                      <li>Gire o sítio a cada aplicação</li>
                      <li>Injete devagar (5–10s)</li>
                      <li>Deixe a medicação chegar à temperatura ambiente</li>
                      <li>Se persistir, fale com seu médico</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'confirmar' && sitio && (
            <>
              <p className="mb-5 text-[13px] leading-snug text-slate-600 dark:text-slate-400">
                Confirme os dados da aplicação.
              </p>
              <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                <Row label="Fármaco" value={medicacao.nome} />
                <Row label="Dose" value={medicacao.dose} mono />
                <Row label="Sítio" value={SITIO_LABELS[sitio]} />
                <Row label="Dor" value={`${dor}/10 · ${dorLabel(dor)}`} mono />
                <Row
                  label="Hora"
                  value={new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  mono
                />
              </div>
              <p className="mt-4 text-center text-[12px] leading-snug text-slate-500 dark:text-slate-500">
                Em 24h vamos lembrar você de registrar como está se sentindo.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={handleAvancar}
            disabled={!podeAvancar}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold transition-all ${
              podeAvancar
                ? 'bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400'
                : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            }`}
          >
            {step === 'confirmar' && <Syringe size={15} strokeWidth={2.2} />}
            {step === 'confirmar' ? 'Confirmar aplicação' : 'Continuar'}
          </button>
        </footer>
      </aside>
    </div>
  )
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[13px] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={`text-[14px] text-slate-900 dark:text-slate-100 ${mono ? 'font-mono tabular-nums' : 'font-medium'}`}
      >
        {value}
      </span>
    </div>
  )
}
