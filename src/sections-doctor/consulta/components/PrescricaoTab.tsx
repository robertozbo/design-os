import { ExternalLink, FileText, ShieldCheck } from 'lucide-react'

interface Props {
  onAbrirMemed?: () => void
}

export function PrescricaoTab({ onAbrirMemed }: Props) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-teal-200/70 bg-gradient-to-br from-teal-50 via-emerald-50 to-white p-6 dark:border-teal-900/40 dark:from-teal-950/30 dark:via-emerald-950/20 dark:to-slate-900">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-400">
            <FileText className="size-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Prescrição via Memed
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Receita digital com validade jurídica (assinatura ICP-Brasil). Paciente recebe direto no app
              e farmácia aceita.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={onAbrirMemed}
                className="
                  inline-flex items-center gap-2 rounded-lg
                  bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                  transition-all hover:bg-teal-500
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                  dark:focus:ring-offset-slate-950
                "
              >
                <ExternalLink className="size-4" />
                Abrir Memed
              </button>
              <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Validade ICP-Brasil
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4 text-xs leading-relaxed text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
        Renovações de medicação contínua (Levotiroxina, Metformina, GLP-1) podem ser geradas em poucos
        cliques. As prescrições aparecem na aba "Medicação" do paciente e geram lembretes automáticos.
      </div>
    </div>
  )
}
