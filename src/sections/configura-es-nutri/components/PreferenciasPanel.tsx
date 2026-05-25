import { Globe, Bell, Cake, RefreshCcw, Languages } from 'lucide-react'
import type {
  AntecedenciaConsulta,
  AntecedenciaOpcao,
  IdiomaCodigo,
  OpcaoIdioma,
  Preferencias,
  PreferenciasLembretes,
  PreferenciasUnidades,
  UnidadeAltura,
  UnidadeEnergia,
  UnidadePeso,
  UnidadeVolume,
} from '@/../product/sections/configura-es-nutri/types'
import { Card, PanelHeader, ToggleRow } from './_shared'

interface PreferenciasPanelProps {
  preferencias: Preferencias
  idiomas: OpcaoIdioma[]
  antecedenciaOpcoes: AntecedenciaOpcao[]
  onChangeIdioma?: (idioma: IdiomaCodigo) => void
  onChangeUnidades?: (unidades: PreferenciasUnidades) => void
  onChangeLembretes?: (lembretes: PreferenciasLembretes) => void
}

export function PreferenciasPanel({
  preferencias,
  idiomas,
  antecedenciaOpcoes,
  onChangeIdioma,
  onChangeUnidades,
  onChangeLembretes,
}: PreferenciasPanelProps) {
  function setUnidade<K extends keyof PreferenciasUnidades>(key: K, val: PreferenciasUnidades[K]) {
    onChangeUnidades?.({ ...preferencias.unidades, [key]: val })
  }

  function toggleAntecedencia(value: AntecedenciaConsulta) {
    const cur = preferencias.lembretes.antecedenciaConsulta
    const next = cur.includes(value)
      ? cur.filter((v) => v !== value)
      : [...cur, value]
    onChangeLembretes?.({ ...preferencias.lembretes, antecedenciaConsulta: next })
  }

  function setLembrete<K extends keyof PreferenciasLembretes>(
    key: K,
    val: PreferenciasLembretes[K],
  ) {
    onChangeLembretes?.({ ...preferencias.lembretes, [key]: val })
  }

  return (
    <div>
      <PanelHeader
        eyebrow="Preferências"
        title="Idioma, unidades e lembretes"
        description="Ajustes pessoais que afetam apenas a sua experiência no Nymos."
      />

      <div className="space-y-4">
        <Card title="Idioma" description="Idioma usado em toda a interface do Nymos." trailing={<Languages size={14} className="text-slate-400" />}>
          <div className="grid grid-cols-3 gap-2">
            {idiomas.map((idioma) => {
              const active = preferencias.idioma === idioma.value
              return (
                <button
                  key={idioma.value}
                  type="button"
                  onClick={() => onChangeIdioma?.(idioma.value)}
                  className={`
                    flex flex-col items-center gap-2 rounded-xl border px-4 py-3 transition
                    ${active
                      ? 'border-teal-300 bg-teal-50 ring-2 ring-teal-200 dark:border-teal-700 dark:bg-teal-950/40 dark:ring-teal-900/60'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/40'}
                  `}
                >
                  <span className="text-3xl leading-none">{idioma.bandeira}</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {idioma.codigo}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      active
                        ? 'text-teal-800 dark:text-teal-200'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {idioma.label}
                  </span>
                </button>
              )
            })}
          </div>
        </Card>

        <Card
          title="Fuso horário"
          description="Define como horários de consulta e lembretes são exibidos."
          trailing={<Globe size={14} className="text-slate-400" />}
        >
          <select
            value={preferencias.fusoHorario}
            onChange={() => {
              /* fuso change — out of MVP scope, just a placeholder */
            }}
            className="
              block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
              focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50
            "
          >
            <option value="America/Sao_Paulo">São Paulo · GMT-3</option>
            <option value="America/Manaus">Manaus · GMT-4</option>
            <option value="America/Recife">Recife · GMT-3</option>
            <option value="America/Noronha">Noronha · GMT-2</option>
          </select>
        </Card>

        <Card title="Unidades" description="Aplicado em planos, avaliações e métricas exibidas a você.">
          <div className="space-y-3">
            <UnidadeRow
              label="Peso"
              options={[
                { value: 'kg', label: 'kg' },
                { value: 'lb', label: 'lb' },
              ]}
              value={preferencias.unidades.peso}
              onChange={(v) => setUnidade('peso', v as UnidadePeso)}
            />
            <UnidadeRow
              label="Altura / comprimento"
              options={[
                { value: 'cm', label: 'cm' },
                { value: 'in', label: 'in' },
              ]}
              value={preferencias.unidades.altura}
              onChange={(v) => setUnidade('altura', v as UnidadeAltura)}
            />
            <UnidadeRow
              label="Energia"
              options={[
                { value: 'kcal', label: 'kcal' },
                { value: 'cal', label: 'cal' },
              ]}
              value={preferencias.unidades.energia}
              onChange={(v) => setUnidade('energia', v as UnidadeEnergia)}
            />
            <UnidadeRow
              label="Volume"
              options={[
                { value: 'ml', label: 'ml' },
                { value: 'oz', label: 'oz' },
              ]}
              value={preferencias.unidades.volume}
              onChange={(v) => setUnidade('volume', v as UnidadeVolume)}
            />
          </div>
        </Card>

        <Card title="Lembretes" description="Quando o Nymos te avisa sobre eventos importantes." trailing={<Bell size={14} className="text-slate-400" />}>
          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                Antecedência de consulta
              </p>
              <p className="mb-2 text-[11px] text-slate-500 dark:text-slate-500">
                Selecione um ou mais momentos para receber lembretes antes da consulta.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {antecedenciaOpcoes.map((opt) => {
                  const active = preferencias.lembretes.antecedenciaConsulta.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleAntecedencia(opt.value)}
                      className={`
                        rounded-full px-3 py-1 text-xs font-medium transition
                        ${active
                          ? 'bg-teal-600 text-white shadow-sm dark:bg-teal-500'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
                      `}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="-mx-1 divide-y divide-slate-200 dark:divide-slate-800">
              <ToggleRow
                icon={<Cake size={14} strokeWidth={1.75} />}
                label="Aniversário do paciente"
                description="Recebe um lembrete no dia do aniversário de cada paciente."
                checked={preferencias.lembretes.aniversarioPaciente}
                onChange={(v) => setLembrete('aniversarioPaciente', v)}
              />
              <ToggleRow
                icon={<RefreshCcw size={14} strokeWidth={1.75} />}
                label="Revisão de plano vencendo"
                description="Avisa quando um plano se aproxima do prazo de revisão."
                checked={preferencias.lembretes.revisaoPlanoVencendo}
                onChange={(v) => setLembrete('revisaoPlanoVencendo', v)}
              />
              {preferencias.lembretes.revisaoPlanoVencendo && (
                <div className="flex items-center justify-between gap-3 px-1 py-3 pl-10">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Avisar com quantos dias de antecedência?
                  </p>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={preferencias.lembretes.diasAntecedenciaRevisao}
                      onChange={(e) =>
                        setLembrete(
                          'diasAntecedenciaRevisao',
                          Math.max(1, Math.min(30, parseInt(e.target.value || '1', 10))),
                        )
                      }
                      className="
                        w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-mono text-slate-900
                        focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20
                        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50
                      "
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      dias
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function UnidadeRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</p>
      <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
        {options.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                rounded-md px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider transition
                ${active
                  ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                  : 'text-slate-500 dark:text-slate-400'}
              `}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
