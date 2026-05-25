import type { Anexo, TipoAnexo } from '@/../product/sections/eventos-esocial/types'
import { Paperclip, FileText, Stethoscope, BookOpen, GraduationCap, Upload, X, Download } from 'lucide-react'

interface Props {
  anexos: Anexo[]
  onUpload?: () => void
  onRemover?: (anexoId: string) => void
  onAbrir?: (anexoId: string) => void
}

const ICON_BY_TIPO: Record<TipoAnexo, typeof FileText> = {
  laudo_medico: Stethoscope,
  ltcat: BookOpen,
  pgr: BookOpen,
  certificado_treinamento: GraduationCap,
  outro: FileText,
}

const LABEL_BY_TIPO: Record<TipoAnexo, string> = {
  laudo_medico: 'Laudo médico',
  ltcat: 'LTCAT',
  pgr: 'PGR',
  certificado_treinamento: 'Certificado',
  outro: 'Outro',
}

export function AnexosPanel({ anexos, onUpload, onRemover, onAbrir }: Props) {
  return (
    <section
      style={{ animationDelay: '320ms' }}
      className="nymos-reveal opacity-0 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      <header className="px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Paperclip className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Anexos</h2>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {anexos.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onUpload}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition"
        >
          <Upload className="w-3 h-3" strokeWidth={2.25} />
          Adicionar
        </button>
      </header>

      <div className="px-3 py-3 space-y-1.5">
        {anexos.length === 0 ? (
          <button
            type="button"
            onClick={onUpload}
            className="
              w-full px-4 py-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700
              bg-slate-50/50 dark:bg-slate-900/40
              text-center text-[12px] text-slate-500 dark:text-slate-400
              hover:border-teal-400 dark:hover:border-teal-700 hover:bg-teal-50/30 dark:hover:bg-teal-950/20
              transition group
            "
          >
            <Upload className="w-5 h-5 mx-auto mb-1.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition" strokeWidth={1.5} />
            <span className="block">Arraste arquivos ou clique para enviar</span>
            <span className="block text-[10px] mt-0.5 opacity-70">PDF · JPG · PNG até 10MB</span>
          </button>
        ) : (
          anexos.map((anexo) => {
            const Icon = ICON_BY_TIPO[anexo.tipo]
            return (
              <article
                key={anexo.id}
                className="group flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
              >
                <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                </span>
                <button
                  type="button"
                  onClick={() => onAbrir?.(anexo.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="text-[12px] font-medium text-slate-900 dark:text-slate-100 truncate">
                    {anexo.nome}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500">
                    {LABEL_BY_TIPO[anexo.tipo]} · {formatSize(anexo.tamanhoKb)}
                  </p>
                </button>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => onAbrir?.(anexo.id)}
                    className="inline-flex items-center justify-center w-7 h-7 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    aria-label="Baixar anexo"
                  >
                    <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemover?.(anexo.id)}
                    className="inline-flex items-center justify-center w-7 h-7 rounded text-slate-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    aria-label="Remover anexo"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`
  return `${kb} KB`
}
