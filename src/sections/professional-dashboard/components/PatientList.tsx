import { Users } from 'lucide-react'
import type { PatientRow as PatientRowData } from '@/../product/sections/professional-dashboard/types'
import { PatientRow } from './PatientRow'

interface Props {
  patients: PatientRowData[]
  selectedPatientId?: string | null
  onOpenPatient?: (patientId: string) => void
  revealIndex?: number
}

export function PatientList({
  patients,
  selectedPatientId,
  onOpenPatient,
  revealIndex = 0,
}: Props) {
  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        rounded-2xl overflow-hidden
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
      "
    >
      <div className="hidden md:flex items-center gap-4 px-5 py-2.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
        <div className="w-60">Paciente</div>
        <div className="w-40 hidden sm:block">Último check-in</div>
        <div className="w-44 hidden md:block">Adesão 7d</div>
        <div className="flex-1">Alertas ativos</div>
      </div>

      {patients.length === 0 ? (
        <div className="p-10 text-center">
          <div
            aria-hidden="true"
            className="mx-auto grid place-items-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
          >
            <Users className="w-4 h-4" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            Nenhum paciente encontrado
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Ajuste os filtros ou a busca para ver outros pacientes.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200/80 dark:divide-slate-800">
          {patients.map((p) => (
            <li key={p.id}>
              <PatientRow
                patient={p}
                isSelected={p.id === selectedPatientId}
                onOpen={() => onOpenPatient?.(p.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
