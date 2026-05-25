import { useMemo, useState } from 'react'
import { X, ChevronLeft, Syringe, Lightbulb } from 'lucide-react'
import {
  SITIO_LABELS,
  type MedicacaoAtiva,
  type RegistroInjecao,
  type SitioAplicacao,
} from '@/../product-mobile/sections/medicacao/types'
import { MapaSitios } from './MapaSitios'

interface Props {
  /** Medicação que vai aplicar. */
  medicacao: MedicacaoAtiva
  /** Histórico de injeções (mais recentes primeiro) — usado pra detectar rotação. */
  historico: RegistroInjecao[]
  open: boolean
  onClose: () => void
  onConfirmar: (payload: { sitio: SitioAplicacao; dor: number }) => void
}

type Step = 'sitio' | 'dor' | 'confirmar'

const DOR_LABEL = (n: number): string => {
  if (n <= 2) return 'Sem dor / leve'
  if (n <= 5) return 'Moderada'
  if (n <= 8) return 'Forte'
  return 'Insuportável'
}

const DOR_COLOR = (n: number): string => {
  if (n <= 2) return 'text-emerald-300'
  if (n <= 5) return 'text-amber-300'
  if (n <= 8) return 'text-orange-300'
  return 'text-rose-300'
}

export function RegistrarInjecao({
  medicacao,
  historico,
  open,
  onClose,
  onConfirmar,
}: Props) {
  const [step, setStep] = useState<Step>('sitio')
  const [sitio, setSitio] = useState<SitioAplicacao | null>(null)
  const [dor, setDor] = useState<number>(2)

  // Sítios usados nas últimas 2 doses
  const sitiosRecentes = useMemo(() => {
    return historico
      .filter((i) => i.medicacaoId === medicacao.id)
      .slice(0, 2)
      .map((i) => i.sitio)
  }, [historico, medicacao.id])

  // Sítio saturado (3 últimas iguais)
  const sitioSaturado = useMemo(() => {
    const ultimas3 = historico
      .filter((i) => i.medicacaoId === medicacao.id)
      .slice(0, 3)
      .map((i) => i.sitio)
    if (ultimas3.length < 3) return null
    return ultimas3.every((s) => s === ultimas3[0]) ? ultimas3[0] : null
  }, [historico, medicacao.id])

  if (!open) return null

  const podeAvancar =
    (step === 'sitio' && !!sitio) || step === 'dor' || step === 'confirmar'

  const handleAvancar = () => {
    if (step === 'sitio') setStep('dor')
    else if (step === 'dor') setStep('confirmar')
    else if (step === 'confirmar' && sitio !== null) {
      onConfirmar({ sitio, dor })
      // reset
      setStep('sitio')
      setSitio(null)
      setDor(2)
    }
  }

  const handleVoltar = () => {
    if (step === 'dor') setStep('sitio')
    else if (step === 'confirmar') setStep('dor')
  }

  const STEPS_LABEL: Record<Step, string> = {
    sitio: 'Sítio',
    dor: 'Dor',
    confirmar: 'Confirmar',
  }
  const STEP_NUM: Record<Step, number> = { sitio: 1, dor: 2, confirmar: 3 }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <button
          onClick={step === 'sitio' ? onClose : handleVoltar}
          className="w-9 h-9 -ml-2 rounded-lg flex items-center justify-center hover:bg-slate-800"
        >
          {step === 'sitio' ? (
            <X size={18} className="text-slate-300" />
          ) : (
            <ChevronLeft size={18} className="text-slate-300" />
          )}
        </button>
        <div className="text-center">
          <div className="text-slate-100 text-[14px] font-semibold">
            Aplicar {medicacao.nome}
          </div>
          <div className="text-slate-500 text-[11px] font-mono">
            {STEP_NUM[step]} de 3 · {STEPS_LABEL[step]}
          </div>
        </div>
        <div className="w-9" />
      </div>

      {/* Progress */}
      <div className="h-1 bg-slate-900">
        <div
          className="h-full bg-teal-500 transition-all"
          style={{ width: `${(STEP_NUM[step] / 3) * 100}%` }}
        />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {step === 'sitio' && (
          <>
            <p className="text-slate-400 text-[12.5px] mb-4 leading-snug">
              Selecione onde vai aplicar. Girar o sítio reduz risco de lipodistrofia.
            </p>
            <MapaSitios
              selecionado={sitio}
              sitiosRecentes={sitiosRecentes}
              sitioSaturado={sitioSaturado}
              onChange={setSitio}
            />
          </>
        )}

        {step === 'dor' && (
          <>
            <p className="text-slate-400 text-[12.5px] mb-4 leading-snug">
              Qual o nível de dor da aplicação?
            </p>
            <div className="text-center mb-6">
              <div
                className={`font-mono text-[64px] font-bold leading-none tabular-nums ${DOR_COLOR(dor)}`}
              >
                {dor}
              </div>
              <div className={`mt-1 text-[13px] ${DOR_COLOR(dor)}`}>
                {DOR_LABEL(dor)}
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">de 0 a 10</div>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={dor}
              onChange={(e) => setDor(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>

            {dor >= 7 && (
              <div className="mt-5 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 flex items-start gap-2">
                <Lightbulb
                  size={14}
                  className="text-amber-300 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-amber-200 text-[12px] font-medium mb-1">
                    Dor acima do esperado
                  </p>
                  <ul className="text-amber-100/80 text-[11.5px] space-y-1 list-disc pl-4">
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
            <p className="text-slate-400 text-[12.5px] mb-4 leading-snug">
              Confirme os dados da aplicação.
            </p>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800">
              <Row label="Fármaco" value={medicacao.nome} />
              <Row label="Dose" value={medicacao.dose} mono />
              <Row label="Sítio" value={SITIO_LABELS[sitio]} />
              <Row
                label="Dor"
                value={`${dor}/10 · ${DOR_LABEL(dor)}`}
                mono
              />
              <Row
                label="Hora"
                value={new Date().toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                mono
              />
            </div>
            <p className="mt-3 text-slate-500 text-[11px] leading-snug text-center">
              Em 24h vamos lembrar você de registrar como está se sentindo.
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-950">
        <button
          onClick={handleAvancar}
          disabled={!podeAvancar}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-[14px] font-semibold transition-all ${
            podeAvancar
              ? 'bg-teal-500 text-slate-950 active:scale-[0.99]'
              : 'bg-slate-800 text-slate-500'
          }`}
        >
          {step === 'confirmar' && <Syringe size={14} strokeWidth={2.2} />}
          {step === 'sitio' && 'Continuar'}
          {step === 'dor' && 'Continuar'}
          {step === 'confirmar' && 'Confirmar aplicação'}
        </button>
      </div>
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
    <div className="px-4 py-3 flex items-center justify-between">
      <span className="text-slate-400 text-[12.5px]">{label}</span>
      <span
        className={`text-slate-100 text-[13px] ${mono ? 'font-mono tabular-nums' : 'font-medium'}`}
      >
        {value}
      </span>
    </div>
  )
}
