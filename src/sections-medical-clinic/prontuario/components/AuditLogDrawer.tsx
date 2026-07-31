import { Download, Eye, Pencil, Pill, Shield, Sparkles, X } from 'lucide-react'
import type { AcaoAudit, AuditEvento } from '@/../product-medical-clinic/sections/prontuario/types'
import { AVATAR_COR, BADGE_COR, relativo } from './cores'

const ACAO_META: Record<AcaoAudit, { label: string; Icon: typeof Eye; cls: string }> = {
  visualizou: { label: 'Visualizou', Icon: Eye, cls: 'text-slate-500' },
  editou: { label: 'Editou', Icon: Pencil, cls: 'text-amber-600 dark:text-amber-400' },
  'ia-inferencia': { label: 'IA · inferência', Icon: Sparkles, cls: 'text-teal-600 dark:text-teal-400' },
  exportou: { label: 'Exportou', Icon: Download, cls: 'text-sky-600 dark:text-sky-400' },
  prescreveu: { label: 'Prescreveu', Icon: Pill, cls: 'text-violet-600 dark:text-violet-400' },
}

interface Props {
  open: boolean
  eventos: AuditEvento[]
  onClose: () => void
}

export function AuditLogDrawer({ open, eventos, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Log de acesso
            </h2>
          </div>
          <button
            aria-label="Fechar"
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
          Registro imutável de toda leitura, edição e inferência de IA neste prontuário (LGPD Art.
          11). Visível também ao titular no app.
        </div>

        <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
          {eventos.map((e) => {
            const meta = ACAO_META[e.acao]
            const { Icon } = meta
            return (
              <li key={e.id} className="flex items-start gap-3 px-5 py-3.5">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${AVATAR_COR[e.cor]}`}
                >
                  {e.iniciais}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {e.ator}
                    </span>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${BADGE_COR[e.cor]}`}>
                      {e.especialidade ?? e.papel}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Icon className={`h-3.5 w-3.5 ${meta.cls}`} />
                    <span className={`text-xs font-medium ${meta.cls}`}>{meta.label}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {e.alvo}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 whitespace-nowrap text-[11px] text-slate-400">
                  {relativo(e.em)}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
