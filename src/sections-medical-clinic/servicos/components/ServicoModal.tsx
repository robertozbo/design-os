import { useState } from 'react'
import { Check, X } from 'lucide-react'
import type { Servico, ServicosData } from '@/../product-medical-clinic/sections/servicos/types'
import { mascaraMoeda, moeda, parseValorBR } from './helpers'

interface Props {
  servico: Servico | null
  dados: ServicosData
  onSalvar: (s: Omit<Servico, 'id'>, id: string | null) => void
  onFechar: () => void
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'

export function ServicoModal({ servico, dados, onSalvar, onFechar }: Props) {
  const editando = servico !== null
  const [nome, setNome] = useState(servico?.nome ?? '')
  const [categoria, setCategoria] = useState(servico?.categoria ?? dados.categorias[0] ?? '')
  const [preco, setPreco] = useState(servico ? moeda(servico.preco) : '')
  const [duracao, setDuracao] = useState(servico?.duracaoMin ?? 30)
  const [ativo, setAtivo] = useState(servico?.ativo ?? true)

  const precoNum = parseValorBR(preco)
  const podeSalvar = nome.trim().length > 1 && precoNum > 0 && duracao >= 5

  const salvar = () => {
    if (!podeSalvar) return
    onSalvar(
      { nome: nome.trim(), categoria, preco: precoNum, duracaoMin: duracao, ativo },
      servico?.id ?? null,
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {editando ? 'Editar serviço' : 'Novo serviço'}
          </h2>
          <button
            aria-label="Fechar"
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <label className="block">
            <Label>Nome do serviço</Label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Consulta · Endocrinologia"
              autoFocus
              className={inputCls}
            />
          </label>

          <label className="block">
            <Label>Categoria (tipo de receita)</Label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={inputCls}>
              {dados.categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <Label>Preço (R$)</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  R$
                </span>
                <input
                  inputMode="decimal"
                  value={preco}
                  onChange={(e) => setPreco(mascaraMoeda(e.target.value))}
                  placeholder="0,00"
                  className={`${inputCls} pl-9`}
                />
              </div>
            </label>
            <label className="block">
              <Label>Duração (min)</Label>
              <input
                type="number"
                min={5}
                max={240}
                step={5}
                value={duracao}
                onChange={(e) => setDuracao(Math.max(5, Math.min(240, Number(e.target.value) || 0)))}
                className={inputCls}
              />
            </label>
          </div>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Ativo</span>
            <button
              type="button"
              role="switch"
              aria-checked={ativo}
              onClick={() => setAtivo((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                ativo ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  ativo ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>
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
