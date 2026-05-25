import { FileText, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import type { LaudoOriginal } from '@/../product-clinico/sections/exames/types'

interface Props {
  laudo: LaudoOriginal
  laboratorio: string
  dataResultado: string
}

export function LaudoViewer({ laudo, laboratorio, dataResultado }: Props) {
  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between gap-2 border-b border-slate-200/80 px-4 py-2.5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <FileText className="size-3.5" />
          </span>
          <div>
            <h2 className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Laudo original
            </h2>
            <p className="text-[10px] text-slate-500">
              {laboratorio} · {laudo.paginas} {laudo.paginas === 1 ? 'página' : 'páginas'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <ToolbarButton icon={ZoomOut} label="Diminuir zoom" />
          <ToolbarButton icon={ZoomIn} label="Aumentar zoom" />
          <ToolbarButton icon={Maximize2} label="Tela cheia" />
        </div>
      </header>

      {/* Document body — paper feel */}
      <div className="flex-1 overflow-y-auto bg-slate-100/50 p-4 dark:bg-slate-950/40">
        <article className="mx-auto max-w-prose rounded-md border border-slate-300/60 bg-white p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
          {/* Lab letterhead */}
          <header className="mb-5 border-b-2 border-slate-300 pb-4 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
              {laboratorio}
            </p>
            <p className="mt-0.5 text-[10px] text-slate-500">
              Resultado emitido em {new Date(dataResultado + 'T12:00:00').toLocaleDateString('pt-BR')}
            </p>
          </header>

          {/* Body */}
          <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200">
            {laudo.texto}
          </pre>
        </article>
      </div>
    </section>
  )
}

function ToolbarButton({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      className="
        rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900
        dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
      "
      aria-label={label}
      title={label}
    >
      <Icon className="size-3.5" />
    </button>
  )
}
