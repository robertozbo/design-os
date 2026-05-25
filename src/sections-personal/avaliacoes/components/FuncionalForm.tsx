import { useState } from 'react'
import type { Funcional, RMTeste } from '@/../product-personal/sections/avaliacoes/types'
import { CollapsibleBlock, NumberInput, Segmented } from './FormPrimitives'
import { calcular1RMBrzycki, FMS_TESTES, fmsTotal } from './avaliacaoFormHelpers'
import type { FMSValues } from './avaliacaoFormHelpers'

interface FuncionalFormProps {
  value: Funcional
  onChange: (next: Funcional) => void
}

export function FuncionalForm({ value, onChange }: FuncionalFormProps) {
  const setRm = (
    exercicio: 'supino' | 'squat' | 'deadlift',
    rm: RMTeste | null,
  ) => onChange({ ...value, rm: { ...value.rm, [exercicio]: rm } })

  const rmActive =
    value.rm.supino != null ||
    value.rm.squat != null ||
    value.rm.deadlift != null
  const fmsActive = value.fms != null
  const flexActive = value.flexibilidade != null
  const cardioActive = value.cardio != null
  const resActive = value.resistenciaLocal != null

  return (
    <div className="space-y-3">
      <CollapsibleBlock
        title="1RM (estimado · Brzycki)"
        description="Teste submax → calcula 1 repetição máxima"
        active={rmActive}
      >
        <div className="space-y-3">
          <RMRow
            label="Supino"
            value={value.rm.supino}
            onChange={(v) => setRm('supino', v)}
          />
          <RMRow
            label="Squat"
            value={value.rm.squat}
            onChange={(v) => setRm('squat', v)}
          />
          <RMRow
            label="Deadlift"
            value={value.rm.deadlift}
            onChange={(v) => setRm('deadlift', v)}
          />
        </div>
      </CollapsibleBlock>

      <CollapsibleBlock
        title="FMS · Functional Movement Screen"
        description="7 sub-testes · score 0-3 cada · total 0-21"
        active={fmsActive}
        badge={
          value.fms && (
            <span className="inline-flex items-center rounded-md bg-violet-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
              {value.fms.totalScore}/21
            </span>
          )
        }
      >
        <FMSEditor
          fms={value.fms}
          onChange={(fms) => onChange({ ...value, fms })}
        />
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Flexibilidade"
        description="Sit-and-reach · ombro · Schober"
        active={flexActive}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <NumberInput
            label="Sit-and-reach"
            unit="cm"
            step={0.5}
            value={value.flexibilidade?.sitAndReachCm ?? null}
            onChange={(v) =>
              onChange({
                ...value,
                flexibilidade: {
                  sitAndReachCm: v,
                  shoulderMobilityCm:
                    value.flexibilidade?.shoulderMobilityCm ?? null,
                  schoberCm: value.flexibilidade?.schoberCm ?? null,
                },
              })
            }
          />
          <NumberInput
            label="Ombro (mobilidade)"
            unit="cm"
            step={0.5}
            value={value.flexibilidade?.shoulderMobilityCm ?? null}
            onChange={(v) =>
              onChange({
                ...value,
                flexibilidade: {
                  sitAndReachCm: value.flexibilidade?.sitAndReachCm ?? null,
                  shoulderMobilityCm: v,
                  schoberCm: value.flexibilidade?.schoberCm ?? null,
                },
              })
            }
          />
          <NumberInput
            label="Schober (lombar)"
            unit="cm"
            step={0.5}
            value={value.flexibilidade?.schoberCm ?? null}
            onChange={(v) =>
              onChange({
                ...value,
                flexibilidade: {
                  sitAndReachCm: value.flexibilidade?.sitAndReachCm ?? null,
                  shoulderMobilityCm:
                    value.flexibilidade?.shoulderMobilityCm ?? null,
                  schoberCm: v,
                },
              })
            }
          />
        </div>
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Cardio"
        description="Cooper (12min) ou Astrand (step + FC) → VO2 estimado"
        active={cardioActive}
      >
        <CardioEditor
          cardio={value.cardio}
          onChange={(cardio) => onChange({ ...value, cardio })}
        />
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Resistência local"
        description="Flexões · abdominais · prancha (tempo)"
        active={resActive}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <NumberInput
            label="Flexões (máx)"
            unit="reps"
            step={1}
            value={value.resistenciaLocal?.flexoesMax ?? null}
            onChange={(v) =>
              onChange({
                ...value,
                resistenciaLocal: {
                  flexoesMax: v,
                  abdominaisMin:
                    value.resistenciaLocal?.abdominaisMin ?? null,
                  pranchaTempoSegundos:
                    value.resistenciaLocal?.pranchaTempoSegundos ?? null,
                },
              })
            }
          />
          <NumberInput
            label="Abdominais (1min)"
            unit="reps"
            step={1}
            value={value.resistenciaLocal?.abdominaisMin ?? null}
            onChange={(v) =>
              onChange({
                ...value,
                resistenciaLocal: {
                  flexoesMax: value.resistenciaLocal?.flexoesMax ?? null,
                  abdominaisMin: v,
                  pranchaTempoSegundos:
                    value.resistenciaLocal?.pranchaTempoSegundos ?? null,
                },
              })
            }
          />
          <NumberInput
            label="Prancha"
            unit="s"
            step={1}
            value={value.resistenciaLocal?.pranchaTempoSegundos ?? null}
            onChange={(v) =>
              onChange({
                ...value,
                resistenciaLocal: {
                  flexoesMax: value.resistenciaLocal?.flexoesMax ?? null,
                  abdominaisMin:
                    value.resistenciaLocal?.abdominaisMin ?? null,
                  pranchaTempoSegundos: v,
                },
              })
            }
          />
        </div>
      </CollapsibleBlock>
    </div>
  )
}

// ===== RM Row =====

function RMRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: RMTeste | null
  onChange: (rm: RMTeste | null) => void
}) {
  const peso = value?.pesoTesteKg ?? null
  const reps = value?.repsTeste ?? null
  const estimado = calcular1RMBrzycki(peso, reps)

  const update = (patch: { peso?: number | null; reps?: number | null }) => {
    const newPeso = patch.peso !== undefined ? patch.peso : peso
    const newReps = patch.reps !== undefined ? patch.reps : reps
    if (newPeso == null && newReps == null) {
      onChange(null)
      return
    }
    if (newPeso != null && newReps != null) {
      const calc = calcular1RMBrzycki(newPeso, newReps) ?? 0
      onChange({
        pesoTesteKg: newPeso,
        repsTeste: newReps,
        estimadoKg: calc,
        formula: 'brzycki',
      })
    } else {
      onChange({
        pesoTesteKg: newPeso ?? 0,
        repsTeste: newReps ?? 0,
        estimadoKg: 0,
        formula: 'brzycki',
      })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-2 rounded-lg bg-slate-50/40 p-3 sm:grid-cols-[1fr_1fr_1fr_1fr] dark:bg-slate-900/40">
      <p className="self-end pb-2 text-[13px] font-semibold text-slate-900 dark:text-slate-50">
        {label}
      </p>
      <NumberInput
        label="Peso teste"
        unit="kg"
        value={peso}
        onChange={(v) => update({ peso: v })}
      />
      <NumberInput
        label="Reps"
        step={1}
        value={reps}
        onChange={(v) => update({ reps: v })}
      />
      <NumberInput
        label="1RM estimado"
        unit="kg"
        value={estimado}
        onChange={() => {}}
        computed
        hint="Brzycki"
      />
    </div>
  )
}

// ===== FMS Editor =====

function FMSEditor({
  fms,
  onChange,
}: {
  fms: { totalScore: number } & FMSValues | null
  onChange: (fms: ({ totalScore: number } & FMSValues) | null) => void
}) {
  const values: FMSValues = {
    deepSquat: fms?.deepSquat ?? 0,
    hurdleStep: fms?.hurdleStep ?? 0,
    inLineLunge: fms?.inLineLunge ?? 0,
    shoulderMobility: fms?.shoulderMobility ?? 0,
    activeStraightLegRaise: fms?.activeStraightLegRaise ?? 0,
    trunkStabilityPushup: fms?.trunkStabilityPushup ?? 0,
    rotaryStability: fms?.rotaryStability ?? 0,
  }

  const setScore = (key: keyof FMSValues, score: number) => {
    const next = { ...values, [key]: score }
    onChange({ ...next, totalScore: fmsTotal(next) })
  }

  return (
    <div className="space-y-2">
      {FMS_TESTES.map((t) => (
        <div
          key={t.key}
          className="flex items-center justify-between gap-3 rounded-lg bg-slate-50/40 px-3 py-2 dark:bg-slate-900/40"
        >
          <p className="min-w-0 flex-1 truncate text-[12px] text-slate-700 dark:text-slate-300">
            {t.label}
          </p>
          <ScorePicker
            value={values[t.key]}
            onChange={(score) => setScore(t.key, score)}
          />
        </div>
      ))}
      <div className="flex items-center justify-between rounded-lg bg-violet-50 px-3 py-2 dark:bg-violet-900/20">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300">
          Total FMS
        </p>
        <p className="font-mono text-base font-semibold tabular-nums text-violet-900 dark:text-violet-100">
          {fmsTotal(values)} <span className="text-xs font-normal">/ 21</span>
        </p>
      </div>
    </div>
  )
}

function ScorePicker({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="inline-flex rounded-md bg-white ring-1 ring-inset ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      {[0, 1, 2, 3].map((s) => {
        const active = value === s
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={`
              h-7 w-7 font-mono text-[12px] font-semibold tabular-nums transition-colors
              ${
                active
                  ? 'bg-violet-600 text-white dark:bg-violet-500'
                  : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'
              }
              ${s === 0 ? 'rounded-l-md' : ''}
              ${s === 3 ? 'rounded-r-md' : ''}
            `}
          >
            {s}
          </button>
        )
      })}
    </div>
  )
}

// ===== Cardio Editor =====

function CardioEditor({
  cardio,
  onChange,
}: {
  cardio: Funcional['cardio']
  onChange: (cardio: Funcional['cardio']) => void
}) {
  const [protocolo, setProtocolo] = useState<'cooper' | 'astrand'>(
    cardio?.protocolo ?? 'cooper',
  )

  const update = (patch: Partial<NonNullable<Funcional['cardio']>>) => {
    onChange({
      protocolo: protocolo,
      metricaPrincipal: cardio?.metricaPrincipal ?? 0,
      vo2Estimado: cardio?.vo2Estimado ?? null,
      fcMedia: cardio?.fcMedia ?? null,
      fcRecuperacao: cardio?.fcRecuperacao ?? null,
      ...patch,
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Protocolo
        </p>
        <div className="mt-1.5">
          <Segmented
            options={[
              { id: 'cooper', label: 'Cooper · 12min' },
              { id: 'astrand', label: 'Astrand · step' },
            ]}
            value={protocolo}
            onChange={(id) => {
              setProtocolo(id)
              update({ protocolo: id })
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <NumberInput
          label={
            protocolo === 'cooper'
              ? 'Distância (12min)'
              : 'Step (degraus/min)'
          }
          unit={protocolo === 'cooper' ? 'm' : 'd/min'}
          step={protocolo === 'cooper' ? 50 : 1}
          value={cardio?.metricaPrincipal ?? null}
          onChange={(v) => update({ metricaPrincipal: v ?? 0 })}
        />
        <NumberInput
          label="VO2 estimado"
          unit="mL/kg/min"
          value={cardio?.vo2Estimado ?? null}
          onChange={(v) => update({ vo2Estimado: v })}
        />
        <NumberInput
          label="FC média"
          unit="bpm"
          step={1}
          value={cardio?.fcMedia ?? null}
          onChange={(v) => update({ fcMedia: v })}
        />
        <NumberInput
          label="FC recuperação (1min)"
          unit="bpm"
          step={1}
          value={cardio?.fcRecuperacao ?? null}
          onChange={(v) => update({ fcRecuperacao: v })}
        />
      </div>
    </div>
  )
}
