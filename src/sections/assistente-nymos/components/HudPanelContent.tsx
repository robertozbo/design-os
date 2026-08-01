import type {
  HudPanel,
  HudPanelBiomarkerAlert,
  HudPanelIdentity,
  HudPanelMetric,
  HudPanelMetricSparkline,
  HudPanelSilhouette,
} from '@/../product/sections/assistente-nymos/types'

interface HudPanelContentProps {
  panel: HudPanel
}

export function HudPanelContent({ panel }: HudPanelContentProps) {
  switch (panel.type) {
    case 'identity':
      return <IdentityContent panel={panel} />
    case 'silhouette':
      return <SilhouetteContent panel={panel} />
    case 'metric':
      return <MetricContent panel={panel} />
    case 'metric-sparkline':
      return <SparklineContent panel={panel} />
    case 'biomarker-alert':
      return <BiomarkerAlertContent panel={panel} />
  }
}

function IdentityContent({ panel }: { panel: HudPanelIdentity }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-300" />
        </span>
        <span className="text-[10px] text-teal-300 tracking-widest">
          {panel.primary}
        </span>
      </div>
      <div className="text-lg font-light text-slate-100 tabular-nums tracking-tight">
        {panel.secondary}
      </div>
    </div>
  )
}

function SilhouetteContent({ panel }: { panel: HudPanelSilhouette }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 24 56"
        className="w-7 h-14 fill-none stroke-teal-400/80"
        strokeWidth="1"
        aria-hidden="true"
      >
        <circle cx="12" cy="5" r="3.5" />
        <path d="M5 18 L8 13 H16 L19 18 V32 H17 V52 H14 V36 H10 V52 H7 V32 H5 Z" />
      </svg>
      <div className="space-y-0.5">
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-teal-500/60">AGE</span>
          <span className="text-lg font-light text-teal-100 tabular-nums">
            {panel.ageYears}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-teal-500/60">HT</span>
          <span className="text-sm text-slate-300 tabular-nums">
            {panel.heightCm}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-teal-500/60">WT</span>
          <span className="text-sm text-slate-300 tabular-nums">
            {panel.weightKg}
          </span>
        </div>
      </div>
    </div>
  )
}

function MetricContent({ panel }: { panel: HudPanelMetric }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-2xl font-light text-teal-100 tabular-nums tracking-tight">
        {panel.value}
      </span>
      <span className="text-[10px] text-teal-500/70 tracking-widest">
        {panel.unit}
      </span>
    </div>
  )
}

function SparklineContent({ panel }: { panel: HudPanelMetricSparkline }) {
  const max = Math.max(...panel.trend)
  const min = Math.min(...panel.trend)
  const range = max - min || 1
  const w = 100
  const h = 22
  const stepX = w / (panel.trend.length - 1)

  const pathD = panel.trend
    .map((v, i) => {
      const x = i * stepX
      const y = h - ((v - min) / range) * h
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  const isActive = panel.status === 'active'
  const isAlert = panel.status === 'alert'
  const strokeColor = isAlert
    ? 'stroke-orange-300'
    : isActive
      ? 'stroke-teal-200'
      : 'stroke-teal-400/70'

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-light text-teal-100 tabular-nums tracking-tight">
          {panel.value}
        </span>
        <span className="text-[10px] text-teal-500/70 tracking-widest">
          {panel.unit}
        </span>
        {typeof panel.valueDeltaPct === 'number' && (
          <span
            className={`text-[10px] tabular-nums ml-auto ${
              panel.valueDeltaPct >= 0 ? 'text-orange-300' : 'text-emerald-300'
            }`}
          >
            {panel.valueDeltaPct > 0 ? '+' : ''}
            {panel.valueDeltaPct.toFixed(1)}%
          </span>
        )}
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-5"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path d={pathD} fill="none" className={strokeColor} strokeWidth="1" />
        {panel.trend.map((v, i) => {
          const x = i * stepX
          const y = h - ((v - min) / range) * h
          return (
            <circle
              key={i}
              cx={x.toFixed(1)}
              cy={y.toFixed(1)}
              r="0.8"
              className={strokeColor.replace('stroke-', 'fill-')}
            />
          )
        })}
      </svg>
    </div>
  )
}

function BiomarkerAlertContent({ panel }: { panel: HudPanelBiomarkerAlert }) {
  const deltaSign = panel.deltaPct >= 0 ? '+' : ''
  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-1.5">
        <span className="text-[10px] text-orange-300 tracking-widest">
          {panel.biomarker}
        </span>
        <span className="text-[9px] text-orange-400/70 ml-auto">
          {deltaSign}
          {panel.deltaPct.toFixed(1)}%
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-light text-orange-100 tabular-nums tracking-tight">
          {panel.value}
        </span>
        <span className="text-[10px] text-orange-400/70">{panel.unit}</span>
      </div>
      <div className="text-[9px] text-orange-400/60 tracking-wider">
        PREV {panel.previousValue}
      </div>
    </div>
  )
}
