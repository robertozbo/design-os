import { useState } from 'react'
import { AlertTriangle, Check, X } from 'lucide-react'
import type {
  Convenio,
  ConvenioFormValues,
} from '@/../product-clinic/sections/convenios/types'
import { normalizarNome } from './helpers'

interface Props {
  convenio: Convenio | null
  /** Catálogo inteiro — só para avisar de nome repetido enquanto se digita. */
  convenios: Convenio[]
  onSalvar: (values: ConvenioFormValues) => void
  onFechar: () => void
}

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'

export function ConvenioModal({ convenio, convenios, onSalvar, onFechar }: Props) {
  const editando = convenio !== null
  const [nome, setNome] = useState(convenio?.nome ?? '')
  const [codigoAns, setCodigoAns] = useState(convenio?.codigoAns ?? '')
  const [ativo, setAtivo] = useState(convenio?.ativo ?? true)

  const podeSalvar = nome.trim().length > 1

  /**
   * Já existe alguém com este nome? Não bloqueia salvar — o servidor é idempotente
   * por nome e devolve o convênio existente em vez de erro. O aviso serve para a
   * pessoa perceber ANTES de criar a terceira "Unimed".
   */
  const jaExiste = convenios.find(
    (c) => c.id !== convenio?.id && normalizarNome(c.nome) === normalizarNome(nome),
  )

  const salvar = () => {
    if (!podeSalvar) return
    onSalvar({
      id: convenio?.id,
      nome: nome.trim(),
      codigoAns: codigoAns.trim() || null,
      ativo,
    })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {editando ? 'Editar convênio' : 'Novo convênio'}
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
            <Label>Nome do convênio</Label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Unimed Regional"
              autoFocus
              className={inputCls}
            />
            {jaExiste && (
              <span className="mt-1.5 inline-flex items-start gap-1.5 text-[11px] text-amber-700 dark:text-amber-400">
                <AlertTriangle className="mt-px h-3 w-3 shrink-0" />
                Já existe “{jaExiste.nome}”. Salvar aqui não cria uma cópia — o catálogo
                reaproveita o convênio que já está lá.
              </span>
            )}
          </label>

          <label className="block">
            <Label>Registro ANS (opcional)</Label>
            <input
              inputMode="numeric"
              value={codigoAns}
              onChange={(e) => setCodigoAns(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Ex.: 000340"
              className={inputCls}
            />
            <span className="mt-1.5 block text-[11px] text-slate-400 dark:text-slate-500">
              O número de registro da operadora na ANS. Pode ficar em branco e ser preenchido
              depois.
            </span>
          </label>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800">
            <span className="min-w-0">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Ativo
              </span>
              <span className="block text-[11px] text-slate-400 dark:text-slate-500">
                Inativo some da lista de novos cadastros; quem já tem, continua tendo.
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={ativo}
              onClick={() => setAtivo((v) => !v)}
              className={`relative ml-3 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
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
