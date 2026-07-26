import { useState } from 'react'
import { Check, Plus, ShieldCheck, Trash2, X } from 'lucide-react'
import type {
  MedicamentoItem,
  PacienteSelector,
  PrescricaoItem,
} from '@/../product-medical-clinic/sections/prescricao/types'

type Modo = 'nova' | 'renovacao'

interface Props {
  modo: Modo
  pacientes: PacienteSelector[]
  /** Prescrição base quando renovação. */
  base: PrescricaoItem | null
  onEmitir: (pacienteNome: string, itens: number) => void
  onFechar: () => void
}

const SUGESTOES = ['Losartana 50 mg', 'Metformina 850 mg', 'Puran T4 50 mcg', 'Vitamina D 7.000 UI']

export function MemedModal({ modo, pacientes, base, onEmitir, onFechar }: Props) {
  const [pacienteId, setPacienteId] = useState<string | null>(
    modo === 'renovacao' ? 'base' : null,
  )
  const [itens, setItens] = useState<string[]>(
    modo === 'renovacao' && base ? base.medicamentos.map((m: MedicamentoItem) => m.nome) : [],
  )

  const pacienteNome =
    modo === 'renovacao' && base
      ? base.paciente.nome
      : pacientes.find((p) => p.id === pacienteId)?.nome ?? ''

  const precisaPaciente = modo === 'nova' && !pacienteId

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl">
        {/* Header Memed */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500 text-xs font-bold text-white">
              M
            </span>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Memed · {modo === 'renovacao' ? 'Renovação' : 'Nova prescrição'}
              </div>
              <div className="text-[10px] text-slate-400">Prescrição digital com validade ICP-Brasil</div>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Seleção de paciente (nova) */}
          {precisaPaciente ? (
            <div>
              <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Selecione o paciente
              </div>
              <ul className="space-y-1.5">
                {pacientes.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => setPacienteId(p.id)}
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-2.5 text-left transition-colors hover:border-teal-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                        {p.iniciais}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                          {p.nome}
                        </div>
                        <div className="truncate text-[11px] text-slate-400">
                          {p.idade}a · {p.condicoesCronicas.join(', ') || 'sem condições'}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              {/* Paciente selecionado */}
              <div className="mb-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
                <span className="text-[11px] text-slate-400">Paciente</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {pacienteNome}
                </span>
                {modo === 'renovacao' && (
                  <span className="ml-auto rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    itens pré-carregados
                  </span>
                )}
              </div>

              {/* Medicamentos */}
              <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Medicamentos
              </div>
              {itens.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-700">
                  Nenhum medicamento. Adicione abaixo.
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {itens.map((nome, i) => (
                    <li
                      key={`${nome}-${i}`}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800"
                    >
                      <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">{nome}</span>
                      <button
                        onClick={() => setItens((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Sugestões (mock do buscador Memed) */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {SUGESTOES.filter((s) => !itens.includes(s)).map((s) => (
                  <button
                    key={s}
                    onClick={() => setItens((prev) => [...prev, s])}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-teal-500 hover:text-teal-700 dark:border-slate-700 dark:text-slate-300 dark:hover:text-teal-300"
                  >
                    <Plus className="h-3 w-3" /> {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé: assinatura ICP + emitir */}
        <div className="border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <div className="mb-2.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Assinatura ICP-Brasil · certificado A1 de Dra. Helena Prado
          </div>
          <button
            disabled={precisaPaciente || itens.length === 0}
            onClick={() => onEmitir(pacienteNome, itens.length)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check className="h-4 w-4" /> Emitir e enviar ao app
          </button>
        </div>
      </div>
    </div>
  )
}
