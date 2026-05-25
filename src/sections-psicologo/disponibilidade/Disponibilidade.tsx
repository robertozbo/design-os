import { useState } from 'react'
import data from '@/../product-psicologo/sections/disponibilidade/data.json'
import type {
  DayOfWeek,
  DisponibilidadeData,
  Intervalo,
  SlotMinutes,
  AntecedenciaHoras,
} from '@/../product-psicologo/sections/disponibilidade/types'
import { Disponibilidade as DisponibilidadeComponent } from './components/Disponibilidade'

export default function DisponibilidadePreview() {
  const [state, setState] = useState<DisponibilidadeData>(data as unknown as DisponibilidadeData)
  const [pristine, setPristine] = useState<DisponibilidadeData>(data as unknown as DisponibilidadeData)

  const hasChanges = JSON.stringify(state) !== JSON.stringify(pristine)

  const updateDia = (
    dayOfWeek: DayOfWeek,
    update: (dia: DisponibilidadeData['dias'][number]) => DisponibilidadeData['dias'][number],
  ) => {
    setState((s) => ({
      ...s,
      dias: s.dias.map((d) => (d.dayOfWeek === dayOfWeek ? update(d) : d)),
    }))
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        body, [data-nymos-psicologo],
        [data-nymos-psicologo] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-psicologo] .font-mono,
        [data-nymos-psicologo] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <div data-nymos-psicologo="true">
        <DisponibilidadeComponent
          data={state}
          hasChanges={hasChanges}
          onToggleDia={(d) => {
            updateDia(d, (dia) => ({
              ...dia,
              ativo: !dia.ativo,
              intervalos:
                !dia.ativo && dia.intervalos.length === 0
                  ? [{ id: `${d}-${Date.now()}`, inicio: '08:00', fim: '18:00' }]
                  : dia.intervalos,
            }))
          }}
          onAddIntervalo={(d) => {
            updateDia(d, (dia) => ({
              ...dia,
              intervalos: [
                ...dia.intervalos,
                { id: `${d}-${Date.now()}`, inicio: '14:00', fim: '18:00' },
              ],
            }))
          }}
          onUpdateIntervalo={(d, intervaloId, patch) => {
            updateDia(d, (dia) => ({
              ...dia,
              intervalos: dia.intervalos.map((i) =>
                i.id === intervaloId ? { ...i, ...patch } : i,
              ),
            }))
          }}
          onRemoveIntervalo={(d, intervaloId) => {
            updateDia(d, (dia) => ({
              ...dia,
              intervalos: dia.intervalos.filter((i) => i.id !== intervaloId),
            }))
          }}
          onCopiarDia={(fromDay, toDays) => {
            const fonte = state.dias.find((x) => x.dayOfWeek === fromDay)
            if (!fonte) return
            setState((s) => ({
              ...s,
              dias: s.dias.map((d) =>
                toDays.includes(d.dayOfWeek)
                  ? {
                      ...d,
                      ativo: fonte.ativo,
                      intervalos: fonte.intervalos.map(
                        (i): Intervalo => ({
                          ...i,
                          id: `${d.dayOfWeek}-${i.id}-${Date.now()}`,
                        }),
                      ),
                      slotMinutesOverride: fonte.slotMinutesOverride,
                    }
                  : d,
              ),
            }))
          }}
          onLimparDia={(d) => {
            updateDia(d, (dia) => ({ ...dia, ativo: false, intervalos: [] }))
          }}
          onSetSlotPadrao={(m: SlotMinutes) => setState((s) => ({ ...s, slotMinutesPadrao: m }))}
          onSetAntecedencia={(h: AntecedenciaHoras) =>
            setState((s) => ({ ...s, antecedenciaMinima: h }))
          }
          onToggleBloqueio={() =>
            setState((s) => ({ ...s, bloqueioEntreSessoes: !s.bloqueioEntreSessoes }))
          }
          onAplicarTemplate={(t) => {
            if (t === 'comercial') {
              setState((s) => ({
                ...s,
                dias: s.dias.map((d) => ({
                  ...d,
                  ativo: d.dayOfWeek >= 1 && d.dayOfWeek <= 5,
                  intervalos:
                    d.dayOfWeek >= 1 && d.dayOfWeek <= 5
                      ? [{ id: `${d.dayOfWeek}-tpl-${Date.now()}`, inicio: '09:00', fim: '18:00' }]
                      : [],
                })),
              }))
            }
          }}
          onLimparTudo={() => {
            setState((s) => ({
              ...s,
              dias: s.dias.map((d) => ({ ...d, ativo: false, intervalos: [] })),
            }))
          }}
          onSalvar={() => setPristine(state)}
          onDescartar={() => setState(pristine)}
        />
      </div>
    </>
  )
}
