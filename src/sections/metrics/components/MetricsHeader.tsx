import { useEffect, useRef, useState } from 'react'
import {
  Plus,
  ChevronDown,
  Heart,
  HeartPulse,
  Scale,
  Droplet,
  type LucideIcon,
} from 'lucide-react'
import type {
  ManualEntryConfig,
  MetricType,
  Timeframe,
} from '@/../product/sections/metrics/types'

export interface MetricsHeaderProps {
  timeframe: Timeframe
  manualEntryConfigs: Partial<Record<MetricType, ManualEntryConfig>>
  onTimeframeChange?: (timeframe: Timeframe) => void
  onCreate?: (metricType: MetricType) => void
}

const TIMEFRAMES: { id: Timeframe; label: string }[] = [
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
]

const PICKER_ICONS: Partial<Record<MetricType, LucideIcon>> = {
  weight: Scale,
  bloodPressure: HeartPulse,
  glucose: Droplet,
  heartRate: Heart,
}

export function MetricsHeader({
  timeframe,
  manualEntryConfigs,
  onTimeframeChange,
  onCreate,
}: MetricsHeaderProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!pickerOpen) return
    const handle = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPickerOpen(false)
    }
    window.addEventListener('mousedown', handle)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', handle)
      window.removeEventListener('keydown', onKey)
    }
  }, [pickerOpen])

  const availableTypes = (Object.keys(manualEntryConfigs) as MetricType[]).filter(
    (t) => Boolean(manualEntryConfigs[t]),
  )

  const handlePick = (type: MetricType) => {
    setPickerOpen(false)
    onCreate?.(type)
  }

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div
          className="
            absolute -top-28 -right-20 w-[380px] h-[380px] rounded-full
            bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.20)_0%,rgba(45,212,191,0)_60%)]
            dark:bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.16)_0%,rgba(20,184,166,0)_60%)]
            blur-2xl
          "
        />
        <div
          className="
            absolute -top-10 -left-24 w-[320px] h-[320px] rounded-full
            bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14)_0%,rgba(16,185,129,0)_60%)]
            dark:bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.14)_0%,rgba(5,150,105,0)_60%)]
            blur-2xl
          "
        />
      </div>

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="nymos-reveal opacity-0" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-teal-600 dark:text-teal-400 mb-2">
            <span className="w-6 h-px bg-teal-500/60" />
            Métricas
          </div>
          <h1 className="text-3xl md:text-[40px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.05]">
            Seus sinais vitais
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Sincronizado com seus dispositivos · registre medidas manuais quando quiser
          </p>
        </div>

        <div
          className="
            nymos-reveal opacity-0 self-start md:self-auto
            flex items-center gap-2
          "
          style={{ animationDelay: '120ms' }}
        >
          <div
            className="
              inline-flex items-center gap-0.5 p-1
              rounded-full
              bg-slate-100/80 dark:bg-slate-800/60
              border border-slate-200 dark:border-slate-700/60
              backdrop-blur-sm
            "
            role="tablist"
            aria-label="Seletor de período"
          >
            {TIMEFRAMES.map((opt) => {
              const active = opt.id === timeframe
              return (
                <button
                  key={opt.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => onTimeframeChange?.(opt.id)}
                  className={`
                    relative px-3.5 py-1.5 rounded-full text-xs font-medium
                    transition-colors
                    ${
                      active
                        ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }
                  `}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          {availableTypes.length > 0 && (
            <div className="relative" ref={pickerRef}>
              <button
                type="button"
                onClick={() => setPickerOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={pickerOpen}
                className="
                  inline-flex items-center gap-1.5
                  px-4 py-2 rounded-full
                  bg-teal-600 hover:bg-teal-700 text-white
                  dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
                  text-sm font-medium
                  shadow-sm
                  transition-colors
                "
              >
                <Plus className="w-4 h-4" />
                Cadastrar
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${pickerOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {pickerOpen && (
                <div
                  role="menu"
                  className="
                    absolute right-0 top-full mt-2 z-30 min-w-[220px]
                    rounded-xl
                    bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-slate-800
                    shadow-xl
                    py-1
                    animate-[picker-in_140ms_ease-out]
                  "
                >
                  <style>{`@keyframes picker-in { from { opacity: 0; transform: translateY(-4px) } to { opacity: 1; transform: translateY(0) } }`}</style>
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                    Qual medida registrar?
                  </div>
                  {availableTypes.map((type) => {
                    const cfg = manualEntryConfigs[type]
                    if (!cfg) return null
                    const Icon = PICKER_ICONS[type] ?? Heart
                    return (
                      <button
                        key={type}
                        type="button"
                        role="menuitem"
                        onClick={() => handlePick(type)}
                        className="
                          w-full flex items-center gap-3 px-3 py-2 text-left
                          text-sm text-slate-700 dark:text-slate-200
                          hover:bg-slate-50 dark:hover:bg-slate-800
                          transition-colors
                        "
                      >
                        <div className="grid place-items-center w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300 shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">{cfg.label}</div>
                          <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                            {cfg.unit}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
