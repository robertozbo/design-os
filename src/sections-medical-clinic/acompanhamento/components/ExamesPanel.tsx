import { FlaskConical } from 'lucide-react'
import type { ExameCompartilhado } from '@/../product-medical-clinic/sections/acompanhamento/types'
import { NIVEL_META, dataExtensa, desdeUltimaConsulta } from './helpers'

interface Props {
  exames: ExameCompartilhado[]
}

/**
 * Exames que o paciente subiu pelo app e liberou para a clínica.
 *
 * A cor do badge vem de `NIVEL_META` (fonte única do módulo) — é leitura clínica do resultado,
 * não julgamento do envio. A ordem exibida é a ordem recebida: quem ordena é quem passa os dados.
 */
export function ExamesPanel({ exames }: Props) {
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Exames compartilhados pelo paciente
        </h2>
        {exames.length > 0 && (
          <p className="text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
            {exames.length} {exames.length === 1 ? 'exame' : 'exames'} · enviados pelo app
          </p>
        )}
      </div>

      {exames.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <FlaskConical
            className="mx-auto h-6 w-6 text-slate-300 dark:text-slate-600"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Nenhum exame compartilhado pelo app.
          </p>
          {/*
            Lista vazia não é conclusão clínica — só significa que nada chegou por aqui. Quem
            responde pelo consentimento é a tela (aviso da aba + painel de permissões); este painel
            não afirma nada sobre autorização, porque não recebe os consentimentos por prop.
          */}
          <p className="mx-auto mt-1.5 max-w-md text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
            Ausência de exame aqui não é ausência de exame — o paciente pode ter exames feitos fora
            do app.
          </p>
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {exames.map((exame) => {
            const nivel = NIVEL_META[exame.nivel]

            return (
              <li
                key={exame.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:gap-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <FlaskConical className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h3 className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {exame.nome}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${nivel.badge}`}
                    >
                      {nivel.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {exame.resumo}
                  </p>
                </div>

                <div className="shrink-0 sm:text-right">
                  <div className="text-xs font-medium tabular-nums text-slate-600 dark:text-slate-300">
                    {dataExtensa(exame.data)}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">
                    {desdeUltimaConsulta(exame.data)}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
