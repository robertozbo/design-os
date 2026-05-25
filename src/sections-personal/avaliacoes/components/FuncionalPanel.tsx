import type { Avaliacao, Funcional } from '@/../product-personal/sections/avaliacoes/types'

interface FuncionalPanelProps {
  avaliacao: Avaliacao
  /** Avaliação anterior pra comparação fantasma no radar */
  anterior?: Avaliacao | null
}

export function FuncionalPanel({ avaliacao, anterior }: FuncionalPanelProps) {
  const f = avaliacao.funcional
  if (!f) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Esta avaliação não tem dados de testes funcionais.
        </p>
      </div>
    )
  }

  const perfil = computePerfil(f)
  const perfilAnterior = anterior?.funcional ? computePerfil(anterior.funcional) : null

  return (
    <div className="space-y-5">
      {/* Radar central */}
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center justify-between">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Perfil funcional
          </p>
          {perfilAnterior && (
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Comparando com{' '}
              <span className="text-slate-700 dark:text-slate-200">
                {new Date(anterior!.data).toLocaleDateString('pt-BR')}
              </span>
            </p>
          )}
        </header>

        <RadarChart perfil={perfil} anterior={perfilAnterior} />

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {perfil.eixos.map((eixo) => (
            <div key={eixo.label} className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-900/60">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                {eixo.label}
              </p>
              <p className="mt-0.5 font-mono text-base font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                {Math.round(eixo.valor)}
                <span className="ml-0.5 text-[9px] text-slate-400 dark:text-slate-500">
                  /100
                </span>
              </p>
            </div>
          ))}
        </div>
      </article>

      {/* Blocos detalhados */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 1RM */}
        {(f.rm.supino || f.rm.squat || f.rm.deadlift) && (
          <Panel title="1RM (Brzycki)">
            <div className="space-y-2">
              {f.rm.supino && <RmRow label="Supino" rm={f.rm.supino} />}
              {f.rm.squat && <RmRow label="Squat" rm={f.rm.squat} />}
              {f.rm.deadlift && <RmRow label="Deadlift" rm={f.rm.deadlift} />}
            </div>
            {f.rm.supino && f.rm.squat && f.rm.deadlift && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-teal-50 px-3 py-2 dark:bg-teal-900/30">
                <span className="font-mono text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  Big 3 total
                </span>
                <span className="font-mono text-sm font-semibold tabular-nums text-teal-900 dark:text-teal-100">
                  {f.rm.supino.estimadoKg + f.rm.squat.estimadoKg + f.rm.deadlift.estimadoKg}
                  <span className="ml-0.5 text-[10px] font-normal">kg</span>
                </span>
              </div>
            )}
          </Panel>
        )}

        {/* FMS */}
        {f.fms && (
          <Panel
            title="FMS · Functional Movement Screen"
            rightBadge={
              <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                {f.fms.totalScore}/21
              </span>
            }
          >
            <FMSDisplay fms={f.fms} />
          </Panel>
        )}

        {/* Flexibilidade */}
        {f.flexibilidade && (
          <Panel title="Flexibilidade">
            <table className="w-full">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {f.flexibilidade.sitAndReachCm != null && (
                  <DataRow
                    label="Sit-and-reach"
                    value={f.flexibilidade.sitAndReachCm}
                    unit="cm"
                  />
                )}
                {f.flexibilidade.shoulderMobilityCm != null && (
                  <DataRow
                    label="Mobilidade de ombro"
                    value={f.flexibilidade.shoulderMobilityCm}
                    unit="cm"
                  />
                )}
                {f.flexibilidade.schoberCm != null && (
                  <DataRow
                    label="Schober (lombar)"
                    value={f.flexibilidade.schoberCm}
                    unit="cm"
                  />
                )}
              </tbody>
            </table>
          </Panel>
        )}

        {/* Cardio */}
        {f.cardio && (
          <Panel
            title="Cardio"
            rightBadge={
              <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                {f.cardio.protocolo}
              </span>
            }
          >
            <table className="w-full">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <DataRow
                  label={f.cardio.protocolo === 'cooper' ? 'Distância (12min)' : 'Step (degraus/min)'}
                  value={f.cardio.metricaPrincipal}
                  unit={f.cardio.protocolo === 'cooper' ? 'm' : 'd/min'}
                />
                {f.cardio.vo2Estimado != null && (
                  <DataRow
                    label="VO2 estimado"
                    value={f.cardio.vo2Estimado}
                    unit="mL/kg/min"
                  />
                )}
                {f.cardio.fcMedia != null && (
                  <DataRow
                    label="FC média"
                    value={f.cardio.fcMedia}
                    unit="bpm"
                  />
                )}
                {f.cardio.fcRecuperacao != null && (
                  <DataRow
                    label="FC recuperação (1min)"
                    value={f.cardio.fcRecuperacao}
                    unit="bpm"
                  />
                )}
              </tbody>
            </table>
          </Panel>
        )}

        {/* Resistência local */}
        {f.resistenciaLocal && (
          <Panel title="Resistência local">
            <table className="w-full">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {f.resistenciaLocal.flexoesMax != null && (
                  <DataRow
                    label="Flexões (máx)"
                    value={f.resistenciaLocal.flexoesMax}
                    unit="reps"
                  />
                )}
                {f.resistenciaLocal.abdominaisMin != null && (
                  <DataRow
                    label="Abdominais (1min)"
                    value={f.resistenciaLocal.abdominaisMin}
                    unit="reps"
                  />
                )}
                {f.resistenciaLocal.pranchaTempoSegundos != null && (
                  <DataRow
                    label="Prancha"
                    value={f.resistenciaLocal.pranchaTempoSegundos}
                    unit="s"
                  />
                )}
              </tbody>
            </table>
          </Panel>
        )}
      </div>
    </div>
  )
}

// ===== Subcomponents =====

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

function DataRow({
  label,
  value,
  unit,
}: {
  label: string
  value: number
  unit: string
}) {
  return (
    <tr>
      <td className="py-2 text-[12px] text-slate-600 dark:text-slate-400">
        {label}
      </td>
      <td className="py-2 text-right">
        <span className="font-mono text-[14px] font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {value}
        </span>
        <span className="ml-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
          {unit}
        </span>
      </td>
    </tr>
  )
}

function RmRow({
  label,
  rm,
}: {
  label: string
  rm: { pesoTesteKg: number; repsTeste: number; estimadoKg: number }
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50/40 px-3 py-2 dark:bg-slate-900/40">
      <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </p>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          teste:{' '}
          <span className="tabular-nums text-slate-600 dark:text-slate-300">
            {rm.repsTeste}× {rm.pesoTesteKg}kg
          </span>
        </span>
        <span className="font-mono text-base font-semibold tabular-nums text-teal-700 dark:text-teal-400">
          {rm.estimadoKg}
          <span className="ml-0.5 text-[10px] font-normal">kg</span>
        </span>
      </div>
    </div>
  )
}

function FMSDisplay({
  fms,
}: {
  fms: NonNullable<Funcional['fms']>
}) {
  const items = [
    { label: 'Deep Squat', value: fms.deepSquat },
    { label: 'Hurdle Step', value: fms.hurdleStep },
    { label: 'In-Line Lunge', value: fms.inLineLunge },
    { label: 'Shoulder Mobility', value: fms.shoulderMobility },
    { label: 'Active SLR', value: fms.activeStraightLegRaise },
    { label: 'Trunk Stab. Push-up', value: fms.trunkStabilityPushup },
    { label: 'Rotary Stability', value: fms.rotaryStability },
  ]

  return (
    <ul className="space-y-1.5">
      {items.map((it) => (
        <li
          key={it.label}
          className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40"
        >
          <span className="text-[12px] text-slate-700 dark:text-slate-300">
            {it.label}
          </span>
          <ScoreDots value={it.value} />
        </li>
      ))}
    </ul>
  )
}

function ScoreDots({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3].map((s) => (
        <span
          key={s}
          className={`h-2 w-2 rounded-full ${
            s <= value
              ? value === 0
                ? 'bg-rose-400'
                : 'bg-violet-500 dark:bg-violet-400'
              : 'bg-slate-200 dark:bg-slate-700'
          }`}
        />
      ))}
      <span className="ml-1.5 font-mono text-[11px] font-semibold tabular-nums text-violet-700 dark:text-violet-300">
        {value}
      </span>
    </span>
  )
}

// ===== Radar Chart =====

interface PerfilFuncional {
  eixos: { label: string; valor: number }[]
}

function computePerfil(f: Funcional): PerfilFuncional {
  // Normaliza cada eixo pra 0-100
  // Força: média dos 3 RMs em relação a meta de 150kg cada (= 100)
  const rmTotal =
    (f.rm.supino?.estimadoKg ?? 0) +
    (f.rm.squat?.estimadoKg ?? 0) +
    (f.rm.deadlift?.estimadoKg ?? 0)
  const forca = Math.min(100, (rmTotal / 450) * 100)

  // Mobilidade: FMS score / 21
  const mobilidade = f.fms ? (f.fms.totalScore / 21) * 100 : 0

  // Flexibilidade: sit-and-reach (30cm = 100)
  const flex = f.flexibilidade?.sitAndReachCm
    ? Math.min(100, (f.flexibilidade.sitAndReachCm / 30) * 100)
    : 0

  // Cardio: VO2 (50 mL/kg/min = 100)
  const cardio = f.cardio?.vo2Estimado
    ? Math.min(100, (f.cardio.vo2Estimado / 50) * 100)
    : 0

  // Resistência: prancha (90s = 100) + abs (50 = 100) / média
  const resPrancha = f.resistenciaLocal?.pranchaTempoSegundos
    ? Math.min(100, (f.resistenciaLocal.pranchaTempoSegundos / 90) * 100)
    : null
  const resAbs = f.resistenciaLocal?.abdominaisMin
    ? Math.min(100, (f.resistenciaLocal.abdominaisMin / 50) * 100)
    : null
  const resValores = [resPrancha, resAbs].filter(
    (v): v is number => v !== null,
  )
  const resistencia =
    resValores.length > 0
      ? resValores.reduce((a, b) => a + b, 0) / resValores.length
      : 0

  return {
    eixos: [
      { label: 'Força', valor: forca },
      { label: 'Mobilidade', valor: mobilidade },
      { label: 'Flexibilidade', valor: flex },
      { label: 'Cardio', valor: cardio },
      { label: 'Resistência', valor: resistencia },
    ],
  }
}

function RadarChart({
  perfil,
  anterior,
}: {
  perfil: PerfilFuncional
  anterior: PerfilFuncional | null
}) {
  const size = 280
  const center = size / 2
  const radius = size / 2 - 40
  const n = perfil.eixos.length

  const pointAt = (i: number, valor: number): [number, number] => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const r = (valor / 100) * radius
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)]
  }

  const labelAt = (i: number): [number, number] => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    const r = radius + 18
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)]
  }

  const polygonPoints = perfil.eixos
    .map((_, i) => pointAt(i, perfil.eixos[i].valor).join(','))
    .join(' ')

  const anteriorPoints = anterior
    ? anterior.eixos
        .map((_, i) => pointAt(i, anterior.eixos[i].valor).join(','))
        .join(' ')
    : null

  const grids = [25, 50, 75, 100]

  return (
    <div className="mt-4 flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Concentric rings */}
        {grids.map((pct) => (
          <polygon
            key={pct}
            points={perfil.eixos
              .map((_, i) => pointAt(i, pct).join(','))
              .join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-slate-200 dark:text-slate-800"
            strokeDasharray={pct === 100 ? '0' : '2 3'}
          />
        ))}
        {/* Axes */}
        {perfil.eixos.map((_, i) => {
          const [x, y] = pointAt(i, 100)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-slate-200 dark:text-slate-800"
            />
          )
        })}

        {/* Anterior polygon (ghost) */}
        {anteriorPoints && (
          <polygon
            points={anteriorPoints}
            fill="rgb(148 163 184 / 0.15)"
            stroke="rgb(148 163 184 / 0.6)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        )}

        {/* Atual polygon */}
        <polygon
          points={polygonPoints}
          fill="rgb(20 184 166 / 0.18)"
          stroke="rgb(20 184 166)"
          strokeWidth="2"
        />
        {perfil.eixos.map((eixo, i) => {
          const [x, y] = pointAt(i, eixo.valor)
          return (
            <circle key={i} cx={x} cy={y} r="3.5" className="fill-teal-500" />
          )
        })}

        {/* Labels */}
        {perfil.eixos.map((eixo, i) => {
          const [x, y] = labelAt(i)
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-700 font-mono text-[11px] font-semibold dark:fill-slate-200"
            >
              {eixo.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
