import { ShieldCheck, EyeOff, Building2 } from 'lucide-react'

export function PrivacyBanner() {
  return (
    <section
      role="note"
      aria-label="Aviso de privacidade"
      className="
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-violet-50 via-white to-teal-50
        dark:from-violet-950/40 dark:via-slate-900 dark:to-teal-950/40
        ring-1 ring-violet-200/60 dark:ring-violet-900/40
      "
    >
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-violet-200/40 dark:bg-violet-700/20 blur-3xl"
      />
      <div className="relative flex flex-col sm:flex-row gap-4 px-5 py-4 sm:py-5">
        <div className="shrink-0 self-start">
          <div className="
            w-10 h-10 rounded-xl
            bg-white dark:bg-slate-900
            ring-1 ring-violet-200 dark:ring-violet-900/60
            flex items-center justify-center
            shadow-sm shadow-violet-900/5
          ">
            <ShieldCheck className="w-5 h-5 text-violet-600 dark:text-violet-400" strokeWidth={1.75} />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
            Anonimato técnico aplicado
          </h2>
          <p className="mt-1 text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
            A identidade real do trabalhador só é revelada ao profissional clínico parceiro <strong className="font-semibold text-slate-900 dark:text-slate-200">após o aceite explícito</strong>. O empregador nunca tem acesso ao caso individual.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-violet-700 dark:text-violet-300">
              <EyeOff className="w-3 h-3" strokeWidth={2} />
              Codinome técnico até o aceite
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-teal-700 dark:text-teal-300">
              <ShieldCheck className="w-3 h-3" strokeWidth={2} />
              Consentimento explícito
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
              <Building2 className="w-3 h-3" strokeWidth={2} />
              Empregador sem acesso
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
