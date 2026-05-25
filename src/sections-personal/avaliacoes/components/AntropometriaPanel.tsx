import type { Antropometria } from '@/../product-personal/sections/avaliacoes/types'

interface AntropometriaPanelProps {
  antropometria: Antropometria | null
}

export function AntropometriaPanel({ antropometria }: AntropometriaPanelProps) {
  if (!antropometria) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Esta avaliação não tem dados de antropometria.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Básico */}
        <Panel title="Básico">
          <DataTable
            rows={[
              { label: 'Peso', value: antropometria.pesoKg, unit: 'kg' },
              {
                label: 'Estatura',
                value: antropometria.estaturaCm,
                unit: 'cm',
              },
              {
                label: 'IMC',
                value: antropometria.imc,
                unit: 'kg/m²',
                interpretacao: antropometria.imc
                  ? interpretarIMC(antropometria.imc)
                  : undefined,
              },
            ]}
          />
        </Panel>

        {/* Circunferências */}
        <Panel title="Circunferências">
          <DataTable
            rows={[
              { label: 'Cintura', value: antropometria.circunferencias.cintura, unit: 'cm' },
              { label: 'Quadril', value: antropometria.circunferencias.quadril, unit: 'cm' },
              { label: 'Abdomen', value: antropometria.circunferencias.abdomen, unit: 'cm' },
              { label: 'Braço', value: antropometria.circunferencias.braco, unit: 'cm' },
              { label: 'Coxa', value: antropometria.circunferencias.coxa, unit: 'cm' },
              { label: 'Panturrilha', value: antropometria.circunferencias.panturrilha, unit: 'cm' },
            ]}
          />
          {antropometria.circunferencias.cintura != null &&
            antropometria.circunferencias.quadril != null && (
              <RazaoCQ
                cintura={antropometria.circunferencias.cintura}
                quadril={antropometria.circunferencias.quadril}
              />
            )}
        </Panel>

        {/* Dobras */}
        <Panel
          title="Dobras cutâneas (Pollock 7)"
          rightBadge={
            antropometria.dobras.percentualGorduraPollock != null && (
              <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                %G {antropometria.dobras.percentualGorduraPollock.toFixed(1)}%
              </span>
            )
          }
        >
          <DataTable
            rows={[
              { label: 'Peitoral', value: antropometria.dobras.peitoral, unit: 'mm' },
              { label: 'Axilar média', value: antropometria.dobras.axilarMedia, unit: 'mm' },
              { label: 'Triciptal', value: antropometria.dobras.triciptal, unit: 'mm' },
              { label: 'Subescapular', value: antropometria.dobras.subescapular, unit: 'mm' },
              { label: 'Abdominal', value: antropometria.dobras.abdominal, unit: 'mm' },
              { label: 'Suprailíaca', value: antropometria.dobras.suprailiaca, unit: 'mm' },
              { label: 'Coxa', value: antropometria.dobras.coxa, unit: 'mm' },
            ]}
          />
        </Panel>

        {/* Bioimpedância */}
        <Panel title="Bioimpedância">
          {antropometria.bioimpedancia ? (
            <DataTable
              rows={[
                {
                  label: 'Peso (bioimp)',
                  value: antropometria.bioimpedancia.pesoKg,
                  unit: 'kg',
                },
                {
                  label: '% Gordura',
                  value: antropometria.bioimpedancia.percentualGordura,
                  unit: '%',
                },
                {
                  label: 'Massa magra',
                  value: antropometria.bioimpedancia.massaMagraKg,
                  unit: 'kg',
                },
                {
                  label: '% Água',
                  value: antropometria.bioimpedancia.percentualAgua,
                  unit: '%',
                },
              ]}
            />
          ) : (
            <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
              Sem dados de bioimpedância
            </p>
          )}
        </Panel>
      </div>
    </div>
  )
}

function Panel({
  title,
  children,
  rightBadge,
}: {
  title: string
  children: React.ReactNode
  rightBadge?: React.ReactNode
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          {title}
        </p>
        {rightBadge}
      </header>
      <div className="mt-3">{children}</div>
    </article>
  )
}

function DataTable({
  rows,
}: {
  rows: { label: string; value: number | null; unit: string; interpretacao?: { label: string; tone: string } }[]
}) {
  return (
    <table className="w-full">
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {rows.map((r) => (
          <tr key={r.label}>
            <td className="py-2 text-[12px] text-slate-600 dark:text-slate-400">
              {r.label}
            </td>
            <td className="py-2 text-right">
              {r.value != null ? (
                <>
                  <span className="font-mono text-[14px] font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                    {r.value}
                  </span>
                  <span className="ml-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                    {r.unit}
                  </span>
                  {r.interpretacao && (
                    <span
                      className={`ml-2 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${r.interpretacao.tone}`}
                    >
                      {r.interpretacao.label}
                    </span>
                  )}
                </>
              ) : (
                <span className="font-mono text-[12px] text-slate-400 dark:text-slate-500">
                  —
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function RazaoCQ({ cintura, quadril }: { cintura: number; quadril: number }) {
  const razao = cintura / quadril
  // OMS: homens > 0.90 risco; mulheres > 0.85
  const tone =
    razao > 0.95
      ? 'text-rose-600 dark:text-rose-400'
      : razao > 0.85
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-emerald-600 dark:text-emerald-400'

  return (
    <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Razão Cintura/Quadril
      </span>
      <span className={`font-mono text-sm font-semibold tabular-nums ${tone}`}>
        {razao.toFixed(2)}
      </span>
    </div>
  )
}

function interpretarIMC(imc: number) {
  if (imc < 18.5)
    return {
      label: 'Abaixo',
      tone: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    }
  if (imc < 25)
    return {
      label: 'Eutrófico',
      tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    }
  if (imc < 30)
    return {
      label: 'Sobrepeso',
      tone: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    }
  return {
    label: 'Obesidade',
    tone: 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  }
}
