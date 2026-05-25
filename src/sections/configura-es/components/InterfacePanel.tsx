import type {
  ConfigInterface,
  ConfiguracoesProps,
  Densidade,
  FormatoData,
  FormatoNumero,
  IdiomaInterface,
  TemaInterface,
} from '@/../product/sections/configura-es/types'
import { Sun, Moon, Monitor, Languages, AlignJustify, Calendar } from 'lucide-react'

interface InterfacePanelProps {
  config: ConfigInterface
  onChange?: ConfiguracoesProps['onUpdateInterface']
}

const IDIOMAS: { value: IdiomaInterface; codigo: string; label: string; helper: string }[] = [
  { value: 'pt', codigo: 'PT', label: 'Português', helper: 'Brasil' },
  { value: 'en', codigo: 'EN', label: 'English', helper: 'Internacional' },
  { value: 'es', codigo: 'ES', label: 'Español', helper: 'Hispano' },
]

const TEMAS: {
  value: TemaInterface
  label: string
  icon: React.ReactNode
  preview: string
}[] = [
  { value: 'claro', label: 'Claro', icon: <Sun className="w-4 h-4" strokeWidth={1.75} />, preview: 'bg-white' },
  { value: 'escuro', label: 'Escuro', icon: <Moon className="w-4 h-4" strokeWidth={1.75} />, preview: 'bg-slate-900' },
  { value: 'sistema', label: 'Sistema', icon: <Monitor className="w-4 h-4" strokeWidth={1.75} />, preview: 'bg-gradient-to-r from-white via-white to-slate-900' },
]

export function InterfacePanel({ config, onChange }: InterfacePanelProps) {
  const update = (patch: Partial<ConfigInterface>) => onChange?.({ ...config, ...patch })

  return (
    <div className="space-y-3">
      <Card title="Idioma" description="Idioma da interface e formato regional padrão." icon={<Languages className="w-3.5 h-3.5" strokeWidth={1.75} />}>
        <div className="grid grid-cols-3 gap-2">
          {IDIOMAS.map((opt) => {
            const active = config.idioma === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ idioma: opt.value })}
                className={`
                  flex flex-col items-start gap-0.5 px-3 py-3 rounded-xl ring-1 transition text-left
                  ${
                    active
                      ? 'bg-teal-50 ring-teal-200/70 dark:bg-teal-950/40 dark:ring-teal-900/60'
                      : 'bg-white/60 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }
                `}
              >
                <span
                  className={`text-[16px] font-mono font-semibold tracking-wider ${
                    active
                      ? 'text-teal-700 dark:text-teal-300'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {opt.codigo}
                </span>
                <span className="text-[12px] text-slate-700 dark:text-slate-200 font-medium">
                  {opt.label}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{opt.helper}</span>
              </button>
            )
          })}
        </div>
      </Card>

      <Card title="Tema" description="Aparência da interface — segue preferência do sistema operacional por padrão." icon={<Sun className="w-3.5 h-3.5" strokeWidth={1.75} />}>
        <div className="grid grid-cols-3 gap-2">
          {TEMAS.map((tema) => {
            const active = config.tema === tema.value
            return (
              <button
                key={tema.value}
                type="button"
                onClick={() => update({ tema: tema.value })}
                className={`
                  rounded-xl ring-1 transition overflow-hidden text-left
                  ${
                    active
                      ? 'ring-teal-300 dark:ring-teal-700 shadow-[0_4px_14px_-4px_rgba(13,148,136,0.25)]'
                      : 'ring-slate-200 dark:ring-slate-800 hover:ring-slate-300 dark:hover:ring-slate-700'
                  }
                `}
              >
                <div className={`h-16 ${tema.preview} ring-1 ring-inset ring-slate-200/40 dark:ring-slate-700/40`} />
                <div
                  className={`
                    flex items-center gap-1.5 px-3 py-2
                    ${
                      active
                        ? 'bg-teal-50/80 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
                        : 'bg-white/80 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200'
                    }
                  `}
                >
                  {tema.icon}
                  <span className="text-[12px] font-medium">{tema.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      <Card title="Densidade" description="Espaçamento e tamanho dos componentes." icon={<AlignJustify className="w-3.5 h-3.5" strokeWidth={1.75} />}>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { value: 'confortavel', label: 'Confortável', helper: 'Mais espaço, melhor para leitura' },
              { value: 'compacto', label: 'Compacto', helper: 'Mais conteúdo na tela' },
            ] as { value: Densidade; label: string; helper: string }[]
          ).map((opt) => {
            const active = config.densidade === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update({ densidade: opt.value })}
                className={`
                  rounded-xl ring-1 transition px-4 py-3 text-left
                  ${
                    active
                      ? 'bg-teal-50 ring-teal-200/70 dark:bg-teal-950/40 dark:ring-teal-900/60'
                      : 'bg-white/60 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <DensidadePreview value={opt.value} />
                  <span
                    className={`text-[13px] font-medium ${
                      active
                        ? 'text-teal-700 dark:text-teal-300'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{opt.helper}</p>
              </button>
            )
          })}
        </div>
      </Card>

      <Card title="Formato de data e número" description="Como datas e números são exibidos pelo sistema." icon={<Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FieldLabel label="Formato de data">
            <select
              value={config.formatoData}
              onChange={(e) => update({ formatoData: e.target.value as FormatoData })}
              className={fieldInput}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY · 29/04/2026</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY · 04/29/2026</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD · 2026-04-29</option>
            </select>
          </FieldLabel>
          <FieldLabel label="Separador decimal">
            <select
              value={config.formatoNumero}
              onChange={(e) => update({ formatoNumero: e.target.value as FormatoNumero })}
              className={fieldInput}
            >
              <option value="vírgula">Vírgula · 1.234,56</option>
              <option value="ponto">Ponto · 1,234.56</option>
            </select>
          </FieldLabel>
        </div>
      </Card>
    </div>
  )
}

function DensidadePreview({ value }: { value: Densidade }) {
  const gap = value === 'confortavel' ? 'space-y-1' : 'space-y-0.5'
  return (
    <div className={`flex flex-col ${gap}`}>
      <span className="block w-7 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
      <span className="block w-7 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
      <span className="block w-7 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
    </div>
  )
}

function Card({
  title,
  description,
  icon,
  children,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5">
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          {icon && <span className="text-slate-500">{icon}</span>}
          <h3 className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h3>
        </div>
        {description && (
          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

const fieldInput = `
  w-full px-3 py-2 rounded-xl
  bg-white/80 dark:bg-slate-900/40
  border border-slate-200 dark:border-slate-800
  text-sm text-slate-800 dark:text-slate-200
  focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
  transition
`

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
        {label}
      </span>
      {children}
    </div>
  )
}
