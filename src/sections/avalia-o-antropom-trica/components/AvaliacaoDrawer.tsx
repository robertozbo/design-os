import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, X } from 'lucide-react'
import type {
  Avaliacao,
  Classificacoes,
  ConfigMedicoes,
  PacienteContexto,
  ProtocoloDobras,
  ProtocoloDobrasOpcao,
} from '@/../product/sections/avalia-o-antropom-trica/types'
import {
  TONE_BADGE,
  calcImc,
  calcRcq,
  calcPercentualGorduraPollock3,
  classifyImc,
  classifyRcq,
  formatNumber,
} from './utils'

interface AvaliacaoDrawerProps {
  open: boolean
  pacienteContexto: PacienteContexto
  configMedicoes: ConfigMedicoes
  classificacoes: Classificacoes
  protocolosDobras: ProtocoloDobrasOpcao[]
  /** When set, drawer is in "edit" mode for this avaliacao. */
  editing?: Avaliacao | null
  onClose: () => void
  onSave: (avaliacao: Omit<Avaliacao, 'id' | 'criadoEm'>) => void
}

interface DraftState {
  dataIso: string
  basicas: { pesoKg: string; alturaCm: string; idade: string }
  composicao: {
    percentualGordura: string
    massaMagraKg: string
    massaOsseaKg: string
    aguaCorporalPct: string
    gorduraVisceral: string
    tmbKcal: string
  }
  circunferencias: {
    cinturaCm: string
    quadrilCm: string
    bracoCm: string
    coxaCm: string
    panturrilhaCm: string
    peitoralCm: string
    pescocoCm: string
  }
  dobras: {
    tricipitalMm: string
    subescapularMm: string
    suprailiacaMm: string
    abdominalMm: string
    coxaMm: string
    protocolo: ProtocoloDobras
  }
  observacoes: string
}

function emptyDraft(today: string, idade: number): DraftState {
  return {
    dataIso: today,
    basicas: { pesoKg: '', alturaCm: '', idade: String(idade) },
    composicao: {
      percentualGordura: '',
      massaMagraKg: '',
      massaOsseaKg: '',
      aguaCorporalPct: '',
      gorduraVisceral: '',
      tmbKcal: '',
    },
    circunferencias: {
      cinturaCm: '',
      quadrilCm: '',
      bracoCm: '',
      coxaCm: '',
      panturrilhaCm: '',
      peitoralCm: '',
      pescocoCm: '',
    },
    dobras: {
      tricipitalMm: '',
      subescapularMm: '',
      suprailiacaMm: '',
      abdominalMm: '',
      coxaMm: '',
      protocolo: 'pollock-3',
    },
    observacoes: '',
  }
}

function fromAvaliacao(a: Avaliacao): DraftState {
  return {
    dataIso: a.dataIso,
    basicas: {
      pesoKg: String(a.basicas.pesoKg),
      alturaCm: String(a.basicas.alturaCm),
      idade: String(a.basicas.idade),
    },
    composicao: {
      percentualGordura: numStr(a.composicao.percentualGordura),
      massaMagraKg: numStr(a.composicao.massaMagraKg),
      massaOsseaKg: numStr(a.composicao.massaOsseaKg),
      aguaCorporalPct: numStr(a.composicao.aguaCorporalPct),
      gorduraVisceral: numStr(a.composicao.gorduraVisceral),
      tmbKcal: numStr(a.composicao.tmbKcal),
    },
    circunferencias: {
      cinturaCm: numStr(a.circunferencias.cinturaCm),
      quadrilCm: numStr(a.circunferencias.quadrilCm),
      bracoCm: numStr(a.circunferencias.bracoCm),
      coxaCm: numStr(a.circunferencias.coxaCm),
      panturrilhaCm: numStr(a.circunferencias.panturrilhaCm),
      peitoralCm: numStr(a.circunferencias.peitoralCm),
      pescocoCm: numStr(a.circunferencias.pescocoCm),
    },
    dobras: a.dobras
      ? {
          tricipitalMm: numStr(a.dobras.tricipitalMm),
          subescapularMm: numStr(a.dobras.subescapularMm),
          suprailiacaMm: numStr(a.dobras.suprailiacaMm),
          abdominalMm: numStr(a.dobras.abdominalMm),
          coxaMm: numStr(a.dobras.coxaMm),
          protocolo: a.dobras.protocolo,
        }
      : {
          tricipitalMm: '',
          subescapularMm: '',
          suprailiacaMm: '',
          abdominalMm: '',
          coxaMm: '',
          protocolo: 'pollock-3',
        },
    observacoes: a.observacoes,
  }
}

function numStr(v: number | undefined): string {
  return v !== undefined && v !== null ? String(v) : ''
}

function parseNumOrUndef(s: string): number | undefined {
  if (s === '' || s == null) return undefined
  const n = parseFloat(s.replace(',', '.'))
  return Number.isFinite(n) ? n : undefined
}

export function AvaliacaoDrawer({
  open,
  pacienteContexto,
  configMedicoes,
  classificacoes,
  protocolosDobras,
  editing,
  onClose,
  onSave,
}: AvaliacaoDrawerProps) {
  const today = new Date().toISOString().slice(0, 10)

  const [draft, setDraft] = useState<DraftState>(() =>
    editing ? fromAvaliacao(editing) : emptyDraft(today, computeAge(pacienteContexto.dataNascimento)),
  )

  // Reset when opening
  useEffect(() => {
    if (open) {
      setDraft(
        editing
          ? fromAvaliacao(editing)
          : emptyDraft(today, computeAge(pacienteContexto.dataNascimento)),
      )
    }
  }, [open, editing, today, pacienteContexto.dataNascimento])

  // Lock body scroll
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Live calculations
  const peso = parseNumOrUndef(draft.basicas.pesoKg)
  const altura = parseNumOrUndef(draft.basicas.alturaCm)
  const idade = parseNumOrUndef(draft.basicas.idade) ?? 0

  const imc = peso && altura ? calcImc(peso, altura) : null
  const imcClass = imc ? classifyImc(imc, classificacoes) : null

  const cintura = parseNumOrUndef(draft.circunferencias.cinturaCm)
  const quadril = parseNumOrUndef(draft.circunferencias.quadrilCm)
  const rcq = calcRcq(cintura, quadril)
  const rcqClass = rcq ? classifyRcq(rcq, pacienteContexto.sexo, classificacoes) : null

  // %BF estimated by Pollock when protocolo != manual
  const dobrasSum = useMemo(() => {
    const tri = parseNumOrUndef(draft.dobras.tricipitalMm) ?? 0
    const sub = parseNumOrUndef(draft.dobras.subescapularMm) ?? 0
    const sup = parseNumOrUndef(draft.dobras.suprailiacaMm) ?? 0
    return tri + sub + sup
  }, [draft.dobras])
  const pctBfEstimado =
    draft.dobras.protocolo !== 'manual' && dobrasSum > 0
      ? calcPercentualGorduraPollock3(dobrasSum, idade, pacienteContexto.sexo)
      : null

  // Field counts
  const totalCampos = useMemo(() => {
    let count = 4 // peso, altura, idade, IMC
    if (anyComposicao(configMedicoes)) {
      count += Object.values(configMedicoes.composicaoCorporal).filter(Boolean).length
    }
    if (anyCircunferencias(configMedicoes)) {
      count += Object.values(configMedicoes.circunferencias).filter(Boolean).length
    }
    if (anyDobras(configMedicoes)) {
      count += Object.values(configMedicoes.dobrasCutaneas).filter(Boolean).length + 1 // +protocolo
    }
    return count
  }, [configMedicoes])

  const tempoEstimadoMin = Math.max(2, Math.round(totalCampos * 0.5))

  const canSave = !!peso && !!altura

  function handleSave() {
    if (!peso || !altura) return
    const dobrasPresent = Object.values(draft.dobras).some((v) => typeof v === 'string' && v !== '')

    onSave({
      dataIso: draft.dataIso,
      basicas: {
        pesoKg: peso,
        alturaCm: altura,
        idade,
      },
      composicao: {
        percentualGordura: parseNumOrUndef(draft.composicao.percentualGordura),
        massaMagraKg: parseNumOrUndef(draft.composicao.massaMagraKg),
        massaOsseaKg: parseNumOrUndef(draft.composicao.massaOsseaKg),
        aguaCorporalPct: parseNumOrUndef(draft.composicao.aguaCorporalPct),
        gorduraVisceral: parseNumOrUndef(draft.composicao.gorduraVisceral),
        tmbKcal: parseNumOrUndef(draft.composicao.tmbKcal),
      },
      circunferencias: {
        cinturaCm: parseNumOrUndef(draft.circunferencias.cinturaCm),
        quadrilCm: parseNumOrUndef(draft.circunferencias.quadrilCm),
        bracoCm: parseNumOrUndef(draft.circunferencias.bracoCm),
        coxaCm: parseNumOrUndef(draft.circunferencias.coxaCm),
        panturrilhaCm: parseNumOrUndef(draft.circunferencias.panturrilhaCm),
        peitoralCm: parseNumOrUndef(draft.circunferencias.peitoralCm),
        pescocoCm: parseNumOrUndef(draft.circunferencias.pescocoCm),
      },
      dobras: dobrasPresent
        ? {
            tricipitalMm: parseNumOrUndef(draft.dobras.tricipitalMm),
            subescapularMm: parseNumOrUndef(draft.dobras.subescapularMm),
            suprailiacaMm: parseNumOrUndef(draft.dobras.suprailiacaMm),
            abdominalMm: parseNumOrUndef(draft.dobras.abdominalMm),
            coxaMm: parseNumOrUndef(draft.dobras.coxaMm),
            protocolo: draft.dobras.protocolo,
            percentualEstimado: pctBfEstimado,
          }
        : null,
      observacoes: draft.observacoes,
    })
  }

  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex" data-aa-drawer>
      <DrawerStyles />
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={editing ? 'Editar avaliação' : 'Nova avaliação'}
        style={{ animation: 'aa-drawer-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        className="
          relative ml-auto flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl
          dark:bg-slate-950
        "
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
              {editing ? 'Editar avaliação' : 'Nova avaliação'}
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-50">
              {pacienteContexto.nome}
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
              {totalCampos} campos · ~{tempoEstimadoMin} min
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={16} />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Date */}
          <div className="mb-4">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400">
              Data da avaliação
            </label>
            <input
              type="date"
              value={draft.dataIso}
              onChange={(e) => setDraft((d) => ({ ...d, dataIso: e.target.value }))}
              className={INPUT_CLASS}
            />
          </div>

          {/* Básicas */}
          <Accordion title="Básicas" eyebrow="Sempre" defaultOpen badge={
            imc !== null && imcClass ? (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${TONE_BADGE[imcClass.tone]}`}
              >
                IMC {formatNumber(imc)} · {imcClass.label}
              </span>
            ) : null
          }>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Field label="Peso *" unit="kg">
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={draft.basicas.pesoKg}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      basicas: { ...d.basicas, pesoKg: e.target.value },
                    }))
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Altura *" unit="cm">
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={draft.basicas.alturaCm}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      basicas: { ...d.basicas, alturaCm: e.target.value },
                    }))
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Idade" unit="anos">
                <input
                  type="number"
                  inputMode="numeric"
                  value={draft.basicas.idade}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      basicas: { ...d.basicas, idade: e.target.value },
                    }))
                  }
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          </Accordion>

          {/* Composição */}
          {anyComposicao(configMedicoes) && (
            <Accordion title="Composição corporal">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {configMedicoes.composicaoCorporal.percentualGordura && (
                  <Field label="% Gordura" unit="%">
                    <NumInput
                      value={draft.composicao.percentualGordura}
                      onChange={(v) => updateField(setDraft, 'composicao', 'percentualGordura', v)}
                    />
                  </Field>
                )}
                {configMedicoes.composicaoCorporal.massaMagra && (
                  <Field label="Massa magra" unit="kg">
                    <NumInput
                      value={draft.composicao.massaMagraKg}
                      onChange={(v) => updateField(setDraft, 'composicao', 'massaMagraKg', v)}
                    />
                  </Field>
                )}
                {configMedicoes.composicaoCorporal.massaOssea && (
                  <Field label="Massa óssea" unit="kg">
                    <NumInput
                      value={draft.composicao.massaOsseaKg}
                      onChange={(v) => updateField(setDraft, 'composicao', 'massaOsseaKg', v)}
                    />
                  </Field>
                )}
                {configMedicoes.composicaoCorporal.aguaCorporal && (
                  <Field label="Água corporal" unit="%">
                    <NumInput
                      value={draft.composicao.aguaCorporalPct}
                      onChange={(v) => updateField(setDraft, 'composicao', 'aguaCorporalPct', v)}
                    />
                  </Field>
                )}
                {configMedicoes.composicaoCorporal.gorduraVisceral && (
                  <Field label="Gord. visceral">
                    <NumInput
                      value={draft.composicao.gorduraVisceral}
                      onChange={(v) => updateField(setDraft, 'composicao', 'gorduraVisceral', v)}
                    />
                  </Field>
                )}
                {configMedicoes.composicaoCorporal.taxaMetabolicaBasal && (
                  <Field label="TMB" unit="kcal">
                    <NumInput
                      value={draft.composicao.tmbKcal}
                      onChange={(v) => updateField(setDraft, 'composicao', 'tmbKcal', v)}
                    />
                  </Field>
                )}
              </div>
            </Accordion>
          )}

          {/* Circunferências */}
          {anyCircunferencias(configMedicoes) && (
            <Accordion
              title="Circunferências"
              badge={
                rcq !== null && rcqClass ? (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${TONE_BADGE[rcqClass.tone]}`}
                  >
                    RCQ {formatNumber(rcq, 2)} · {rcqClass.label}
                  </span>
                ) : null
              }
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {configMedicoes.circunferencias.cintura && (
                  <Field label="Cintura" unit="cm">
                    <NumInput
                      value={draft.circunferencias.cinturaCm}
                      onChange={(v) =>
                        updateField(setDraft, 'circunferencias', 'cinturaCm', v)
                      }
                    />
                  </Field>
                )}
                {configMedicoes.circunferencias.quadril && (
                  <Field label="Quadril" unit="cm">
                    <NumInput
                      value={draft.circunferencias.quadrilCm}
                      onChange={(v) =>
                        updateField(setDraft, 'circunferencias', 'quadrilCm', v)
                      }
                    />
                  </Field>
                )}
                {configMedicoes.circunferencias.braco && (
                  <Field label="Braço" unit="cm">
                    <NumInput
                      value={draft.circunferencias.bracoCm}
                      onChange={(v) => updateField(setDraft, 'circunferencias', 'bracoCm', v)}
                    />
                  </Field>
                )}
                {configMedicoes.circunferencias.coxa && (
                  <Field label="Coxa" unit="cm">
                    <NumInput
                      value={draft.circunferencias.coxaCm}
                      onChange={(v) => updateField(setDraft, 'circunferencias', 'coxaCm', v)}
                    />
                  </Field>
                )}
                {configMedicoes.circunferencias.panturrilha && (
                  <Field label="Panturrilha" unit="cm">
                    <NumInput
                      value={draft.circunferencias.panturrilhaCm}
                      onChange={(v) =>
                        updateField(setDraft, 'circunferencias', 'panturrilhaCm', v)
                      }
                    />
                  </Field>
                )}
                {configMedicoes.circunferencias.peitoral && (
                  <Field label="Peitoral" unit="cm">
                    <NumInput
                      value={draft.circunferencias.peitoralCm}
                      onChange={(v) =>
                        updateField(setDraft, 'circunferencias', 'peitoralCm', v)
                      }
                    />
                  </Field>
                )}
                {configMedicoes.circunferencias.pescoco && (
                  <Field label="Pescoço" unit="cm">
                    <NumInput
                      value={draft.circunferencias.pescocoCm}
                      onChange={(v) =>
                        updateField(setDraft, 'circunferencias', 'pescocoCm', v)
                      }
                    />
                  </Field>
                )}
              </div>
            </Accordion>
          )}

          {/* Dobras */}
          {anyDobras(configMedicoes) && (
            <Accordion
              title="Dobras cutâneas"
              badge={
                pctBfEstimado !== null ? (
                  <span className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-teal-700 ring-1 ring-teal-200/60 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900/60">
                    %BF est. {formatNumber(pctBfEstimado)}%
                  </span>
                ) : null
              }
            >
              <div className="space-y-3">
                <Field label="Protocolo">
                  <select
                    value={draft.dobras.protocolo}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        dobras: { ...d.dobras, protocolo: e.target.value as ProtocoloDobras },
                      }))
                    }
                    className={INPUT_CLASS}
                  >
                    {protocolosDobras.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-500">
                    {protocolosDobras.find((p) => p.value === draft.dobras.protocolo)?.descricao}
                  </p>
                </Field>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {configMedicoes.dobrasCutaneas.tricipital && (
                    <Field label="Tricipital" unit="mm">
                      <NumInput
                        value={draft.dobras.tricipitalMm}
                        onChange={(v) => updateField(setDraft, 'dobras', 'tricipitalMm', v)}
                      />
                    </Field>
                  )}
                  {configMedicoes.dobrasCutaneas.subescapular && (
                    <Field label="Subescapular" unit="mm">
                      <NumInput
                        value={draft.dobras.subescapularMm}
                        onChange={(v) => updateField(setDraft, 'dobras', 'subescapularMm', v)}
                      />
                    </Field>
                  )}
                  {configMedicoes.dobrasCutaneas.suprailiaca && (
                    <Field label="Suprailíaca" unit="mm">
                      <NumInput
                        value={draft.dobras.suprailiacaMm}
                        onChange={(v) => updateField(setDraft, 'dobras', 'suprailiacaMm', v)}
                      />
                    </Field>
                  )}
                  {configMedicoes.dobrasCutaneas.abdominal && (
                    <Field label="Abdominal" unit="mm">
                      <NumInput
                        value={draft.dobras.abdominalMm}
                        onChange={(v) => updateField(setDraft, 'dobras', 'abdominalMm', v)}
                      />
                    </Field>
                  )}
                  {configMedicoes.dobrasCutaneas.coxa && (
                    <Field label="Coxa" unit="mm">
                      <NumInput
                        value={draft.dobras.coxaMm}
                        onChange={(v) => updateField(setDraft, 'dobras', 'coxaMm', v)}
                      />
                    </Field>
                  )}
                </div>
              </div>
            </Accordion>
          )}

          {/* Observações */}
          <div className="mt-3">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400">
              Observações
            </label>
            <textarea
              rows={3}
              value={draft.observacoes}
              onChange={(e) => setDraft((d) => ({ ...d, observacoes: e.target.value }))}
              placeholder="Notas clínicas relevantes desta avaliação…"
              className={`${INPUT_CLASS} resize-none`}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between gap-2 border-t border-slate-200 px-5 py-3 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white
              hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50
              dark:bg-teal-500 dark:hover:bg-teal-400
            "
          >
            {editing ? 'Salvar alterações' : 'Salvar avaliação'}
          </button>
        </footer>
      </aside>
    </div>,
    document.body,
  )
}

const INPUT_CLASS = `
  block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
  focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50
`

function NumInput({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  return (
    <input
      type="number"
      step="0.1"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={INPUT_CLASS}
    />
  )
}

function Field({
  label,
  unit,
  children,
}: {
  label: string
  unit?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400">
        <span>{label}</span>
        {unit && (
          <span className="font-mono text-[10px] normal-case tracking-normal text-slate-400 dark:text-slate-500">
            {unit}
          </span>
        )}
      </span>
      {children}
    </label>
  )
}

function Accordion({
  title,
  eyebrow,
  defaultOpen,
  badge,
  children,
}: {
  title: string
  eyebrow?: string
  defaultOpen?: boolean
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <section className="mb-3 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/30 dark:border-slate-800 dark:bg-slate-900/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </span>
          {eyebrow && (
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {eyebrow}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {badge}
          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {open && <div className="border-t border-slate-200/80 bg-white px-3 py-3 dark:border-slate-800 dark:bg-slate-950/40">{children}</div>}
    </section>
  )
}

function DrawerStyles() {
  return (
    <style>{`
      @keyframes aa-drawer-in {
        from { transform: translateX(100%); }
        to   { transform: translateX(0); }
      }
    `}</style>
  )
}

function computeAge(dataNascimento: string): number {
  const birth = new Date(dataNascimento)
  if (Number.isNaN(birth.getTime())) return 0
  const diffMs = Date.now() - birth.getTime()
  return Math.floor(diffMs / (365.25 * 86_400_000))
}

function anyComposicao(c: ConfigMedicoes): boolean {
  return Object.values(c.composicaoCorporal).some(Boolean)
}
function anyCircunferencias(c: ConfigMedicoes): boolean {
  return Object.values(c.circunferencias).some(Boolean)
}
function anyDobras(c: ConfigMedicoes): boolean {
  return Object.values(c.dobrasCutaneas).some(Boolean)
}

// Helper to update nested field while keeping types simple
function updateField<K extends 'composicao' | 'circunferencias' | 'dobras'>(
  setDraft: React.Dispatch<React.SetStateAction<DraftState>>,
  group: K,
  field: string,
  value: string,
) {
  setDraft((d) => ({
    ...d,
    [group]: { ...(d as DraftState)[group], [field]: value },
  }))
}
