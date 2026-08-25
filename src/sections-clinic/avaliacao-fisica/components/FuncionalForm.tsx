import type {
  Cardio,
  FMS,
  Flexibilidade,
  Funcional,
  OneRM,
  ResistenciaLocal,
  RMTeste,
} from '@/../product-clinic/sections/avaliacao-fisica/types'
import {
  FMS_TESTES,
  FUNCIONAL_VAZIO,
  RM_LABEL,
  calcular1RMBrzycki,
  classificarFMS,
  fmsTotal,
  vo2Cooper,
} from './formulas'
import {
  ClassBadge,
  CollapsibleBlock,
  NumberInput,
  ScorePicker,
  Segmented,
} from './FormPrimitives'
import { numero } from './helpers'

interface Props {
  funcional: Funcional | null
  pesoKg: number | null
  onChange: (funcional: Funcional) => void
}

/**
 * A metade de desempenho da avaliação — força, mobilidade, aptidão cardiorrespiratória e
 * resistência local. É o que o educador físico mede e a nutricionista não; existe como aba
 * separada em vez de mais blocos porque, para a nutrição, ela nunca é preenchida, e um
 * formulário que mostra cinco blocos vazios ensina que a avaliação está incompleta.
 */
export function FuncionalForm({ funcional, pesoKg, onChange }: Props) {
  const f = funcional ?? FUNCIONAL_VAZIO
  const patch = (p: Partial<Funcional>) => onChange({ ...f, ...p })

  const setRm = (id: keyof OneRM, teste: RMTeste | null) =>
    patch({ rm: { ...f.rm, [id]: teste } })

  const setFlex = (p: Partial<Flexibilidade>) =>
    patch({
      flexibilidade: {
        sentaEAlcancaCm: f.flexibilidade?.sentaEAlcancaCm ?? null,
        mobilidadeOmbroCm: f.flexibilidade?.mobilidadeOmbroCm ?? null,
        schoberCm: f.flexibilidade?.schoberCm ?? null,
        ...p,
      },
    })

  const setResistencia = (p: Partial<ResistenciaLocal>) =>
    patch({
      resistenciaLocal: {
        flexoesMax: f.resistenciaLocal?.flexoesMax ?? null,
        abdominais1min: f.resistenciaLocal?.abdominais1min ?? null,
        pranchaSegundos: f.resistenciaLocal?.pranchaSegundos ?? null,
        ...p,
      },
    })

  const setCardio = (p: Partial<Cardio>) =>
    patch({
      cardio: {
        protocolo: f.cardio?.protocolo ?? 'cooper',
        metricaPrincipal: f.cardio?.metricaPrincipal ?? null,
        vo2Informado: f.cardio?.vo2Informado ?? null,
        fcMedia: f.cardio?.fcMedia ?? null,
        fcRecuperacao: f.cardio?.fcRecuperacao ?? null,
        ...p,
      },
    })

  const temRM = Object.values(f.rm).some((r) => r != null)
  const total = fmsTotal(f.fms)
  const cardio = f.cardio
  const protocolo = cardio?.protocolo ?? 'cooper'

  return (
    <div className="space-y-3">
      <CollapsibleBlock
        title="Força · 1RM estimado"
        description="Teste submáximo → Brzycki: peso × 36 / (37 − reps)"
        defaultOpen
        active={temRM}
        badge={
          pesoKg && temRM ? (
            <span className="rounded-full bg-teal-50 px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
              {numero(
                (Object.keys(RM_LABEL) as (keyof OneRM)[])
                  .map((id) =>
                    calcular1RMBrzycki(f.rm[id]?.pesoTesteKg ?? null, f.rm[id]?.repsTeste ?? null),
                  )
                  .filter((v): v is number => v != null)
                  .reduce((a, b) => a + b, 0) / pesoKg,
                2,
              )}
              × o peso
            </span>
          ) : undefined
        }
      >
        <div className="space-y-2">
          {(Object.keys(RM_LABEL) as (keyof OneRM)[]).map((id) => (
            <LinhaRM
              key={id}
              label={RM_LABEL[id]}
              teste={f.rm[id]}
              onChange={(t) => setRm(id, t)}
            />
          ))}
          <p className="text-[10px] leading-snug text-slate-400">
            Acima de ~10 repetições a Brzycki superestima — por isso o teste aparece ao lado do
            resultado, e não só o 1RM.
          </p>
        </div>
      </CollapsibleBlock>

      <CollapsibleBlock
        title="FMS · triagem de movimento"
        description="7 sub-testes, 0 a 3 cada. Zero é dor, não desempenho ruim."
        active={f.fms != null}
        badge={
          total != null ? (
            <>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {total}/21
              </span>
              <ClassBadge classificacao={classificarFMS(f.fms)} />
            </>
          ) : undefined
        }
      >
        <div className="space-y-1.5">
          {FMS_TESTES.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/40"
            >
              <span className="min-w-0 flex-1 truncate text-xs text-slate-700 dark:text-slate-300">
                {t.label}
              </span>
              <ScorePicker
                value={f.fms?.[t.id] ?? 0}
                onChange={(score) => {
                  const base: FMS = f.fms ?? {
                    agachamentoProfundo: 0,
                    passagemBarreira: 0,
                    avancoLinha: 0,
                    mobilidadeOmbro: 0,
                    elevacaoPernaEstendida: 0,
                    estabilidadeTroncoFlexao: 0,
                    estabilidadeRotatoria: 0,
                  }
                  patch({ fms: { ...base, [t.id]: score } })
                }}
              />
            </div>
          ))}
          <p className="text-[10px] leading-snug text-slate-400">
            O corte validado é 14: abaixo dele, risco aumentado de lesão. Mas zero em qualquer
            sub-teste manda encaminhar antes de prescrever, mesmo com o total alto — o total
            esconde a dor.
          </p>
        </div>
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Flexibilidade"
        description="Senta-e-alcança · mobilidade de ombro · Schober"
        active={f.flexibilidade != null}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <NumberInput
            label="Senta-e-alcança"
            unit="cm"
            step={0.5}
            value={f.flexibilidade?.sentaEAlcancaCm ?? null}
            onChange={(v) => setFlex({ sentaEAlcancaCm: v })}
          />
          <NumberInput
            label="Mobilidade de ombro"
            unit="cm"
            step={0.5}
            value={f.flexibilidade?.mobilidadeOmbroCm ?? null}
            onChange={(v) => setFlex({ mobilidadeOmbroCm: v })}
            hint="distância entre punhos"
          />
          <NumberInput
            label="Schober"
            unit="cm"
            step={0.5}
            value={f.flexibilidade?.schoberCm ?? null}
            onChange={(v) => setFlex({ schoberCm: v })}
            hint="mobilidade lombar"
          />
        </div>
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Aptidão cardiorrespiratória"
        description="Cooper (12 min) ou Åstrand (step) → VO₂máx"
        active={cardio != null}
        badge={
          vo2Cooper(protocolo === 'cooper' ? (cardio?.metricaPrincipal ?? null) : null) != null ||
          cardio?.vo2Informado != null ? (
            <span className="rounded-full bg-teal-50 px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
              VO₂{' '}
              {numero(
                protocolo === 'cooper'
                  ? vo2Cooper(cardio?.metricaPrincipal ?? null)
                  : (cardio?.vo2Informado ?? null),
              )}
            </span>
          ) : undefined
        }
      >
        <div className="space-y-3">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Protocolo
            </p>
            <div className="mt-1.5">
              <Segmented
                options={[
                  { id: 'cooper', label: 'Cooper · 12 min' },
                  { id: 'astrand', label: 'Åstrand · step' },
                ]}
                value={protocolo}
                onChange={(id) => setCardio({ protocolo: id })}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <NumberInput
              label={protocolo === 'cooper' ? 'Distância em 12 min' : 'Cadência do step'}
              unit={protocolo === 'cooper' ? 'm' : 'd/min'}
              step={protocolo === 'cooper' ? 10 : 1}
              value={cardio?.metricaPrincipal ?? null}
              onChange={(v) => setCardio({ metricaPrincipal: v })}
            />
            {protocolo === 'cooper' ? (
              <NumberInput
                label="VO₂máx"
                unit="mL/kg/min"
                value={
                  vo2Cooper(cardio?.metricaPrincipal ?? null) != null
                    ? Math.round(vo2Cooper(cardio!.metricaPrincipal)! * 10) / 10
                    : null
                }
                computed
                hint="(distância − 504,9) / 44,73"
              />
            ) : (
              <NumberInput
                label="VO₂máx"
                unit="mL/kg/min"
                value={cardio?.vo2Informado ?? null}
                onChange={(v) => setCardio({ vo2Informado: v })}
                hint="do nomograma de Åstrand"
              />
            )}
            <NumberInput
              label="FC média"
              unit="bpm"
              step={1}
              value={cardio?.fcMedia ?? null}
              onChange={(v) => setCardio({ fcMedia: v })}
            />
            <NumberInput
              label="FC recuperação"
              unit="bpm"
              step={1}
              value={cardio?.fcRecuperacao ?? null}
              onChange={(v) => setCardio({ fcRecuperacao: v })}
              hint="1 min após o esforço"
            />
          </div>
        </div>
      </CollapsibleBlock>

      <CollapsibleBlock
        title="Resistência local"
        description="Flexões · abdominais · prancha isométrica"
        active={f.resistenciaLocal != null}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <NumberInput
            label="Flexões (máximo)"
            unit="reps"
            step={1}
            value={f.resistenciaLocal?.flexoesMax ?? null}
            onChange={(v) => setResistencia({ flexoesMax: v })}
          />
          <NumberInput
            label="Abdominais (1 min)"
            unit="reps"
            step={1}
            value={f.resistenciaLocal?.abdominais1min ?? null}
            onChange={(v) => setResistencia({ abdominais1min: v })}
          />
          <NumberInput
            label="Prancha"
            unit="s"
            step={1}
            value={f.resistenciaLocal?.pranchaSegundos ?? null}
            onChange={(v) => setResistencia({ pranchaSegundos: v })}
          />
        </div>
      </CollapsibleBlock>
    </div>
  )
}

function LinhaRM({
  label,
  teste,
  onChange,
}: {
  label: string
  teste: RMTeste | null
  onChange: (t: RMTeste | null) => void
}) {
  const peso = teste?.pesoTesteKg ?? null
  const reps = teste?.repsTeste ?? null
  const estimado = calcular1RMBrzycki(peso, reps)

  const atualizar = (p: Partial<RMTeste>) => {
    const proximo: RMTeste = { pesoTesteKg: peso, repsTeste: reps, ...p }
    // Linha zerada volta a ser "não testado" — não um teste com zero.
    if (proximo.pesoTesteKg == null && proximo.repsTeste == null) return onChange(null)
    onChange(proximo)
  }

  return (
    <div className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_1fr_1fr] dark:bg-slate-800/40">
      <p className="self-end pb-2 text-xs font-semibold text-slate-900 dark:text-slate-50">
        {label}
      </p>
      <NumberInput
        label="Peso do teste"
        unit="kg"
        step={2.5}
        value={peso}
        onChange={(v) => atualizar({ pesoTesteKg: v })}
      />
      <NumberInput
        label="Repetições"
        step={1}
        min={1}
        max={36}
        value={reps}
        onChange={(v) => atualizar({ repsTeste: v })}
      />
      <NumberInput
        label="1RM estimado"
        unit="kg"
        value={estimado != null ? Math.round(estimado * 10) / 10 : null}
        computed
        hint={reps ? `de ${reps} rep${reps > 1 ? 's' : ''}` : 'Brzycki'}
      />
    </div>
  )
}
