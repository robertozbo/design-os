import { AlertTriangle, FileText, Pill, Sparkles } from 'lucide-react'
import type { ConsultaData } from '@/../product-medical-clinic/sections/consulta/types'
import { AVATAR_COR, TEXTO_COR } from './helpers'

export function ContextoPanel({ contexto }: { contexto: ConsultaData['contexto'] }) {
  return (
    <div className="space-y-4">
      {/* Medicações ativas */}
      <Bloco titulo="Medicações ativas" icon={<Pill className="h-3.5 w-3.5" />}>
        <ul className="space-y-2">
          {contexto.medicacoes.map((m) => (
            <li key={m.id} className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/50">
              <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{m.nome}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{m.posologia}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${AVATAR_COR[m.cor]}`} aria-hidden />
                <span className="text-[10px] text-slate-400">
                  {m.prescritoPor} · {m.especialidade} · {m.prescritoEm}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Bloco>

      {/* Últimos exames */}
      <Bloco titulo="Últimos exames" icon={<FileText className="h-3.5 w-3.5" />}>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {contexto.exames.map((ex) => (
            <li key={ex.id} className="flex items-center justify-between py-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                    {ex.nome}
                  </span>
                  {ex.alterado && (
                    <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{ex.data}</span>
              </div>
              <span
                className={`shrink-0 font-mono text-[11px] tabular-nums ${
                  ex.alterado
                    ? 'font-semibold text-amber-600 dark:text-amber-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {ex.valor}
              </span>
            </li>
          ))}
        </ul>
      </Bloco>

      {/* Evoluções recentes */}
      <Bloco titulo="Evoluções recentes" icon={<FileText className="h-3.5 w-3.5" />}>
        <ul className="space-y-2.5">
          {contexto.evolucoes.map((ev) => (
            <li key={ev.id}>
              <div className="flex items-center gap-1.5">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white ${AVATAR_COR[ev.cor]}`}
                >
                  {ev.medicoIniciais}
                </span>
                <span className={`text-[11px] font-medium ${TEXTO_COR[ev.cor]}`}>
                  {ev.especialidade}
                </span>
                <span className="text-[10px] text-slate-400">· {ev.data}</span>
                {ev.geradoPorIA && (
                  <Sparkles className="h-2.5 w-2.5 text-teal-500" />
                )}
              </div>
              <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                {ev.resumo}
              </p>
            </li>
          ))}
        </ul>
      </Bloco>
    </div>
  )
}

function Bloco({
  titulo,
  icon,
  children,
}: {
  titulo: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2.5 flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {icon}
        <h3 className="text-[11px] font-semibold uppercase tracking-wide">{titulo}</h3>
      </div>
      {children}
    </div>
  )
}
