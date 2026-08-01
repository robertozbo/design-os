import { useState } from 'react'
import { Check, ShieldCheck, Sparkles } from 'lucide-react'
import type { ItemExtraido, SOAP } from '@/../product-clinic/sections/consulta/types'
import { SOAP_LABEL } from './helpers'

interface Props {
  itens: ItemExtraido[]
  modeloIA: string
  /** Recebe só o que o médico marcou — o resto nunca chega ao prontuário. */
  onAplicar: (itens: ItemExtraido[]) => void
  onDescartar: () => void
  /** De onde vieram os itens — muda só o texto, não o pacto de marcação. */
  origem?: 'transcricao' | 'analise'
}

const ORDEM: (keyof SOAP)[] = ['S', 'O', 'A', 'P']

/**
 * Revisão do que a IA extraiu, **antes** de qualquer coisa entrar na evolução.
 *
 * Os itens começam desmarcados de propósito. Se viessem marcados, o médico estaria removendo o que
 * a IA já escreveu no registro que ele assina — aprovação por omissão. Desmarcado, cada linha que
 * entra no prontuário é um ato dele. O atalho "Marcar todos" existe para quando a extração está boa
 * e evita que a fricção vire teatro de conformidade.
 */
export function RevisaoIA({ itens, modeloIA, onAplicar, onDescartar, origem = 'transcricao' }: Props) {
  const [marcados, setMarcados] = useState<Set<string>>(new Set())

  const alternar = (id: string) =>
    setMarcados((prev) => {
      const proximo = new Set(prev)
      if (proximo.has(id)) proximo.delete(id)
      else proximo.add(id)
      return proximo
    })

  const todosMarcados = marcados.size === itens.length && itens.length > 0

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 rounded-lg bg-teal-50 px-3 py-2 text-[11px] text-teal-800 dark:bg-teal-950/30 dark:text-teal-300">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          <strong className="font-semibold">{modeloIA}</strong>{' '}
          {origem === 'analise'
            ? `analisou sua anotação junto com medicações ativas, exames recentes e os dados do app, e sugere ${itens.length} pontos.`
            : `extraiu ${itens.length} achados da transcrição.`}{' '}
          <strong className="font-semibold">Nada entra na evolução sem você marcar</strong> — o que
          ficar de fora não é registrado.
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          {marcados.size} de {itens.length} marcados
        </span>
        <button
          type="button"
          onClick={() =>
            setMarcados(todosMarcados ? new Set() : new Set(itens.map((i) => i.id)))
          }
          className="text-[11px] font-medium text-teal-600 hover:underline dark:text-teal-400"
        >
          {todosMarcados ? 'Desmarcar todos' : 'Marcar todos'}
        </button>
      </div>

      <div className="space-y-3">
        {ORDEM.map((campo) => {
          const doCampo = itens.filter((i) => i.campo === campo)
          if (doCampo.length === 0) return null
          return (
            <div key={campo}>
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-200 text-[9px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                  {campo}
                </span>
                {SOAP_LABEL[campo]}
              </div>
              <ul className="space-y-1">
                {doCampo.map((item) => {
                  const marcado = marcados.has(item.id)
                  return (
                    <li key={item.id}>
                      <label
                        className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2 text-xs transition-colors ${
                          marcado
                            ? 'border-teal-500 bg-teal-50/60 text-slate-800 dark:border-teal-500 dark:bg-teal-950/30 dark:text-slate-100'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={marcado}
                          onChange={() => alternar(item.id)}
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600"
                        />
                        <span className="leading-relaxed">{item.texto}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          onClick={() => onAplicar(itens.filter((i) => marcados.has(i.id)))}
          disabled={marcados.size === 0}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check className="h-4 w-4" />
          Aplicar {marcados.size > 0 ? `${marcados.size} ` : ''}à evolução
        </button>
        <button
          onClick={onDescartar}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Descartar tudo
        </button>
      </div>

      <p className="flex items-start gap-1.5 text-[10px] text-slate-400">
        <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0" />
        O texto aplicado ainda é editável antes de assinar — e a assinatura registra que a evolução
        foi assistida por IA, com o modelo usado.
      </p>
    </div>
  )
}
