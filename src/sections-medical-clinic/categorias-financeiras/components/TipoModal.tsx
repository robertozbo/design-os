import { useState } from 'react'
import { Check, X } from 'lucide-react'
import type {
  CategoriasData,
  Comportamento,
  Natureza,
  TipoFinanceiro,
} from '@/../product-medical-clinic/sections/categorias-financeiras/types'

interface Props {
  /** Tipo em edição, ou null para criar. */
  tipo: TipoFinanceiro | null
  dados: CategoriasData
  onSalvar: (t: Omit<TipoFinanceiro, 'id'>, id: string | null) => void
  onFechar: () => void
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'

export function TipoModal({ tipo, dados, onSalvar, onFechar }: Props) {
  const editando = tipo !== null
  const [nome, setNome] = useState(tipo?.nome ?? '')
  const [natureza, setNatureza] = useState<Natureza>(tipo?.natureza ?? 'despesa')
  const [grupo, setGrupo] = useState(tipo?.grupo ?? dados.gruposDespesa[0] ?? '')
  const [comportamento, setComportamento] = useState<Comportamento>(
    tipo?.comportamento ?? 'variavel',
  )

  const grupos = natureza === 'receita' ? dados.gruposReceita : dados.gruposDespesa

  // Troca a natureza e ajusta o grupo se o atual não pertencer à nova lista.
  const trocarNatureza = (n: Natureza) => {
    setNatureza(n)
    const novosGrupos = n === 'receita' ? dados.gruposReceita : dados.gruposDespesa
    if (!novosGrupos.includes(grupo)) setGrupo(novosGrupos[0] ?? '')
  }

  const podeSalvar = nome.trim().length > 1

  const salvar = () => {
    if (!podeSalvar) return
    onSalvar(
      {
        nome: nome.trim(),
        natureza,
        grupo,
        comportamento: natureza === 'despesa' ? comportamento : undefined,
        padrao: tipo?.padrao ?? false,
        ativo: tipo?.ativo ?? true,
      },
      tipo?.id ?? null,
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {editando ? 'Editar tipo' : 'Novo tipo'}
          </h2>
          <button
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Natureza */}
          <div>
            <Label>Natureza</Label>
            <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
              {(['receita', 'despesa'] as Natureza[]).map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={editando && tipo?.padrao}
                  onClick={() => trocarNatureza(n)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                    natureza === n
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <Label>Nome</Label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder={natureza === 'receita' ? 'Ex.: Consultas' : 'Ex.: Aluguel do espaço'}
              autoFocus
              className={inputCls}
            />
          </label>

          <label className="block">
            <Label>Grupo</Label>
            <select value={grupo} onChange={(e) => setGrupo(e.target.value)} className={inputCls}>
              {grupos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          {natureza === 'despesa' && (
            <div>
              <Label>Comportamento</Label>
              <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
                {(['fixa', 'variavel'] as Comportamento[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setComportamento(c)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      comportamento === c
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                    }`}
                  >
                    {c === 'fixa' ? 'Fixa' : 'Variável'}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                Fixa não muda com o volume de atendimentos; variável acompanha o movimento.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <button
            onClick={onFechar}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={!podeSalvar}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check className="h-4 w-4" /> Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {children}
    </span>
  )
}
