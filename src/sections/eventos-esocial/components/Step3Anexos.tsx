import { useRef } from 'react'
import type { Anexo, TipoAnexo, TipoEvento } from '@/../product/sections/eventos-esocial/types'
import {
  Upload,
  Paperclip,
  FileText,
  Stethoscope,
  BookOpen,
  GraduationCap,
  X,
  Info,
} from 'lucide-react'

interface Props {
  tipo: TipoEvento
  anexos: Anexo[]
  onAdd: (file: { nome: string; tamanhoKb: number; tipo: TipoAnexo }) => void
  onRemover: (anexoId: string) => void
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
  certificado_treinamento: 'Certificado de treinamento',
  outro: 'Outro',
}

const SUGESTAO_POR_TIPO: Record<TipoEvento, { tipo: TipoAnexo; nome: string }> = {
  'S-2210': { tipo: 'laudo_medico', nome: 'Laudo médico do acidente' },
  'S-2220': { tipo: 'laudo_medico', nome: 'Laudo do ASO assinado pelo médico' },
  'S-2240': { tipo: 'ltcat', nome: 'LTCAT vigente do setor' },
  'S-2245': { tipo: 'certificado_treinamento', nome: 'Certificado de conclusão' },
}

export function Step3Anexos({ tipo, anexos, onAdd, onRemover }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const sugestao = SUGESTAO_POR_TIPO[tipo]

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    onAdd({
      nome: f.name,
      tamanhoKb: Math.round(f.size / 1024),
      tipo: sugestao.tipo,
    })
    e.target.value = ''
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-sky-200/70 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/30 px-4 py-3 flex items-start gap-2.5">
        <Info className="w-3.5 h-3.5 mt-0.5 text-sky-600 dark:text-sky-400 shrink-0" strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-sky-900 dark:text-sky-200">
            Anexos recomendados para {tipo}
          </p>
          <p className="text-[11px] text-sky-800/90 dark:text-sky-300/80 mt-0.5">
            {sugestao.nome}. Aceito: PDF, JPG, PNG (até 10 MB cada).
          </p>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        className="hidden"
        onChange={handlePick}
      />

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="
          w-full px-4 py-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700
          bg-slate-50/40 dark:bg-slate-900/40
          text-center
          hover:border-teal-400 dark:hover:border-teal-700 hover:bg-teal-50/30 dark:hover:bg-teal-950/20
          transition group
        "
      >
        <Upload
          className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition"
          strokeWidth={1.5}
        />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Arraste arquivos ou clique para enviar
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          PDF · JPG · PNG · 10 MB
        </p>
      </button>

      {anexos.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Anexados · {anexos.length}
          </p>
          <ul className="space-y-1.5">
            {anexos.map((anexo) => {
              const Icon = ICON_BY_TIPO[anexo.tipo]
              return (
                <li
                  key={anexo.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
                >
                  <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100 truncate">
                      {anexo.nome}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {LABEL_BY_TIPO[anexo.tipo]} · {formatSize(anexo.tamanhoKb)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemover(anexo.id)}
                    className="inline-flex items-center justify-center w-7 h-7 rounded text-slate-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    aria-label="Remover anexo"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {anexos.length === 0 && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center inline-flex items-center justify-center gap-1.5 w-full">
          <Paperclip className="w-3 h-3" strokeWidth={2} />
          Nenhum arquivo anexado ainda.
        </p>
      )}
    </div>
  )
}

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`
  return `${kb} KB`
}
