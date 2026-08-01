import { useMemo, useState } from 'react'
import { FlaskConical, Plus, Send, Trash2, X } from 'lucide-react'

interface Props {
  pacienteNome: string
  onSolicitar: (exames: string[], urgencia: Urgencia, indicacao: string) => void
  onFechar: () => void
}

type Urgencia = 'rotina' | 'urgente'

/** Catálogo de exames por categoria — mock do buscador do laboratório. */
const CATALOGO: { grupo: string; exames: string[] }[] = [
  {
    grupo: 'Sangue — bioquímica',
    exames: [
      'Hemograma completo',
      'Glicemia de jejum',
      'Hemoglobina glicada (HbA1c)',
      'Colesterol total e frações',
      'Triglicerídeos',
      'Ácido úrico',
      'Creatinina',
      'Ureia',
      'TGO (AST)',
      'TGP (ALT)',
      'Ferritina',
      'Vitamina D (25-OH)',
      'PCR ultrassensível',
    ],
  },
  {
    grupo: 'Hormônios',
    exames: ['TSH', 'T4 livre', 'Anti-TPO', 'PSA total', 'PSA livre'],
  },
  {
    grupo: 'Urina',
    exames: ['Parcial de urina (EAS)', 'Urocultura', 'Microalbuminúria'],
  },
  {
    grupo: 'Imagem',
    exames: ['USG de tireoide', 'USG abdominal total', 'Raio-X de tórax'],
  },
]

/** Atalhos rápidos mais pedidos. */
const RAPIDOS = [
  'Hemograma completo',
  'Colesterol total e frações',
  'PSA total',
  'Hemoglobina glicada (HbA1c)',
  'Parcial de urina (EAS)',
  'Ácido úrico',
]

export function SolicitarExameModal({ pacienteNome, onSolicitar, onFechar }: Props) {
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [urgencia, setUrgencia] = useState<Urgencia>('rotina')
  const [indicacao, setIndicacao] = useState('')

  const adicionar = (exame: string) => {
    if (!exame) return
    setSelecionados((prev) => (prev.includes(exame) ? prev : [...prev, exame]))
  }

  const disponiveis = useMemo(
    () =>
      CATALOGO.map((g) => ({
        ...g,
        exames: g.exames.filter((e) => !selecionados.includes(e)),
      })).filter((g) => g.exames.length > 0),
    [selecionados],
  )

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500 text-white">
              <FlaskConical className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Solicitar exames
              </div>
              <div className="text-[10px] text-slate-400">{pacienteNome}</div>
            </div>
          </div>
          <button
            aria-label="Fechar"
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Select para ir montando */}
          <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            Adicionar exame ao pedido
          </label>
          <select
            value=""
            onChange={(e) => adicionar(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="" disabled>
              Selecione um exame…
            </option>
            {disponiveis.map((g) => (
              <optgroup key={g.grupo} label={g.grupo}>
                {g.exames.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Atalhos rápidos */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {RAPIDOS.filter((r) => !selecionados.includes(r)).map((r) => (
              <button
                key={r}
                onClick={() => adicionar(r)}
                className="inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-300 px-2 py-1 text-[11px] text-slate-600 transition hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-600 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
              >
                <Plus className="h-3 w-3" /> {r}
              </button>
            ))}
          </div>

          {/* Pedido em montagem */}
          <div className="mt-4 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Exames no pedido
            </span>
            <span className="text-[11px] text-slate-400">{selecionados.length} selecionado(s)</span>
          </div>
          {selecionados.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-700">
              Nenhum exame ainda. Use o select ou os atalhos acima.
            </div>
          ) : (
            <ul className="space-y-1.5">
              {selecionados.map((e, i) => (
                <li
                  key={e}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-mono text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">{e}</span>
                  <button
                    onClick={() => setSelecionados((prev) => prev.filter((x) => x !== e))}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Urgência */}
          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Prioridade
            </span>
            <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
              {(['rotina', 'urgente'] as Urgencia[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUrgencia(u)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    urgencia === u
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Indicação clínica */}
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Indicação clínica (opcional)
            </label>
            <textarea
              value={indicacao}
              onChange={(e) => setIndicacao(e.target.value)}
              placeholder="Ex.: investigação de hipotireoidismo (CID E03), fadiga e ganho de peso…"
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <button
            disabled={selecionados.length === 0}
            onClick={() => onSolicitar(selecionados, urgencia, indicacao.trim())}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> Solicitar {selecionados.length > 0 && `${selecionados.length} exame(s)`}
          </button>
        </div>
      </div>
    </div>
  )
}
