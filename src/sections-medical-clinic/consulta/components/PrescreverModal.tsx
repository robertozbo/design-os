import { useState } from 'react'
import { Check, Plus, ShieldCheck, Trash2, X } from 'lucide-react'

interface Props {
  pacienteNome: string
  medicoNome: string
  onEmitir: (itens: MedItem[]) => void
  onFechar: () => void
}

export interface MedItem {
  nome: string
  posologia: string
}

/** Catálogo mock do buscador Memed — medicamento + posologia sugerida. */
const CATALOGO: MedItem[] = [
  { nome: 'Levotiroxina (Puran T4) 50 mcg', posologia: '1 comp. em jejum, 1x/dia' },
  { nome: 'Sinvastatina 20 mg', posologia: '1 comp. à noite, 1x/dia' },
  { nome: 'Metformina 850 mg', posologia: '1 comp. após almoço e jantar' },
  { nome: 'Losartana 50 mg', posologia: '1 comp. pela manhã, 1x/dia' },
  { nome: 'Vitamina D 7.000 UI', posologia: '1 cáps. por semana' },
  { nome: 'AAS 100 mg', posologia: '1 comp. após almoço, 1x/dia' },
  { nome: 'Omeprazol 20 mg', posologia: '1 comp. em jejum, 1x/dia' },
]

export function PrescreverModal({ pacienteNome, medicoNome, onEmitir, onFechar }: Props) {
  const [itens, setItens] = useState<MedItem[]>([])

  const adicionar = (med: MedItem) => {
    if (itens.some((m) => m.nome === med.nome)) return
    setItens((prev) => [...prev, { ...med }])
  }

  const atualizarPosologia = (i: number, posologia: string) =>
    setItens((prev) => prev.map((m, idx) => (idx === i ? { ...m, posologia } : m)))

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
                Memed · Nova prescrição
              </div>
              <div className="text-[10px] text-slate-400">
                {pacienteNome} · receita digital ICP-Brasil
              </div>
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
          {/* Buscar / adicionar */}
          <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            Adicionar medicamento
          </label>
          <select
            value=""
            onChange={(e) => {
              const med = CATALOGO.find((m) => m.nome === e.target.value)
              if (med) adicionar(med)
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="" disabled>
              Buscar medicamento…
            </option>
            {CATALOGO.filter((m) => !itens.some((x) => x.nome === m.nome)).map((m) => (
              <option key={m.nome} value={m.nome}>
                {m.nome}
              </option>
            ))}
          </select>

          {/* Itens da receita */}
          <div className="mt-4 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Medicamentos da receita
          </div>
          {itens.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-700">
              Nenhum medicamento. Adicione pelo buscador acima.
            </div>
          ) : (
            <ul className="space-y-2">
              {itens.map((m, i) => (
                <li
                  key={m.nome}
                  className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                      {m.nome}
                    </span>
                    <button
                      onClick={() => setItens((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    value={m.posologia}
                    onChange={(e) => atualizarPosologia(i, e.target.value)}
                    placeholder="Posologia (ex.: 1 comp. em jejum, 1x/dia)"
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  />
                </li>
              ))}
            </ul>
          )}

          <p className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-400">
            <Plus className="mt-0.5 h-3 w-3 shrink-0" />
            No Memed real, o buscador traz bula, interações e apresentações; aqui é um catálogo mock.
          </p>
        </div>

        {/* Rodapé: ICP + emitir */}
        <div className="border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <div className="mb-2.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Assinatura ICP-Brasil · certificado A1 de {medicoNome}
          </div>
          <button
            disabled={itens.length === 0 || itens.some((m) => !m.posologia.trim())}
            onClick={() => onEmitir(itens)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check className="h-4 w-4" /> Emitir e enviar ao app
          </button>
        </div>
      </div>
    </div>
  )
}
