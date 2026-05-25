import { useMemo, useState } from 'react'
import type {
  EstabelecimentoLite,
  SetorLite,
  TrabalhadorFormLite,
} from '@/../product/sections/eventos-esocial/types'
import { Search, Building2, MapPin, Check, User2 } from 'lucide-react'

interface Props {
  estabelecimentos: EstabelecimentoLite[]
  setores: SetorLite[]
  trabalhadores: TrabalhadorFormLite[]
  estabelecimentoId: string | null
  setorId: string | null
  trabalhadorId: string | null
  onChange: (next: {
    estabelecimentoId: string | null
    setorId: string | null
    trabalhadorId: string | null
  }) => void
}

export function Step1Trabalhador({
  estabelecimentos,
  setores,
  trabalhadores,
  estabelecimentoId,
  setorId,
  trabalhadorId,
  onChange,
}: Props) {
  const [busca, setBusca] = useState('')

  const setoresFiltrados = useMemo(
    () =>
      estabelecimentoId
        ? setores.filter((s) => s.estabelecimentoId === estabelecimentoId)
        : setores,
    [setores, estabelecimentoId],
  )

  const trabalhadoresFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return trabalhadores.filter((t) => {
      if (estabelecimentoId && t.estabelecimentoId !== estabelecimentoId) return false
      if (setorId && t.setorId !== setorId) return false
      if (termo) {
        const hay = `${t.nome} ${t.cpf} ${t.cargo}`.toLowerCase()
        if (!hay.includes(termo)) return false
      }
      return true
    })
  }, [trabalhadores, estabelecimentoId, setorId, busca])

  const setorById = new Map(setores.map((s) => [s.id, s]))
  const estabById = new Map(estabelecimentos.map((e) => [e.id, e]))

  return (
    <div className="space-y-5">
      {/* Cascade selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            <Building2 className="w-3 h-3 inline mr-1 -mt-0.5" strokeWidth={2} />
            Estabelecimento
          </span>
          <select
            value={estabelecimentoId ?? ''}
            onChange={(e) =>
              onChange({
                estabelecimentoId: e.target.value || null,
                setorId: null,
                trabalhadorId: null,
              })
            }
            className="
              w-full px-3 py-2.5 rounded-xl
              bg-white dark:bg-slate-900/60
              border border-slate-200 dark:border-slate-800
              text-sm text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition cursor-pointer
            "
          >
            <option value="">Todos estabelecimentos</option>
            {estabelecimentos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            <MapPin className="w-3 h-3 inline mr-1 -mt-0.5" strokeWidth={2} />
            Setor
          </span>
          <select
            value={setorId ?? ''}
            disabled={!estabelecimentoId}
            onChange={(e) =>
              onChange({
                estabelecimentoId,
                setorId: e.target.value || null,
                trabalhadorId: null,
              })
            }
            className="
              w-full px-3 py-2.5 rounded-xl
              bg-white dark:bg-slate-900/60
              border border-slate-200 dark:border-slate-800
              text-sm text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              disabled:opacity-50 disabled:cursor-not-allowed
              transition cursor-pointer
            "
          >
            <option value="">
              {estabelecimentoId ? 'Todos setores' : 'Escolha estabelecimento'}
            </option>
            {setoresFiltrados.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
          strokeWidth={1.75}
        />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, CPF ou cargo"
          className="
            w-full pl-9 pr-3 py-2.5 rounded-xl
            bg-white dark:bg-slate-900/60
            border border-slate-200 dark:border-slate-800
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            text-sm text-slate-700 dark:text-slate-200
            focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
            transition
          "
        />
      </div>

      {/* Lista de trabalhadores */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
          Trabalhadores · {trabalhadoresFiltrados.length}
        </p>
        {trabalhadoresFiltrados.length === 0 ? (
          <div className="px-4 py-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40 text-center">
            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              Nenhum trabalhador encontrado nos filtros atuais.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1">
            {trabalhadoresFiltrados.map((t) => {
              const selected = t.id === trabalhadorId
              const setor = setorById.get(t.setorId)
              const estab = estabById.get(t.estabelecimentoId)
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    onChange({
                      estabelecimentoId: t.estabelecimentoId,
                      setorId: t.setorId,
                      trabalhadorId: t.id,
                    })
                  }
                  className={`
                    relative flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition
                    ${
                      selected
                        ? 'bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800 shadow-[0_4px_14px_-4px_rgba(13,148,136,0.25)]'
                        : 'bg-white/60 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }
                  `}
                >
                  <span
                    className={`
                      shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full
                      ${
                        selected
                          ? 'bg-teal-600 dark:bg-teal-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }
                    `}
                  >
                    {selected ? (
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    ) : (
                      <User2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[13px] font-medium truncate ${
                        selected
                          ? 'text-teal-900 dark:text-teal-100'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {t.nome}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-500 tabular-nums truncate">
                      {t.cpf}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {t.cargo} · {setor?.nome ?? '—'} · {estab?.nome ?? '—'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
