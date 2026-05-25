import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import type {
  DiaSemana,
  Disponibilidade,
  IntervaloHorario,
} from '@/../product/sections/configura-es-nutri/types'
import { Card, PanelHeader, SaveBar } from './_shared'

interface DisponibilidadePanelProps {
  disponibilidade: Disponibilidade
  duracoesSlot: number[]
  onSave?: (disponibilidade: Disponibilidade) => void
  onAddIntervalo?: (dia: DiaSemana, inicio: string, fim: string) => void
  onRemoveIntervalo?: (dia: DiaSemana, intervaloId: string) => void
}

const DIAS: { id: DiaSemana; label: string; short: string }[] = [
  { id: 'domingo', label: 'Domingo', short: 'DOM' },
  { id: 'segunda', label: 'Segunda', short: 'SEG' },
  { id: 'terca', label: 'Terça', short: 'TER' },
  { id: 'quarta', label: 'Quarta', short: 'QUA' },
  { id: 'quinta', label: 'Quinta', short: 'QUI' },
  { id: 'sexta', label: 'Sexta', short: 'SEX' },
  { id: 'sabado', label: 'Sábado', short: 'SAB' },
]

export function DisponibilidadePanel({
  disponibilidade,
  duracoesSlot,
  onSave,
}: DisponibilidadePanelProps) {
  const [draft, setDraft] = useState<Disponibilidade>(disponibilidade)

  const dirty = JSON.stringify(draft) !== JSON.stringify(disponibilidade)

  const totalIntervalos = Object.values(draft.intervalosPorDia).reduce(
    (sum, list) => sum + list.length,
    0,
  )

  function addIntervalo(dia: DiaSemana) {
    const novo: IntervaloHorario = {
      id: `int-${dia}-${Date.now()}`,
      inicio: '09:00',
      fim: '18:00',
    }
    setDraft((d) => ({
      ...d,
      intervalosPorDia: {
        ...d.intervalosPorDia,
        [dia]: [...d.intervalosPorDia[dia], novo],
      },
    }))
  }

  function removeIntervalo(dia: DiaSemana, id: string) {
    setDraft((d) => ({
      ...d,
      intervalosPorDia: {
        ...d.intervalosPorDia,
        [dia]: d.intervalosPorDia[dia].filter((i) => i.id !== id),
      },
    }))
  }

  function updateIntervalo(
    dia: DiaSemana,
    id: string,
    patch: Partial<IntervaloHorario>,
  ) {
    setDraft((d) => ({
      ...d,
      intervalosPorDia: {
        ...d.intervalosPorDia,
        [dia]: d.intervalosPorDia[dia].map((i) => (i.id === id ? { ...i, ...patch } : i)),
      },
    }))
  }

  return (
    <div>
      <PanelHeader
        eyebrow="Disponibilidade"
        title="Horários de atendimento"
        description={`${totalIntervalos} ${totalIntervalos === 1 ? 'intervalo' : 'intervalos'} configurados nos 7 dias da semana.`}
      />

      <div className="space-y-4">
        <Card title="Janelas de atendimento" description="Os intervalos definem quando seus pacientes podem agendar pelo app.">
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {DIAS.map((dia) => {
              const intervalos = draft.intervalosPorDia[dia.id]
              const ativo = intervalos.length > 0
              return (
                <li key={dia.id} className="flex items-start gap-4 py-3">
                  <div className="w-20 shrink-0 pt-1.5">
                    <p
                      className={`text-sm font-semibold ${
                        ativo
                          ? 'text-slate-900 dark:text-slate-100'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {dia.label}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
                      {dia.short}
                    </p>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    {intervalos.length === 0 ? (
                      <span className="text-xs text-slate-500 dark:text-slate-500">Indisponível</span>
                    ) : (
                      intervalos.map((int) => (
                        <span
                          key={int.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2 py-1 ring-1 ring-teal-200/60 dark:bg-teal-950/40 dark:ring-teal-900/60"
                        >
                          <input
                            type="time"
                            value={int.inicio}
                            onChange={(e) => updateIntervalo(dia.id, int.id, { inicio: e.target.value })}
                            className="bg-transparent font-mono text-xs text-teal-800 dark:text-teal-300 focus:outline-none"
                          />
                          <span className="text-teal-500">→</span>
                          <input
                            type="time"
                            value={int.fim}
                            onChange={(e) => updateIntervalo(dia.id, int.id, { fim: e.target.value })}
                            className="bg-transparent font-mono text-xs text-teal-800 dark:text-teal-300 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeIntervalo(dia.id, int.id)}
                            className="ml-0.5 rounded p-0.5 text-teal-700/70 hover:bg-teal-100 hover:text-teal-900 dark:text-teal-400/70 dark:hover:bg-teal-900/40 dark:hover:text-teal-100"
                            aria-label="Remover intervalo"
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))
                    )}
                    <button
                      type="button"
                      onClick={() => addIntervalo(dia.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
                    >
                      <Plus size={11} />
                      Adicionar
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card
          title="Configuração de slots"
          description="Define como os horários disponíveis viram slots de agendamento na Agenda."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Duração padrão">
              <div className="flex flex-wrap gap-1">
                {duracoesSlot.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setDraft((s) => ({ ...s, duracaoSlotMinutos: d as 15 | 30 | 45 | 60 }))
                    }
                    className={`
                      rounded-md px-2.5 py-1.5 text-xs font-semibold transition
                      ${draft.duracaoSlotMinutos === d
                        ? 'bg-teal-600 text-white shadow-sm dark:bg-teal-500'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
                    `}
                  >
                    {d}min
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Antecedência mínima" hint="Tempo mínimo entre o agendamento e o atendimento">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={draft.antecedenciaMinimaHoras}
                  onChange={(e) =>
                    setDraft((s) => ({
                      ...s,
                      antecedenciaMinimaHoras: Math.max(0, parseInt(e.target.value || '0', 10)),
                    }))
                  }
                  className={INPUT_CLASS}
                />
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">horas</span>
              </div>
            </Field>

            <Field label="Janela máxima" hint="Quanto à frente um paciente pode agendar">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={draft.janelaMaximaDias}
                  onChange={(e) =>
                    setDraft((s) => ({
                      ...s,
                      janelaMaximaDias: Math.max(1, parseInt(e.target.value || '1', 10)),
                    }))
                  }
                  className={INPUT_CLASS}
                />
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">dias</span>
              </div>
            </Field>
          </div>
        </Card>
      </div>

      <SaveBar
        dirty={dirty}
        onSave={() => onSave?.(draft)}
        onDiscard={() => setDraft(disponibilidade)}
      />
    </div>
  )
}

const INPUT_CLASS = `
  block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
  focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50
`

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-400">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-500">{hint}</span>
      )}
    </label>
  )
}
