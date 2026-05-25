import { useMemo } from 'react'
import { Ruler, Droplet, Activity, Pin } from 'lucide-react'
import type {
  CircunferenciaToggles,
  ComposicaoCorporalToggles,
  DobraCutaneaToggles,
  PreferenciasMedicoes,
} from '@/../product/sections/configura-es-nutri/types'
import { Card, PanelHeader, Switch } from './_shared'

interface PreferenciasMedicoesPanelProps {
  preferenciasMedicoes: PreferenciasMedicoes
  onChange?: (next: PreferenciasMedicoes) => void
}

const COMPOSICAO_LABELS: Record<keyof ComposicaoCorporalToggles, string> = {
  percentualGordura: '% Gordura',
  massaMagra: 'Massa magra',
  massaOssea: 'Massa óssea',
  aguaCorporal: 'Água corporal',
  gorduraVisceral: 'Gordura visceral',
  taxaMetabolicaBasal: 'Taxa metabólica basal',
}

const COMPOSICAO_HINTS: Record<keyof ComposicaoCorporalToggles, string> = {
  percentualGordura: '% do peso corporal em gordura',
  massaMagra: 'Massa muscular + outros tecidos não-gordurosos',
  massaOssea: 'Estimativa por bioimpedância',
  aguaCorporal: 'Hidratação total estimada',
  gorduraVisceral: 'Indicador de gordura abdominal interna',
  taxaMetabolicaBasal: 'TMB · gasto energético em repouso',
}

const CIRCUNF_LABELS: Record<keyof CircunferenciaToggles, string> = {
  cintura: 'Cintura',
  quadril: 'Quadril',
  braco: 'Braço',
  coxa: 'Coxa',
  panturrilha: 'Panturrilha',
  peitoral: 'Peitoral',
  pescoco: 'Pescoço',
}

const DOBRAS_LABELS: Record<keyof DobraCutaneaToggles, string> = {
  tricipital: 'Tricipital',
  subescapular: 'Subescapular',
  suprailiaca: 'Suprailíaca',
  abdominal: 'Abdominal',
  coxa: 'Coxa',
}

export function PreferenciasMedicoesPanel({
  preferenciasMedicoes,
  onChange,
}: PreferenciasMedicoesPanelProps) {
  const totalCampos = useMemo(() => {
    const composicao = Object.values(preferenciasMedicoes.composicaoCorporal).filter(Boolean).length
    const circunf = Object.values(preferenciasMedicoes.circunferencias).filter(Boolean).length
    const dobras = Object.values(preferenciasMedicoes.dobrasCutaneas).filter(Boolean).length
    return preferenciasMedicoes.medidasBasicas.length + composicao + circunf + dobras
  }, [preferenciasMedicoes])

  const tempoEstimado = Math.max(2, Math.round(totalCampos * 0.5))

  function setComposicao(key: keyof ComposicaoCorporalToggles, val: boolean) {
    onChange?.({
      ...preferenciasMedicoes,
      composicaoCorporal: { ...preferenciasMedicoes.composicaoCorporal, [key]: val },
    })
  }

  function setCircunf(key: keyof CircunferenciaToggles, val: boolean) {
    onChange?.({
      ...preferenciasMedicoes,
      circunferencias: { ...preferenciasMedicoes.circunferencias, [key]: val },
    })
  }

  function setDobra(key: keyof DobraCutaneaToggles, val: boolean) {
    onChange?.({
      ...preferenciasMedicoes,
      dobrasCutaneas: { ...preferenciasMedicoes.dobrasCutaneas, [key]: val },
    })
  }

  return (
    <div>
      <PanelHeader
        eyebrow="Preferências de Medições"
        title="Campos da avaliação antropométrica"
        description="Escolha quais medidas você costuma coletar para evitar campos sobrando no formulário."
      />

      <div className="space-y-4 pb-20">
        <Card
          title="Medidas básicas"
          description="Sempre incluídas — formam o cálculo de IMC e idade biológica estimada."
          trailing={
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Padrão
            </span>
          }
        >
          <div className="flex flex-wrap gap-2">
            {preferenciasMedicoes.medidasBasicas.map((m) => (
              <span
                key={m.id}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 ring-1 ring-emerald-200/60 dark:bg-emerald-950/40 dark:ring-emerald-900/60"
              >
                <Pin size={11} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-800 dark:text-emerald-200">
                  {m.label}
                </span>
                <span className="font-mono text-[10px] text-emerald-700/70 dark:text-emerald-300/70">
                  {m.unidade}
                </span>
              </span>
            ))}
          </div>
        </Card>

        <Card
          title="Composição corporal"
          description="Geralmente vem da bioimpedância. Habilite só os campos que sua balança fornece."
          trailing={<Droplet size={14} className="text-slate-400" />}
        >
          <ToggleGrid
            entries={Object.keys(COMPOSICAO_LABELS).map((k) => {
              const key = k as keyof ComposicaoCorporalToggles
              return {
                key,
                label: COMPOSICAO_LABELS[key],
                hint: COMPOSICAO_HINTS[key],
                checked: preferenciasMedicoes.composicaoCorporal[key],
                onChange: (v: boolean) => setComposicao(key, v),
              }
            })}
          />
        </Card>

        <Card
          title="Circunferências"
          description="Medidas com fita métrica. Mais usadas: cintura e quadril (RCQ)."
          trailing={<Ruler size={14} className="text-slate-400" />}
        >
          <ToggleGrid
            entries={Object.keys(CIRCUNF_LABELS).map((k) => {
              const key = k as keyof CircunferenciaToggles
              return {
                key,
                label: CIRCUNF_LABELS[key],
                checked: preferenciasMedicoes.circunferencias[key],
                onChange: (v: boolean) => setCircunf(key, v),
              }
            })}
          />
        </Card>

        <Card
          title="Dobras cutâneas"
          description="Medidas com adipômetro. Habilite se você usa protocolo Pollock ou similar."
          trailing={<Activity size={14} className="text-slate-400" />}
        >
          <ToggleGrid
            entries={Object.keys(DOBRAS_LABELS).map((k) => {
              const key = k as keyof DobraCutaneaToggles
              return {
                key,
                label: DOBRAS_LABELS[key],
                checked: preferenciasMedicoes.dobrasCutaneas[key],
                onChange: (v: boolean) => setDobra(key, v),
              }
            })}
          />
        </Card>
      </div>

      {/* Sticky summary */}
      <div className="sticky bottom-4 z-30">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Sua avaliação coleta{' '}
            <strong className="text-teal-700 dark:text-teal-300">{totalCampos} campos</strong>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Tempo estimado · {tempoEstimado} min
          </p>
        </div>
      </div>
    </div>
  )
}

function ToggleGrid<K extends string>({
  entries,
}: {
  entries: { key: K; label: string; hint?: string; checked: boolean; onChange: (next: boolean) => void }[]
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {entries.map((e) => (
        <label
          key={e.key}
          className={`
            flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 transition
            ${e.checked
              ? 'border-teal-200 bg-teal-50/50 dark:border-teal-900/60 dark:bg-teal-950/30'
              : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/40'}
          `}
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{e.label}</p>
            {e.hint && (
              <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {e.hint}
              </p>
            )}
          </div>
          <Switch checked={e.checked} onChange={e.onChange} ariaLabel={e.label} />
        </label>
      ))}
    </div>
  )
}
