import { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { ERRO_TEXTO, type ErroCodigo } from './helpers'

interface Props {
  codigo: string
  onCodigo: (v: string) => void
  erro: ErroCodigo | null
  busca: string
  onBusca: (v: string) => void
}

/**
 * A barra de captura do balcão.
 *
 * O campo do código **toma o foco ao montar** e o devolve a si mesmo depois de
 * cada registro: a recepcionista recebe uma pessoa a cada 30 segundos e não
 * pode gastar um clique para começar. Não há botão de confirmar — a validação
 * dispara ao sexto dígito, porque nesse ponto o gesto já terminou.
 */
export function CapturaCodigo({ codigo, onCodigo, erro, busca, onBusca }: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4 lg:flex-row lg:items-start dark:border-slate-800 dark:bg-slate-900/40">
      <div className="lg:w-80">
        <label
          htmlFor="codigo-chegada"
          className="mb-1.5 block text-[11px] font-medium text-slate-500 dark:text-slate-400"
        >
          Código do paciente
        </label>
        <input
          id="codigo-chegada"
          ref={ref}
          value={codigo}
          onChange={(e) => onCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          autoComplete="off"
          placeholder="000000"
          aria-invalid={erro !== null}
          aria-describedby={erro ? 'codigo-erro' : undefined}
          className={`w-full rounded-xl border-2 bg-white px-4 py-3 font-mono text-2xl tracking-[0.4em] tabular-nums text-slate-900 placeholder:text-slate-300 focus:outline-none dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-700 ${
            erro
              ? 'border-rose-400 focus:border-rose-500 dark:border-rose-500/60'
              : 'border-slate-200 focus:border-teal-500 dark:border-slate-700'
          }`}
        />
        <p
          id="codigo-erro"
          role={erro ? 'alert' : undefined}
          className={`mt-1.5 text-[11px] ${
            erro ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {erro ? ERRO_TEXTO[erro] : 'Seis dígitos do app do paciente — valida sozinho'}
        </p>
      </div>

      <div className="lg:mt-6 lg:flex-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => onBusca(e.target.value)}
            placeholder="Buscar por paciente ou profissional — para quem não tem o app"
            aria-label="Buscar paciente"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500"
          />
          {busca && (
            <button
              onClick={() => onBusca('')}
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
