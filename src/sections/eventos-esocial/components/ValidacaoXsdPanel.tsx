import type { ValidacaoXsd } from '@/../product/sections/eventos-esocial/types'
import { ShieldCheck, ShieldAlert, AlertTriangle, FileCode2 } from 'lucide-react'

interface Props {
  validacao: ValidacaoXsd
  onRevalidar?: () => void
}

export function ValidacaoXsdPanel({ validacao, onRevalidar }: Props) {
  const hasErros = validacao.erros.length > 0
  const hasAvisos = validacao.avisos.length > 0

  return (
    <section
      style={{ animationDelay: '180ms' }}
      className="nymos-reveal opacity-0 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      <header className="px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${
              hasErros
                ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {hasErros ? (
              <ShieldAlert className="w-3.5 h-3.5" strokeWidth={1.75} />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
            )}
          </span>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Validação XSD
          </h2>
          <span
            className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ring-1 ${
              hasErros
                ? 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 ring-rose-200 dark:ring-rose-900'
                : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-200 dark:ring-emerald-900'
            }`}
          >
            {hasErros ? `${validacao.erros.length} erro${validacao.erros.length > 1 ? 's' : ''}` : 'Válido'}
          </span>
        </div>
        <button
          type="button"
          onClick={onRevalidar}
          className="text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
        >
          Revalidar
        </button>
      </header>

      <div className="px-5 py-4 space-y-3">
        {!hasErros && !hasAvisos && (
          <div className="flex items-center gap-3 py-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                XML conforme o schema oficial
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Pronto para transmissão ao governo.
              </p>
            </div>
          </div>
        )}

        {validacao.erros.map((erro, idx) => (
          <article
            key={`erro-${idx}`}
            className="rounded-xl border border-rose-200/70 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 px-4 py-3"
          >
            <div className="flex items-start gap-2.5">
              <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 mt-0.5">
                <ShieldAlert className="w-3 h-3" strokeWidth={2.25} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[12px] font-semibold text-rose-900 dark:text-rose-200">
                    {erro.campo}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-700/80 dark:text-rose-300/80">
                    <FileCode2 className="w-2.5 h-2.5" strokeWidth={2} />
                    {erro.path}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-rose-800 dark:text-rose-200/90 leading-snug">
                  {erro.mensagem}
                </p>
                {erro.sugestaoCorrecao && (
                  <p className="mt-1.5 text-[11px] text-rose-700/80 dark:text-rose-300/70 border-l-2 border-rose-300 dark:border-rose-800 pl-2.5">
                    → {erro.sugestaoCorrecao}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}

        {validacao.avisos.map((aviso, idx) => (
          <article
            key={`aviso-${idx}`}
            className="rounded-xl border border-amber-200/70 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 px-4 py-3"
          >
            <div className="flex items-start gap-2.5">
              <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 mt-0.5">
                <AlertTriangle className="w-3 h-3" strokeWidth={2.25} />
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-[12px] font-semibold text-amber-900 dark:text-amber-200">
                  {aviso.campo}
                </span>
                <p className="mt-1 text-[12px] text-amber-800 dark:text-amber-200/90 leading-snug">
                  {aviso.mensagem}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
