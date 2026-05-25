import { useState, useEffect, useRef } from 'react'
import {
  Check,
  ChevronDown,
  Monitor,
  Moon,
  Sun,
  Globe,
  Clock,
  Calendar,
} from 'lucide-react'
import type {
  DateFormat,
  DateFormatOption,
  Language,
  LanguageOption,
  MetricSystem,
  MetricSystemOption,
  Preferences,
  Theme,
  ThemeOption,
  TimeFormat,
  TimeFormatOption,
  TimezoneOption,
  UpdatePreferencesPayload,
} from '@/../product/sections/configura-es-paciente/types'

interface PreferencesSectionProps {
  preferences: Preferences
  languageOptions: LanguageOption[]
  timezoneOptions: TimezoneOption[]
  metricSystemOptions: MetricSystemOption[]
  themeOptions: ThemeOption[]
  dateFormatOptions: DateFormatOption[]
  timeFormatOptions: TimeFormatOption[]
  onChange: (payload: UpdatePreferencesPayload) => void
}

function FieldHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

function LanguageDropdown({
  value,
  options,
  onChange,
}: {
  value: Language
  options: LanguageOption[]
  onChange: (v: Language) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-900 transition hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-lg leading-none">{selected?.flag}</span>
          <span>{selected?.label}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-900/5 dark:border-slate-700 dark:bg-slate-800 dark:ring-white/5">
          <ul className="max-h-64 overflow-y-auto py-1">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition ${
                    opt.value === value
                      ? 'bg-teal-50 text-teal-900 dark:bg-teal-500/15 dark:text-teal-100'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{opt.flag}</span>
                    <span className="font-medium">{opt.label}</span>
                  </span>
                  {opt.value === value && (
                    <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function MetricPills({
  value,
  options,
  onChange,
}: {
  value: MetricSystem
  options: MetricSystemOption[]
  onChange: (v: MetricSystem) => void
}) {
  return (
    <div className="inline-flex w-full gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800 sm:w-auto">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition sm:flex-initial ${
              active
                ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-700 dark:text-teal-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span className="block">{opt.label}</span>
            <span className="block text-[11px] font-normal opacity-80">
              {opt.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function ThemeCards({
  value,
  options,
  onChange,
}: {
  value: Theme
  options: ThemeOption[]
  onChange: (v: Theme) => void
}) {
  const icons: Record<Theme, React.ReactNode> = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    system: <Monitor className="h-5 w-5" />,
  }
  const bgs: Record<Theme, string> = {
    light: 'bg-gradient-to-br from-amber-100 via-amber-50 to-white',
    dark: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700',
    system: 'bg-gradient-to-br from-amber-100 via-slate-300 to-slate-900',
  }
  const textColors: Record<Theme, string> = {
    light: 'text-amber-700',
    dark: 'text-slate-100',
    system: 'text-slate-700',
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`group rounded-2xl border-2 p-3 text-left transition ${
              active
                ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-500/10'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
            }`}
          >
            <div
              className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${bgs[opt.value]} ${textColors[opt.value]}`}
            >
              {icons[opt.value]}
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {opt.label}
            </p>
            <p className="mt-0.5 text-[11px] leading-tight text-slate-500 dark:text-slate-400">
              {opt.description}
            </p>
          </button>
        )
      })}
    </div>
  )
}

function TimezoneSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: TimezoneOption[]
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label} ({opt.offset})
        </option>
      ))}
    </select>
  )
}

function RadioPills<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: Array<{ value: T; label: string; example: string }>
  onChange: (v: T) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-start gap-1 rounded-xl border-2 px-3 py-2.5 text-left transition ${
              active
                ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-500/10'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {opt.label}
            </span>
            <span className="font-mono text-sm text-slate-900 dark:text-slate-100">
              {opt.example}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function PreferencesSection({
  preferences,
  languageOptions,
  timezoneOptions,
  metricSystemOptions,
  themeOptions,
  dateFormatOptions,
  timeFormatOptions,
  onChange,
}: PreferencesSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Preferências
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Mudanças salvas automaticamente
        </p>
      </header>

      <div className="divide-y divide-slate-100 px-6 dark:divide-slate-800">
        {/* Idioma */}
        <div className="grid items-start gap-4 py-5 md:grid-cols-[1fr_360px]">
          <FieldHeader
            icon={<Globe className="h-4 w-4" />}
            title="Idioma"
            subtitle="Escolha o idioma do app"
          />
          <LanguageDropdown
            value={preferences.language}
            options={languageOptions}
            onChange={(language) => onChange({ language })}
          />
        </div>

        {/* Sistema métrico */}
        <div className="grid items-start gap-4 py-5 md:grid-cols-[1fr_360px]">
          <FieldHeader
            icon={<span className="text-sm font-mono font-bold">kg</span>}
            title="Sistema de medida"
            subtitle="Como exibir peso, altura e volume"
          />
          <MetricPills
            value={preferences.metricSystem}
            options={metricSystemOptions}
            onChange={(metricSystem) => onChange({ metricSystem })}
          />
        </div>

        {/* Tema */}
        <div className="grid items-start gap-4 py-5 md:grid-cols-[1fr_360px]">
          <FieldHeader
            icon={<Sun className="h-4 w-4" />}
            title="Tema"
            subtitle="Aparência claro, escuro ou automático"
          />
          <ThemeCards
            value={preferences.theme}
            options={themeOptions}
            onChange={(theme) => onChange({ theme })}
          />
        </div>

        {/* Fuso horário */}
        <div className="grid items-start gap-4 py-5 md:grid-cols-[1fr_360px]">
          <FieldHeader
            icon={<Clock className="h-4 w-4" />}
            title="Fuso horário"
            subtitle="Para agendamentos e lembretes"
          />
          <TimezoneSelect
            value={preferences.timezone}
            options={timezoneOptions}
            onChange={(timezone) => onChange({ timezone })}
          />
        </div>

        {/* Formato de data */}
        <div className="grid items-start gap-4 py-5 md:grid-cols-[1fr_360px]">
          <FieldHeader
            icon={<Calendar className="h-4 w-4" />}
            title="Formato de data"
            subtitle="Como datas são exibidas"
          />
          <RadioPills
            value={preferences.dateFormat}
            options={dateFormatOptions as Array<{
              value: DateFormat
              label: string
              example: string
            }>}
            onChange={(dateFormat) => onChange({ dateFormat })}
          />
        </div>

        {/* Formato de hora */}
        <div className="grid items-start gap-4 py-5 md:grid-cols-[1fr_360px]">
          <FieldHeader
            icon={<Clock className="h-4 w-4" />}
            title="Formato de hora"
            subtitle="12h ou 24h"
          />
          <RadioPills
            value={preferences.timeFormat}
            options={timeFormatOptions as Array<{
              value: TimeFormat
              label: string
              example: string
            }>}
            onChange={(timeFormat) => onChange({ timeFormat })}
          />
        </div>
      </div>
    </section>
  )
}
